export interface WordBox { top: number; height: number }
export interface LineBox { top: number; height: number }

/**
 * Groups word boxes into wrapped lines. A word starts a new line when its top differs from the
 * line's first word by more than half a line pitch. Using the span box (not glyph ink) keeps this
 * stable for Nastaliq, whose glyphs slope down the line but whose inline boxes do not.
 */
export function groupLines(words: WordBox[], pitch: number): { lineOf: number[]; boxes: LineBox[] } {
  const lineOf: number[] = [];
  const boxes: LineBox[] = [];
  let anchor = -Infinity;
  for (const w of words) {
    if (boxes.length === 0 || Math.abs(w.top - anchor) > pitch * 0.5) {
      anchor = w.top;
      boxes.push({ top: w.top + w.height / 2 - pitch / 2, height: pitch });
    }
    lineOf.push(boxes.length - 1);
  }
  return { lineOf, boxes };
}

export const chunkOf = (line: number, size: number) => Math.floor(line / size);
export const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);
