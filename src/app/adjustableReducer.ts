import type { Lang } from '../config/languages';
import { BASELINE, type ReaderSettings, type SettingKey } from '../config/settings';
import { suggestFor } from '../config/suggested';

export type Source = 'baseline' | 'suggested' | 'reader';
export type SuggestionStatus = 'pending' | 'accepted' | 'declined';
export type Value = string | number | boolean;

export interface SettingEvent {
  t: number;                       // epoch ms, supplied by the caller so the reducer stays pure
  kind: 'change' | 'suggested' | 'declined' | 'reset';
  key?: SettingKey;
  from?: Value;
  to?: Value;
  source: Source;
}

export interface AdjState {
  settings: ReaderSettings;
  sources: Record<SettingKey, Source>;   // who set the CURRENT value of each setting
  suggestion: SuggestionStatus;
  events: SettingEvent[];                // append-only log, kept across resets
}
export type State = Record<Lang, AdjState>;

export type Action =
  | { type: 'change'; lang: Lang; patch: Partial<ReaderSettings>; t: number }
  | { type: 'accept'; lang: Lang; t: number }
  | { type: 'decline'; lang: Lang; t: number }
  | { type: 'reset'; lang: Lang; t: number };

const allSources = (s: Source): Record<SettingKey, Source> => ({
  fontId: s, sizePx: s, lineHeight: s, letterSpacingEm: s, wordSpacingEm: s, bgId: s, lineFocus: s, chunking: s, simplified: s,
});

const initAdj = (lang: Lang): AdjState => ({
  settings: { ...BASELINE[lang] }, sources: allSources('baseline'), suggestion: 'pending', events: [],
});
export const initialState = (): State => ({ en: initAdj('en'), ur: initAdj('ur') });

export function reducer(state: State, a: Action): State {
  const cur = state[a.lang];
  let settings = cur.settings;
  const sources = { ...cur.sources };
  const events = [...cur.events];
  let suggestion = cur.suggestion;

  switch (a.type) {
    case 'change': {
      for (const k of Object.keys(a.patch) as SettingKey[]) {
        const to = a.patch[k] as Value;
        const from = settings[k] as Value;
        if (from === to) continue;
        settings = { ...settings, [k]: to } as ReaderSettings;
        sources[k] = 'reader';
        events.push({ t: a.t, kind: 'change', key: k, from, to, source: 'reader' });
      }
      break;
    }
    case 'accept': {
      const sug = suggestFor(a.lang);
      for (const k of Object.keys(sug) as SettingKey[]) {
        const to = sug[k] as Value;
        const from = settings[k] as Value;
        settings = { ...settings, [k]: to } as ReaderSettings;
        sources[k] = 'suggested';
        events.push({ t: a.t, kind: 'suggested', key: k, from, to, source: 'suggested' });
      }
      suggestion = 'accepted';
      break;
    }
    case 'decline':
      suggestion = 'declined';
      events.push({ t: a.t, kind: 'declined', source: 'reader' });
      break;
    case 'reset':
      settings = { ...BASELINE[a.lang] };
      suggestion = 'pending';
      events.push({ t: a.t, kind: 'reset', source: 'baseline' });
      return { ...state, [a.lang]: { settings, sources: allSources('baseline'), suggestion, events } };
  }
  return { ...state, [a.lang]: { settings, sources, suggestion, events } };
}
