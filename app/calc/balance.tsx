import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalcLayout } from '../../components/CalcLayout';
import { FormField } from '../../components/FormField';
import { ResultItem } from '../../components/ResultItem';
import { fmt, parseNum } from '../../lib/format';
import { calcBalance, type BalanceDayInput } from '../../lib/calculators';
import { saveHistory } from '../../lib/history';
import { validate } from '../../lib/validators';

const ACCENT = '#3B6FB5';
const DEFAULT_DAYS: BalanceDayInput[] = Array.from({ length: 7 }, () => ({ lluvia: 0, riego: 0 }));

export default function BalanceScreen() {
  const [lara, setLara] = useState('');
  const [et, setEt] = useState('');
  const [days, setDays] = useState<BalanceDayInput[]>(DEFAULT_DAYS);
  const [result, setResult] = useState<ReturnType<typeof calcBalance> | null>(null);
  const [calculated, setCalculated] = useState(false);

  function updateDay(index: number, field: 'lluvia' | 'riego', value: string) {
    setDays((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: parseNum(value) ?? 0 };
      return next;
    });
  }

  function addDay() {
    setDays((prev) => [...prev, { lluvia: 0, riego: 0 }]);
  }

  function resetDays() {
    setDays(DEFAULT_DAYS);
    setResult(null);
    setCalculated(false);
  }

  async function handleCalc() {
    Keyboard.dismiss();
    if (!validate([
      { field: 'LARA', value: parseNum(lara), test: v => v > 0, msg: 'La LARA debe ser mayor a 0.' },
      { field: 'ET diaria', value: parseNum(et), test: v => v > 0, msg: 'La ET diaria debe ser mayor a 0.' },
    ])) return;

    const r = calcBalance(parseNum(lara), parseNum(et), days);
    setResult(r);
    setCalculated(true);
    await saveHistory({
      toolId: 'balance',
      toolName: 'Balance hídrico',
      inputs: { LARA: lara, 'ET diaria': et, 'Días': String(days.length) },
      results: {
        'Estado': r.criticalDay ? `Déficit día ${r.criticalDay}` : 'Sin déficit',
        'Próximo día crítico': r.criticalDay ? `día ${r.criticalDay}` : '—',
      },
    });
  }

  return (
    <CalcLayout
      title="Balance hídrico"
      description="Simula día a día la LAS con lluvia, riego y ET."
      accent={ACCENT}
      formula={'Δθ = P + R − Et\nLAS(día) = min(LARA, LAS(día−1) + Δθ)'}
      results={
        calculated && result ? (
          <>
            <ResultItem label="Estado" value={result.criticalDay ? `Déficit día ${result.criticalDay}` : 'Sin déficit'} accent={ACCENT} />
            <ResultItem label="Próximo día crítico" value={result.criticalDay ? `día ${result.criticalDay}` : '—'} accent={ACCENT} />
          </>
        ) : (
          <Text style={{ color: '#9BA3B5', fontSize: 14, textAlign: 'center', padding: 20 }}>Configura los días y presiona Calcular</Text>
        )
      }
    >
      <FormField label="LARA (capacidad del reservorio)" value={lara} onChangeText={setLara} unit="mm" placeholder="38" />
      <FormField label="ET diaria constante" value={et} onChangeText={setEt} unit="mm/día" placeholder="5" />

      <Text style={balStyles.hint}>El día 1 asume LAS = LARA.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={balStyles.tableScroll}>
        <View>
          <View style={balStyles.tableHeader}>
            <Text style={balStyles.thCell}>Día</Text>
            <Text style={balStyles.thCell}>P (mm)</Text>
            <Text style={balStyles.thCell}>R (mm)</Text>
            {calculated && <Text style={[balStyles.thCell, { color: ACCENT }]}>LAS</Text>}
          </View>
          {days.map((day, i) => {
            const lr = result?.results[i];
            return (
              <View key={i} style={[balStyles.tableRow, lr?.isDeficit && balStyles.deficitRow]}>
                <Text style={[balStyles.tdCell, { color: ACCENT }]}>{i + 1}</Text>
                <View style={balStyles.tdInput}>
                  <TextInput value={day.lluvia ? String(day.lluvia) : ''} onChangeText={(v) => updateDay(i, 'lluvia', v)} keyboardType="decimal-pad" placeholderTextColor="#B0B8C9" style={balStyles.tableInput} />
                </View>
                <View style={balStyles.tdInput}>
                  <TextInput value={day.riego ? String(day.riego) : ''} onChangeText={(v) => updateDay(i, 'riego', v)} keyboardType="decimal-pad" placeholderTextColor="#B0B8C9" style={balStyles.tableInput} />
                </View>
                {calculated && (
                  <Text style={[balStyles.tdCell, { color: ACCENT }, lr?.isDeficit && balStyles.deficitText]}>
                    {lr?.las != null ? fmt(lr.las, 1) + ' mm' : '—'}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={balStyles.actions}>
        <TouchableOpacity style={[balStyles.actionBtn, { borderColor: ACCENT }]} onPress={addDay}>
          <Ionicons name="add-circle-outline" size={16} color={ACCENT} />
          <Text style={[balStyles.actionText, { color: ACCENT }]}>Día</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[balStyles.actionBtn, { borderColor: '#E4E7ED' }]} onPress={resetDays}>
          <Ionicons name="refresh-outline" size={16} color="#7A8194" />
          <Text style={[balStyles.actionText, { color: '#7A8194' }]}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

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

const balStyles = StyleSheet.create({
  hint: { fontSize: 13, color: '#7A8194', marginBottom: 10, lineHeight: 18 },
  tableScroll: { marginHorizontal: -4 },
  tableHeader: { flexDirection: 'row', paddingBottom: 6, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: '#E4E7ED' },
  thCell: { width: 65, fontSize: 11, fontWeight: '500', color: '#9BA3B5', textTransform: 'uppercase', letterSpacing: 0.3 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E4E7ED40' },
  deficitRow: { backgroundColor: '#C6512E10' },
  tdCell: { width: 65, fontSize: 13, fontWeight: '500' },
  tdInput: { width: 65 },
  tableInput: { borderWidth: 1, borderColor: '#E4E7ED', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 6, fontSize: 14, color: '#1A1D26', backgroundColor: '#FFFFFF' },
  deficitText: { color: '#C6512E', fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  actionText: { fontSize: 13, fontWeight: '500' },
});
