/* ============================================================
   translate_L5.js — 模式 7 中翻英題庫
   - 12 題（評量本 + 學測本翻譯區整合）
   - answers: 陣列，可放多個可接受答案（寬鬆比對）
   - 批改：忽略大小寫、標點、多空白；只要匹配陣列任一答案即算對
   ============================================================ */

window.TRANSLATE_L5 = [
  {
    id: 'T001',
    source: '評量本 p.98 翻譯 1',
    zh: 'David 時常在客廳讀書。',
    hint: 'often / read / in the living room',
    answers: [
      'David often reads in the living room.',
      'David reads in the living room often.'
    ],
    en_full: 'David often reads in the living room.',
    explanation: '主詞 David 三單，動詞 read 加 -s；頻率副詞 often 放動詞前；客廳 = living room。'
  },
  {
    id: 'T002',
    source: '評量本 p.98 翻譯 2',
    zh: 'Sally: 你多常游泳？ Eric: 一星期一次或兩次。',
    hint: 'How often / swim / once or twice a week',
    answers: [
      'Sally: How often do you swim? Eric: Once or twice a week.',
      'Sally: How often do you swim Eric: Once or twice a week.',
      'How often do you swim? Once or twice a week.'
    ],
    en_full: 'Sally: How often do you swim? Eric: Once or twice a week.',
    explanation: '問頻率用 How often + do/does + 主詞 + 原形動詞；答用「次數 + a + 時間單位」。'
  },
  {
    id: 'T003',
    source: '評量本 p.98 翻譯 3',
    zh: 'Billy: 你多常玩電腦遊戲？ Jane: 我每天玩電腦遊戲一次。',
    hint: 'How often / play computer games / once a day',
    answers: [
      'Billy: How often do you play computer games? Jane: I play computer games once a day.',
      'How often do you play computer games? I play computer games once a day.'
    ],
    en_full: 'Billy: How often do you play computer games? Jane: I play computer games once a day.',
    explanation: 'How often 問頻率；every day = once a day 都可表「每天一次」。'
  },
  {
    id: 'T004',
    source: '評量本 p.101 二、翻譯',
    zh: '記者的人生從來不是容易的。',
    hint: 'reporter / life / never easy',
    answers: [
      "A reporter's life is never easy.",
      "The reporter's life is never easy.",
      "A reporter's life is not easy."
    ],
    en_full: "A reporter's life is never easy.",
    explanation: '所有格 reporter\'s；life is（單數動詞）；never 放 be 動詞後 → is never。'
  },
  {
    id: 'T005',
    source: '評量本 p.102 翻譯 2',
    zh: '這些運動員每一週訓練兩次。',
    hint: 'athletes / train / twice a week',
    answers: [
      'These athletes train twice a week.',
      'The athletes train twice a week.'
    ],
    en_full: 'These athletes train twice a week.',
    explanation: '主詞 athletes 複數 → 動詞原形 train；兩次 = twice；twice a week = 一週兩次。'
  },
  {
    id: 'T006',
    source: '評量本 p.102 翻譯 3',
    zh: 'Andy 時常受傷，但是他相信「努力就有收穫。」',
    hint: 'often / get hurt / believe / Hard work pays off',
    answers: [
      'Andy often gets hurt, but he believes "Hard work pays off."',
      'Andy often gets hurt, but he believes hard work pays off.',
      'Andy often gets hurt but he believes hard work pays off.'
    ],
    en_full: 'Andy often gets hurt, but he believes "Hard work pays off."',
    explanation: 'Andy 三單 → gets / believes 都加 s；often 放動詞前；Hard work pays off. 為固定片語。'
  },
  {
    id: 'T007',
    source: '評量本 p.102 翻譯 4',
    zh: 'John: 你有時間做你的作業嗎？ Ann: 有的，我晚上做。',
    hint: 'have time / do your homework / at night',
    answers: [
      'John: Do you have time to do your homework? Ann: Yes, I do it at night.',
      'Do you have time to do your homework? Yes, I do it at night.',
      'John: Do you have time to do your homework? Ann: Yes, I do my homework at night.'
    ],
    en_full: 'John: Do you have time to do your homework? Ann: Yes, I do it at night.',
    explanation: '「有時間做 X」= have time to do X；「在晚上」= at night。'
  },
  {
    id: 'T008',
    source: '學測本 p.70 整句翻譯 1',
    zh: '那位運動員常常受傷，但他從來不放棄。',
    hint: 'athlete / get hurt / never give up',
    answers: [
      'The athlete often gets hurt, but he never gives up.',
      'That athlete often gets hurt, but he never gives up.',
      'The athlete often gets hurt but he never gives up.'
    ],
    en_full: 'The athlete often gets hurt, but he never gives up.',
    explanation: 'athlete 三單 → gets / gives；never 放一般動詞 gives 前；放棄 = give up。'
  },
  {
    id: 'T009',
    source: '學測本 p.70 整句翻譯 2',
    zh: '一位記者正在問那位運動員一些問題。',
    hint: 'reporter / be asking / athlete / some questions',
    answers: [
      'A reporter is asking the athlete some questions.',
      'A reporter is asking that athlete some questions.'
    ],
    en_full: 'A reporter is asking the athlete some questions.',
    explanation: '進行式 is + Ving；ask sb. some questions = 問某人一些問題。'
  },
  {
    id: 'T010',
    source: '學測本 p.70 整句翻譯 3',
    zh: '我每天總是有許多作業。',
    hint: 'always / have / a lot of homework / every day',
    answers: [
      'I always have a lot of homework every day.',
      'I always have lots of homework every day.'
    ],
    en_full: 'I always have a lot of homework every day.',
    explanation: '頻率副詞 always 放一般動詞 have 前；「許多作業」= a lot of / lots of homework（homework 不可數）。'
  },
  {
    id: 'T011',
    source: '學測本 p.70 整句翻譯 4',
    zh: 'A: 那位高中生多久游泳一次呢？ B: 一個月三次。',
    hint: 'How often / senior high school student / swim / three times a month',
    answers: [
      'A: How often does the senior high school student swim? B: Three times a month.',
      'How often does the senior high school student swim? Three times a month.',
      'A: How often does that senior high school student swim? B: Three times a month.'
    ],
    en_full: 'A: How often does the senior high school student swim? B: Three times a month.',
    explanation: '主詞三單 → does + 原形 swim；三次 = three times；three times a month = 一個月三次。'
  },
  {
    id: 'T012',
    source: '學測本 p.70 整句翻譯 5',
    zh: '我爸爸總是準時回家。',
    hint: 'always / get/come home / on time',
    answers: [
      'My dad always gets home on time.',
      'My dad always comes home on time.',
      'My father always gets home on time.',
      'My father always comes home on time.',
      'My dad always goes home on time.'
    ],
    en_full: 'My dad always gets home on time.',
    explanation: '回家 = get / come / go home；always 放動詞前；準時 = on time。'
  }
];
