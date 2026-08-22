import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../_layout';
import { CalcCard } from '../../components/CalcCard';
import { Accordion } from '../../components/Accordian';
import { SymbolReference } from '../../components/SymbolReference';
import { TOOLS, type ToolDef } from '../../lib/tools';
import { CATEGORY_COLORS } from '../../lib/colors';
import { checkForUpdate, type UpdateInfo } from '../../lib/versionCheck';
import { Ionicons } from '@expo/vector-icons';

const CATEGORY_LABELS: Record<string, string> = {
  suelo: 'Propiedades del suelo',
  riego: 'Programación de riego',
};

export default function HomeScreen() {
  const router = useRouter();
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();
  const [update, setUpdate] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    checkForUpdate().then(setUpdate);
  }, []);

  const sueloTools = TOOLS.filter((t) => t.category === 'suelo');
  const riegoTools = TOOLS.filter((t) => t.category === 'riego');

  function handlePress(tool: ToolDef) {
    router.push(`/calc/${tool.id}`);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
    >
      <Text style={styles.greeting}>
        Hola, ¿qué quieres{'\n'}calcular hoy?
      </Text>

      {update?.hasUpdate && (
        <TouchableOpacity
          style={styles.updateBanner}
          activeOpacity={0.7}
          onPress={() => Linking.openURL(update.downloadUrl)}
        >
          <Ionicons name="arrow-up-circle-outline" size={24} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.updateTitle}>Nueva versión disponible</Text>
            <Text style={styles.updateSub}>v{update.latestVersion} — Toca para actualizar</Text>
          </View>
          <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionHead}>{CATEGORY_LABELS.suelo}</Text>
        {sueloTools.map((tool) => (
          <CalcCard
            key={tool.id}
            icon={tool.icon as keyof typeof Ionicons.glyphMap}
            name={tool.name}
            description={tool.description}
            accent={CATEGORY_COLORS[tool.colorKey as keyof typeof CATEGORY_COLORS] || settings.accent}
            onPress={() => handlePress(tool)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHead}>{CATEGORY_LABELS.riego}</Text>
        {riegoTools.map((tool) => (
          <CalcCard
            key={tool.id}
            icon={tool.icon as keyof typeof Ionicons.glyphMap}
            name={tool.name}
            description={tool.description}
            accent={CATEGORY_COLORS[tool.colorKey as keyof typeof CATEGORY_COLORS] || settings.accent}
            onPress={() => handlePress(tool)}
          />
        ))}
      </View>

      <Accordion title="Referencia rápida de símbolos" accent={settings.accent}>
        <SymbolReference />
      </Accordion>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  content: { paddingHorizontal: 20 },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1D26',
    marginBottom: 28,
    lineHeight: 34,
  },
  section: { marginBottom: 8 },
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
  sectionHead: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9BA3B5',
    marginBottom: 10,
    marginLeft: 4,
  },
});
