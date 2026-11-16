import { describe, it, expect } from 'vitest';
import { clearCurrent, deleteAllSessions, deleteSession, loadCurrent, loadSessions, saveCurrent, storageWorks, upsertSession, type StorageLike } from './storage';
import { initialStudy } from '../study/studyReducer';
import { initialState } from '../app/adjustableReducer';
import type { StudyRecord } from './record';

const fake = (): StorageLike & { m: Map<string, string> } => {
  const m = new Map<string, string>();
  return { m, getItem: (k) => m.get(k) ?? null, setItem: (k, v) => { m.set(k, v); }, removeItem: (k) => { m.delete(k); } };
};
const rec = (id: string): StudyRecord => ({
  schemaVersion: 1, sessionId: id, participantId: 'P001', participantNumber: 1, status: 'completed',
  startedAt: 1, consentAt: 1, endedAt: 2, contentPlaceholder: true, plan: [], trials: [], sus: null,
});

describe('storage', () => {
  it('round-trips the current session and clears it', () => {
    const st = fake();
    expect(saveCurrent({ study: initialStudy(), adj: initialAdj() }, st)).toBe(true);
    expect(loadCurrent(st)?.study.stage).toBe('setup');
    clearCurrent(st);
    expect(loadCurrent(st)).toBeNull();
  });
  it('upserts by sessionId without duplicating, and deletes', () => {
    const st = fake();
    upsertSession(rec('a'), st); upsertSession(rec('a'), st); upsertSession(rec('b'), st);
    expect(loadSessions(st).map((r) => r.sessionId).sort()).toEqual(['a', 'b']);
    deleteSession('a', st);
    expect(loadSessions(st).map((r) => r.sessionId)).toEqual(['b']);
    deleteAllSessions(st);
    expect(loadSessions(st)).toEqual([]);
  });
  it('ignores corrupt data and survives a missing or failing store', () => {
    const st = fake();
    st.m.set('ahci.v1.sessions', '{not json');
    st.m.set('ahci.v1.current', 'xx');
    expect(loadSessions(st)).toEqual([]);
    expect(loadCurrent(st)).toBeNull();
    expect(saveCurrent({ study: initialStudy(), adj: initialAdj() }, null)).toBe(false);
    const full: StorageLike = { getItem: () => null, setItem: () => { throw new Error('quota'); }, removeItem: () => {} };
    expect(upsertSession(rec('x'), full)).toBe(false);
    expect(storageWorks(full)).toBe(false);
    expect(storageWorks(st)).toBe(true);
  });
});
const initialAdj = initialState;
