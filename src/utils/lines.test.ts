import { describe, it, expect } from 'vitest';
import { groupLines, chunkOf, clamp } from './lines';

describe('groupLines', () => {
  it('groups words by line and tolerates small vertical jitter', () => {
    const words = [0, 0, 1, 40, 41, 80].map((top) => ({ top, height: 30 }));
    const { lineOf, boxes } = groupLines(words, 40);
    expect(lineOf).toEqual([0, 0, 0, 1, 1, 2]);
    expect(boxes).toHaveLength(3);
  });
  it('centres the line box on the word box', () => {
    const { boxes } = groupLines([{ top: 100, height: 30 }], 40);
    expect(boxes[0]).toEqual({ top: 95, height: 40 });
  });
  it('handles empty input', () => {
    expect(groupLines([], 40)).toEqual({ lineOf: [], boxes: [] });
  });
});

describe('chunk helpers', () => {
  it('maps lines to chunks', () => {
    expect([0, 1, 2, 3, 5, 6].map((l) => chunkOf(l, 3))).toEqual([0, 0, 0, 1, 1, 2]);
  });
  it('clamps', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
  });
});
