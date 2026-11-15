import { useState } from 'react';
import { Reader } from '../components/Reader';
import { SettingsPanel } from '../components/SettingsPanel';
import { LANGS, type Lang } from '../config/languages';
import { DEFAULTS, type ReaderSettings } from '../config/settings';
import { passagesFor } from '../content/passages';

export function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [simplified, setSimplified] = useState(false); // temporary; moves into the adjustable condition in Milestone 3
  // Settings are kept per language so each language can be tuned independently (RQ2).
  const [all, setAll] = useState<Record<Lang, ReaderSettings>>(DEFAULTS);
  const passage = passagesFor(lang)[0];

  const patch = (p: Partial<ReaderSettings>) => setAll((a) => ({ ...a, [lang]: { ...a[lang], ...p } }));
  const reset = () => setAll((a) => ({ ...a, [lang]: DEFAULTS[lang] }));

  return (
    <main className="shell">
      <div className="bar">
        <h1>Adaptive Reading Interface</h1>
        <div className="seg" role="group" aria-label="Reading language">
          {(Object.keys(LANGS) as Lang[]).map((l) => (
            <button key={l} className={l === 'ur' ? 'ur-label' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>
              {LANGS[l].label}
            </button>
          ))}
        </div>
      </div>
      {passage.placeholder && (
        <p className="flag" role="note">Placeholder text for rendering tests only. Replace with approved study passages before any session.</p>
      )}
      <div className="workspace">
        <div>
          <Reader passage={passage} lang={lang} settings={all[lang]} simplified={simplified} />
          <p><label><input type="checkbox" checked={simplified} onChange={(e) => setSimplified(e.target.checked)} /> Show simplified version (temporary test control)</label></p>
        </div>
        <SettingsPanel lang={lang} settings={all[lang]} onChange={patch} onReset={reset} />
      </div>
    </main>
  );
}
