import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { loadSettings, saveSettings, type AppSettings } from '../lib/storage';

SplashScreen.preventAutoHideAsync();

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: { accent: '#2E7D5B' },
  updateSettings: () => {},
});

export function useSettings() {
  return useContext(SettingsContext);
}

export default function RootLayout() {
  const [settings, setSettings] = useState<AppSettings>({ accent: '#2E7D5B' });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  if (!loaded) return null;

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F2F4F7' },
        }}
      />
      <StatusBar style="dark" />
    </SettingsContext.Provider>
  );
}
