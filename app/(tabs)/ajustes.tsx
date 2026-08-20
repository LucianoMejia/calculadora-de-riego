import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../_layout';
import { APP_VERSION, GIT_COMMIT } from '../../lib/gitInfo';

const SOCIALS = [
  { name: 'Instagram', icon: 'logo-instagram' as const, color: '#E4405F', url: 'https://instagram.com/lucianomejia17' },
  { name: 'GitHub', icon: 'logo-github' as const, color: '#1A1D26', url: 'https://github.com/LucianoMejia' },
  { name: 'LinkedIn', icon: 'logo-linkedin' as const, color: '#0A66C2', url: 'https://www.linkedin.com/in/jos%C3%A9-luciano-mej%C3%ADa-arias-a35806383/' },
];

export default function AjustesScreen() {
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    checkUpdate();
  }, []);

  async function checkUpdate() {
    try {
      const Updates = await import('expo-updates');
      const checkFn = Updates.checkForUpdateAsync;
      if (!checkFn) return;
      const update = await checkFn();
      if (update.isAvailable) {
        setUpdateAvailable(true);
        setUpdateMsg('Nueva versión disponible');
      }
    } catch {}
  }

  async function applyUpdate() {
    try {
      const Updates = await import('expo-updates');
      await Updates.reloadAsync();
    } catch {
      Alert.alert('Actualización', 'No se pudo actualizar. Intenta más tarde.');
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
    >
      <Text style={styles.title}>Más</Text>

      {/* Hero */}
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ionicons name="leaf" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.heroTitle}>Calculadora de Riego</Text>
        <Text style={styles.heroSub}>Herramientas profesionales para el manejo del agua en suelo agrícola.</Text>
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>v{APP_VERSION}</Text>
          <Text style={styles.versionDot}>·</Text>
          <Text style={styles.commitText}>{GIT_COMMIT}</Text>
        </View>
      </View>

      {/* Update banner */}
      {updateAvailable && (
        <TouchableOpacity style={styles.updateBanner} onPress={applyUpdate} activeOpacity={0.7}>
          <Ionicons name="arrow-down-circle-outline" size={22} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.updateTitle}>Nueva versión disponible</Text>
            <Text style={styles.updateSub}>{updateMsg}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Desarrollador */}
      <Text style={styles.groupHead}>DESARROLLADOR</Text>
      <View style={styles.group}>
        <View style={styles.creditRow}>
          <Text style={styles.creditName}>Nombre</Text>
          <Text style={styles.creditValue}>José Luciano Mejía Arias</Text>
        </View>
      </View>

      {/* Redes sociales */}
      <Text style={styles.groupHead}>REDES SOCIALES</Text>
      <View style={styles.group}>
        {SOCIALS.map((s, i) => (
          <TouchableOpacity
            key={s.name}
            style={[styles.row, i < SOCIALS.length - 1 && { borderBottomColor: '#F0F1F4' }]}
            onPress={() => Linking.openURL(s.url)}
            activeOpacity={0.6}
          >
            <View style={styles.rowLeft}>
              <Ionicons name={s.icon} size={22} color={s.color} />
              <Text style={styles.rowLabel}>{s.name}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#C7CCD6" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Contacto */}
      <Text style={styles.groupHead}>CONTACTO</Text>
      <View style={styles.group}>
        <TouchableOpacity
          style={[styles.row, { borderBottomColor: '#F0F1F4' }]}
          onPress={() => Linking.openURL('mailto:jomejiaar@unal.edu.co?subject=Sugerencia%20Calculadora%20de%20Riego')}
          activeOpacity={0.6}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="mail-outline" size={22} color="#7A8194" />
            <Text style={styles.rowLabel}>Sugerencias</Text>
          </View>
          <Ionicons name="open-outline" size={16} color="#C7CCD6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('mailto:jomejiaar@unal.edu.co?subject=Bug%20Calculadora%20de%20Riego')}
          activeOpacity={0.6}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="bug-outline" size={22} color="#7A8194" />
            <Text style={styles.rowLabel}>Reportar un problema</Text>
          </View>
          <Ionicons name="open-outline" size={16} color="#C7CCD6" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1D26', marginBottom: 20, lineHeight: 34 },

  heroCard: {
    backgroundColor: '#2E7D5B',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 6, textAlign: 'center' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20, textAlign: 'center', marginBottom: 14 },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  versionText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  versionDot: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  commitText: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Courier' },

  updateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6512E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  updateTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  updateSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },

  groupHead: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9BA3B5',
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 4,
  },
  group: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  creditRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  creditName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9BA3B5',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  creditValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1D26',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F1F4',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 15, fontWeight: '500', color: '#1A1D26' },
});
