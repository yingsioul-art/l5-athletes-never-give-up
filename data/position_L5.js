/* ============================================================
   position_L5.js — 模式 2 副詞位置點選 題庫
   - 共 10 題：5 題 be 動詞 + 5 題一般動詞
   - correct_index：副詞要插在 parts[N] 的「後面」（0-based）
     例：parts=["She","is","happy"], correct_index=1 → "She is _here_ happy"
   - verb_type："be" 或 "verb"
   ============================================================ */

window.POSITION_L5 = [
  // ───── be 動詞 5 題（副詞放在 be 動詞後）─────
  {
    id: 'P001',
    parts: ['She', 'is', 'happy'],
    adverb: 'always',
    correct_index: 1,
    verb_type: 'be',
    explanation: 'be 動詞 (is) 後面放頻率副詞。',
    en_full: 'She is always happy.',
    zh: '她總是很開心。'
  },
  {
    id: 'P002',
    parts: ['I', 'am', 'late'],
    adverb: 'never',
    correct_index: 1,
    verb_type: 'be',
    explanation: 'be 動詞 (am) 後面放頻率副詞。',
    en_full: 'I am never late.',
    zh: '我從不遲到。'
  },
  {
    id: 'P003',
    parts: ['They', 'are', 'busy'],
    adverb: 'often',
    correct_index: 1,
    verb_type: 'be',
    explanation: 'be 動詞 (are) 後面放頻率副詞。',
    en_full: 'They are often busy.',
    zh: '他們經常很忙。'
  },
  {
    id: 'P004',
    parts: ['My', 'brothers', 'are', 'tired'],
    adverb: 'usually',
    correct_index: 2,
    verb_type: 'be',
    explanation: 'be 動詞 (are) 後面放頻率副詞；「My brothers」是主詞。',
    en_full: 'My brothers are usually tired.',
    zh: '我哥哥們通常都很累。'
  },
  {
    id: 'P005',
    parts: ['Tom', 'is', 'sick'],
    adverb: 'sometimes',
    correct_index: 1,
    verb_type: 'be',
    explanation: 'be 動詞 (is) 後面放頻率副詞。',
    en_full: 'Tom is sometimes sick.',
    zh: 'Tom 有時候會生病。'
  },

  // ───── 一般動詞 5 題（副詞放在一般動詞前）─────
  {
    id: 'P006',
    parts: ['I', 'eat', 'breakfast'],
    adverb: 'always',
    correct_index: 0,
    verb_type: 'verb',
    explanation: '一般動詞 (eat) 前面放頻率副詞。',
    en_full: 'I always eat breakfast.',
    zh: '我總是吃早餐。'
  },
  {
    id: 'P007',
    parts: ['She', 'plays', 'the', 'piano'],
    adverb: 'often',
    correct_index: 0,
    verb_type: 'verb',
    explanation: '一般動詞 (plays) 前面放頻率副詞；三單動詞要加 -s。',
    en_full: 'She often plays the piano.',
    zh: '她常常彈鋼琴。'
  },
  {
    id: 'P008',
    parts: ['We', 'go', 'to', 'the', 'park'],
    adverb: 'usually',
    correct_index: 0,
    verb_type: 'verb',
    explanation: '一般動詞 (go) 前面放頻率副詞。',
    en_full: 'We usually go to the park.',
    zh: '我們通常會去公園。'
  },
  {
    id: 'P009',
    parts: ['David', 'watches', 'TV'],
    adverb: 'seldom',
    correct_index: 0,
    verb_type: 'verb',
    explanation: '一般動詞 (watches) 前面放頻率副詞。',
    en_full: 'David seldom watches TV.',
    zh: 'David 很少看電視。'
  },
  {
    id: 'P010',
    parts: ['My', 'sister', 'and', 'I', 'play', 'tennis'],
    adverb: 'sometimes',
    correct_index: 3,
    verb_type: 'verb',
    explanation: '一般動詞 (play) 前面放頻率副詞；副詞放在主詞「My sister and I」之後、動詞之前。',
    en_full: 'My sister and I sometimes play tennis.',
    zh: '我姊姊和我有時候會打網球。'
  }
];
