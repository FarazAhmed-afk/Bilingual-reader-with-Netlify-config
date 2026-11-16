import type { Lang } from '../config/languages';

// All Urdu strings below are my own translations and are NOT validated. Have them reviewed
// (ideally back-translated) before any real session. English SUS follows Brooke (1996), with
// "system" changed to "reading tool".

export type EffortId = 'mental' | 'effort' | 'frustration';

export const EFFORT_ITEMS: Record<Lang, { id: EffortId; text: string }[]> = {
  en: [
    { id: 'mental', text: 'How much mental effort did reading this passage take?' },
    { id: 'effort', text: 'How hard did you have to work to read and understand it?' },
    { id: 'frustration', text: 'How frustrated or stressed did you feel while reading it?' },
  ],
  ur: [
    { id: 'mental', text: 'اس عبارت کو پڑھنے میں کتنی ذہنی محنت درکار تھی؟' },
    { id: 'effort', text: 'اسے پڑھنے اور سمجھنے کے لیے آپ کو کتنی کوشش کرنی پڑی؟' },
    { id: 'frustration', text: 'اسے پڑھتے ہوئے آپ نے کتنی جھنجھلاہٹ یا دباؤ محسوس کیا؟' },
  ],
};
export const EFFORT_ANCHORS: Record<Lang, { low: string; high: string; heading: string }> = {
  en: { low: 'Very low', high: 'Very high', heading: 'How was reading that passage?' },
  ur: { low: 'بہت کم', high: 'بہت زیادہ', heading: 'اس عبارت کو پڑھنا کیسا رہا؟' },
};

export const SUS_INTRO: Record<Lang, string> = {
  en: 'These statements are about the adjustable reading settings you used.',
  ur: 'یہ بیانات اُن قابلِ ترتیب مطالعاتی سیٹنگز کے بارے میں ہیں جو آپ نے استعمال کیں۔',
};
export const SUS_SCALE: Record<Lang, string[]> = {
  en: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
  ur: ['بالکل متفق نہیں', 'متفق نہیں', 'غیر جانبدار', 'متفق', 'بالکل متفق'],
};
export const SUS_ITEMS: Record<Lang, string[]> = {
  en: [
    'I think that I would like to use this reading tool frequently.',
    'I found the reading tool unnecessarily complex.',
    'I thought the reading tool was easy to use.',
    'I think that I would need the support of a technical person to be able to use this reading tool.',
    'I found the various functions in this reading tool were well integrated.',
    'I thought there was too much inconsistency in this reading tool.',
    'I would imagine that most people would learn to use this reading tool very quickly.',
    'I found the reading tool very cumbersome to use.',
    'I felt very confident using the reading tool.',
    'I needed to learn a lot of things before I could get going with this reading tool.',
  ],
  ur: [
    'میرا خیال ہے کہ میں اس مطالعاتی ٹول کو بار بار استعمال کرنا پسند کروں گا۔',
    'مجھے یہ مطالعاتی ٹول غیر ضروری طور پر پیچیدہ لگا۔',
    'میرے خیال میں یہ مطالعاتی ٹول استعمال کرنا آسان تھا۔',
    'میرا خیال ہے کہ اس مطالعاتی ٹول کو استعمال کرنے کے لیے مجھے کسی تکنیکی ماہر کی مدد درکار ہوگی۔',
    'مجھے اس مطالعاتی ٹول کے مختلف افعال آپس میں اچھی طرح مربوط لگے۔',
    'مجھے لگا کہ اس مطالعاتی ٹول میں بہت زیادہ تضاد یا بے ترتیبی تھی۔',
    'میرا تصور ہے کہ زیادہ تر لوگ اس مطالعاتی ٹول کو استعمال کرنا بہت جلد سیکھ لیں گے۔',
    'مجھے یہ مطالعاتی ٹول استعمال کرنے میں بہت بوجھل لگا۔',
    'اس مطالعاتی ٹول کو استعمال کرتے ہوئے میں نے خود کو بہت پراعتماد محسوس کیا۔',
    'اس مطالعاتی ٹول کو استعمال کرنے سے پہلے مجھے بہت سی چیزیں سیکھنی پڑیں۔',
  ],
};
