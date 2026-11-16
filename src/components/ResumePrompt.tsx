import { CONDITION_LABEL } from '../config/conditions';
import type { SavedSession } from '../data/storage';

interface Props { saved: SavedSession; onResume: () => void; onArchive: () => void; onDelete: () => void }

export function ResumePrompt({ saved, onResume, onArchive, onDelete }: Props) {
  const { study } = saved;
  const where = study.stage === 'trial' ? `reading ${study.trialIdx + 1} of ${study.plan.length} (${CONDITION_LABEL[study.plan[study.trialIdx].condition]})` : study.stage;
  return (
    <main className="shell">
      <section className="card" aria-labelledby="res-h">
        <h2 id="res-h">Unfinished session found</h2>
        <p>Participant <strong>{study.participant?.id}</strong>, at: {where}. This page was probably reloaded or closed.</p>
        <p>If a passage was being read, that reading restarts and is flagged as interrupted.</p>
        <div className="row">
          <button type="button" className="btn btn--solid btn--auto" onClick={onResume}>Resume session</button>
          <button type="button" className="btn btn--auto" onClick={onArchive}>Save as incomplete and close</button>
          <button type="button" className="btn btn--auto" onClick={onDelete}>Delete it</button>
        </div>
      </section>
    </main>
  );
}
