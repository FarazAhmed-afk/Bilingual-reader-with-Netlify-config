import { getPassage } from '../content/passages';
import { wordCount } from '../content/validate';
import type { SettingKey } from '../config/settings';
import type { StudyRecord } from './record';

export const SETTING_KEYS: SettingKey[] = ['fontId', 'sizePx', 'lineHeight', 'letterSpacingEm', 'wordSpacingEm', 'bgId', 'lineFocus', 'chunking', 'simplified'];

type Cell = string | number | boolean | null | undefined;
export function csvCell(v: Cell): string {
  const s = v === null || v === undefined ? '' : typeof v === 'boolean' ? (v ? '1' : '0') : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export const toCsv = (header: string[], rows: Cell[][]) =>
  [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';

const idCols = (r: StudyRecord) => [r.sessionId, r.participantId];

export function trialsCsv(records: StudyRecord[]): string {
  const header = [
    'session_id', 'participant_id', 'status', 'content_placeholder', 'trial_index', 'lang', 'condition', 'passage_id',
    'reading_ms', 'interrupted', 'words_original', 'words_simplified', 'wpm_original',
    'quiz_score', 'q1_correct', 'q2_correct', 'q3_correct', 'q4_correct', 'q5_correct',
    'effort_mental', 'effort_effort', 'effort_frustration',
    ...SETTING_KEYS.map((k) => `set_${k}`), 'suggestion_status', ...SETTING_KEYS.map((k) => `src_${k}`),
  ];
  const rows: Cell[][] = [];
  for (const r of records) for (const t of r.trials) {
    const p = getPassage(t.passageId);
    const wo = p ? wordCount(p.original) : null;
    const ws = p?.simplified ? wordCount(p.simplified) : null;
    rows.push([
      ...idCols(r), r.status, r.contentPlaceholder, t.index, t.lang, t.condition, t.passageId,
      t.readingMs, t.interrupted, wo, ws, wo ? +(wo / (t.readingMs / 60000)).toFixed(1) : null,
      t.quiz.score, ...[0, 1, 2, 3, 4].map((i) => (t.quiz.answers[i] ? t.quiz.answers[i].correct : null)),
      t.effort.mental, t.effort.effort, t.effort.frustration,
      ...SETTING_KEYS.map((k) => t.settings.final[k]), t.settings.suggestion,
      ...SETTING_KEYS.map((k) => (t.settings.sources ? t.settings.sources[k] : null)),
    ]);
  }
  return toCsv(header, rows);
}

/** One row per settings change/decision. t_rel_ms < 0 means it happened in the untimed setup step. */
export function eventsCsv(records: StudyRecord[]): string {
  const header = ['session_id', 'participant_id', 'trial_index', 'lang', 'phase', 't_rel_ms', 'kind', 'key', 'from', 'to', 'source'];
  const rows: Cell[][] = [];
  for (const r of records) for (const t of r.trials) for (const e of t.settings.events) {
    const rel = e.t - t.readingStartedAt;
    rows.push([...idCols(r), t.index, t.lang, rel < 0 ? 'setup' : 'reading', rel, e.kind, e.key, e.from, e.to, e.source]);
  }
  return toCsv(header, rows);
}

export function susCsv(records: StudyRecord[]): string {
  const header = ['session_id', 'participant_id', 'status', 'content_placeholder', 'sus_lang', ...Array.from({ length: 10 }, (_, i) => `q${i + 1}`), 'sus_score', 'submitted_at'];
  const rows: Cell[][] = records.filter((r) => r.sus).map((r) => [
    ...idCols(r), r.status, r.contentPlaceholder, r.sus!.lang, ...r.sus!.answers, r.sus!.score, r.sus!.submittedAt,
  ]);
  return toCsv(header, rows);
}

export const sessionsJson = (records: StudyRecord[]) =>
  JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), sessions: records }, null, 2);

export function downloadText(filename: string, mime: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const stamp = () => new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '').replace(/^(\d{8})/, '$1-');
