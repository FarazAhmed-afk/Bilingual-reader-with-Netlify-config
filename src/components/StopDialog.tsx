import { useEffect, useRef } from 'react';

interface Props { onKeep: () => void; onDiscard: () => void; onContinue: () => void }

export function StopDialog({ onKeep, onDiscard, onContinue }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return (
    <dialog ref={ref} className="dlg" aria-labelledby="stop-h" onCancel={(e) => { e.preventDefault(); onContinue(); }}>
      <h2 id="stop-h">Stop the session?</h2>
      <p>You can stop at any time, for any reason. You do not need to explain.</p>
      <div className="dlg__actions">
        <button type="button" className="btn btn--solid" onClick={onContinue}>Continue the session</button>
        <button type="button" className="btn" onClick={onKeep}>Stop and keep what I have done so far</button>
        <button type="button" className="btn" onClick={onDiscard}>Stop and delete my data</button>
      </div>
    </dialog>
  );
}
