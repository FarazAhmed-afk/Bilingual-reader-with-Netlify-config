import { useRef } from 'react';
import { DefaultNotice } from './DefaultNotice';
import { EffortScale } from './EffortScale';
import { Quiz } from './Quiz';
import { Reader } from './Reader';
import { SettingsPanel } from './SettingsPanel';
import type { Action as AdjAction, AdjState } from '../app/adjustableReducer';
import { CONDITION_LABEL } from '../config/conditions';
import { BASELINE, type ReaderSettings } from '../config/settings';
import { suggestFor } from '../config/suggested';
import { getPassage, samplePassage } from '../content/passages';
import { questionsFor } from '../content/questions';
import type { Trial } from '../study/plan';
import type { EffortRatings, QuizAnswer } from '../study/schema';
import type { Phase } from '../study/studyReducer';

interface Props {
  trial: Trial;
  phase: Phase;
  adj: AdjState;
  dispatchAdj: (a: AdjAction) => void;
  onStart: (t: number) => void;
  onDone: (t: number, readingMs: number) => void;
  onQuiz: (a: QuizAnswer[]) => void;
  onEffort: (r: EffortRatings) => void;
}

export function TrialView({ trial, phase, adj, dispatchAdj, onStart, onDone, onQuiz, onEffort }: Props) {
  const t0 = useRef(0);
  const { lang, condition } = trial;
  const adjustable = condition === 'adjustable';
  const settings = adjustable ? adj.settings : BASELINE[lang];
  const patch = (p: Partial<ReaderSettings>) => dispatchAdj({ type: 'change', lang, patch: p, t: Date.now() });

  if (phase === 'quiz') return <Quiz lang={lang} questions={questionsFor(trial.passageId)} onSubmit={onQuiz} />;
  if (phase === 'effort') return <EffortScale lang={lang} onSubmit={onEffort} />;

  const panel = (canSimplify: boolean) => (
    <SettingsPanel
      lang={lang} settings={adj.settings} sources={adj.sources} suggestion={adj.suggestion} suggested={suggestFor(lang)}
      canSimplify={canSimplify} onChange={patch}
      onAccept={() => dispatchAdj({ type: 'accept', lang, t: Date.now() })}
      onDecline={() => dispatchAdj({ type: 'decline', lang, t: Date.now() })}
      onReset={() => dispatchAdj({ type: 'reset', lang, t: Date.now() })}
    />
  );
  const start = () => { t0.current = performance.now(); onStart(Date.now()); };

  if (phase === 'ready') {
    return (
      <section className="card" aria-labelledby="ready-h">
        <p className={`tag tag--${condition}`}>{CONDITION_LABEL[condition]}</p>
        <h2 id="ready-h">Ready to read</h2>
        <p>The layout is fixed for this reading. When you press Start reading, the passage appears and timing begins. Read it at your normal pace. You will not be able to look back at it while answering the questions.</p>
        <button type="button" className="btn btn--solid" onClick={start}>Start reading</button>
      </section>
    );
  }

  if (phase === 'setup') {
    return (
      <div>
        <section className="card" aria-labelledby="setup-h">
          <p className={`tag tag--${condition}`}>{CONDITION_LABEL[condition]}</p>
          <h2 id="setup-h">Set up your reading layout</h2>
          <p>Try the settings on this sample text. This step is not timed and is not part of the questions. You can keep adjusting while you read. When you are ready, press Start reading.</p>
          <button type="button" className="btn btn--solid" onClick={start}>Start reading</button>
        </section>
        <div className="workspace">
          <Reader passage={samplePassage(lang)} lang={lang} settings={settings} />
          {panel(true)}
        </div>
      </div>
    );
  }

  // reading
  const passage = getPassage(trial.passageId)!;
  return (
    <div className="workspace">
      <div>
        <p className={`tag tag--${condition}`}>{CONDITION_LABEL[condition]}</p>
        <Reader passage={passage} lang={lang} settings={settings} />
        <p><button type="button" className="btn btn--solid" onClick={() => onDone(Date.now(), Math.round(performance.now() - t0.current))}>Done reading</button></p>
      </div>
      {adjustable ? panel(!!passage.simplified) : <DefaultNotice />}
    </div>
  );
}
