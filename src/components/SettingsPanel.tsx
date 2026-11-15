import { LANGS, type Lang } from '../config/languages';
import { BACKGROUNDS, CHUNK_LINES, RANGES, type ReaderSettings, type SettingKey } from '../config/settings';
import type { Source, SuggestionStatus } from '../app/adjustableReducer';

interface Props {
  lang: Lang;
  settings: ReaderSettings;
  sources: Record<SettingKey, Source>;
  suggestion: SuggestionStatus;
  suggested: Partial<ReaderSettings>;
  canSimplify: boolean;
  onChange: (patch: Partial<ReaderSettings>) => void;
  onAccept: () => void;
  onDecline: () => void;
  onReset: () => void;
}

export function SettingsPanel({ lang, settings: s, sources, suggestion, suggested, canSimplify, onChange, onAccept, onDecline, onReset }: Props) {
  const r = RANGES[lang];
  const fonts = LANGS[lang].fonts;
  const bgLabel = BACKGROUNDS.find((b) => b.id === suggested.bgId)?.label ?? '';
  const modified = Object.values(sources).includes('reader');
  const status =
    suggestion === 'accepted' ? (modified ? 'Suggested settings, adjusted by you' : 'Suggested settings')
    : suggestion === 'declined' ? 'Chosen by you'
    : modified ? 'Changed by you' : 'Starting layout';

  return (
    <section className="panel" aria-labelledby="panel-title">
      <h2 id="panel-title" className="panel__title">Reading settings</h2>
      <p className="status" role="status">{status}</p>

      {suggestion !== 'accepted' && (
        <div className="suggest" role="group" aria-labelledby="sug-title">
          <h3 id="sug-title">Suggested settings</h3>
          <ul>
            <li>Font size {suggested.sizePx} px</li>
            <li>Line spacing {suggested.lineHeight?.toFixed(1)}</li>
            <li>{bgLabel} background</li>
          </ul>
          <div className="suggest__actions">
            <button type="button" className="btn btn--solid" onClick={onAccept}>Use suggested settings</button>
            {suggestion === 'pending' && <button type="button" className="btn" onClick={onDecline}>Choose my own</button>}
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="s-font">Font</label>
        <select id="s-font" value={s.fontId} onChange={(e) => onChange({ fontId: e.target.value })}>
          {fonts.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="s-size">Font size <output htmlFor="s-size">{s.sizePx} px</output></label>
        <input id="s-size" type="range" {...r.size} value={s.sizePx} onChange={(e) => onChange({ sizePx: +e.target.value })} />
      </div>

      <div className="field">
        <label htmlFor="s-line">Line spacing <output htmlFor="s-line">{s.lineHeight.toFixed(1)}</output></label>
        <input id="s-line" type="range" {...r.line} value={s.lineHeight} onChange={(e) => onChange({ lineHeight: +e.target.value })} />
      </div>

      {r.letter && (
        <div className="field">
          <label htmlFor="s-letter">Letter spacing <output htmlFor="s-letter">{s.letterSpacingEm.toFixed(2)} em</output></label>
          <input id="s-letter" type="range" {...r.letter} value={s.letterSpacingEm} onChange={(e) => onChange({ letterSpacingEm: +e.target.value })} />
        </div>
      )}
      {r.word && (
        <div className="field">
          <label htmlFor="s-word">Word spacing <output htmlFor="s-word">{s.wordSpacingEm.toFixed(2)} em</output></label>
          <input id="s-word" type="range" {...r.word} value={s.wordSpacingEm} onChange={(e) => onChange({ wordSpacingEm: +e.target.value })} />
        </div>
      )}

      <fieldset className="field">
        <legend>Background</legend>
        <div className="swatches">
          {BACKGROUNDS.map((b) => (
            <label key={b.id} className="swatch">
              <input type="radio" name="bg" value={b.id} checked={s.bgId === b.id} onChange={() => onChange({ bgId: b.id })} />
              <span className="swatch__chip" style={{ background: b.bg }} aria-hidden="true" />
              {b.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field check">
        <label><input type="checkbox" checked={s.lineFocus} onChange={(e) => onChange({ lineFocus: e.target.checked })} /> Line focus</label>
        <p className="hint">Highlights one line. Move it with the up and down arrow keys or the mouse.</p>
      </div>
      <div className="field check">
        <label><input type="checkbox" checked={s.chunking} onChange={(e) => onChange({ chunking: e.target.checked })} /> Text chunking</label>
        <p className="hint">Shows {CHUNK_LINES} lines at a time and dims the rest.</p>
      </div>
      {canSimplify && (
        <div className="field check">
          <label><input type="checkbox" checked={s.simplified} onChange={(e) => onChange({ simplified: e.target.checked })} /> Simplified text</label>
          <p className="hint">Shows a shorter, simpler version of this passage.</p>
        </div>
      )}

      <button type="button" className="btn" onClick={onReset}>Reset to starting layout</button>
    </section>
  );
}
