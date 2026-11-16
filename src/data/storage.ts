import type { State as AdjAll } from '../app/adjustableReducer';
import type { StudyState } from '../study/studyReducer';
import type { StudyRecord } from './record';

export interface StorageLike {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}
export interface SavedSession { v: 1; savedAt: number; study: StudyState; adj: AdjAll }

const CURRENT = 'ahci.v1.current';
const SESSIONS = 'ahci.v1.sessions';

// localStorage is enough: a whole session is a few kilobytes. Everything is wrapped because
// storage can be missing or blocked (private mode, policy) and must never crash the study.
const defaultStore = (): StorageLike | null => {
  try { return globalThis.localStorage ?? null; } catch { return null; }
};

const write = (key: string, value: unknown, store: StorageLike | null): boolean => {
  if (!store) return false;
  try { store.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
};
const read = <T>(key: string, store: StorageLike | null): T | null => {
  if (!store) return null;
  try { const raw = store.getItem(key); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
};

export function storageWorks(store: StorageLike | null = defaultStore()): boolean {
  if (!store) return false;
  try { store.setItem('ahci.v1.probe', '1'); store.removeItem('ahci.v1.probe'); return true; } catch { return false; }
}

export const saveCurrent = (s: Omit<SavedSession, 'v' | 'savedAt'>, store = defaultStore()) =>
  write(CURRENT, { v: 1, savedAt: Date.now(), ...s } satisfies SavedSession, store);
export const loadCurrent = (store = defaultStore()): SavedSession | null => {
  const s = read<SavedSession>(CURRENT, store);
  return s && s.v === 1 && s.study ? s : null;
};
export const clearCurrent = (store = defaultStore()) => { try { store?.removeItem(CURRENT); } catch { /* ignore */ } };

export const loadSessions = (store = defaultStore()): StudyRecord[] => {
  const all = read<StudyRecord[]>(SESSIONS, store);
  return Array.isArray(all) ? all.filter((r) => r && r.schemaVersion === 1) : [];
};
/** Insert or replace by sessionId, so archiving the same session twice never duplicates it. */
export function upsertSession(rec: StudyRecord, store = defaultStore()): boolean {
  const rest = loadSessions(store).filter((r) => r.sessionId !== rec.sessionId);
  return write(SESSIONS, [...rest, rec], store);
}
export const deleteSession = (id: string, store = defaultStore()) =>
  write(SESSIONS, loadSessions(store).filter((r) => r.sessionId !== id), store);
export const deleteAllSessions = (store = defaultStore()) => { try { store?.removeItem(SESSIONS); } catch { /* ignore */ } };
