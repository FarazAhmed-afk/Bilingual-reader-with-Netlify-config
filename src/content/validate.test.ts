import { describe, it, expect } from 'vitest';
import { checkContent, wordCount } from './validate';
import { PASSAGES } from './passages';

describe('checkContent', () => {
  it('shipped placeholder content is structurally valid and flagged as placeholder', () => {
    const c = checkContent();
    expect(c.structural).toEqual([]);
    expect(c.placeholder).toBe(true);
  });
  it('flags real passages outside 150-200 words and missing questions', () => {
    const real = { ...PASSAGES[0], placeholder: false };
    const c = checkContent([real], []);
    expect(c.structural.some((m) => m.includes('expected 5 questions'))).toBe(true);
    expect(c.structural.some((m) => m.includes('target 150 to 200'))).toBe(true);
  });
  it('counts words', () => { expect(wordCount(' a  b\nc ')).toBe(3); });
});
