import type { Lang } from './languages';
import { BASELINE, RANGES, type Range, type ReaderSettings } from './settings';
import { clamp } from '../utils/lines';

/**
 * System-suggested starting configuration. It is defined RELATIVE to the baseline and is identical
 * for both languages (plan item 7), so H2 (Urdu prefers larger size/spacing) is not decided by us.
 * The 1.5 line-spacing and warm tint follow the preferences reported by Madjidi & Crick (n=14,
 * English only); the 1.1 size scale is our own design assumption, to be checked in the pilot.
 * No diagnosis or user trait is used.
 */
export const SUGGESTION = { sizeScale: 1.1, lineScale: 1.2, bgId: 'warm-yellow' } as const;

const snap = (n: number, r: Range) => clamp(Math.round(n / r.step) * r.step, r.min, r.max);

export function suggestFor(lang: Lang): Partial<ReaderSettings> {
  const b = BASELINE[lang];
  const r = RANGES[lang];
  return {
    sizePx: Math.round(snap(b.sizePx * SUGGESTION.sizeScale, r.size)),
    lineHeight: +snap(b.lineHeight * SUGGESTION.lineScale, r.line).toFixed(1),
    bgId: SUGGESTION.bgId,
  };
}
