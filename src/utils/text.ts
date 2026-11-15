import type { Lang } from '../config/languages';

/** Direction is derived from the language setting, never guessed from content. */
export const dirFor = (lang: Lang): 'ltr' | 'rtl' => (lang === 'ur' ? 'rtl' : 'ltr');

/** Splits text into sentences for later chunking. Handles Latin '.', '!', '?' and Urdu '۔' (U+06D4), '؟' (U+061F). */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?۔؟])\s+/u)
    .map((s) => s.trim())
    .filter(Boolean);
}
