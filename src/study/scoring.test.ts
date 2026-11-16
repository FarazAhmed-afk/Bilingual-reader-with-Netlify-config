import { describe, it, expect } from 'vitest';
import { susScore } from './scoring';

describe('susScore', () => {
  it('gives 100 for the best possible pattern and 0 for the worst', () => {
    expect(susScore([5, 1, 5, 1, 5, 1, 5, 1, 5, 1])).toBe(100);
    expect(susScore([1, 5, 1, 5, 1, 5, 1, 5, 1, 5])).toBe(0);
  });
  it('gives 50 for all neutral', () => { expect(susScore(Array(10).fill(3))).toBe(50); });
  it('rejects bad input', () => {
    expect(() => susScore([1, 2, 3])).toThrow();
    expect(() => susScore([6, 1, 1, 1, 1, 1, 1, 1, 1, 1])).toThrow();
  });
});
