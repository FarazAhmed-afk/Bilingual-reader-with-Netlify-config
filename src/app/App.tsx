import { useState } from 'react';
import { FacilitatorView } from '../components/FacilitatorView';
import { ResumePrompt } from '../components/ResumePrompt';
import { checkContent } from '../content/validate';
import { buildRecord } from '../data/record';
import { clearCurrent, loadCurrent, upsertSession, type SavedSession } from '../data/storage';
import { Study } from '../study/Study';

const resumable = (s: SavedSession | null) => !!s && (s.study.stage === 'consent' || s.study.stage === 'trial' || s.study.stage === 'sus');

export function App() {
  const [saved, setSaved] = useState<SavedSession | null>(() => { const s = loadCurrent(); return resumable(s) ? s : null; });
  const [initial, setInitial] = useState<SavedSession | undefined>();
  const [view, setView] = useState<'study' | 'data'>(() => (window.location.hash === '#facilitator' ? 'data' : 'study'));
  const [session, setSession] = useState(0); // remounting <Study> resets every reducer for a new participant

  if (view === 'data') return <FacilitatorView onBack={() => setView('study')} />;
  if (saved) {
    return (
      <ResumePrompt
        saved={saved}
        onResume={() => { setInitial(saved); setSaved(null); }}
        onArchive={() => { const r = buildRecord(saved.study, checkContent().placeholder); if (r) upsertSession(r); clearCurrent(); setSaved(null); }}
        onDelete={() => { if (window.confirm('Delete this unfinished session and its data?')) { clearCurrent(); setSaved(null); } }}
      />
    );
  }
  return <Study key={session} initial={initial} onOpenData={() => setView('data')} onNewSession={() => { setInitial(undefined); setSession((k) => k + 1); }} />;
}
