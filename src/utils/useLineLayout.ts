import { useLayoutEffect, useState, type RefObject } from 'react';
import { groupLines, type LineBox } from './lines';

export interface LineLayout { lineOf: number[]; boxes: LineBox[] }
const EMPTY: LineLayout = { lineOf: [], boxes: [] };

/** Measures which wrapped line each `[data-w]` word sits on. Re-measures on resize, font load and when `deps` change. */
export function useLineLayout(ref: RefObject<HTMLElement | null>, deps: unknown[]): LineLayout {
  const [layout, setLayout] = useState<LineLayout>(EMPTY);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const words = Array.from(el.querySelectorAll<HTMLElement>('[data-w]'));
      if (words.length === 0) return;
      const boxes = words.map((w) => ({ top: w.offsetTop, height: w.offsetHeight }));
      const px = parseFloat(getComputedStyle(words[0]).lineHeight);
      const pitch = Number.isFinite(px) ? px : boxes[0].height;
      const next = groupLines(boxes, pitch);
      setLayout((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    let cancelled = false;
    document.fonts?.ready.then(() => { if (!cancelled) measure(); });
    return () => { cancelled = true; ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return layout;
}
