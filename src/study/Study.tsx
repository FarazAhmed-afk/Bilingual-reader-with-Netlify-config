import { useEffect, useReducer, useRef, useState } from 'react';
import { initialState as initialAdj, reducer as adjReducer } from '../app/adjustableReducer';
import { Consent } from '../components/Consent';
import { FacilitatorSetup } from '../components/FacilitatorSetup';
import { StopDialog } from '../components/StopDialog';
import { SusForm } from '../components/SusForm';
import { TrialView } from '../components/TrialView';
import { BASELINE } from '../config/settings';
import { checkContent } from '../content/validate';
import { buildRecord } from '../data/record';
import { clearCurrent, saveCurrent, storageWorks, upsertSession, type SavedSession } from '../data/storage';
import type { SettingsSnapshot } from './schema';
import { initialStudy, studyReducer } from './studyReducer';

interface Props { initial?: SavedSession; onNewSession: () => void; onOpenData: () => void }

export function Study({ initial, onNewSession, onOpenData }: Props) {
  const [s, dispatch] = useReducer(studyReducer, undefined, () => initial?.study ?? initialStudy());
  const [adj, dispatchAdj] = useReducer(adjReducer, undefined, () => initial?.adj ?? initialAdj());
  const [stopOpen, setStopOpen] = useState(false);
  const [saveOk, setSaveOk] = useState(() => storageWorks());
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { mainRef.current?.focus({ preventScroll: true }); }, [s.stage, s.trialIdx, s.phase]);

  // After a reload, restart any reading that was in progress (its timing is no longer valid).
  useEffect(() => { if (initial) dispatch({ type: 'resume', t: Date.now() }); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const active = s.stage === 'consent' || s.stage === 'trial' || s.stage === 'sus';

  // Autosave on every change while a session is running.
  useEffect(() => { if (active) setSaveOk(saveCurrent({ study: s, adj })); }, [s, adj, active]);

  // Archive once the session ends; stop-and-delete keeps nothing.
  useEffect(() => {
    if (s.stage !== 'done' && s.stage !== 'stopped') return;
    const rec = buildRecord(s, checkContent().placeholder);
    if (rec && !upsertSession(rec)) setSaveOk(false);
    clearCurrent();
  }, [s.stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const trial = s.plan[s.trialIdx];
  const progress = s.stage === 'trial' ? `Reading ${s.trialIdx + 1} of ${s.plan.length}` : s.stage === 'sus' ? 'Final questions' : '';

  const snapshot = (): SettingsSnapshot =>
    trial.condition === 'adjustable'
      ? { final: adj[trial.lang].settings, sources: adj[trial.lang].sources, suggestion: adj[trial.lang].suggestion, events: adj[trial.lang].events }
      : { final: BASELINE[trial.lang], sources: null, suggestion: null, events: [] };

  return (
    <main className="shell" ref={mainRef} tabIndex={-1}>
      <div className="bar">
        <h1>Adaptive Reading Interface</h1>
        <div className="bar__controls">
          {progress && <span className="progress">{progress}</span>}
          {s.participant && <span className="progress">{s.participant.id}</span>}
          {active && <button type="button" className="btn btn--small" onClick={() => setStopOpen(true)}>Stop</button>}
        </div>
      </div>

      {!saveOk && <p className="err" role="alert">Autosave is not working in this browser. Data may be lost on reload. Export before closing, or use a normal (non-private) window.</p>}

      {s.stage === 'setup' && <FacilitatorSetup onBegin={(n) => dispatch({ type: 'begin', number: n, t: Date.now() })} onOpenData={onOpenData} />}
      {s.stage === 'consent' && (
        <Consent onAgree={() => dispatch({ type: 'consent', t: Date.now() })} onDecline={() => dispatch({ type: 'stop', t: Date.now(), keep: false })} />
      )}
      {s.stage === 'trial' && trial && (
        <TrialView
          key={trial.index} trial={trial} phase={s.phase} adj={adj[trial.lang]}
          dispatchAdj={dispatchAdj}
          onStart={(t) => dispatch({ type: 'startReading', t })}
          onDone={(t, ms) => dispatch({ type: 'doneReading', t, readingMs: ms, settings: snapshot() })}
          onQuiz={(answers) => dispatch({ type: 'submitQuiz', t: Date.now(), answers })}
          onEffort={(effort) => dispatch({ type: 'submitEffort', t: Date.now(), effort })}
        />
      )}
      {s.stage === 'sus' && <SusForm onSubmit={(lang, answers) => dispatch({ type: 'submitSus', t: Date.now(), lang, answers })} />}

      {(s.stage === 'done' || s.stage === 'stopped') && (
        <section className="card" aria-labelledby="end-h">
          <h2 id="end-h">{s.stage === 'done' ? 'Thank you' : 'Session ended'}</h2>
          <p>{s.stage === 'done' ? 'You have finished. Please let the facilitator know.' : 'The session has been stopped. Please let the facilitator know.'}</p>
          <p><button type="button" className="btn btn--small" onClick={onNewSession}>Facilitator: next participant</button></p>
        </section>
      )}

      {stopOpen && (
        <StopDialog
          onContinue={() => setStopOpen(false)}
          onKeep={() => { setStopOpen(false); dispatch({ type: 'stop', t: Date.now(), keep: true }); }}
          onDiscard={() => { setStopOpen(false); dispatch({ type: 'stop', t: Date.now(), keep: false }); }}
        />
      )}
    </main>
  );
}
