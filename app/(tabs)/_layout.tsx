import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../_layout';

export default function TabsLayout() {
  const { settings } = useSettings();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: settings.accent,
        tabBarInactiveTintColor: '#A0A8B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0F1F4',
          borderTopWidth: 0.5,
          height: 56,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calculadoras',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calculator-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Acerca de',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ellipsis-horizontal-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
