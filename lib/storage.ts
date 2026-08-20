import { safeGetItem, safeSetItem } from './safeStorage';
import type { AccentColor } from './colors';

const SETTINGS_KEY = 'riegos_settings_v1';
const LAST_TOOL_KEY = 'riegos_lastTool';

export interface AppSettings {
  accent: AccentColor;
}

const DEFAULT_SETTINGS: AppSettings = {
  accent: '#2E7D5B',
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await safeGetItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await safeSetItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export async function loadLastTool(): Promise<string | null> {
  try {
    return await safeGetItem(LAST_TOOL_KEY);
  } catch {
    return null;
  }
}

export async function saveLastTool(toolId: string): Promise<void> {
  try {
    await safeSetItem(LAST_TOOL_KEY, toolId);
  } catch {}
}
