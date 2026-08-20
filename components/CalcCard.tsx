import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CalcCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  description: string;
  accent: string;
  onPress: () => void;
}

export function CalcCard({ icon, name, description, accent, onPress }: CalcCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.iconWrap, { backgroundColor: accent + '14' }]}>
        <Ionicons name={icon} size={24} color={accent} />
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.desc} numberOfLines={2}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C7CCD6" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 10,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1D26',
    marginBottom: 2,
  },
  desc: {
    fontSize: 13,
    color: '#7A8194',
    lineHeight: 18,
  },
});
