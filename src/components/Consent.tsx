import { useState } from 'react';

interface Props { onAgree: () => void; onDecline: () => void }

// DRAFT consent wording. It must be reviewed and approved by the course instructor / the
// appropriate ethics process before any real session. Bracketed items are for the team to fill in.
export function Consent({ onAgree, onDecline }: Props) {
  const [ok, setOk] = useState(false);
  return (
    <section className="card" aria-labelledby="consent-h">
      <h2 id="consent-h">Information and consent</h2>
      <p className="flag" role="note">DRAFT wording. Needs approval before real sessions. Team to add: contact details [CONTACT] and course context [COURSE].</p>
      <p>We are studying how the layout of text on a screen affects reading in Urdu and English. You will read four short passages, two in each language. For each one you will answer five questions and rate how it felt. At the end you will answer a short questionnaire about the reading settings.</p>
      <ul>
        <li>Taking part is voluntary. You can stop at any time using the Stop button, and you can choose to delete what you have done so far.</li>
        <li>We do not ask about, and do not record, any reading difficulty, diagnosis or health information.</li>
        <li>Your data is anonymous. It is linked only to a participant code, never to your name or contact details.</li>
        <li>We record your reading times, answers, ratings, and the layout settings you choose.</li>
        <li>This is a test of the text layout, not of you. There are no right or wrong preferences.</li>
      </ul>
      <label className="agree">
        <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
        <span>I have read this information and I agree to take part.</span>
      </label>
      <div className="row">
        <button type="button" className="btn btn--solid" disabled={!ok} onClick={onAgree}>Begin</button>
        <button type="button" className="btn" onClick={onDecline}>I do not want to take part</button>
      </div>
    </section>
  );
}
