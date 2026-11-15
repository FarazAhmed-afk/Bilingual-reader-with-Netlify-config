import { useState, type CSSProperties } from 'react';
import { Reader } from '../components/Reader';
import { LANGS, type Lang } from '../config/languages';
import { passagesFor } from '../content/passages';

export function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [simplified, setSimplified] = useState(false); // temporary; moves into the adjustable condition in Milestone 3
  const passage = passagesFor(lang)[0];
  const font = LANGS[lang].fonts[0].stack;

  return (
    <main className="shell" style={{ '--r-font': font } as CSSProperties}>
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
      <Reader passage={passage} lang={lang} simplified={simplified} />
      <p><label><input type="checkbox" checked={simplified} onChange={(e) => setSimplified(e.target.checked)} /> Show simplified version (temporary test control)</label></p>
    </main>
  );
}
