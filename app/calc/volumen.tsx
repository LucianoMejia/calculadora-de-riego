import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { CalcLayout } from '../../components/CalcLayout';
import { FormField } from '../../components/FormField';
import { ResultItem } from '../../components/ResultItem';
import { fmt, parseNum } from '../../lib/format';
import { calcVolumen } from '../../lib/calculators';
import { saveHistory } from '../../lib/history';
import { validate } from '../../lib/validators';

const ACCENT = '#3B6FB5';

export default function VolumenScreen() {
  const [lam, setLam] = useState('');
  const [area, setArea] = useState('1');
  const [volDirect, setVolDirect] = useState('');
  const [result, setResult] = useState<{ volumen: number | null; lamCalc: number | null } | null>(null);
  const [calculated, setCalculated] = useState(false);

  async function handleCalc() {
    const pLam = parseNum(lam);
    const pArea = parseNum(area);
    const pVol = parseNum(volDirect);
    const hasLam = pLam != null && pLam > 0;
    const hasVol = pVol != null && pVol > 0;

    if (!hasLam && !hasVol) {
      Alert.alert('Datos insuficientes', 'Ingresa la lámina o el volumen directamente.');
      return;
    }

    if (hasLam && !validate([
      { field: 'Lámina de riego', value: pLam, test: v => v > 0, msg: 'La lámina debe ser mayor a 0.' },
      { field: 'Área', value: pArea, test: v => v > 0, msg: 'El área debe ser mayor a 0.' },
    ])) return;

    if (hasVol && !validate([
      { field: 'Volumen', value: pVol, test: v => v > 0, msg: 'El volumen debe ser mayor a 0.' },
    ])) return;

    const r = calcVolumen(pLam ?? 0, pArea ?? 0, pVol ?? 0);
    setResult(r);
    setCalculated(true);
    await saveHistory({
      toolId: 'volumen',
      toolName: 'Lámina ↔ volumen',
      inputs: { Lámina: lam, Área: area, Volumen: volDirect },
      results: {
        'Volumen': r.volumen != null ? fmt(r.volumen, 1) + ' m³' : '—',
        'Lámina': r.lamCalc != null ? fmt(r.lamCalc, 2) + ' mm' : '—',
      },
    });
    Alert.alert('Guardado', 'Cálculo guardado en el historial.');
  }

  return (
    <CalcLayout
      title="Lámina ↔ volumen"
      description="Convierte entre lámina de riego (mm) y volumen de agua (m³)."
      accent={ACCENT}
      formula="V(m³) = área(ha) × 10 × lámina(mm)"
      results={
        calculated && result ? (
          <>
            <ResultItem label="Volumen de agua" value={fmt(result.volumen, 1) + ' m³'} accent={ACCENT} />
            <ResultItem label="Lámina equivalente" value={fmt(result.lamCalc, 2) + ' mm'} accent={ACCENT} />
          </>
        ) : (
          <Text style={{ color: '#9BA3B5', fontSize: 14, textAlign: 'center', padding: 20 }}>Ingresa los datos y presiona Calcular</Text>
        )
      }
    >
      <FormField label="Lámina de riego" value={lam} onChangeText={setLam} unit="mm" placeholder="35" />
      <FormField label="Área a regar" value={area} onChangeText={setArea} unit="ha" placeholder="1" />
      <FormField label="...o ingresa el volumen directamente" value={volDirect} onChangeText={setVolDirect} unit="m³" placeholder="opcional" />
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
