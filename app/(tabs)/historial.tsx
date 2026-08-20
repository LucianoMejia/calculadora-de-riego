import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadHistory, deleteHistoryEntry, clearHistory, type HistoryEntry } from '../../lib/history';
import { useSettings } from '../_layout';

const TOOL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  densidad: 'layers-outline',
  humedad: 'water-outline',
  lamina: 'bar-chart-outline',
  lara: 'leaf-outline',
  volumen: 'swap-horizontal-outline',
  evapo: 'sunny-outline',
  balance: 'calendar-outline',
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

export default function HistorialScreen() {
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory().then(setHistory);
    }, [])
  );

  function handleDelete(id: string) {
    Alert.alert('Eliminar', '¿Eliminar este cálculo del historial?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteHistoryEntry(id);
          setHistory((prev) => prev.filter((e) => e.id !== id));
        },
      },
    ]);
  }

  function handleClearAll() {
    Alert.alert('Limpiar historial', '¿Eliminar todo el historial?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar todo',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  }

  function renderItem({ item }: { item: HistoryEntry }) {
    const icon = TOOL_ICONS[item.toolId] || 'calculator-outline';
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: '#2E7D5B14' }]}>
            <Ionicons name={icon} size={20} color="#2E7D5B" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.toolName}</Text>
            <Text style={styles.cardTime}>{timeAgo(item.timestamp)}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={18} color="#C7CCD6" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Entradas</Text>
            {Object.entries(item.inputs).map(([k, v]) => (
              <View key={k} style={styles.kvRow}>
                <Text style={styles.kvKey}>{k}</Text>
                <Text style={styles.kvVal}>{v || '—'}</Text>
              </View>
            ))}
          </View>
          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Resultados</Text>
            {Object.entries(item.results).map(([k, v]) => (
              <View key={k} style={styles.kvRow}>
                <Text style={styles.kvKey}>{k}</Text>
                <Text style={[styles.kvVal, { color: '#2E7D5B', fontWeight: '600' }]}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Historial</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearBtn}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 16 }]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={48} color="#D0D5DD" />
            <Text style={styles.emptyTitle}>Sin cálculos aún</Text>
            <Text style={styles.emptyText}>Los cálculos que guardes aparecerán aquí.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1D26' },
  clearBtn: { fontSize: 14, fontWeight: '500', color: '#C6512E' },
  list: { paddingHorizontal: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1A1D26' },
  cardTime: { fontSize: 12, color: '#9BA3B5', marginTop: 1 },
  cardBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  section: { marginBottom: 4 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9BA3B5',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  kvKey: { fontSize: 13, color: '#7A8194' },
  kvVal: { fontSize: 13, color: '#1A1D26' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E4E7ED',
    marginVertical: 8,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: '#7A8194' },
  emptyText: { fontSize: 14, color: '#9BA3B5', textAlign: 'center' },
});
