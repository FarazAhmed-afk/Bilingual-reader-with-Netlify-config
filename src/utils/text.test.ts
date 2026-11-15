import { describe, it, expect } from 'vitest';
import { dirFor, splitSentences } from './text';

describe('text utils', () => {
  it('maps language to direction', () => {
    expect(dirFor('ur')).toBe('rtl');
    expect(dirFor('en')).toBe('ltr');
  });
  it('splits English sentences', () => {
    expect(splitSentences('One. Two? Three!')).toEqual(['One.', 'Two?', 'Three!']);
  });
  it('splits Urdu sentences on the full stop ۔ and ؟', () => {
    expect(splitSentences('یہ پہلا ہے۔ یہ دوسرا ہے؟ تیسرا')).toEqual(['یہ پہلا ہے۔', 'یہ دوسرا ہے؟', 'تیسرا']);
  });
});
