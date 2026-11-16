import type { Trial } from '../study/plan';
import type { SusRecord, TrialRecord } from '../study/schema';
import type { StudyState } from '../study/studyReducer';

export interface StudyRecord {
  schemaVersion: 1;
  sessionId: string;
  participantId: string;
  participantNumber: number;
  status: 'completed' | 'stopped_kept' | 'incomplete';
  startedAt: number;
  consentAt: number;
  endedAt: number | null;
  /** true when stand-in passages/questions were in use: test data, never analyse as real */
  contentPlaceholder: boolean;
  plan: Trial[];
  trials: TrialRecord[];
  sus: SusRecord | null;
}

/** Returns null when there is nothing that may be kept (no participant, or no consent given). */
export function buildRecord(s: StudyState, contentPlaceholder: boolean): StudyRecord | null {
  if (!s.participant || s.consentAt === undefined) return null;
  if (s.stopped && !s.stopped.kept) return null;
  const status = s.stage === 'done' ? 'completed' : s.stopped?.kept ? 'stopped_kept' : 'incomplete';
  return {
    schemaVersion: 1,
    sessionId: `${s.participant.id}_${s.consentAt}`,
    participantId: s.participant.id,
    participantNumber: s.participant.number,
    status,
    startedAt: s.startedAt ?? s.consentAt,
    consentAt: s.consentAt,
    endedAt: s.endedAt ?? null,
    contentPlaceholder,
    plan: s.plan,
    trials: s.trials,
    sus: s.sus ?? null,
  };
}
