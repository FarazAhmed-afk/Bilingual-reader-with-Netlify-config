import type { Lang } from './languages';

export interface ReaderSettings {
  fontId: string;
  sizePx: number;
  lineHeight: number;        // unitless multiplier
  letterSpacingEm: number;   // English only (breaks Nastaliq joins, so Urdu ignores it)
  wordSpacingEm: number;     // Urdu only (English keeps the browser default)
  bgId: string;
  lineFocus: boolean;
  chunking: boolean;
  simplified: boolean;       // RQ3 (optional): prepared simplified passage instead of the original
}
export type SettingKey = keyof ReaderSettings;

export interface Range { min: number; max: number; step: number }

export const RANGES: Record<Lang, { size: Range; line: Range; letter: Range | null; word: Range | null }> = {
  en: { size: { min: 16, max: 40, step: 1 }, line: { min: 1.2, max: 2.4, step: 0.1 }, letter: { min: 0, max: 0.12, step: 0.01 }, word: null },
  // Nastaliq has tall ascenders/descenders, so its line-height floor is higher.
  ur: { size: { min: 18, max: 44, step: 1 }, line: { min: 2.0, max: 3.0, step: 0.1 }, letter: null, word: { min: 0, max: 0.5, step: 0.05 } },
};

export interface Background { id: string; label: string; bg: string; ink: string }
export const BACKGROUNDS: Background[] = [
  { id: 'white', label: 'White', bg: '#FFFFFF', ink: '#16212B' },
  { id: 'warm-yellow', label: 'Warm yellow', bg: '#FBF0C9', ink: '#2B2414' },
  { id: 'peach', label: 'Peach', bg: '#FCE6D4', ink: '#2E2018' },
  { id: 'grey', label: 'Light grey', bg: '#E9EBED', ink: '#16212B' },
  { id: 'pale-blue', label: 'Pale blue', bg: '#DDEBF5', ink: '#122230' },
];

/** Number of wrapped lines shown together when chunking is on (design assumption, see plan item 3). */
export const CHUNK_LINES = 3;

/**
 * BASELINE = the fixed "default layout" comparison condition, and also the starting point of the
 * adjustable condition. Values are design assumptions to confirm in a pilot (single-ish spacing,
 * white background, no focus aids), loosely modelled on the control layout in Madjidi & Crick.
 */
export const BASELINE: Record<Lang, ReaderSettings> = {
  en: { fontId: 'atkinson', sizePx: 18, lineHeight: 1.25, letterSpacingEm: 0, wordSpacingEm: 0, bgId: 'white', lineFocus: false, chunking: false, simplified: false },
  ur: { fontId: 'nastaliq', sizePx: 22, lineHeight: 2.0, letterSpacingEm: 0, wordSpacingEm: 0, bgId: 'white', lineFocus: false, chunking: false, simplified: false },
};
