import type { Lang } from '../config/languages';

export interface Passage {
  id: string;
  lang: Lang;
  title: string;
  original: string;
  simplified?: string;
  /** TRUE = rendering-test text only. Must be replaced before any real session. */
  placeholder: boolean;
}

// PLACEHOLDER CONTENT. Not study material: it exists only to test RTL/LTR and Nastaliq rendering.
// Real passages (150-200 words, 2 per language, plus simplified versions) must be supplied by the team.
export const PASSAGES: Passage[] = [
  {
    id: 'en-test-1', lang: 'en', placeholder: true,
    title: 'Placeholder passage (English)',
    original:
      'Reading is a skill that most people practise every day, often without noticing. ' +
      'Signs, messages, menus and textbooks all ask us to turn small marks on a surface into meaning. ' +
      'For some readers this takes more effort than for others, and the way a text is laid out can change how hard it feels. ' +
      'Larger letters, wider gaps between lines, and a calmer background are small changes that some readers find helpful.',
    simplified:
      'Reading is a skill we use every day. Signs, messages and books all ask us to turn marks into meaning. ' +
      'For some people this is harder. How a text looks on the page can change how hard it feels.',
  },
  {
    id: 'ur-test-1', lang: 'ur', placeholder: true,
    title: 'نمونہ عبارت (اردو)',
    original:
      'پڑھنا ایک ایسی مہارت ہے جسے ہم روزانہ استعمال کرتے ہیں، اکثر بغیر محسوس کیے۔ ' +
      'تختیاں، پیغامات، کھانوں کی فہرستیں اور نصابی کتابیں سب ہم سے یہ تقاضا کرتی ہیں کہ ہم سطح پر موجود چھوٹے نشانات کو معنی میں بدلیں۔ ' +
      'کچھ قارئین کے لیے یہ کام زیادہ محنت طلب ہوتا ہے، اور عبارت کی ترتیب سے اس کی مشکل میں فرق پڑ سکتا ہے۔',
    simplified:
      'پڑھنا ایک ایسی مہارت ہے جو ہم روز استعمال کرتے ہیں۔ کچھ لوگوں کے لیے یہ مشکل ہوتا ہے۔ عبارت کی ترتیب سے مشکل کم یا زیادہ ہو سکتی ہے۔',
  },
];

export const passagesFor = (lang: Lang) => PASSAGES.filter((p) => p.lang === lang);
