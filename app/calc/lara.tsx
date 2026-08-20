import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { CalcLayout } from '../../components/CalcLayout';
import { FormField } from '../../components/FormField';
import { ResultItem } from '../../components/ResultItem';
import { fmt, parseNum } from '../../lib/format';
import { calcLara } from '../../lib/calculators';
import { saveHistory } from '../../lib/history';
import { validate } from '../../lib/validators';

const ACCENT = '#2E7D5B';

export default function LaraScreen() {
  const [wcc, setWcc] = useState('');
  const [wpmp, setWpmp] = useState('');
  const [da, setDa] = useState('');
  const [prof, setProf] = useState('');
  const [na, setNa] = useState('50');
  const [ef, setEf] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calcLara> | null>(null);
  const [calculated, setCalculated] = useState(false);

  async function handleCalc() {
    const pWcc = parseNum(wcc);
    const pWpmp = parseNum(wpmp);
    if (!validate([
      { field: 'Humedad a capacidad de campo (Wcc)', value: pWcc, test: v => v > 0, msg: 'Wcc debe ser mayor a 0.' },
      { field: 'Humedad a punto de marchitez (Wpmp)', value: pWpmp, test: v => v > 0, msg: 'Wpmp debe ser mayor a 0.' },
      { field: 'Wcc', value: pWcc, test: v => pWpmp != null && v > pWpmp, msg: 'Wcc debe ser mayor que Wpmp.' },
      { field: 'Densidad aparente (Da)', value: parseNum(da), test: v => v > 0, msg: 'La densidad aparente debe ser mayor a 0.' },
      { field: 'Profundidad de raíces', value: parseNum(prof), test: v => v > 0, msg: 'La profundidad debe ser mayor a 0.' },
      { field: 'Nivel de agotamiento (NA)', value: parseNum(na), test: v => v > 0 && v <= 100, msg: 'NA debe estar entre 1 y 100.' },
    ])) return;

    const pEf = parseNum(ef);
    if (ef && !validate([
      { field: 'Eficiencia de aplicación', value: pEf, test: v => v > 0 && v <= 100, msg: 'La eficiencia debe estar entre 0 y 100.' },
    ])) return;

    const r = calcLara(pWcc!, pWpmp!, parseNum(da)!, parseNum(prof)!, parseNum(na)!, pEf ?? 0);
    setResult(r);
    setCalculated(true);
    await saveHistory({
      toolId: 'lara',
      toolName: 'Agua aprovechable / LARA',
      inputs: { Wcc: wcc, Wpmp: wpmp, Da: da, Prof: prof, NA: na, Eficiencia: ef },
      results: {
        'A.A. masa': r.aaMasa != null ? fmt(r.aaMasa, 2) + ' %' : '—',
        'LAA': r.laaMm != null ? fmt(r.laaMm, 1) + ' mm' : '—',
        'LARA': r.lara != null ? fmt(r.lara, 1) + ' mm' : '—',
        'Lámina bruta': r.bruta != null ? fmt(r.bruta, 1) + ' mm' : '—',
      },
    });
    Alert.alert('Guardado', 'Cálculo guardado en el historial.');
  }

  return (
    <CalcLayout
      title="Agua aprovechable y LARA"
      description="Calcula A.A., ARA, LARA y la lámina bruta de riego."
      accent={ACCENT}
      formula="A.A. = Wcc − Wpmp\nLARA = NA × LAA\nLámina bruta = LARA / eficiencia"
      results={
        calculated && result ? (
          <>
            <ResultItem label="A.A. base masa" value={fmt(result.aaMasa, 2) + ' %'} accent={ACCENT} />
            <ResultItem label="A.A. base volumen" value={fmt(result.aaVol, 2) + ' %'} accent={ACCENT} />
            <ResultItem label="LAA" value={fmt(result.laaMm, 1) + ' mm'} accent={ACCENT} />
            <ResultItem label="ARA" value={fmt(result.ara, 2) + ' %'} accent={ACCENT} />
            <ResultItem label="LARA" value={fmt(result.lara, 1) + ' mm'} accent={ACCENT} />
            <ResultItem label="Lámina bruta" value={fmt(result.bruta, 1) + ' mm'} accent={ACCENT} />
          </>
        ) : (
          <Text style={{ color: '#9BA3B5', fontSize: 14, textAlign: 'center', padding: 20 }}>Ingresa los datos y presiona Calcular</Text>
        )
      }
    >
      <FormField label="Humedad a capacidad de campo (Wcc)" value={wcc} onChangeText={setWcc} unit="%" placeholder="29" />
      <FormField label="Humedad a punto de marchitez (Wpmp)" value={wpmp} onChangeText={setWpmp} unit="%" placeholder="18" />
      <FormField label="Densidad aparente (Da)" value={da} onChangeText={setDa} unit="g/cm³" placeholder="1.4" />
      <FormField label="Profundidad de raíces" value={prof} onChangeText={setProf} unit="cm" placeholder="30" />
      <FormField label="Nivel de agotamiento (NA)" value={na} onChangeText={setNa} unit="%" placeholder="50" />
      <FormField label="Eficiencia de aplicación" value={ef} onChangeText={setEf} unit="%, opcional" placeholder="60" />
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
