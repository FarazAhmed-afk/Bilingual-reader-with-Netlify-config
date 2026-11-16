import { useState } from 'react';
import { CONDITION_LABEL } from '../config/conditions';
import { deleteAllSessions, deleteSession, loadSessions } from '../data/storage';
import { downloadText, eventsCsv, sessionsJson, stamp, susCsv, trialsCsv } from '../data/export';

export function FacilitatorView({ onBack }: { onBack: () => void }) {
  const [sessions, setSessions] = useState(loadSessions);
  const refresh = () => setSessions(loadSessions());
  const placeholderCount = sessions.filter((s) => s.contentPlaceholder).length;
  const s = stamp();

  return (
    <main className="shell">
      <div className="bar">
        <h1>Facilitator: data</h1>
        <button type="button" className="btn btn--small" onClick={onBack}>Back to study</button>
      </div>
      <section className="card" aria-labelledby="data-h">
        <h2 id="data-h">Saved sessions ({sessions.length})</h2>
        <p>Data is stored only in this browser on this device. Export after every session. Clearing browser data deletes it.</p>
        {placeholderCount > 0 && <p className="flag" role="note">{placeholderCount} session(s) used placeholder content: test data, not real results. The export marks them with <code>content_placeholder</code>.</p>}
        {sessions.length === 0 ? <p>No saved sessions yet.</p> : (
          <table className="tbl">
            <thead><tr><th>Participant</th><th>Status</th><th>Trials</th><th>SUS</th><th>Placeholder</th><th></th></tr></thead>
            <tbody>{sessions.map((x) => (
              <tr key={x.sessionId}>
                <td>{x.participantId}</td><td>{x.status}</td><td>{x.trials.length}/4</td><td>{x.sus ? x.sus.score : '-'}</td><td>{x.contentPlaceholder ? 'yes' : 'no'}</td>
                <td><button type="button" className="btn btn--small" onClick={() => { if (window.confirm(`Delete session ${x.participantId}? This cannot be undone.`)) { deleteSession(x.sessionId); refresh(); } }}>Delete</button></td>
              </tr>
            ))}</tbody>
          </table>
        )}
        <div className="row">
          <button type="button" className="btn btn--solid btn--auto" disabled={!sessions.length} onClick={() => downloadText(`ahci_sessions_${s}.json`, 'application/json', sessionsJson(sessions))}>Export JSON (everything)</button>
          <button type="button" className="btn btn--auto" disabled={!sessions.length} onClick={() => downloadText(`ahci_trials_${s}.csv`, 'text/csv', trialsCsv(sessions))}>Trials CSV</button>
          <button type="button" className="btn btn--auto" disabled={!sessions.length} onClick={() => downloadText(`ahci_settings_events_${s}.csv`, 'text/csv', eventsCsv(sessions))}>Settings events CSV</button>
          <button type="button" className="btn btn--auto" disabled={!sessions.length} onClick={() => downloadText(`ahci_sus_${s}.csv`, 'text/csv', susCsv(sessions))}>SUS CSV</button>
        </div>
        <details className="debug">
          <summary>Danger zone</summary>
          <button type="button" className="btn btn--auto" disabled={!sessions.length} onClick={() => { if (window.prompt('Type DELETE to remove all saved sessions from this browser.') === 'DELETE') { deleteAllSessions(); refresh(); } }}>Delete all sessions</button>
        </details>
        <p className="hint" style={{ marginInlineStart: 0 }}>Conditions: {Object.values(CONDITION_LABEL).join(' / ')}. Reading time includes in-reading adjustments; rows with <code>interrupted</code> above 0 should be excluded from timing analysis.</p>
      </section>
    </main>
  );
}
