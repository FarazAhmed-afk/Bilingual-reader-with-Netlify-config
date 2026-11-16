import { useState } from 'react';
import { LANGS, type Lang } from '../config/languages';
import { BASELINE } from '../config/settings';
import { EFFORT_ANCHORS, EFFORT_ITEMS, type EffortId } from '../content/questionnaires';
import type { EffortRatings } from '../study/schema';
import { readerStyle } from './Reader';

export function EffortScale({ lang, onSubmit }: { lang: Lang; onSubmit: (r: EffortRatings) => void }) {
  const cfg = LANGS[lang];
  const items = EFFORT_ITEMS[lang];
  const anchors = EFFORT_ANCHORS[lang];
  const [v, setV] = useState<Partial<Record<EffortId, number>>>({});
  const complete = items.every((i) => v[i.id] !== undefined);
  const submit = lang === 'en' ? 'Continue' : 'آگے بڑھیں';

  return (
    <section className="reader quiz" lang={cfg.htmlLang} dir={cfg.dir} style={readerStyle(lang, BASELINE[lang])} aria-labelledby="eff-h">
      <h2 id="eff-h" className="reader__title">{anchors.heading}</h2>
      {items.map((it) => (
        <fieldset key={it.id} className="q">
          <legend>{it.text}</legend>
          <div className="likert">
            <span className="likert__end">{anchors.low}</span>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <label key={n} className="likert__pt">
                <input type="radio" name={it.id} checked={v[it.id] === n} onChange={() => setV((x) => ({ ...x, [it.id]: n }))} />
                <span>{n}</span>
              </label>
            ))}
            <span className="likert__end">{anchors.high}</span>
          </div>
        </fieldset>
      ))}
      <button type="button" className="btn btn--solid btn--wide" disabled={!complete}
        onClick={() => onSubmit({ mental: v.mental!, effort: v.effort!, frustration: v.frustration! })}>
        {submit}
      </button>
    </section>
  );
}
