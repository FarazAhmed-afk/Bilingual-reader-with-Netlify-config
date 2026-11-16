import { describe, it, expect } from 'vitest';
import { initialStudy, studyReducer, type StudyAction, type StudyState } from './studyReducer';
import type { SettingsSnapshot } from './schema';
import { BASELINE } from '../config/settings';

const snap: SettingsSnapshot = { final: BASELINE.en, sources: null, suggestion: null, events: [] };
const run = (s: StudyState, ...as: StudyAction[]) => as.reduce(studyReducer, s);
const trialActions = (t0: number): StudyAction[] => [
  { type: 'startReading', t: t0 },
  { type: 'doneReading', t: t0 + 10, readingMs: 10000, settings: snap },
  { type: 'submitQuiz', t: t0 + 20, answers: [{ questionId: 'x', choice: 0, correct: true }, { questionId: 'y', choice: 1, correct: false }] },
  { type: 'submitEffort', t: t0 + 30, effort: { mental: 3, effort: 4, frustration: 2 } },
];

describe('studyReducer', () => {
  it('runs the full happy path', () => {
    let s = run(initialStudy(), { type: 'begin', number: 1, t: 1 }, { type: 'consent', t: 2 });
    expect(s.stage).toBe('trial');
    expect(s.phase).toBe('ready');           // trial 1 of P001 is the default condition
    for (let i = 0; i < 4; i++) s = run(s, ...trialActions(100 * (i + 1)));
    expect(s.stage).toBe('sus');
    expect(s.trials).toHaveLength(4);
    expect(s.trials[0].quiz.score).toBe(1);
    s = run(s, { type: 'submitSus', t: 999, lang: 'ur', answers: Array(10).fill(3) });
    expect(s.stage).toBe('done');
    expect(s.sus).toMatchObject({ score: 50, lang: 'ur' });
  });

  it('starts adjustable trials with the untimed setup step', () => {
    let s = run(initialStudy(), { type: 'begin', number: 1, t: 1 }, { type: 'consent', t: 2 }, ...trialActions(10));
    expect(s.phase).toBe('setup');
  });

  it('ignores out-of-order actions', () => {
    const s = run(initialStudy(), { type: 'begin', number: 1, t: 1 });
    expect(studyReducer(s, { type: 'startReading', t: 5 })).toBe(s);   // consent not given yet
    const c = run(s, { type: 'consent', t: 2 });
    expect(studyReducer(c, { type: 'submitQuiz', t: 3, answers: [] })).toBe(c);
  });

  it('stop and keep retains data; stop and delete removes it', () => {
    const base = run(initialStudy(), { type: 'begin', number: 2, t: 1 }, { type: 'consent', t: 2 }, ...trialActions(10));
    const kept = run(base, { type: 'stop', t: 50, keep: true });
    expect(kept.stage).toBe('stopped');
    expect(kept.trials).toHaveLength(1);
    const gone = run(base, { type: 'stop', t: 50, keep: false });
    expect(gone.trials).toHaveLength(0);
    expect(gone.stopped).toEqual({ t: 50, kept: false });
  });
});

describe('resume after reload', () => {
  it('restarts an interrupted reading, keeps the settings step, and flags it', () => {
    let s = run(initialStudy(), { type: 'begin', number: 1, t: 1 }, { type: 'consent', t: 2 }, { type: 'startReading', t: 3 });
    expect(s.phase).toBe('reading');
    s = run(s, { type: 'resume', t: 4 });
    expect(s.phase).toBe('ready');
    expect(s.draft).toEqual({ interrupted: 1 });
    s = run(s, { type: 'startReading', t: 5 }, { type: 'doneReading', t: 6, readingMs: 100, settings: snap },
      { type: 'submitQuiz', t: 7, answers: [{ questionId: 'x', choice: 0, correct: true }] }, { type: 'submitEffort', t: 8, effort: { mental: 1, effort: 1, frustration: 1 } });
    expect(s.trials[0].interrupted).toBe(1);
  });
  it('leaves quiz and effort phases untouched', () => {
    const s = run(initialStudy(), { type: 'begin', number: 1, t: 1 }, { type: 'consent', t: 2 }, { type: 'startReading', t: 3 }, { type: 'doneReading', t: 4, readingMs: 1, settings: snap });
    expect(studyReducer(s, { type: 'resume', t: 5 })).toBe(s);
  });
});
