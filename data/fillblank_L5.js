/* ============================================================
   fillblank_L5.js — 模式 3 Look and Write 填空 題庫
   - 8 題示範（對應課本 p.95-96 Look and Write）
   - template 用 ___ (三條底線) 標記每個空格
   - answers 陣列依空格由左到右順序
   - 對 OCR 提示：此資料之後會被課本掃描結果覆蓋
   ============================================================ */

window.FILLBLANK_L5 = [
  {
    id: 'F001',
    source: '課本 p.95 Look and Write 1（示範）',
    hint: 'never / easy',
    template: "Emma's homework ___ ___ easy.",
    answers: ['is', 'never'],
    explanation: 'be 動詞 (is) 後面放頻率副詞 never。',
    en_full: "Emma's homework is never easy.",
    zh: 'Emma 的作業從來都不簡單。'
  },
  {
    id: 'F002',
    source: '課本 p.95 Look and Write 2（示範）',
    hint: 'sometimes / late',
    template: 'My brothers ___ ___ late for school.',
    answers: ['are', 'sometimes'],
    explanation: '主詞 brothers 為複數，be 動詞用 are；sometimes 放 are 後面。',
    en_full: 'My brothers are sometimes late for school.',
    zh: '我哥哥們有時候上學會遲到。'
  },
  {
    id: 'F003',
    source: '課本 p.95 Look and Write 3（示範）',
    hint: 'seldom / clean',
    template: 'My bedroom ___ ___ clean.',
    answers: ['is', 'seldom'],
    explanation: '主詞 bedroom 為單數，be 動詞用 is；seldom 放 is 後面。',
    en_full: 'My bedroom is seldom clean.',
    zh: '我的房間很少是乾淨的。'
  },
  {
    id: 'F004',
    source: '課本 p.95 Look and Write 4（示範）',
    hint: 'usually / delicious',
    template: 'The school lunch ___ ___ delicious.',
    answers: ['is', 'usually'],
    explanation: 'be 動詞 (is) 後面放頻率副詞 usually。',
    en_full: 'The school lunch is usually delicious.',
    zh: '學校的午餐通常很好吃。'
  },
  {
    id: 'F005',
    source: '課本 p.95 Look and Write 5（示範）',
    hint: 'always / angry',
    template: 'Jeff ___ ___ angry.',
    answers: ['is', 'always'],
    explanation: 'be 動詞 (is) 後面放頻率副詞 always。',
    en_full: 'Jeff is always angry.',
    zh: 'Jeff 總是很生氣。'
  },
  {
    id: 'F006',
    source: '課本 p.96 Look and Write 1（示範．一般動詞）',
    hint: 'seldom / play with her cat',
    template: 'Helen ___ ___ with her cat.',
    answers: ['seldom', 'plays'],
    explanation: '一般動詞 play 前面放副詞 seldom；Helen 為三單，動詞加 -s → plays。',
    en_full: 'Helen seldom plays with her cat.',
    zh: 'Helen 很少跟她的貓玩。'
  },
  {
    id: 'F007',
    source: '課本 p.96 Look and Write 2（示範．一般動詞）',
    hint: 'often / sleep on the school bus',
    template: 'They ___ ___ on the school bus.',
    answers: ['often', 'sleep'],
    explanation: '一般動詞 sleep 前面放副詞 often；主詞 They 為複數，動詞原形。',
    en_full: 'They often sleep on the school bus.',
    zh: '他們常常在校車上睡覺。'
  },
  {
    id: 'F008',
    source: '課本 p.96 Look and Write 3（示範．一般動詞）',
    hint: 'sometimes / jump rope in the morning',
    template: 'Peter ___ ___ ___ in the morning.',
    answers: ['sometimes', 'jumps', 'rope'],
    explanation: 'Peter 為三單，動詞 jump 加 -s → jumps；sometimes 放動詞前。',
    en_full: 'Peter sometimes jumps rope in the morning.',
    zh: 'Peter 有時候會在早上跳繩。'
  },

  // ───── 評量本 p.99 文意字彙 1-5（OCR 自練習題照片）─────
  {
    id: 'F009',
    source: '評量本 p.99 文意字彙 1',
    hint: '首字母 s、末字母 m（共 6 字母）',
    template: "Peter ___ plays basketball. He's not good at sports.",
    answers: ['seldom'],
    explanation: '「不擅長運動」→ 推測「很少」打籃球 → seldom（s___m）。',
    en_full: "Peter seldom plays basketball. He's not good at sports.",
    zh: 'Peter 很少打籃球，他不擅長運動。'
  },
  {
    id: 'F010',
    source: '評量本 p.99 文意字彙 2',
    hint: '首字母 n、末字母 r（共 5 字母）',
    template: 'John is ___ late for school. He goes to school early every day.',
    answers: ['never'],
    explanation: 'John 每天早早上學 → 「從不」遲到 → never（n___r）。',
    en_full: 'John is never late for school. He goes to school early every day.',
    zh: 'John 從不上學遲到，他每天都很早上學。'
  },
  {
    id: 'F011',
    source: '評量本 p.99 文意字彙 3',
    hint: '首字母 t、末字母 n（共 5 字母）',
    template: 'Those athletes must ___ five to six hours a day. They work hard.',
    answers: ['train'],
    explanation: '運動員每天「訓練」5-6 小時 → train（t___n）。',
    en_full: 'Those athletes must train five to six hours a day. They work hard.',
    zh: '那些運動員每天必須訓練五到六小時，他們很努力。'
  },
  {
    id: 'F012',
    source: '評量本 p.99 文意字彙 4',
    hint: '首字母 c、末字母 s（共 5 字母）；動詞要加 -s（三單）',
    template: 'Linda studies hard every day. She ___ about her grades.',
    answers: ['cares'],
    explanation: 'Linda 三單，動詞要加 -s → cares（c___es）；care about = 在乎、關心。',
    en_full: 'Linda studies hard every day. She cares about her grades.',
    zh: 'Linda 每天努力讀書，她很在乎自己的成績。'
  },
  {
    id: 'F013',
    source: '評量本 p.99 文意字彙 5',
    hint: '首字母 e、末字母 y（共 5 字母）',
    template: "It's not easy for me to get up ___. But those athletes have to do it every day.",
    answers: ['early'],
    explanation: 'get up early = 早起；對我來說早起不容易，但運動員每天都要這樣做。',
    en_full: "It's not easy for me to get up early. But those athletes have to do it every day.",
    zh: '對我來說早起不容易，但那些運動員每天都必須這樣做。'
  },

  // ───── 評量本 p.101 五、對話填空（Tony/Nora 圖書館）─────
  {
    id: 'F014',
    source: '評量本 p.101 對話填空 1',
    hint: 'How ___ 問頻率',
    template: 'Tony: How ___ do you go to the library?',
    answers: ['often'],
    explanation: '「How often...?」是問頻率的固定句型。',
    en_full: 'How often do you go to the library?',
    zh: 'Tony：你多久去一次圖書館？'
  },
  {
    id: 'F015',
    source: '評量本 p.101 對話填空 2',
    hint: '一週兩天（Friday + Saturday）= ___ a week',
    template: 'Nora: ___ a week. I go there every Friday and Saturday.',
    answers: ['Twice'],
    explanation: '「兩次」用 twice；twice a week = 一週兩次。',
    en_full: 'Twice a week.',
    zh: '一週兩次，我每週五和週六會去。'
  },
  {
    id: 'F016',
    source: '評量本 p.101 對話填空 3',
    hint: '走路去，所以「從不」騎腳踏車',
    template: 'Tony: Do you always go there by bike? Nora: No, I ___ do. My house is in front of the library, so I walk there.',
    answers: ['never'],
    explanation: '對比 always → 否定簡答用 never；「房子就在圖書館前面，所以走路」表示從不騎車。',
    en_full: 'No, I never do.',
    zh: '不，我從來不騎車去；我家就在圖書館前面，所以我走路。'
  },

  // ───── 學測本 p.68 文意字彙 1-10 ─────
  {
    id: 'F017',
    source: '學測本 p.68 文意字彙 1',
    hint: '首字母 a、末字母 r（共 7 字母）',
    template: 'The beef noodles are very yummy. Can I have ___ bowl?',
    answers: ['another'],
    explanation: '「再來一碗」= have another bowl；another（另一個的）。',
    en_full: 'Can I have another bowl?',
    zh: '牛肉麵很好吃，我可以再來一碗嗎？'
  },
  {
    id: 'F018',
    source: '學測本 p.68 文意字彙 2',
    hint: '首字母 s、末字母 ming（共 8 字母）',
    template: 'Look! The two geese are ___ in the pool.',
    answers: ['swimming'],
    explanation: '進行式 are + Ving；swim → swimming（雙寫 m）。',
    en_full: 'Look! The two geese are swimming in the pool.',
    zh: '看！那兩隻鵝正在池中游泳。'
  },
  {
    id: 'F019',
    source: '學測本 p.68 文意字彙 3',
    hint: '首字母 s、末字母 ts（共 6 字母，複數）',
    template: 'The students often play ___ after school.',
    answers: ['sports'],
    explanation: 'play sports = 做運動；sport 複數加 s。',
    en_full: 'The students often play sports after school.',
    zh: '學生們放學後經常運動。'
  },
  {
    id: 'F020',
    source: '學測本 p.68 文意字彙 4',
    hint: '首字母 c、末字母 es（三單動詞變化）',
    template: 'Alice ___ about her health very much. She always has fruit and vegetables and jogs every day.',
    answers: ['cares'],
    explanation: 'care about = 在乎、關心；Alice 三單 → cares。',
    en_full: 'Alice cares about her health very much.',
    zh: 'Alice 非常在乎自己的健康，她總是吃水果蔬菜並每天慢跑。'
  },
  {
    id: 'F021',
    source: '學測本 p.68 文意字彙 5',
    hint: '首字母 h、末字母 k（共 8 字母）',
    template: 'Jenny: Does your teacher give you a lot of ___ every day? Hank: Yes.',
    answers: ['homework'],
    explanation: 'homework（作業）是不可數名詞，搭 a lot of。',
    en_full: 'Does your teacher give you a lot of homework every day?',
    zh: 'Jenny：你老師每天給你很多作業嗎？ Hank：對。'
  },
  {
    id: 'F022',
    source: '學測本 p.68 文意字彙 6',
    hint: '首字母 e、末字母 y（共 5 字母）',
    template: 'My parents get up ___ every morning, and then they jog in the park.',
    answers: ['early'],
    explanation: 'get up early = 早起；early 形容詞作補語。',
    en_full: 'My parents get up early every morning.',
    zh: '我爸媽每天早上都早起，然後到公園慢跑。'
  },
  {
    id: 'F023',
    source: '學測本 p.68 文意字彙 7',
    hint: '首字母 r、末字母 r（共 8 字母）',
    template: 'The ___ is talking about the weather on TV.',
    answers: ['reporter'],
    explanation: '在電視上談天氣的人 → reporter（記者／播報員）。',
    en_full: 'The reporter is talking about the weather on TV.',
    zh: '那位記者正在電視上播報天氣。'
  },
  {
    id: 'F024',
    source: '學測本 p.68 文意字彙 8',
    hint: '首字母 w、末字母 t（共 4 字母）',
    template: "Don't walk so fast. Please ___ for me.",
    answers: ['wait'],
    explanation: 'wait for me = 等等我；wait（等待）。',
    en_full: "Don't walk so fast. Please wait for me.",
    zh: '不要走那麼快，請等我一下。',
    note: 'wait 非 L5 重點字，可能為延伸詞彙。'
  },
  {
    id: 'F025',
    source: '學測本 p.68 文意字彙 9',
    hint: '首字母 s、末字母 m（共 6 字母）',
    template: 'Alice ___ makes dinner for her family. She does it twice a year.',
    answers: ['seldom'],
    explanation: '一年只做兩次晚餐 → 很少 → seldom。',
    en_full: 'Alice seldom makes dinner for her family. She does it twice a year.',
    zh: 'Alice 很少為家人做晚餐，她一年只做兩次。'
  },
  {
    id: 'F026',
    source: '學測本 p.68 文意字彙 10',
    hint: '首字母 l、末字母 e（共 4 字母）',
    template: "Everyone can only live once in a ___. Don't waste time. Let's have fun.",
    answers: ['life'],
    explanation: 'once in a life = 一生只有一次；勸不要浪費時間。',
    en_full: "Everyone can only live once in a life. Don't waste time. Let's have fun.",
    zh: '每個人一生只能活一次，別浪費時間，讓我們盡情享受吧。'
  },

  // ───── 學測本 p.69 翻譯填空 1-2 ─────
  {
    id: 'F027',
    source: '學測本 p.69 翻譯填空 1',
    hint: '記者(reporter) / 總是(always) / 早(early)',
    template: 'The ___ ___ gets up ___ every day.',
    answers: ['reporter', 'always', 'early'],
    explanation: '那位記者 = The reporter；總是 always 放動詞前；早起 = get up early。',
    en_full: 'The reporter always gets up early every day.',
    zh: '那位記者每天總是早起。'
  },
  {
    id: 'F028',
    source: '學測本 p.69 翻譯填空 2',
    hint: 'sometimes(有時候) / ask(問) / questions(問題複數) / never(從不)',
    template: 'Julia: Do you ___ ___ any ___ in class? Benson: No, ___.',
    answers: ['sometimes', 'ask', 'questions', 'never'],
    explanation: '有時候 sometimes 放主動詞前；ask + 受詞 questions；從來沒有 = never。',
    en_full: 'Julia: Do you sometimes ask any questions in class? Benson: No, never.',
    zh: 'Julia：你有時候會在課堂上問任何問題嗎？ Benson：不，從來沒有。'
  }
];
