import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ResultItemProps {
  label: string;
  value: string;
  note?: string;
  accent?: string;
}

export function ResultItem({ label, value, note, accent = '#2E7D5B' }: ResultItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E7ED',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7A8194',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  note: {
    fontSize: 12,
    color: '#9BA3B5',
    marginTop: 2,
  },
});
