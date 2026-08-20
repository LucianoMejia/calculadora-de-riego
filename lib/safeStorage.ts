let memoryStore: Record<string, string> = {};

let asyncStorageAvailable: boolean | null = null;

async function isAvailable(): Promise<boolean> {
  if (asyncStorageAvailable !== null) return asyncStorageAvailable;
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem('__test__', '1');
    await AsyncStorage.removeItem('__test__');
    asyncStorageAvailable = true;
  } catch {
    asyncStorageAvailable = false;
  }
  return asyncStorageAvailable;
}

export async function safeGetItem(key: string): Promise<string | null> {
  if (await isAvailable()) {
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      return await AsyncStorage.getItem(key);
    } catch {}
  }
  return memoryStore[key] ?? null;
}

export async function safeSetItem(key: string, value: string): Promise<void> {
  if (await isAvailable()) {
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem(key, value);
      return;
    } catch {}
  }
  memoryStore[key] = value;
}

export async function safeRemoveItem(key: string): Promise<void> {
  if (await isAvailable()) {
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.removeItem(key);
      return;
    } catch {}
  }
  delete memoryStore[key];
}
