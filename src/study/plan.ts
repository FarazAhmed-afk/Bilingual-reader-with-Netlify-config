import type { Condition } from '../config/conditions';
import type { Lang } from '../config/languages';

export interface Trial { index: number; lang: Lang; condition: Condition; passageId: string }

export const participantId = (n: number) => `P${String(n).padStart(3, '0')}`;
export const validParticipantNumber = (n: number) => Number.isInteger(n) && n >= 1 && n <= 999;

/**
 * Counterbalancing from the participant number (set by the facilitator). Three binary factors give
 * 8 cells, repeating every 8 participants:
 *   bit0 = which language block comes first
 *   bit1 = which condition comes first (same order in both languages)
 *   bit2 = whether passages A/B are swapped across the two conditions
 * Reading is blocked by language: [lang1: cond1, cond2] then [lang2: cond1, cond2].
 */
export function buildPlan(participantNumber: number): Trial[] {
  const k = participantNumber - 1;
  const langs: Lang[] = k % 2 === 0 ? ['en', 'ur'] : ['ur', 'en'];
  const conds: Condition[] = Math.floor(k / 2) % 2 === 0 ? ['default', 'adjustable'] : ['adjustable', 'default'];
  const swap = Math.floor(k / 4) % 2 === 1;
  const trials: Trial[] = [];
  for (const lang of langs) {
    conds.forEach((condition, ci) => {
      const letter = (ci === 0) !== swap ? 'a' : 'b';
      trials.push({ index: trials.length, lang, condition, passageId: `${lang}-${letter}` });
    });
  }
  return trials;
}
