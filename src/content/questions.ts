export interface Question {
  id: string;
  passageId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  /** TRUE = stand-in question. Replace with the team's five approved questions per passage. */
  placeholder: boolean;
}

const q = (passageId: string, n: number, prompt: string, options: string[], correctIndex: number): Question =>
  ({ id: `${passageId}-q${n}`, passageId, prompt, options, correctIndex, placeholder: true });

// PLACEHOLDER questions (multiple choice, one correct answer). The question format itself is an
// assumption to confirm. Urdu text is unvalidated.
export const QUESTIONS: Question[] = [
  q('en-a', 1, 'When does the library open?', ['Eight', 'Nine', 'Ten', 'Noon'], 1),
  q('en-a', 2, 'On which day does it stay open until eight?', ['Monday', 'Tuesday', 'Thursday', 'Friday'], 1),
  q('en-a', 3, 'How many books may members borrow?', ['Two', 'Four', 'Six', 'Eight'], 2),
  q('en-a', 4, 'Where is group study allowed?', ['Second floor', 'Ground floor', 'The roof', 'Behind the desk'], 1),
  q('en-a', 5, 'What must people bring to join?', ['One photo card', 'Two letters', 'A fee receipt', 'An old book'], 0),

  q('en-b', 1, 'How often does the bus leave the station?', ['Every ten minutes', 'Every fifteen minutes', 'Every twenty minutes', 'Every thirty minutes'], 2),
  q('en-b', 2, 'When does the last bus run?', ['Eight in the evening', 'Ten at night', 'Midnight', 'Six in the morning'], 1),
  q('en-b', 3, 'How much is a single ticket?', ['Twenty rupees', 'Thirty rupees', 'Forty rupees', 'Fifty rupees'], 2),
  q('en-b', 4, 'What do students pay?', ['Full price', 'Half price', 'Nothing', 'Double'], 1),
  q('en-b', 5, 'Why are buses slow on Fridays?', ['Rain', 'The weekly market', 'Road repairs', 'A strike'], 1),

  q('ur-a', 1, 'لائبریری صبح کس وقت کھلتی ہے؟', ['آٹھ بجے', 'نو بجے', 'دس بجے', 'دوپہر بارہ بجے'], 1),
  q('ur-a', 2, 'کس دن لائبریری رات آٹھ بجے تک کھلی رہتی ہے؟', ['پیر', 'منگل', 'جمعرات', 'جمعہ'], 1),
  q('ur-a', 3, 'اراکین زیادہ سے زیادہ کتنی کتابیں لے جا سکتے ہیں؟', ['دو', 'چار', 'چھ', 'آٹھ'], 2),
  q('ur-a', 4, 'گروہی مطالعہ کہاں کیا جا سکتا ہے؟', ['دوسری منزل پر', 'گراؤنڈ فلور پر', 'چھت پر', 'استقبالیہ کے پیچھے'], 1),
  q('ur-a', 5, 'رکنیت کے لیے کیا ساتھ لانا ہوگا؟', ['ایک تصویری کارڈ', 'دو سفارشی خط', 'فیس کی رسید', 'پرانی کتاب'], 0),

  q('ur-b', 1, 'بارہ نمبر کی بس کتنے منٹ بعد روانہ ہوتی ہے؟', ['دس', 'پندرہ', 'بیس', 'تیس'], 2),
  q('ur-b', 2, 'آخری بس کس وقت چلتی ہے؟', ['شام آٹھ بجے', 'رات دس بجے', 'رات بارہ بجے', 'صبح چھ بجے'], 1),
  q('ur-b', 3, 'ایک ٹکٹ کی قیمت کتنی ہے؟', ['بیس روپے', 'تیس روپے', 'چالیس روپے', 'پچاس روپے'], 2),
  q('ur-b', 4, 'طلبہ کتنا کرایہ دیتے ہیں؟', ['پورا کرایہ', 'آدھا کرایہ', 'کوئی کرایہ نہیں', 'دگنا کرایہ'], 1),
  q('ur-b', 5, 'جمعے کے دن بسیں سست کیوں چلتی ہیں؟', ['بارش کی وجہ سے', 'ہفتہ وار بازار کی وجہ سے', 'سڑک کی مرمت کی وجہ سے', 'ہڑتال کی وجہ سے'], 1),
];

export const questionsFor = (passageId: string) => QUESTIONS.filter((x) => x.passageId === passageId);
