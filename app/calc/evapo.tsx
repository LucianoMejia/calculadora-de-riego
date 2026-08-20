import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { CalcLayout } from '../../components/CalcLayout';
import { FormField } from '../../components/FormField';
import { ResultItem } from '../../components/ResultItem';
import { fmt, parseNum } from '../../lib/format';
import { calcEvapotranspiracion } from '../../lib/calculators';
import { saveHistory } from '../../lib/history';
import { validate } from '../../lib/validators';

const ACCENT = '#C68B2E';

export default function EvapoScreen() {
  const [ev, setEv] = useState('');
  const [kp, setKp] = useState('');
  const [kc, setKc] = useState('');
  const [dias, setDias] = useState('');
  const [result, setResult] = useState<{ etc: number | null; etcTotal: number | null } | null>(null);
  const [calculated, setCalculated] = useState(false);

  async function handleCalc() {
    if (!validate([
      { field: 'Evaporación del tanque (Ev)', value: parseNum(ev), test: v => v > 0, msg: 'La evaporación debe ser mayor a 0.' },
      { field: 'Coeficiente de tanque (Kp)', value: parseNum(kp), test: v => v > 0 && v <= 1, msg: 'Kp debe estar entre 0 y 1.' },
      { field: 'Coeficiente de cultivo (Kc)', value: parseNum(kc), test: v => v > 0 && v <= 1.5, msg: 'Kc debe estar entre 0 y 1.5.' },
    ])) return;

    if (dias && !validate([
      { field: 'Días a proyectar', value: parseNum(dias), test: v => v > 0 && v <= 365, msg: 'Los días deben estar entre 1 y 365.' },
    ])) return;

    const r = calcEvapotranspiracion(parseNum(ev), parseNum(kp), parseNum(kc), parseNum(dias));
    setResult(r);
    setCalculated(true);
    await saveHistory({
      toolId: 'evapo',
      toolName: 'Evapotranspiración',
      inputs: { Ev: ev, Kp: kp, Kc: kc, Días: dias },
      results: {
        'ETc': r.etc != null ? fmt(r.etc, 2) + ' mm/día' : '—',
        'ETc acumulada': r.etcTotal != null ? fmt(r.etcTotal, 1) + ' mm' : '—',
      },
    });
    Alert.alert('Guardado', 'Cálculo guardado en el historial.');
  }

  return (
    <CalcLayout
      title="Evapotranspiración"
      description="Estima ETc usando tanque Clase A, Kp y Kc."
      accent={ACCENT}
      formula="ETc = Kc × Kp × Ev"
      results={
        calculated && result ? (
          <>
            <ResultItem label="ETc" value={fmt(result.etc, 2) + ' mm/día'} accent={ACCENT} />
            <ResultItem label="ETc acumulada" value={fmt(result.etcTotal, 1) + ' mm'} accent={ACCENT} />
          </>
        ) : (
          <Text style={{ color: '#9BA3B5', fontSize: 14, textAlign: 'center', padding: 20 }}>Ingresa los datos y presiona Calcular</Text>
        )
      }
    >
      <FormField label="Evaporación del tanque (Ev)" value={ev} onChangeText={setEv} unit="mm/día" placeholder="5" />
      <FormField label="Coeficiente de tanque (Kp)" value={kp} onChangeText={setKp} unit="0–1" placeholder="0.75" />
      <FormField label="Coeficiente de cultivo (Kc)" value={kc} onChangeText={setKc} unit="0–1.3" placeholder="0.9" />
      <FormField label="Días a proyectar" value={dias} onChangeText={setDias} unit="días, opcional" placeholder="7" />
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
