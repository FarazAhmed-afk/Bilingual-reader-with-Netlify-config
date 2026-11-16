// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { loadSessions, loadCurrent } from '../data/storage';
import { trialsCsv } from '../data/export';

beforeEach(() => { cleanup(); localStorage.clear(); window.location.hash = ''; });

async function answerAllRadios(user: ReturnType<typeof userEvent.setup>, pick: (groupIdx: number) => number) {
  const groups = new Map<string, HTMLInputElement[]>();
  for (const r of screen.getAllByRole('radio') as HTMLInputElement[]) groups.set(r.name, [...(groups.get(r.name) ?? []), r]);
  let i = 0;
  for (const radios of groups.values()) await user.click(radios[Math.min(pick(i++), radios.length - 1)]);
}

describe('full participant flow (jsdom)', () => {
  it('runs setup -> consent -> 4 readings -> SUS -> archived, and exports', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/Participant number/i), '3');          // P003: English first, adjustable first
    await user.click(screen.getByRole('button', { name: /Continue to consent/i }));
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /^Begin$/ }));
    expect(loadCurrent()?.study.stage).toBe('trial');                            // autosaved

    for (let i = 0; i < 4; i++) {
      expect(screen.getByText(`Reading ${i + 1} of 4`)).toBeTruthy();
      if (i === 0) {                                                             // adjustable: untimed setup first
        await user.click(screen.getByRole('button', { name: /Use suggested settings/i }));
        expect(document.querySelector('p.status')?.textContent).toMatch(/Suggested settings/);
      }
      await user.click(screen.getByRole('button', { name: /Start reading/i }));
      await user.click(screen.getByRole('button', { name: /Done reading/i }));
      await answerAllRadios(user, () => 1);
      await user.click(screen.getAllByRole('button').find((b) => /Submit answers|جوابات جمع کریں/.test(b.textContent ?? ''))!);
      await answerAllRadios(user, () => 2);
      await user.click(screen.getAllByRole('button').find((b) => /^(Continue|آگے بڑھیں)$/.test(b.textContent ?? ''))!);
    }

    await answerAllRadios(user, () => 3);
    await user.click(screen.getByRole('button', { name: /^Finish$/ }));
    expect(screen.getByText('Thank you')).toBeTruthy();

    const [rec] = loadSessions();
    expect(rec.status).toBe('completed');
    expect(rec.trials).toHaveLength(4);
    expect(rec.trials.map((t) => t.lang)).toEqual(['en', 'en', 'ur', 'ur']);
    expect(rec.trials[0].condition).toBe('adjustable');
    expect(rec.trials[0].settings.suggestion).toBe('accepted');
    expect(rec.trials[0].settings.final.sizePx).toBe(20);                        // English suggestion
    expect(rec.trials[1].settings.sources).toBeNull();                           // default condition
    expect(rec.sus?.score).toBe(50);                                             // all "4" on a 1..5 scale => (3*5 + 1*5) * 2.5 = 50
    expect(loadCurrent()).toBeNull();                                            // cleared after archiving
    expect(trialsCsv([rec]).trim().split('\r\n')).toHaveLength(5);
  });

  it('stop-and-delete retains nothing; stop-and-keep archives as stopped_kept', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/Participant number/i), '1');
    await user.click(screen.getByRole('button', { name: /Continue to consent/i }));
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /^Begin$/ }));
    await user.click(screen.getByRole('button', { name: /^Stop$/ }));
    await user.click(screen.getByRole('button', { name: /Stop and delete my data/i }));
    expect(screen.getByText('Session ended')).toBeTruthy();
    expect(loadSessions()).toHaveLength(0);
    expect(loadCurrent()).toBeNull();

    cleanup();
    render(<App />);
    await user.type(screen.getByLabelText(/Participant number/i), '3');
    await user.click(screen.getByRole('button', { name: /Continue to consent/i }));
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /^Begin$/ }));
    await user.click(screen.getByRole('button', { name: /^Stop$/ }));
    await user.click(screen.getByRole('button', { name: /Stop and keep/i }));
    expect(loadSessions().map((s) => s.status)).toEqual(['stopped_kept']);
  });

  it('offers to resume an unfinished session after a reload and flags the interrupted reading', async () => {
    const user = userEvent.setup();
    const first = render(<App />);
    await user.type(screen.getByLabelText(/Participant number/i), '1');
    await user.click(screen.getByRole('button', { name: /Continue to consent/i }));
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /^Begin$/ }));
    await user.click(screen.getByRole('button', { name: /Start reading/i }));      // mid-reading
    first.unmount();                                                                // "reload"

    render(<App />);
    expect(screen.getByText(/Unfinished session found/i)).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Resume session/i }));
    expect(screen.getByRole('button', { name: /Start reading/i })).toBeTruthy();    // reading restarted
    expect(loadCurrent()?.study.draft.interrupted).toBe(1);
  });

  it('shows the facilitator data view and lists saved sessions', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Saved data and export/i }));
    expect(within(screen.getByRole('main')).getByText(/Saved sessions \(0\)/)).toBeTruthy();
  });
});
