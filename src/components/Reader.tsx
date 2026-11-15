import { LANGS, type Lang } from '../config/languages';
import type { Passage } from '../content/passages';

interface Props { passage: Passage; lang: Lang; simplified?: boolean }

/** Renders one passage with correct lang/dir attributes. Settings arrive via CSS variables on an ancestor. */
export function Reader({ passage, lang, simplified = false }: Props) {
  const cfg = LANGS[lang];
  const text = simplified && passage.simplified ? passage.simplified : passage.original;
  return (
    <article className="reader" lang={cfg.htmlLang} dir={cfg.dir} aria-label={passage.title}>
      <h2 className="reader__title">{passage.title}</h2>
      <p className="reader__body">{text}</p>
    </article>
  );
}
