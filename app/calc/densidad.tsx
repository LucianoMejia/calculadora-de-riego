import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { CalcLayout } from '../../components/CalcLayout';
import { FormField } from '../../components/FormField';
import { ResultItem } from '../../components/ResultItem';
import { fmt, parseNum } from '../../lib/format';
import { calcDensidad } from '../../lib/calculators';
import { saveHistory } from '../../lib/history';
import { validate } from '../../lib/validators';

const ACCENT = '#2E7D5B';

export default function DensidadScreen() {
  const [da, setDa] = useState('');
  const [dr, setDr] = useState('2.65');
  const [prof, setProf] = useState('');
  const [area, setArea] = useState('1');
  const [result, setResult] = useState<{ porosidad: number | null; masa: number | null } | null>(null);
  const [calculated, setCalculated] = useState(false);

  async function handleCalc() {
    const pDa = parseNum(da);
    const pDr = parseNum(dr);
    if (!validate([
      { field: 'Densidad aparente (Da)', value: pDa, test: v => v > 0, msg: 'La densidad aparente debe ser mayor a 0.' },
      { field: 'Densidad real (Dr)', value: pDr, test: v => v > 0, msg: 'La densidad real debe ser mayor a 0.' },
      { field: 'Densidad aparente (Da)', value: pDa, test: v => pDr != null && v < pDr, msg: 'Da debe ser menor que Dr.' },
      { field: 'Profundidad', value: parseNum(prof), test: v => v > 0, msg: 'La profundidad debe ser mayor a 0.' },
      { field: 'Área', value: parseNum(area), test: v => v > 0, msg: 'El área debe ser mayor a 0.' },
    ])) return;

    const r = calcDensidad(pDa!, pDr!, parseNum(prof)!, parseNum(area)!);
    setResult(r);
    setCalculated(true);
    await saveHistory({
      toolId: 'densidad',
      toolName: 'Densidad y porosidad',
      inputs: { Da: da, Dr: dr, Profundidad: prof, Área: area },
      results: {
        'Porosidad': r.porosidad != null ? fmt(r.porosidad, 1) + ' %' : '—',
        'Masa de suelo': r.masa != null ? fmt(r.masa, 0) + ' ton' : '—',
      },
    });
    Alert.alert('Guardado', 'Cálculo guardado en el historial.');
  }

  return (
    <CalcLayout
      title="Densidad y porosidad"
      description="Calcula la porosidad de un suelo a partir de su densidad aparente y real."
      accent={ACCENT}
      formula="η = (1 − Da/Dr) × 100\nmasa/ha (ton) = Da × 100 × prof.(cm) × área(ha)"
      results={
        calculated && result ? (
          <>
            <ResultItem label="Porosidad (η)" value={fmt(result.porosidad, 1) + ' %'} accent={ACCENT} />
            <ResultItem label="Masa de suelo" value={fmt(result.masa, 0) + ' ton'} note="toneladas en el área indicada" accent={ACCENT} />
          </>
        ) : (
          <Text style={{ color: '#9BA3B5', fontSize: 14, textAlign: 'center', padding: 20 }}>Ingresa los datos y presiona Calcular</Text>
        )
      }
    >
      <FormField label="Densidad aparente (Da)" value={da} onChangeText={setDa} unit="g/cm³" placeholder="1.10" />
      <FormField label="Densidad real (Dr)" value={dr} onChangeText={setDr} unit="g/cm³" placeholder="2.65" />
      <FormField label="Profundidad analizada" value={prof} onChangeText={setProf} unit="cm" placeholder="20" />
      <FormField label="Área" value={area} onChangeText={setArea} unit="ha" placeholder="1" />
      <TouchableOpacity style={[styles.btn, { backgroundColor: ACCENT }]} onPress={handleCalc} activeOpacity={0.7}>
        <Text style={styles.btnText}>Calcular</Text>
      </TouchableOpacity>
    </CalcLayout>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
