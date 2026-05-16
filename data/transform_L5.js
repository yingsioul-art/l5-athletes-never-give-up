/* ============================================================
   transform_L5.js — 模式 9 句型轉換（拖拉版）題庫
   - 9 題：依提示把原句改寫
   - answer: 標準改寫後句子（用於 token 順序比對）
   - distractors: 額外的「誘餌 tile」陣列（增加難度，可選）
   - underline_text: 原句中需要強調的字（會在顯示時加底線）
   ============================================================ */

window.TRANSFORM_L5 = [
  {
    id: 'X001',
    source: '評量本 p.101 依提示作答 1',
    original: "Tom: Does your sister swim on Sundays? Ben: No, she doesn't.",
    hint: '問句加入 often，答句加入 seldom 改寫',
    answer: 'Tom: Does your sister often swim on Sundays? Ben: No, she seldom does.',
    distractors: [],
    explanation: '一般動詞問句副詞放在主動詞前 (often swim)；否定簡答用 seldom does（seldom 在 does 前）。'
  },
  {
    id: 'X002',
    source: '評量本 p.101 依提示作答 2',
    original: 'They play baseball once or twice a month.',
    underline_text: 'once or twice a month',
    hint: '依畫線部分造原問句',
    answer: 'How often do they play baseball?',
    distractors: ['does'],
    explanation: '畫線部分表頻率 → 用 How often 問；主詞 they 複數用 do。'
  },
  {
    id: 'X003',
    source: '評量本 p.101 依提示作答 3',
    original: 'Kevin is never late for school.',
    hint: '用 ... go to school... 改寫句子（去掉 is，改為一般動詞）',
    answer: 'Kevin never goes to school late.',
    distractors: ['is', 'go'],
    explanation: 'be 動詞句改為一般動詞句：Kevin → goes（三單）；副詞 never 放動詞前；late 改修飾動作。'
  },
  {
    id: 'X004',
    source: '評量本 p.101 依提示作答 4',
    original: 'Tina often cooks dinner at home on Saturday. Mike seldom cooks dinner at home on Saturday.',
    hint: '合併句子',
    answer: 'Tina often cooks dinner at home on Saturday, but Mike seldom does.',
    distractors: ['cook'],
    explanation: '用 but 連接對比；後半用 does 替代 cooks dinner... 避免重複；副詞 seldom 放 does 前。'
  },
  {
    id: 'X005',
    source: '學測本 p.69 依提示作答 1',
    original: 'Dad washes his car six times a month.',
    underline_text: 'six times a month',
    hint: '依畫線部分造原問句',
    answer: 'How often does Dad wash his car?',
    distractors: ['washes', 'do'],
    explanation: '畫線部分表頻率 → 用 How often；Dad 三單用 does；助動詞後動詞用原形 wash。'
  },
  {
    id: 'X006',
    source: '學測本 p.69 依提示作答 2',
    original: 'How often do you visit your grandmother?',
    hint: '用「一星期一次或兩次」詳答',
    answer: 'I visit my grandmother once or twice a week.',
    distractors: ['twice', 'a'],
    explanation: '詳答主詞用 I + visit（複數用原形）；my grandmother（you 對 I 時所有格改 your→my）；once or twice a week。'
  },
  {
    id: 'X007',
    source: '學測本 p.69 依提示作答 3',
    original: 'Is the weather always sunny here?',
    hint: '肯定簡答',
    answer: 'Yes, it is.',
    distractors: ['No', "isn't"],
    explanation: 'be 動詞肯定簡答：Yes, + 主詞代名詞 + be；the weather 用代名詞 it。'
  },
  {
    id: 'X008',
    source: '學測本 p.69 依提示作答 4',
    original: 'I have breakfast at home.',
    hint: '加入 always 改寫句子',
    answer: 'I always have breakfast at home.',
    distractors: [],
    explanation: '頻率副詞 always 放在一般動詞 have 前面。'
  },
  {
    id: 'X009',
    source: '學測本 p.69 依提示作答 5',
    original: 'Jack sings every day.',
    underline_text: 'every day',
    hint: '依畫線部分造原問句',
    answer: 'How often does Jack sing?',
    distractors: ['sings', 'do'],
    explanation: '畫線部分表頻率 → 用 How often；Jack 三單用 does；助動詞後動詞用原形 sing。'
  }
];
