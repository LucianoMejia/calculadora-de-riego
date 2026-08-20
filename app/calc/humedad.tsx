import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { CalcLayout } from '../../components/CalcLayout';
import { FormField } from '../../components/FormField';
import { ResultItem } from '../../components/ResultItem';
import { fmt, parseNum } from '../../lib/format';
import { calcHumedad } from '../../lib/calculators';
import { saveHistory } from '../../lib/history';
import { validate } from '../../lib/validators';

const ACCENT = '#3B6FB5';

export default function HumedadScreen() {
  const [msh, setMsh] = useState('');
  const [mss, setMss] = useState('');
  const [wDirect, setWDirect] = useState('');
  const [da, setDa] = useState('');
  const [result, setResult] = useState<{ W: number | null; theta: number | null } | null>(null);
  const [calculated, setCalculated] = useState(false);

  async function handleCalc() {
    const pMsh = parseNum(msh);
    const pMss = parseNum(mss);
    const pWDir = parseNum(wDirect);
    const hasMasas = pMsh != null && pMsh > 0 && pMss != null && pMss > 0;
    const hasDirecto = pWDir != null && pWDir > 0;

    if (!hasMasas && !hasDirecto) {
      Alert.alert('Datos insuficientes', 'Ingresa Msh y Mss, o ingresa W% directamente.');
      return;
    }

    if (hasMasas && !validate([
      { field: 'Masa húmeda (Msh)', value: pMsh, test: v => v > 0, msg: 'Msh debe ser mayor a 0.' },
      { field: 'Masa seca (Mss)', value: pMss, test: v => v > 0, msg: 'Mss debe ser mayor a 0.' },
    ])) return;

    if (hasDirecto && !validate([
      { field: 'W% directo', value: pWDir, test: v => v >= 0 && v <= 100, msg: 'W% debe estar entre 0 y 100.' },
    ])) return;

    const pDa = parseNum(da);
    if (!hasDirecto && !validate([
      { field: 'Densidad aparente (Da)', value: pDa, test: v => v > 0, msg: 'La densidad aparente debe ser mayor a 0.' },
    ])) return;

    const r = calcHumedad(pMsh ?? 0, pMss ?? 0, pWDir ?? 0, pDa ?? 0);
    setResult(r);
    setCalculated(true);
    await saveHistory({
      toolId: 'humedad',
      toolName: 'Humedad del suelo',
      inputs: { Msh: msh, Mss: mss, 'W% directo': wDirect, Da: da },
      results: {
        'W%': r.W != null ? fmt(r.W, 2) + ' %' : '—',
        'θ%': r.theta != null ? fmt(r.theta, 2) + ' %' : '—',
      },
    });
    Alert.alert('Guardado', 'Cálculo guardado en el historial.');
  }

  return (
    <CalcLayout
      title="Humedad del suelo"
      description="Obtén la humedad gravimétrica y conviértela a volumétrica."
      accent={ACCENT}
      formula="W(%) = (Msh − Mss) / Mss × 100\nθ(%) = W(%) × Da"
      results={
        calculated && result ? (
          <>
            <ResultItem label="Humedad gravimétrica (W%)" value={fmt(result.W, 2) + ' %'} note="con base a masa" accent={ACCENT} />
            <ResultItem label="Humedad volumétrica (θ%)" value={fmt(result.theta, 2) + ' %'} note="con base a volumen" accent={ACCENT} />
          </>
        ) : (
          <Text style={{ color: '#9BA3B5', fontSize: 14, textAlign: 'center', padding: 20 }}>Ingresa los datos y presiona Calcular</Text>
        )
      }
    >
      <FormField label="Masa de suelo húmedo (Msh)" value={msh} onChangeText={setMsh} unit="g" placeholder="opcional" />
      <FormField label="Masa de suelo seco (Mss)" value={mss} onChangeText={setMss} unit="g" placeholder="opcional" />
      <FormField label="...o ingresa W% directamente" value={wDirect} onChangeText={setWDirect} unit="%" placeholder="ej. 33" />
      <FormField label="Densidad aparente (Da)" value={da} onChangeText={setDa} unit="g/cm³" placeholder="1.10" />
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
