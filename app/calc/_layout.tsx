import React from 'react';
import { Stack } from 'expo-router';

export default function CalcLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#1A1D26',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 16,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#F2F4F7',
        },
        animation: 'slide_from_right',
      }}
    />
  );
}
