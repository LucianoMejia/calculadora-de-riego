import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SYMBOLS = [
  { abbr: 'Da', desc: 'densidad aparente (g/cm³)' },
  { abbr: 'Dr', desc: 'densidad real (g/cm³, ≈2.65)' },
  { abbr: 'η', desc: 'porosidad (%)' },
  { abbr: 'W%', desc: 'humedad gravimétrica (base masa)' },
  { abbr: 'θ%', desc: 'humedad volumétrica (base volumen)' },
  { abbr: 'Lam', desc: 'lámina de agua (cm o mm)' },
  { abbr: 'Wcc', desc: 'humedad a capacidad de campo' },
  { abbr: 'Wpmp', desc: 'humedad a punto de marchitez permanente' },
  { abbr: 'A.A.', desc: 'agua aprovechable' },
  { abbr: 'NA', desc: 'nivel de agotamiento permitido' },
  { abbr: 'ARA', desc: 'agua rápidamente aprovechable' },
  { abbr: 'LARA', desc: 'lámina de agua rápidamente aprovechable' },
  { abbr: 'ETc', desc: 'evapotranspiración del cultivo' },
  { abbr: 'Ev', desc: 'evaporación del tanque clase A' },
  { abbr: 'Kc, Kp', desc: 'coeficientes de cultivo y de tanque' },
  { abbr: 'LAS', desc: 'lámina de agua almacenada disponible' },
];

export function SymbolReference() {
  return (
    <View style={styles.list}>
      {SYMBOLS.map((s, i) => (
        <View key={s.abbr} style={[styles.row, i < SYMBOLS.length - 1 && styles.rowBorder]}>
          <Text style={styles.abbr}>{s.abbr}</Text>
          <Text style={styles.desc}>{s.desc}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {},
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingVertical: 8,
    gap: 8,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E7ED',
  },
  abbr: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D26',
    minWidth: 44,
  },
  desc: {
    fontSize: 13,
    color: '#7A8194',
    flex: 1,
  },
});
