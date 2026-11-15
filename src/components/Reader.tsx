import type { CSSProperties } from 'react';
import { LANGS, type Lang } from '../config/languages';
import { BACKGROUNDS, type ReaderSettings } from '../config/settings';
import type { Passage } from '../content/passages';
import { ReaderBody } from './ReaderBody';

interface Props { passage: Passage; lang: Lang; settings: ReaderSettings }

/** Renders one passage. All settings are applied through CSS variables so changes are immediate. */
export function Reader({ passage, lang, settings: s }: Props) {
  const cfg = LANGS[lang];
  const font = cfg.fonts.find((f) => f.id === s.fontId) ?? cfg.fonts[0];
  const bg = BACKGROUNDS.find((b) => b.id === s.bgId) ?? BACKGROUNDS[0];
  const showSimple = s.simplified && !!passage.simplified;
  const text = showSimple ? passage.simplified! : passage.original;

  const style = {
    '--r-font': font.stack,
    '--r-size': `${s.sizePx}px`,
    '--r-line': s.lineHeight,
    '--r-letter': lang === 'en' ? `${s.letterSpacingEm}em` : '0em',
    '--r-word': lang === 'ur' ? `${s.wordSpacingEm}em` : '0em',
    '--r-bg': bg.bg,
    '--r-ink': bg.ink,
  } as CSSProperties;

  const layoutKey = [lang, font.id, s.sizePx, s.lineHeight, s.letterSpacingEm, s.wordSpacingEm].join('|');

  return (
    <article className="reader" lang={cfg.htmlLang} dir={cfg.dir} aria-label={passage.title} style={style}>
      <h2 className="reader__title">{passage.title}</h2>
      <ReaderBody key={`${passage.id}-${showSimple}`} text={text} lineFocus={s.lineFocus} chunking={s.chunking} layoutKey={layoutKey} />
    </article>
  );
}
