import { PASSAGES, type Passage } from './passages';
import { QUESTIONS, type Question } from './questions';

export const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export interface ContentCheck {
  /** Real problems: the study cannot start while any exist. */
  structural: string[];
  /** Stand-in content is present: fine for testing, never for real sessions. */
  placeholder: boolean;
}

export function checkContent(passages: Passage[] = PASSAGES, questions: Question[] = QUESTIONS): ContentCheck {
  const structural: string[] = [];
  for (const p of passages) {
    const qs = questions.filter((x) => x.passageId === p.id);
    if (qs.length !== 5) structural.push(`${p.id}: expected 5 questions, found ${qs.length}`);
    if (!p.simplified) structural.push(`${p.id}: no simplified version`);
    if (!p.placeholder) {
      const n = wordCount(p.original);
      if (n < 150 || n > 200) structural.push(`${p.id}: ${n} words (target 150 to 200)`);
    }
    for (const x of qs) {
      if (x.options.length < 2 || x.correctIndex < 0 || x.correctIndex >= x.options.length) structural.push(`${x.id}: invalid options or correct answer`);
    }
  }
  const placeholder = passages.some((p) => p.placeholder) || questions.some((x) => x.placeholder);
  return { structural, placeholder };
}
