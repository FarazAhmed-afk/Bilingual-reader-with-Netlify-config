import { describe, it, expect } from 'vitest';
import { buildPlan, participantId, validParticipantNumber } from './plan';

describe('buildPlan', () => {
  it('P001: English first, default first, A then B', () => {
    expect(buildPlan(1)).toEqual([
      { index: 0, lang: 'en', condition: 'default', passageId: 'en-a' },
      { index: 1, lang: 'en', condition: 'adjustable', passageId: 'en-b' },
      { index: 2, lang: 'ur', condition: 'default', passageId: 'ur-a' },
      { index: 3, lang: 'ur', condition: 'adjustable', passageId: 'ur-b' },
    ]);
  });
  it('always has 4 trials, each language once per condition, never reusing a passage', () => {
    for (let n = 1; n <= 16; n++) {
      const p = buildPlan(n);
      expect(p).toHaveLength(4);
      for (const lang of ['en', 'ur']) {
        const t = p.filter((x) => x.lang === lang);
        expect(t.map((x) => x.condition).sort()).toEqual(['adjustable', 'default']);
        expect(new Set(t.map((x) => x.passageId)).size).toBe(2);
      }
    }
  });
  it('balances everything over 8 participants', () => {
    const all = Array.from({ length: 8 }, (_, i) => buildPlan(i + 1));
    expect(all.filter((p) => p[0].lang === 'en')).toHaveLength(4);
    expect(all.filter((p) => p[0].condition === 'default')).toHaveLength(4);
    for (const lang of ['en', 'ur']) for (const letter of ['a', 'b']) for (const c of ['default', 'adjustable']) {
      const count = all.flat().filter((t) => t.lang === lang && t.passageId === `${lang}-${letter}` && t.condition === c).length;
      expect(count).toBe(4);
    }
  });
  it('repeats every 8 participants', () => { expect(buildPlan(9)).toEqual(buildPlan(1)); });
  it('formats and validates ids', () => {
    expect(participantId(7)).toBe('P007');
    expect(validParticipantNumber(0)).toBe(false);
    expect(validParticipantNumber(1.5)).toBe(false);
    expect(validParticipantNumber(999)).toBe(true);
  });
});
