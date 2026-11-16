import { useState } from 'react';
import { LANGS, type Lang } from '../config/languages';
import { BASELINE } from '../config/settings';
import type { Question } from '../content/questions';
import type { QuizAnswer } from '../study/schema';
import { readerStyle } from './Reader';

interface Props { lang: Lang; questions: Question[]; onSubmit: (a: QuizAnswer[]) => void }

/** Questions always use the fixed baseline layout, so the adjustable settings cannot help answer them. */
export function Quiz({ lang, questions, onSubmit }: Props) {
  const cfg = LANGS[lang];
  const [choice, setChoice] = useState<(number | null)[]>(() => questions.map(() => null));
  const complete = choice.every((c) => c !== null);
  const heading = lang === 'en' ? 'Questions' : 'سوالات';
  const submit = lang === 'en' ? 'Submit answers' : 'جوابات جمع کریں';

  return (
    <section className="reader quiz" lang={cfg.htmlLang} dir={cfg.dir} style={readerStyle(lang, BASELINE[lang])} aria-labelledby="quiz-h">
      <h2 id="quiz-h" className="reader__title">{heading}</h2>
      {questions.map((q, qi) => (
        <fieldset key={q.id} className="q">
          <legend>{qi + 1}. {q.prompt}</legend>
          {q.options.map((o, oi) => (
            <label key={oi} className="opt">
              <input type="radio" name={q.id} checked={choice[qi] === oi} onChange={() => setChoice((c) => c.map((v, i) => (i === qi ? oi : v)))} />
              <span>{o}</span>
            </label>
          ))}
        </fieldset>
      ))}
      <button type="button" className="btn btn--solid btn--wide" disabled={!complete}
        onClick={() => onSubmit(questions.map((q, i) => ({ questionId: q.id, choice: choice[i]!, correct: choice[i] === q.correctIndex })))}>
        {submit}
      </button>
    </section>
  );
}
