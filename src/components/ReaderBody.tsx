import { Fragment, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { CHUNK_LINES } from '../config/settings';
import { chunkOf, clamp } from '../utils/lines';
import { useLineLayout } from '../utils/useLineLayout';

interface Props { text: string; lineFocus: boolean; chunking: boolean; layoutKey: string }

/**
 * Passage text with optional line focus (one highlighted line) and chunking (CHUNK_LINES lines
 * shown, rest dimmed). Move with ArrowUp/ArrowDown or the pointer. Words are wrapped in spans only
 * to measure lines; each Urdu word stays one shaped unit, so Nastaliq joins are not affected.
 */
export function ReaderBody({ text, lineFocus, chunking, layoutKey }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const words = text.split(/\s+/).filter(Boolean);
  const { lineOf, boxes } = useLineLayout(ref, [text, layoutKey]);
  const [active, setActive] = useState(0);

  const lineCount = boxes.length;
  const activeLine = clamp(active, 0, Math.max(lineCount - 1, 0));
  const activeChunk = chunkOf(activeLine, CHUNK_LINES);
  const guided = lineFocus || chunking;

  const move = (delta: number) => {
    if (chunking && !lineFocus) {
      const next = clamp(activeChunk + delta, 0, chunkOf(lineCount - 1, CHUNK_LINES));
      setActive(next * CHUNK_LINES);
    } else {
      setActive(clamp(activeLine + delta, 0, lineCount - 1));
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (!guided) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  };
  const pick = (e: PointerEvent) => {
    if (!guided || !ref.current) return;
    const y = e.clientY - ref.current.getBoundingClientRect().top;
    const i = boxes.findIndex((b) => y >= b.top && y < b.top + b.height);
    if (i >= 0) setActive(i);
  };

  const isDim = (i: number) => {
    const line = lineOf[i] ?? 0;
    if (chunking) return chunkOf(line, CHUNK_LINES) !== activeChunk;
    if (lineFocus) return line !== activeLine;
    return false;
  };

  return (
    <div
      ref={ref}
      className="reader__text"
      tabIndex={guided ? 0 : undefined}
      role={guided ? 'group' : undefined}
      aria-label={guided ? 'Passage text. Use the up and down arrow keys to move the focus.' : undefined}
      onKeyDown={onKeyDown}
      onPointerMove={(e) => { if (e.pointerType === 'mouse') pick(e); }}
      onPointerDown={pick}
    >
      {lineFocus && boxes[activeLine] && (
        <div className="focus-band" aria-hidden="true" style={{ top: boxes[activeLine].top, height: boxes[activeLine].height }} />
      )}
      <p className="reader__body">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span data-w className={isDim(i) ? 'w is-dim' : 'w'}>{w}</span>{' '}
          </Fragment>
        ))}
      </p>
    </div>
  );
}
