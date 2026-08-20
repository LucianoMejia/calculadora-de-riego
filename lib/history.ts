import { safeGetItem, safeSetItem } from './safeStorage';

const HISTORY_KEY = 'riegos_history_v1';

export interface HistoryEntry {
  id: string;
  toolId: string;
  toolName: string;
  timestamp: number;
  inputs: Record<string, string>;
  results: Record<string, string>;
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await safeGetItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export async function saveHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): Promise<HistoryEntry> {
  const full: HistoryEntry = {
    ...entry,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: Date.now(),
  };
  try {
    const history = await loadHistory();
    history.unshift(full);
    if (history.length > 50) history.length = 50;
    await safeSetItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
  return full;
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  try {
    const history = await loadHistory();
    const filtered = history.filter((e) => e.id !== id);
    await safeSetItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch {}
}

export async function clearHistory(): Promise<void> {
  try {
    const history = await loadHistory();
    const empty: HistoryEntry[] = [];
    await safeSetItem(HISTORY_KEY, JSON.stringify(empty));
  } catch {}
}
