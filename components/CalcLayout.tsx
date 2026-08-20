import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CalcLayoutProps {
  title: string;
  description: string;
  accent: string;
  children: React.ReactNode;
  results: React.ReactNode;
  formula?: string;
}

export function CalcLayout({ title, description, accent, children, results, formula }: CalcLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.hero}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>

      <View style={styles.card}>
        {children}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resultados</Text>
        {results}
      </View>

      {formula ? (
        <View style={styles.formula}>
          <Text style={styles.formulaText}>{formula}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F2F4F7' },
  content: { padding: 20 },
  hero: { marginBottom: 24 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1D26',
    marginBottom: 6,
  },
  desc: {
    fontSize: 15,
    color: '#7A8194',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9BA3B5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  formula: {
    backgroundColor: '#F7F8FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  formulaText: {
    fontSize: 13,
    color: '#7A8194',
    lineHeight: 20,
  },
});
