import { describe, it, expect } from 'vitest';
import { csvCell, eventsCsv, susCsv, toCsv, trialsCsv } from './export';
import { buildRecord } from './record';
import { initialStudy, studyReducer, type StudyAction, type StudyState } from '../study/studyReducer';
import type { SettingsSnapshot } from '../study/schema';
import { BASELINE } from '../config/settings';

const adjSnap: SettingsSnapshot = {
  final: { ...BASELINE.en, sizePx: 24, bgId: 'warm-yellow' },
  sources: { fontId: 'baseline', sizePx: 'reader', lineHeight: 'baseline', letterSpacingEm: 'baseline', wordSpacingEm: 'baseline', bgId: 'suggested', lineFocus: 'baseline', chunking: 'baseline', simplified: 'baseline' },
  suggestion: 'accepted',
  events: [
    { t: 900, kind: 'suggested', key: 'bgId', from: 'white', to: 'warm-yellow', source: 'suggested' },
    { t: 1100, kind: 'change', key: 'sizePx', from: 20, to: 24, source: 'reader' },
  ],
};
const run = (s: StudyState, ...as: StudyAction[]) => as.reduce(studyReducer, s);
const trial = (t0: number, settings: SettingsSnapshot): StudyAction[] => [
  { type: 'startReading', t: t0 },
  { type: 'doneReading', t: t0 + 60000, readingMs: 60000, settings },
  { type: 'submitQuiz', t: t0 + 61000, answers: [0, 1, 2, 3, 4].map((i) => ({ questionId: `q${i}`, choice: 0, correct: i < 3 })) },
  { type: 'submitEffort', t: t0 + 62000, effort: { mental: 3, effort: 4, frustration: 2 } },
];
const defSnap: SettingsSnapshot = { final: BASELINE.en, sources: null, suggestion: null, events: [] };

function finished() {
  let s = run(initialStudy(), { type: 'begin', number: 1, t: 1 }, { type: 'consent', t: 2 });
  s = run(s, ...trial(1000, defSnap), ...trial(2000, adjSnap), ...trial(3000, defSnap), ...trial(4000, adjSnap));
  return run(s, { type: 'submitSus', t: 9, lang: 'en', answers: [5, 1, 5, 1, 5, 1, 5, 1, 5, 1] });
}

describe('csv helpers', () => {
  it('escapes commas, quotes and newlines; booleans become 1/0', () => {
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell(true)).toBe('1');
    expect(csvCell(null)).toBe('');
    expect(toCsv(['a', 'b'], [[1, 'x']])).toBe('a,b\r\n1,x\r\n');
  });
});

describe('record and exports', () => {
  it('builds a completed record only when consent was given and data is kept', () => {
    expect(buildRecord(initialStudy(), true)).toBeNull();
    const rec = buildRecord(finished(), true)!;
    expect(rec.status).toBe('completed');
    expect(rec.sessionId).toBe('P001_2');
    expect(rec.trials).toHaveLength(4);
    const gone = run(run(initialStudy(), { type: 'begin', number: 1, t: 1 }, { type: 'consent', t: 2 }), { type: 'stop', t: 3, keep: false });
    expect(buildRecord(gone, true)).toBeNull();
  });
  it('marks mid-session records incomplete', () => {
    const mid = run(initialStudy(), { type: 'begin', number: 1, t: 1 }, { type: 'consent', t: 2 }, ...trial(1000, defSnap));
    expect(buildRecord(mid, false)!.status).toBe('incomplete');
  });
  it('trials CSV has one row per trial with consistent column counts and sources', () => {
    const rec = buildRecord(finished(), true)!;
    const lines = trialsCsv([rec]).trim().split('\r\n');
    expect(lines).toHaveLength(5);
    const cols = lines[0].split(',').length;
    lines.forEach((l) => expect(l.split(',').length).toBe(cols));
    const header = lines[0].split(',');
    const adjRow = lines[2].split(',');
    expect(adjRow[header.indexOf('condition')]).toBe('adjustable');
    expect(adjRow[header.indexOf('set_sizePx')]).toBe('24');
    expect(adjRow[header.indexOf('src_sizePx')]).toBe('reader');
    expect(adjRow[header.indexOf('src_bgId')]).toBe('suggested');
    expect(adjRow[header.indexOf('quiz_score')]).toBe('3');
    expect(adjRow[header.indexOf('content_placeholder')]).toBe('1');
    expect(lines[1].split(',')[header.indexOf('src_sizePx')]).toBe('');
  });
  it('events CSV separates the untimed setup step from reading', () => {
    const rec = buildRecord(finished(), true)!;
    const rows = eventsCsv([rec]).trim().split('\r\n').slice(1);
    expect(rows.length).toBe(4);   // 2 events x 2 adjustable trials
    expect(rows[0].split(',')[4]).toBe('setup');      // t=900 is before readingStartedAt=2000
  });
  it('SUS CSV has the score', () => {
    const rec = buildRecord(finished(), false)!;
    expect(susCsv([rec]).trim().split('\r\n')[1]).toContain(',100,');
  });
});
