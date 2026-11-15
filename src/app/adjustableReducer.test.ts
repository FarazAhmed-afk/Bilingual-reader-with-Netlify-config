import { describe, it, expect } from 'vitest';
import { initialState, reducer } from './adjustableReducer';
import { suggestFor } from '../config/suggested';
import { BASELINE, RANGES } from '../config/settings';
import type { Lang } from '../config/languages';

describe('suggestFor', () => {
  it('is identical in relative terms and inside the allowed ranges', () => {
    expect(suggestFor('en')).toEqual({ sizePx: 20, lineHeight: 1.5, bgId: 'warm-yellow' });
    expect(suggestFor('ur')).toEqual({ sizePx: 24, lineHeight: 2.4, bgId: 'warm-yellow' });
    for (const l of ['en', 'ur'] as Lang[]) {
      const s = suggestFor(l), r = RANGES[l];
      expect(s.sizePx!).toBeGreaterThanOrEqual(r.size.min);
      expect(s.sizePx!).toBeLessThanOrEqual(r.size.max);
      expect(s.lineHeight!).toBeGreaterThanOrEqual(r.line.min);
      expect(s.lineHeight!).toBeLessThanOrEqual(r.line.max);
    }
  });
});

describe('adjustable reducer', () => {
  it('starts at baseline with a pending suggestion and no events', () => {
    const s = initialState().en;
    expect(s.settings).toEqual(BASELINE.en);
    expect(s.suggestion).toBe('pending');
    expect(s.events).toHaveLength(0);
    expect(Object.values(s.sources).every((x) => x === 'baseline')).toBe(true);
  });

  it('marks manual changes as reader-set and logs them', () => {
    const s = reducer(initialState(), { type: 'change', lang: 'en', patch: { sizePx: 24 }, t: 1 }).en;
    expect(s.settings.sizePx).toBe(24);
    expect(s.sources.sizePx).toBe('reader');
    expect(s.events).toEqual([{ t: 1, kind: 'change', key: 'sizePx', from: 18, to: 24, source: 'reader' }]);
  });

  it('ignores no-op changes', () => {
    const s = reducer(initialState(), { type: 'change', lang: 'en', patch: { sizePx: 18 }, t: 1 }).en;
    expect(s.events).toHaveLength(0);
  });

  it('accepting applies suggested values and marks only those keys as suggested', () => {
    const s = reducer(initialState(), { type: 'accept', lang: 'ur', t: 2 }).ur;
    expect(s.suggestion).toBe('accepted');
    expect(s.settings).toMatchObject({ sizePx: 24, lineHeight: 2.4, bgId: 'warm-yellow', fontId: 'nastaliq' });
    expect(s.sources).toMatchObject({ sizePx: 'suggested', lineHeight: 'suggested', bgId: 'suggested', fontId: 'baseline' });
  });

  it('overriding a suggested value flips its source to reader', () => {
    let st = reducer(initialState(), { type: 'accept', lang: 'en', t: 1 });
    st = reducer(st, { type: 'change', lang: 'en', patch: { sizePx: 26 }, t: 2 });
    expect(st.en.sources.sizePx).toBe('reader');
    expect(st.en.sources.lineHeight).toBe('suggested');
    expect(st.en.suggestion).toBe('accepted');
  });

  it('declining keeps baseline values and records the decision', () => {
    const s = reducer(initialState(), { type: 'decline', lang: 'en', t: 3 }).en;
    expect(s.suggestion).toBe('declined');
    expect(s.settings).toEqual(BASELINE.en);
    expect(s.events[0].kind).toBe('declined');
  });

  it('reset restores baseline but keeps the event log', () => {
    let st = reducer(initialState(), { type: 'change', lang: 'en', patch: { sizePx: 30 }, t: 1 });
    st = reducer(st, { type: 'reset', lang: 'en', t: 2 });
    expect(st.en.settings).toEqual(BASELINE.en);
    expect(st.en.suggestion).toBe('pending');
    expect(st.en.events.map((e) => e.kind)).toEqual(['change', 'reset']);
  });

  it('keeps languages independent', () => {
    const st = reducer(initialState(), { type: 'change', lang: 'en', patch: { sizePx: 30 }, t: 1 });
    expect(st.ur.settings).toEqual(BASELINE.ur);
  });
});
