/** Standard SUS scoring: odd items contribute (x-1), even items (5-x); sum x 2.5 gives 0 to 100. */
export function susScore(answers: number[]): number {
  if (answers.length !== 10 || answers.some((a) => a < 1 || a > 5)) throw new Error('SUS needs 10 answers in 1..5');
  const sum = answers.reduce((acc, a, i) => acc + (i % 2 === 0 ? a - 1 : 5 - a), 0);
  return sum * 2.5;
}
