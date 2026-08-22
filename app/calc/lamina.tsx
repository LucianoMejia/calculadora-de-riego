import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalcLayout } from '../../components/CalcLayout';
import { FormField } from '../../components/FormField';
import { ResultItem } from '../../components/ResultItem';
import { fmt, parseNum } from '../../lib/format';
import { calcLaminaPerLayer, calcLaminaTotal, type LayerInput } from '../../lib/calculators';
import { saveHistory } from '../../lib/history';
import { validate } from '../../lib/validators';

const ACCENT = '#6A4FA0';

const DEFAULT_LAYERS: LayerInput[] = [
  { espesor: 15, W: 19, Da: 1.0 },
  { espesor: 8, W: 25, Da: 1.2 },
  { espesor: 27, W: 31, Da: 1.4 },
];

export default function LaminaScreen() {
  const [layers, setLayers] = useState<LayerInput[]>(DEFAULT_LAYERS);
  const [result, setResult] = useState<ReturnType<typeof calcLaminaTotal> | null>(null);
  const [layerResults, setLayerResults] = useState<ReturnType<typeof calcLaminaPerLayer>[]>([]);
  const [calculated, setCalculated] = useState(false);

  function updateLayer(index: number, field: keyof LayerInput, value: string) {
    setLayers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: parseNum(value) };
      return next;
    });
  }

  function addLayer() {
    setLayers((prev) => [...prev, { espesor: null, W: null, Da: null }]);
  }

  function removeLayer(index: number) {
    setLayers((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCalc() {
    Keyboard.dismiss();
    if (layers.length === 0) {
      Alert.alert('Sin capas', 'Agrega al menos una capa del perfil.');
      return;
    }

    for (let i = 0; i < layers.length; i++) {
      const l = layers[i];
      if (!validate([
        { field: `Capa ${i + 1} - Espesor`, value: l.espesor, test: v => v > 0, msg: `Capa ${i + 1}: el espesor debe ser mayor a 0.` },
        { field: `Capa ${i + 1} - W`, value: l.W, test: v => v >= 0 && v <= 100, msg: `Capa ${i + 1}: W% debe estar entre 0 y 100.` },
        { field: `Capa ${i + 1} - Da`, value: l.Da, test: v => v > 0, msg: `Capa ${i + 1}: Da debe ser mayor a 0.` },
      ])) return;
    }

    const total = calcLaminaTotal(layers);
    const lr = layers.map((l) => calcLaminaPerLayer(l));
    setResult(total);
    setLayerResults(lr);
    setCalculated(true);

    const inputSummary: Record<string, string> = {};
    layers.forEach((l, i) => {
      inputSummary[`Capa ${i + 1}`] = `${l.espesor ?? '—'}cm / ${l.W ?? '—'}% / ${l.Da ?? '—'}`;
    });

    await saveHistory({
      toolId: 'lamina',
      toolName: 'Lámina por perfil',
      inputs: inputSummary,
      results: {
        'Lámina total (cm)': fmt(total.totalCm, 3) + ' cm',
        'Lámina total (mm)': fmt(total.totalMm, 1) + ' mm',
        'W̄ promedio': fmt(total.wProm, 2) + ' %',
      },
    });
  }

  return (
    <CalcLayout
      title="Lámina por perfil"
      description="Calcula la lámina de agua por capa del perfil."
      accent={ACCENT}
      formula={'Lam = W × Da × espesor\nW̄ = Σ(Wᵢ·profᵢ) / Σ(profᵢ)'}
      results={
        calculated && result ? (
          <>
            <ResultItem label="Lámina total" value={fmt(result.totalCm, 3) + ' cm'} accent={ACCENT} />
            <ResultItem label="Lámina total" value={fmt(result.totalMm, 1) + ' mm'} accent={ACCENT} />
            <ResultItem label="W̄ promedio" value={fmt(result.wProm, 2) + ' %'} accent={ACCENT} />
          </>
        ) : (
          <Text style={{ color: '#9BA3B5', fontSize: 14, textAlign: 'center', padding: 20 }}>Ingresa los datos y presiona Calcular</Text>
        )
      }
    >
      {layers.map((layer, i) => (
        <View key={i} style={layerStyles.layerRow}>
          <Text style={[layerStyles.layerNum, { color: ACCENT }]}>Capa {i + 1}</Text>
          <View style={layerStyles.fields}>
            <View style={layerStyles.field}>
              <FormField label="Espesor" value={layer.espesor != null ? String(layer.espesor) : ''} onChangeText={(v) => updateLayer(i, 'espesor', v)} unit="cm" placeholder="—" />
            </View>
            <View style={layerStyles.field}>
              <FormField label="W" value={layer.W != null ? String(layer.W) : ''} onChangeText={(v) => updateLayer(i, 'W', v)} unit="%" placeholder="—" />
            </View>
            <View style={layerStyles.field}>
              <FormField label="Da" value={layer.Da != null ? String(layer.Da) : ''} onChangeText={(v) => updateLayer(i, 'Da', v)} unit="g/cm³" placeholder="—" />
            </View>
          </View>
          {calculated && layerResults[i]?.layerCm != null && (
            <Text style={[layerStyles.resultText, { color: ACCENT }]}>{fmt(layerResults[i].layerCm, 3)} cm</Text>
          )}
          {layers.length > 1 && (
            <TouchableOpacity style={layerStyles.removeBtn} onPress={() => removeLayer(i)}>
              <Ionicons name="close-circle" size={22} color="#C6512E" />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity style={[layerStyles.addBtn, { borderColor: ACCENT }]} onPress={addLayer}>
        <Ionicons name="add-circle-outline" size={18} color={ACCENT} />
        <Text style={[layerStyles.addBtnText, { color: ACCENT }]}>Agregar capa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: ACCENT }]} onPress={handleCalc} activeOpacity={0.7}>
        <Text style={styles.btnText}>Calcular</Text>
      </TouchableOpacity>
    </CalcLayout>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

const layerStyles = StyleSheet.create({
  layerRow: {
    borderWidth: 1,
    borderColor: '#E4E7ED',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F7F8FA',
  },
  layerNum: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  fields: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  field: { flex: 1, minWidth: 90 },
  resultText: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  removeBtn: { alignSelf: 'flex-end', marginTop: 4, padding: 4 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  addBtnText: { fontSize: 14, fontWeight: '500' },
});
