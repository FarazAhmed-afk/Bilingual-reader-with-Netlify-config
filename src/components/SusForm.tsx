import { useState } from 'react';
import { LANGS, type Lang } from '../config/languages';
import { BASELINE } from '../config/settings';
import { SUS_INTRO, SUS_ITEMS, SUS_SCALE } from '../content/questionnaires';
import { readerStyle } from './Reader';

export function SusForm({ onSubmit }: { onSubmit: (lang: Lang, answers: number[]) => void }) {
  const [lang, setLang] = useState<Lang>('en'); // participant may switch; the chosen language is recorded
  const [ans, setAns] = useState<(number | null)[]>(() => Array(10).fill(null));
  const cfg = LANGS[lang];
  const complete = ans.every((a) => a !== null);

  return (
    <div>
      <div className="seg" role="group" aria-label="Questionnaire language">
        {(Object.keys(LANGS) as Lang[]).map((l) => (
          <button key={l} className={l === 'ur' ? 'ur-label' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>{LANGS[l].label}</button>
        ))}
      </div>
      <section className="reader quiz" lang={cfg.htmlLang} dir={cfg.dir} style={{ ...readerStyle(lang, BASELINE[lang]), marginTop: '1rem' }} aria-labelledby="sus-h">
        <h2 id="sus-h" className="reader__title">{lang === 'en' ? 'Final questions' : 'آخری سوالات'}</h2>
        <p>{SUS_INTRO[lang]}</p>
        {SUS_ITEMS[lang].map((text, i) => (
          <fieldset key={i} className="q">
            <legend>{i + 1}. {text}</legend>
            <div className="likert likert--5">
              {SUS_SCALE[lang].map((label, k) => (
                <label key={k} className="likert__pt likert__pt--label">
                  <input type="radio" name={`sus${i}`} checked={ans[i] === k + 1} onChange={() => setAns((a) => a.map((v, j) => (j === i ? k + 1 : v)))} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button type="button" className="btn btn--solid btn--wide" disabled={!complete} onClick={() => onSubmit(lang, ans as number[])}>
          {lang === 'en' ? 'Finish' : 'مکمل کریں'}
        </button>
      </section>
    </div>
  );
}
