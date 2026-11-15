import { useReducer, useState } from 'react';
import { DefaultNotice } from '../components/DefaultNotice';
import { Reader } from '../components/Reader';
import { SettingsPanel } from '../components/SettingsPanel';
import { CONDITION_LABEL, type Condition } from '../config/conditions';
import { LANGS, type Lang } from '../config/languages';
import { BASELINE, type ReaderSettings } from '../config/settings';
import { suggestFor } from '../config/suggested';
import { passagesFor } from '../content/passages';
import { initialState, reducer } from './adjustableReducer';

export function App() {
  const [lang, setLang] = useState<Lang>('en');
  // Temporary facilitator control. In Milestone 4 the condition order comes from counterbalancing.
  const [cond, setCond] = useState<Condition>('adjustable');
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const passage = passagesFor(lang)[0];
  const adj = state[lang];
  const shown = cond === 'default' ? BASELINE[lang] : adj.settings;

  const patch = (p: Partial<ReaderSettings>) => dispatch({ type: 'change', lang, patch: p, t: Date.now() });

  return (
    <main className="shell">
      <div className="bar">
        <h1>Adaptive Reading Interface</h1>
        <div className="bar__controls">
          <div className="seg" role="group" aria-label="Condition (facilitator, temporary)">
            {(Object.keys(CONDITION_LABEL) as Condition[]).map((c) => (
              <button key={c} aria-pressed={cond === c} onClick={() => setCond(c)}>{CONDITION_LABEL[c]}</button>
            ))}
          </div>
          <div className="seg" role="group" aria-label="Reading language">
            {(Object.keys(LANGS) as Lang[]).map((l) => (
              <button key={l} className={l === 'ur' ? 'ur-label' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {LANGS[l].label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {passage.placeholder && (
        <p className="flag" role="note">Placeholder text for rendering tests only. Replace with approved study passages before any session.</p>
      )}
      <div className="workspace">
        <div>
          <p className={`tag tag--${cond}`}>{CONDITION_LABEL[cond]}</p>
          <Reader passage={passage} lang={lang} settings={shown} />
        </div>
        {cond === 'default' ? (
          <DefaultNotice />
        ) : (
          <SettingsPanel
            lang={lang}
            settings={adj.settings}
            sources={adj.sources}
            suggestion={adj.suggestion}
            suggested={suggestFor(lang)}
            canSimplify={!!passage.simplified}
            onChange={patch}
            onAccept={() => dispatch({ type: 'accept', lang, t: Date.now() })}
            onDecline={() => dispatch({ type: 'decline', lang, t: Date.now() })}
            onReset={() => dispatch({ type: 'reset', lang, t: Date.now() })}
          />
        )}
      </div>
      {cond === 'adjustable' && (
        <details className="debug">
          <summary>Settings log (temporary debug, removed in Milestone 5)</summary>
          <pre>{JSON.stringify({ suggestion: adj.suggestion, sources: adj.sources, events: adj.events }, null, 2)}</pre>
        </details>
      )}
    </main>
  );
}
