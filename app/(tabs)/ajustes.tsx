import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../_layout';
import Constants from 'expo-constants';

const SOCIALS = [
  { name: 'Instagram', icon: 'logo-instagram' as const, color: '#E4405F', url: 'https://instagram.com/lucianomejia17' },
  { name: 'GitHub', icon: 'logo-github' as const, color: '#1A1D26', url: 'https://github.com/LucianoMejia' },
  { name: 'LinkedIn', icon: 'logo-linkedin' as const, color: '#0A66C2', url: 'https://www.linkedin.com/in/jos%C3%A9-luciano-mej%C3%ADa-arias-a35806383/' },
];

const FEATURES = [
  { icon: 'calculator-outline' as const, title: '7 herramientas', text: 'Cálculos de riego agrícola respaldados por ecuaciones de ingeniería.' },
  { icon: 'time-outline' as const, title: 'Historial', text: 'Guarda y consulta cada cálculo que realizas.' },
  { icon: 'cloud-offline-outline' as const, title: '100% offline', text: 'Funciona sin conexión a internet en cualquier momento.' },
];

export default function AjustesScreen() {
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
    >
      <Text style={styles.title}>Acerca de</Text>

      {/* Hero */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Calculadora de Riego</Text>
        <Text style={styles.heroSub}>
          Herramientas profesionales para el cálculo y manejo del agua en suelo agrícola. Diseñada para ingenieros agrónomos, estudiantes y productores.
        </Text>
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>v{Constants.expoConfig?.version ?? '1.0.0'}</Text>
        </View>
      </View>

      {/* Objetivo */}
      <Text style={styles.groupHead}>OBJETIVO</Text>
      <View style={styles.objectiveCard}>
        <Text style={styles.objectiveText}>
          Esta aplicación nace con el propósito de facilitar los cálculos de riego agrícola que diariamente realizan los profesionales del sector agropecuario.{'\n\n'}
          Resuelve problemas comunes como la conversión de unidades, el cálculo de láminas de riego, la estimación de evapotranspiración y el balance hídrico del suelo, todo desde el celular sin necesidad de internet.
        </Text>
      </View>

      {/* Características */}
      <Text style={styles.groupHead}>CARACTERÍSTICAS</Text>
      <View style={styles.group}>
        {FEATURES.map((f, i) => (
          <View key={i} style={[styles.featureRow, i < FEATURES.length - 1 && { borderBottomColor: '#F0F1F4' }]}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={20} color={settings.accent} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          </View>
        ))}
      </View>

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
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 10, textAlign: 'center' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 21, textAlign: 'center', marginBottom: 16 },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  versionText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },

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

  objectiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  objectiveText: {
    fontSize: 14,
    color: '#4A5068',
    lineHeight: 22,
  },

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

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F1F4',
    gap: 14,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2E7D5B10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '600', color: '#1A1D26', marginBottom: 2 },
  featureText: { fontSize: 13, color: '#7A8194', lineHeight: 18 },

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
