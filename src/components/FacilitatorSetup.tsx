import { useState } from 'react';
import { CONDITION_LABEL } from '../config/conditions';
import { LANGS } from '../config/languages';
import { checkContent } from '../content/validate';
import { buildPlan, participantId, validParticipantNumber } from '../study/plan';

export function FacilitatorSetup({ onBegin, onOpenData }: { onBegin: (n: number) => void; onOpenData: () => void }) {
  const [raw, setRaw] = useState('');
  const n = Number(raw);
  const valid = raw !== '' && validParticipantNumber(n);
  const check = checkContent();
  const plan = valid ? buildPlan(n) : [];

  return (
    <section className="card" aria-labelledby="fac-h">
      <h2 id="fac-h">Facilitator setup</h2>
      <p>Complete this before handing the device to the participant.</p>
      {check.placeholder && (
        <p className="flag" role="note">Placeholder passages and questions are in use. Fine for testing, not for real sessions.</p>
      )}
      {check.structural.length > 0 && (
        <div className="err" role="alert"><strong>Content problems (fix before starting):</strong><ul>{check.structural.map((m) => <li key={m}>{m}</li>)}</ul></div>
      )}
      <div className="field">
        <label htmlFor="pnum">Participant number (1 to 999, used for counterbalancing)</label>
        <input id="pnum" inputMode="numeric" className="txt" value={raw} onChange={(e) => setRaw(e.target.value.trim())} />
        {raw !== '' && !valid && <p className="hint" role="alert">Enter a whole number from 1 to 999.</p>}
      </div>
      {valid && (
        <>
          <p>Participant code: <strong>{participantId(n)}</strong>. Do not record names.</p>
          <table className="tbl">
            <caption>Planned order</caption>
            <thead><tr><th>#</th><th>Language</th><th>Condition</th><th>Passage</th></tr></thead>
            <tbody>{plan.map((t) => (
              <tr key={t.index}><td>{t.index + 1}</td><td>{LANGS[t.lang].code === 'en' ? 'English' : 'Urdu'}</td><td>{CONDITION_LABEL[t.condition]}</td><td>{t.passageId}</td></tr>
            ))}</tbody>
          </table>
        </>
      )}
      <button type="button" className="btn btn--solid" disabled={!valid || check.structural.length > 0} onClick={() => onBegin(n)}>Continue to consent</button>
      <p><button type="button" className="btn btn--small" onClick={onOpenData}>Saved data and export</button></p>
    </section>
  );
}
