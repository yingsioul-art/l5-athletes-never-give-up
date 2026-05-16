/* ============================================================
   dialogue_L5.js — L5 課本對話「Reporter's Interview with Amanda」
   - 開場場景說明 + 6 句對話
   - 每句附單字（連結 L5 vocab #）、慣用語、文法重點
   ============================================================ */

window.DIALOGUE_L5 = {
  title: "Reporter's Interview with Amanda",
  subtitle: "Lesson 5 對話 — 記者訪問拔河隊員",
  speakers: [
    { id: 'reporter', name: 'Reporter', emoji: '🎤',   color: 'orange' },
    { id: 'amanda',   name: 'Amanda',   emoji: '🏃‍♀️', color: 'green'  }
  ],
  setting: {
    en: "(Amanda is on the Jingmei Girls Senior High School tug of war team. A reporter is asking her some questions.)",
    zh: "(Amanda 是景美女中拔河隊的成員。一位記者正在問她一些問題。)",
    vocab: [
      { word: 'senior high school', num: 1,  pos: 'n.', meaning: '高中' },
      { word: 'tug of war',         num: 11, pos: 'n.', meaning: '拔河' },
      { word: 'reporter',           num: 2,  pos: 'n.', meaning: '記者' },
      { word: 'ask',                num: 3,  pos: 'v.', meaning: '詢問（asking 為現在分詞）' },
      { word: 'questions',          num: 4,  pos: 'n.', meaning: '問題（複數）' }
    ],
    grammar: [
      { point: '現在進行式 be + Ving',
        explanation: 'A reporter is asking ... 表示「正在問」（動作正在進行）。be 動詞用單數 is 因主詞 a reporter 為單數。' }
    ]
  },
  lines: [
    {
      speaker: 'reporter',
      en: "Another great win! You rock! How often do you train?",
      zh: "又是一場精彩的勝利！妳超棒！妳們多久練習一次呢？",
      vocab: [
        { word: 'another', num: 5,  pos: 'adj.', meaning: '另一個的' },
        { word: 'win',     num: 6,  pos: 'n.',   meaning: '勝利（此處為名詞）' },
        { word: 'often',   num: 7,  pos: 'adv.', meaning: '時常' },
        { word: 'train',   num: 8,  pos: 'v.',   meaning: '訓練' }
      ],
      idioms: [
        { phrase: 'You rock!', meaning: '你超棒！很厲害！（口語讚美）' }
      ],
      grammar: [
        { point: 'How often + do/does + 主詞 + 原形動詞？',
          explanation: '問頻率的句型。主詞 you 用助動詞 do（you 視為複數）；後面動詞用原形 train（不加 -s）。' }
      ]
    },
    {
      speaker: 'amanda',
      en: "From Monday to Friday, we train twice a day. And on weekends, we train for eight hours each day.",
      zh: "從星期一至星期五，我們一天練習兩次。在週末，我們一天練習八小時。",
      vocab: [
        { word: 'twice', num: 9,    pos: 'adv.', meaning: '兩次' },
        { word: 'each',  num: null, pos: 'adj.', meaning: '每一個（補充字）' }
      ],
      grammar: [
        { point: '次數 + a / each + 時間單位',
          explanation: '表「每⋯⋯幾次」：once a day 一天一次；twice a day 一天兩次；three times a week 一週三次。each day = a day（每一天）。' },
        { point: 'from A to B',
          explanation: '從 A 到 B 的時間範圍：from Monday to Friday = 星期一到星期五。' },
        { point: 'on weekends',
          explanation: 'on + 星期或假日 = 「在那天」。on weekends 為 weekend 複數，意指「每逢週末」。' }
      ]
    },
    {
      speaker: 'reporter',
      en: "Do you have time for your homework?",
      zh: "妳們有時間寫作業嗎？",
      vocab: [
        { word: 'homework', num: 10, pos: 'n.', meaning: '作業（不可數名詞）' }
      ],
      grammar: [
        { point: 'Do/Does + 主詞 + 動詞 + ...？',
          explanation: '一般動詞疑問句。主詞 you 用 Do（複數對應）；have 為原形。' },
        { point: 'have time for + 名詞',
          explanation: 'have time for X = 有時間做 X；另一寫法 have time to do X。' }
      ]
    },
    {
      speaker: 'amanda',
      en: "Yes, we do our homework at night.",
      zh: "有的，我們晚上寫作業。",
      grammar: [
        { point: 'do (one\'s) homework',
          explanation: '寫作業的固定搭配。homework 不可數，不能加 s 或冠詞 a/an。' },
        { point: 'at night',
          explanation: '「在晚上」：at night（不加 the）；其他常見：in the morning / in the afternoon / in the evening。' }
      ]
    },
    {
      speaker: 'reporter',
      en: "Hard work pays off. Thank you for your time.",
      zh: "努力就會有收穫。謝謝妳撥冗受訪。",
      idioms: [
        { phrase: 'Hard work pays off.', meaning: '努力就會有收穫。pay off 字面是「付清」，引申為「有回報」。L5 課本片語。' },
        { phrase: 'Thank you for your time.', meaning: '謝謝你撥冗（受訪/與我交談）。客套話。' }
      ]
    },
    {
      speaker: 'amanda',
      en: "No problem.",
      zh: "不客氣。",
      idioms: [
        { phrase: 'No problem.', meaning: '不客氣；沒問題。回應「謝謝」或請求的客套用語。' }
      ]
    }
  ],
  comprehension: [
    {
      id: 'D-Q1',
      prompt: 'How often does the tug of war team train on weekends?',
      zh_prompt: '拔河隊週末多久練習一次？',
      choices: [
        'Once a day for eight hours.',
        'Twice a day.',
        'Every two days.',
        'They don\'t train on weekends.'
      ],
      answer: 0,
      explanation: 'Amanda 說 "on weekends, we train for eight hours each day" — 週末一天一次共八小時。'
    },
    {
      id: 'D-Q2',
      prompt: 'When does Amanda do her homework?',
      zh_prompt: 'Amanda 何時寫作業？',
      choices: [
        'In the morning.',
        'During training.',
        'At night.',
        'On weekends only.'
      ],
      answer: 2,
      explanation: 'Amanda 說 "we do our homework at night" — 在晚上寫作業。'
    },
    {
      id: 'D-Q3',
      prompt: 'What does a member of the tug of war team do every day?',
      zh_prompt: '拔河隊員每天都做什麼？',
      choices: [
        'Sleep at 11:00 PM.',
        'Do homework.',
        'Win a trophy.',
        'Take a day off.'
      ],
      answer: 1,
      explanation: '從對話得知她們每天都寫作業（at night）；睡覺與獎盃並非每日例行。'
    }
  ]
};
