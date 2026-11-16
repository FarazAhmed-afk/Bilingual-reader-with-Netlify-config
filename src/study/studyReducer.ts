import type { Trial } from './plan';
import { buildPlan, participantId } from './plan';
import { susScore } from './scoring';
import type { EffortRatings, QuizAnswer, SettingsSnapshot, SusRecord, TrialRecord } from './schema';
import type { Lang } from '../config/languages';

export type Stage = 'setup' | 'consent' | 'trial' | 'sus' | 'done' | 'stopped';
/** setup = untimed layout step (adjustable only); ready = instructions (default only). */
export type Phase = 'setup' | 'ready' | 'reading' | 'quiz' | 'effort';

export interface Draft {
  readingStartedAt?: number;
  readingEndedAt?: number;
  readingMs?: number;
  settings?: SettingsSnapshot;
  quiz?: TrialRecord["quiz"];
  interrupted?: number;
}

export interface StudyState {
  stage: Stage;
  participant: { number: number; id: string } | null;
  plan: Trial[];
  trialIdx: number;
  phase: Phase;
  draft: Draft;
  consentAt?: number;
  startedAt?: number;
  endedAt?: number;
  trials: TrialRecord[];
  sus?: SusRecord;
  stopped?: { t: number; kept: boolean };
}

export type StudyAction =
  | { type: 'begin'; number: number; t: number }
  | { type: 'consent'; t: number }
  | { type: 'startReading'; t: number }
  | { type: 'doneReading'; t: number; readingMs: number; settings: SettingsSnapshot }
  | { type: 'submitQuiz'; t: number; answers: QuizAnswer[] }
  | { type: 'submitEffort'; t: number; effort: EffortRatings }
  | { type: 'submitSus'; t: number; lang: Lang; answers: number[] }
  | { type: 'resume'; t: number }
  | { type: 'stop'; t: number; keep: boolean };

export const initialStudy = (): StudyState => ({
  stage: 'setup', participant: null, plan: [], trialIdx: 0, phase: 'ready', draft: {}, trials: [],
});

const initialPhase = (t: Trial): Phase => (t.condition === 'adjustable' ? 'setup' : 'ready');

export function studyReducer(state: StudyState, a: StudyAction): StudyState {
  switch (a.type) {
    case 'begin':
      if (state.stage !== 'setup') return state;
      return { ...state, stage: 'consent', participant: { number: a.number, id: participantId(a.number) }, plan: buildPlan(a.number) };
    case 'consent':
      if (state.stage !== 'consent') return state;
      return { ...state, stage: 'trial', consentAt: a.t, startedAt: a.t, trialIdx: 0, phase: initialPhase(state.plan[0]), draft: {} };
    case 'startReading':
      if (state.stage !== 'trial' || (state.phase !== 'setup' && state.phase !== 'ready')) return state;
      return { ...state, phase: 'reading', draft: { ...state.draft, readingStartedAt: a.t } };
    case 'doneReading':
      if (state.stage !== 'trial' || state.phase !== 'reading') return state;
      return { ...state, phase: 'quiz', draft: { ...state.draft, readingEndedAt: a.t, readingMs: a.readingMs, settings: a.settings } };
    case 'submitQuiz': {
      if (state.stage !== 'trial' || state.phase !== 'quiz') return state;
      const score = a.answers.filter((x) => x.correct).length;
      return { ...state, phase: 'effort', draft: { ...state.draft, quiz: { answers: a.answers, score, submittedAt: a.t } } };
    }
    case 'submitEffort': {
      const tr = state.plan[state.trialIdx];
      const d = state.draft;
      if (state.stage !== 'trial' || state.phase !== 'effort' || !tr) return state;
      if (d.readingStartedAt === undefined || d.readingEndedAt === undefined || d.readingMs === undefined || !d.settings || !d.quiz) return state;
      const rec: TrialRecord = {
        index: tr.index, lang: tr.lang, condition: tr.condition, passageId: tr.passageId,
        readingStartedAt: d.readingStartedAt, readingEndedAt: d.readingEndedAt, readingMs: d.readingMs,
        interrupted: d.interrupted ?? 0, settings: d.settings, quiz: d.quiz, effort: { ...a.effort, submittedAt: a.t },
      };
      const trials = [...state.trials, rec];
      const next = state.trialIdx + 1;
      if (next < state.plan.length) return { ...state, trials, trialIdx: next, phase: initialPhase(state.plan[next]), draft: {} };
      return { ...state, trials, stage: 'sus', draft: {} };
    }
    case 'submitSus':
      if (state.stage !== 'sus') return state;
      return { ...state, stage: 'done', endedAt: a.t, sus: { lang: a.lang, answers: a.answers, score: susScore(a.answers), submittedAt: a.t } };
    case 'resume': {
      // After a reload: a reading interrupted mid-way has no valid timing, so it restarts and is flagged.
      if (state.stage !== 'trial' || state.phase !== 'reading') return state;
      return { ...state, phase: initialPhase(state.plan[state.trialIdx]), draft: { interrupted: (state.draft.interrupted ?? 0) + 1 } };
    }
    case 'stop':
      if (state.stage === 'setup' || state.stage === 'done' || state.stage === 'stopped') return state;
      // keep=false: nothing collected so far is retained.
      return a.keep
        ? { ...state, stage: 'stopped', endedAt: a.t, stopped: { t: a.t, kept: true } }
        : { ...state, stage: 'stopped', endedAt: a.t, stopped: { t: a.t, kept: false }, trials: [], sus: undefined, draft: {} };
  }
}
