export type Lang = 'en' | 'ur';

export interface LangConfig {
  code: Lang;
  htmlLang: string;      // BCP-47 tag for the lang attribute (drives shaping + hyphenation)
  dir: 'ltr' | 'rtl';
  label: string;         // native name, shown in the picker
  fonts: { id: string; label: string; stack: string }[];
}

// Font stacks are bundled locally via @fontsource (no network needed at study time).
// Verdana is a system font and is NOT bundled; it falls back to Atkinson Hyperlegible.
export const LANGS: Record<Lang, LangConfig> = {
  en: {
    code: 'en', htmlLang: 'en', dir: 'ltr', label: 'English',
    fonts: [
      { id: 'atkinson', label: 'Atkinson Hyperlegible', stack: "'Atkinson Hyperlegible', Verdana, sans-serif" },
      { id: 'verdana', label: 'Verdana', stack: "Verdana, 'Atkinson Hyperlegible', sans-serif" },
      { id: 'opendyslexic', label: 'OpenDyslexic', stack: "'OpenDyslexic', 'Atkinson Hyperlegible', sans-serif" },
    ],
  },
  ur: {
    code: 'ur', htmlLang: 'ur', dir: 'rtl', label: 'اردو',
    fonts: [
      { id: 'nastaliq', label: 'Noto Nastaliq Urdu', stack: "'Noto Nastaliq Urdu', 'Lateef', serif" },
      { id: 'naskh', label: 'Lateef (Naskh)', stack: "'Lateef', 'Noto Nastaliq Urdu', serif" },
    ],
  },
};
