import type { Lang } from '../config/languages';

export interface Passage {
  id: string;
  lang: Lang;
  title: string;
  original: string;
  simplified?: string;
  /** TRUE = stand-in text. Must be replaced by approved study passages (150-200 words) before real sessions. */
  placeholder: boolean;
}

// PLACEHOLDER CONTENT: short, neutral, answerable texts that exist only to test the study flow.
// The Urdu translations are mine and unvalidated. Replace every entry with the team's real material.
export const PASSAGES: Passage[] = [
  {
    id: 'en-a', lang: 'en', title: 'Passage A', placeholder: true,
    original:
      'Placeholder text A. The town library opens at nine each morning and closes at five. On Tuesdays it stays open until eight for evening readers. ' +
      'Members may borrow up to six books for three weeks. A reading room on the second floor is kept quiet, and group study is allowed only on the ground floor. ' +
      'People who wish to join must bring one photo card and fill in a short form at the front desk.',
    simplified:
      'Placeholder text A. The library opens at nine and closes at five. On Tuesdays it stays open until eight. Members can borrow six books. ' +
      'Group study is only on the ground floor. To join, bring one photo card.',
  },
  {
    id: 'en-b', lang: 'en', title: 'Passage B', placeholder: true,
    original:
      'Placeholder text B. The number twelve bus leaves the station every twenty minutes. The first bus runs at six in the morning and the last at ten at night. ' +
      'A single ticket costs forty rupees. The route passes the market, the hospital and the university gate. ' +
      'Students pay half price when they show a card. On Fridays the buses move slowly because of the weekly market.',
    simplified:
      'Placeholder text B. The number twelve bus leaves every twenty minutes. The last bus is at ten at night. A ticket costs forty rupees. ' +
      'Students pay half. On Fridays buses are slow because of the weekly market.',
  },
  {
    id: 'ur-a', lang: 'ur', title: 'عبارت الف', placeholder: true,
    original:
      'نمونہ عبارت الف۔ شہر کی لائبریری ہر صبح نو بجے کھلتی ہے اور شام پانچ بجے بند ہو جاتی ہے۔ منگل کے دن شام کے قارئین کے لیے یہ رات آٹھ بجے تک کھلی رہتی ہے۔ ' +
      'اراکین تین ہفتوں کے لیے زیادہ سے زیادہ چھ کتابیں لے جا سکتے ہیں۔ دوسری منزل کا مطالعہ ہال خاموش رکھا جاتا ہے، اور گروہی مطالعہ صرف گراؤنڈ فلور پر کیا جا سکتا ہے۔ ' +
      'رکنیت کے خواہش مند افراد کو ایک تصویری کارڈ ساتھ لانا ہوگا اور استقبالیہ پر ایک مختصر فارم بھرنا ہوگا۔',
    simplified:
      'نمونہ عبارت الف۔ لائبریری صبح نو بجے کھلتی ہے اور شام پانچ بجے بند ہوتی ہے۔ منگل کو رات آٹھ بجے تک کھلی رہتی ہے۔ ہر رکن چھ کتابیں لے جا سکتا ہے۔ ' +
      'گروہی مطالعہ صرف گراؤنڈ فلور پر ہوتا ہے۔ رکن بننے کے لیے ایک تصویری کارڈ لانا ہوگا۔',
  },
  {
    id: 'ur-b', lang: 'ur', title: 'عبارت ب', placeholder: true,
    original:
      'نمونہ عبارت ب۔ بارہ نمبر کی بس ہر بیس منٹ بعد اسٹیشن سے روانہ ہوتی ہے۔ پہلی بس صبح چھ بجے اور آخری بس رات دس بجے چلتی ہے۔ ایک ٹکٹ کی قیمت چالیس روپے ہے۔ ' +
      'یہ راستہ بازار، ہسپتال اور جامعہ کے دروازے سے گزرتا ہے۔ طلبہ کارڈ دکھا کر آدھا کرایہ دیتے ہیں۔ جمعے کے دن ہفتہ وار بازار کی وجہ سے بسیں سست چلتی ہیں۔',
    simplified:
      'نمونہ عبارت ب۔ بارہ نمبر کی بس ہر بیس منٹ بعد چلتی ہے۔ آخری بس رات دس بجے ہے۔ ٹکٹ چالیس روپے کا ہے۔ طلبہ آدھا کرایہ دیتے ہیں۔ جمعے کو ہفتہ وار بازار کی وجہ سے بسیں سست چلتی ہیں۔',
  },
];

/** Untimed sample used only in the adjustable condition's setup step, so the study passage is not pre-read. */
export const samplePassage = (lang: Lang): Passage =>
  lang === 'en'
    ? {
        id: 'sample-en', lang, title: 'Sample text', placeholder: false,
        original:
          'This sample text is only for trying the settings. Signs, messages, menus and textbooks all ask us to turn small marks on a surface into meaning. ' +
          'Larger letters, wider gaps between lines, and a calmer background are small changes that some readers find helpful.',
        simplified: 'This sample text is only for trying the settings. Larger letters, wider gaps between lines and a calm background can help some readers.',
      }
    : {
        id: 'sample-ur', lang, title: 'نمونہ متن', placeholder: false,
        original:
          'یہ نمونہ متن صرف سیٹنگز آزمانے کے لیے ہے۔ تختیاں، پیغامات، کھانوں کی فہرستیں اور نصابی کتابیں سب ہم سے یہ تقاضا کرتی ہیں کہ ہم سطح پر موجود چھوٹے نشانات کو معنی میں بدلیں۔ ' +
          'بڑے حروف، سطروں کے درمیان زیادہ فاصلہ اور پرسکون پس منظر چھوٹی تبدیلیاں ہیں جو کچھ قارئین کو مفید لگتی ہیں۔',
        simplified: 'یہ نمونہ متن صرف سیٹنگز آزمانے کے لیے ہے۔ بڑے حروف، زیادہ فاصلہ اور پرسکون پس منظر کچھ قارئین کے لیے مفید ہو سکتے ہیں۔',
      };

export const getPassage = (id: string) => PASSAGES.find((p) => p.id === id);
