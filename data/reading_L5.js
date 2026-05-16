/* ============================================================
   reading_L5.js — 模式 8 閱讀理解題庫
   - 7 篇閱讀 × 共 24 題
   - type:
       'cloze'    克漏字（passage 內 {{1}} {{2}} 標出空格，每個空格對一題）
       'passage'  短文閱讀
       'dialogue' 對話閱讀
       'chart'    圖表閱讀（passage = { headers, rows }）
       'table'    表格閱讀（passage = { rows: [{label, value}] }）
   - questions: 該篇下屬選擇題（4 選 1）
   ============================================================ */

window.READING_L5 = [
  // ───── R1：克漏字（評量本 p.102 一、克漏字選擇）─────
  {
    id: 'R1-cloze',
    source: '評量本 p.102 克漏字',
    type: 'cloze',
    title: 'Jack & Tina：起司蛋糕',
    passage:
`Jack: How {{1}} does your father eat in the restaurant?
Tina: Not very often. About four {{2}} a month. How about you?
Jack: I {{3}} eat in the restaurant. I don't like going out. I {{4}} eat at home.
Tina: {{5}}, what are you eating?
Jack: A cheesecake. My mother made a cheesecake for my breakfast.
Tina: Wow! Does your mom always make desserts for you?
Jack: Yes, {{6}}. It's easy for her.`,
    vocab: 'breakfast 早餐；dessert 甜點',
    questions: [
      { id: 'R1-1', prompt: '空格 1：選最適合的字', choices: ['many', 'much', 'often', 'long'], answer: 2,
        explanation: 'How often = 多久一次，答頻率時用 often。' },
      { id: 'R1-2', prompt: '空格 2：選最適合的字', choices: ['times', 'shops', 'floors', 'holes'], answer: 0,
        explanation: '「次數 + a + 時間單位」→ four times a month。' },
      { id: 'R1-3', prompt: '空格 3：選最適合的字', choices: ['often', 'always', 'twice', 'seldom'], answer: 3,
        explanation: 'Jack 說自己不喜歡外出，所以「很少」在餐廳吃 → seldom。' },
      { id: 'R1-4', prompt: '空格 4：選最適合的字', choices: ['never', 'usually', 'once', 'seldom'], answer: 1,
        explanation: '對比 seldom eat in the restaurant → 通常 usually 在家吃。' },
      { id: 'R1-5', prompt: '空格 5：選最適合的字', choices: ['Over there', 'Of course', 'By the way', 'Once a week'], answer: 2,
        explanation: 'By the way = 順便一提（轉換話題用語）。' },
      { id: 'R1-6', prompt: '空格 6：選最適合的字', choices: ['she always does', 'she does always', 'she always is', 'she is always'], answer: 0,
        explanation: '一般動詞 make → 簡答用 does；副詞 always 放 does 前 → she always does。' }
    ]
  },

  // ───── R2：圖表閱讀（評量本 p.102-103 Bob 週運動表）─────
  {
    id: 'R2-chart-bob',
    source: '評量本 p.102-103 圖表閱讀',
    type: 'chart',
    title: "Bob's Weekly Activities",
    passage: {
      headers: ['', 'Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'],
      rows: [
        { label: 'swim',                   cells: ['✓', '✓', '',  '',  '',  '',  '✓'] },
        { label: 'jump rope',              cells: ['',  '',  '',  '',  '',  '',  ''  ] },
        { label: 'play basketball',        cells: ['',  '',  '',  '✓', '',  '',  ''  ] },
        { label: 'watch TV',               cells: ['✓', '✓', '',  '',  '',  '✓', ''  ] },
        { label: 'go to the night market', cells: ['✓', '✓', '✓', '✓', '✓', '✓', '✓'] }
      ]
    },
    vocab: '',
    questions: [
      { id: 'R2-1', prompt: 'How often does Bob watch TV?',
        choices: ['Every day.', 'Five days a week.', 'Never.', 'Sometimes.'], answer: 3,
        explanation: 'Bob 在週日、週一、週五看電視（3 天）→ 不到每天但偶爾，sometimes 最合適。' },
      { id: 'R2-2', prompt: "What doesn't Bob do on the weekend?",
        choices: ['Swim.', 'Play basketball.', 'Jump rope.', 'Watch TV.'], answer: 2,
        explanation: 'jump rope 整週都沒有打勾 → Bob 從不跳繩，週末也不做。' },
      { id: 'R2-3', prompt: 'What does Bob do once a week?',
        choices: ['Play basketball.', 'Swim.', 'Jump rope.', 'Watch TV.'], answer: 0,
        explanation: 'play basketball 只有週三 1 個勾 → 一週一次。' }
    ]
  },

  // ───── R3：對話閱讀（評量本 p.103 Tony/Nora 跑步）─────
  {
    id: 'R3-dialog-nora',
    source: '評量本 p.103 短文閱讀',
    type: 'dialogue',
    title: 'Tony & Nora：晨跑',
    passage:
`Tony: What are you doing?
Nora: I'm running. I run every morning and every evening. And I run for an hour each time.
Tony: Do you have time to study?
Nora: Yes, I do. I do my homework at school. I study after I eat dinner.
Tony: Why do you run so hard? Do you want to join a race?
Nora: No, I just love to exercise. Running helps me to study better.
Tony: Oh, I see. Can I run with you in the morning?
Nora: Sure. But you must get up early, or you may be late for school.`,
    vocab: 'dinner 晚餐；want 想要；race 賽跑；exercise 運動；better 更好地；must 必須',
    questions: [
      { id: 'R3-1', prompt: 'How many times a day does Nora run?',
        choices: ['Once.', 'Never.', 'Seldom.', 'Twice.'], answer: 3,
        explanation: '每天早上、傍晚各跑一次 → 一天兩次 twice。' },
      { id: 'R3-2', prompt: 'What might Tony and Nora do in the morning? (依文意推測)',
        choices: ['一起讀書', '一起跑步', '一起聊天', '一起上學'], answer: 1,
        explanation: 'Tony 問可以跟妳一起晨跑嗎，Nora 答 Sure → 早上一起跑步。' },
      { id: 'R3-3', prompt: 'Which is true?',
        choices: ["Nora doesn't have time to study.", 'Nora only runs in the morning.', "Running is good for Nora's study.", "Nora doesn't do her homework every day."], answer: 2,
        explanation: 'Nora 說 "Running helps me to study better"（跑步幫助讀書更好）。' }
    ]
  },

  // ───── R4：對話閱讀（評量本 p.104 Ben/Jack/Vicky/Eric 四人對話）─────
  {
    id: 'R4-dialog-jack',
    source: '評量本 p.104 對話閱讀題',
    type: 'dialogue',
    title: 'Ben, Jack, Vicky & Eric：運動聊天',
    passage:
`Ben: Do you like sports?
Jack: Yes. I enjoy sports very much.
Vicky: What sport do you like?
Jack: I like all. For example, I like to swim in the swimming pool. When it is rainy, I like to jump rope in the house.
Vicky: Wow! You do a lot of sports. How often do you go to the gym?
Jack: I like sports, but I seldom do it in the gym. I always do it in the park.
Eric: Can you play basketball?
Jack: Sure. It's my favorite.
Eric: We have a basketball game in two weeks, but we need one more player. We want to win the game.
Jack: No problem. I always help my class win the game.
Eric: Great!`,
    vocab: 'enjoy 享受；all 全部；when 當；one more 再一位；player 球員',
    questions: [
      { id: 'R4-1', prompt: 'How often does Jack play sports in the gym?',
        choices: ['Seldom.', 'Often.', 'Sometimes.', 'Never.'], answer: 0,
        explanation: 'Jack 說 "I seldom do it in the gym"（我很少在健身房運動）。' },
      { id: 'R4-2', prompt: 'Which is NOT true?',
        choices: ["Jack's favorite sport is jogging.", 'Jack seldom plays sports in the gym.', 'Jack enjoys sports.', 'Jack always helps his class win the game.'], answer: 0,
        explanation: 'Jack 說最喜歡的運動是 basketball（籃球），不是 jogging。' },
      { id: 'R4-3', prompt: 'What might Jack and Eric do in two weeks?',
        choices: ['打籃球比賽', '游泳比賽', '跳繩比賽', '在公園聊天'], answer: 0,
        explanation: 'Eric 說 "We have a basketball game in two weeks" → 兩週後有籃球比賽。' },
      { id: 'R4-4', prompt: "In the dialogue, which sport isn't talked about?",
        choices: ['Jump rope.', 'Baseball.', 'Basketball.', 'Swimming.'], answer: 1,
        explanation: '對話中提到 swim/jump rope/basketball，但沒提到 baseball。' }
    ]
  },

  // ───── R5：圖表閱讀（學測本 p.73 Summer Camp）─────
  {
    id: 'R5-chart-camp',
    source: '學測本 p.73 題組 B',
    type: 'chart',
    title: "Summer Camp — You don't want to miss it!",
    passage: {
      headers: ['', 'Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'],
      rows: [
        { label: '活動', cells: ['🪢 跳繩', '🏀 籃球', '🏊 游泳', '⚾ 棒球', '🏃 跑步', '🏀 籃球', '🏊 游泳'] }
      ]
    },
    vocab: 'camp 露營；want 想要；miss 錯過',
    questions: [
      { id: 'R5-1', prompt: "What's the summer camp about?",
        choices: ['Food.', 'Art.', 'Animals.', 'Sports.'], answer: 3,
        explanation: '所有活動都是運動類（跳繩、籃球、游泳、棒球、跑步）→ Sports。' },
      { id: 'R5-2', prompt: 'What do students do on Tuesday?',
        choices: ['They play basketball.', 'They swim.', 'They run.', 'They jump rope.'], answer: 1,
        explanation: '圖表上週二是「游泳」→ They swim。' },
      { id: 'R5-3', prompt: 'How often do students play basketball?',
        choices: ['Once a week.', 'Twice a week.', 'Every two days.', 'Every day.'], answer: 1,
        explanation: '週一與週五打籃球 → 一週兩次 twice a week。' }
    ]
  },

  // ───── R6：短文閱讀（學測本 p.74 Tom & Tim 雙胞胎）─────
  {
    id: 'R6-passage-twin',
    source: '學測本 p.74 題組 C',
    type: 'passage',
    title: 'Tom & Tim：性格相反的雙胞胎',
    passage:
`Tom and Tim are twin brothers, but they are very different.

Tom is very lazy. He never does his homework. He watches TV late every night and goes to bed at 1 a.m. Therefore, he is usually late for school.

But his twin brother, Tim, isn't. Tim always gets up early in the morning, so he never goes to school late. He also finishes his homework on time every day.

Tom doesn't like sports. He likes music. JJ Lin is his favorite singer. Tim plays basketball after school on Mondays, Wednesdays, and Fridays. LeBron James is his idol.`,
    vocab: 'twin 雙胞胎；lazy 懶惰的；therefore 因此；finish 完成；singer 歌手；idol 偶像',
    questions: [
      { id: 'R6-1', prompt: "It's 11:30 p.m. What may Tom do now?",
        choices: ['唱歌', '打籃球', '看電視', '寫作業'], answer: 2,
        explanation: '文章說 Tom 每天晚上看電視到很晚 → 11:30 p.m. 最可能在看電視。' },
      { id: 'R6-2', prompt: 'How often does Tim play basketball?',
        choices: ['He plays basketball once a week.', 'He plays basketball twice a week.', 'He plays basketball three times a week.', 'He plays basketball four times a week.'], answer: 2,
        explanation: 'Tim 在 Monday/Wednesday/Friday 打籃球 → 一週三次。' },
      { id: 'R6-3', prompt: 'Which is true?',
        choices: ['Tom likes LeBron James very much.', 'Tim is usually late for school.', 'Tom does his homework at night.', 'Tom goes to bed late.'], answer: 3,
        explanation: 'Tom 凌晨 1 點才睡 → goes to bed late 正確；其他選項都與文意相反。' }
    ]
  },

  // ───── R7：表格閱讀（學測本 p.75 Jimmy Chen 健康檢查）─────
  {
    id: 'R7-table-jimmy',
    source: '學測本 p.75 題組 D',
    type: 'table',
    title: "Let's Stay Healthy! — AMC Health Center",
    passage: {
      rows: [
        { label: 'Date of Checkup', value: 'June 1, 2020' },
        { label: 'Name',            value: 'Jimmy Chen' },
        { label: 'Date of Birth',   value: 'October 23, 1993' },
        { label: 'Height',          value: '178 cm' },
        { label: 'Weight',          value: '90 kg' },
        { label: 'BMI',             value: '28.4' },
        { label: 'Q: What do you usually eat?',          value: 'Hot dogs, chicken, noodles, and cake.' },
        { label: 'Q: What do you do on weekends?',        value: 'Play computer games, sleep, and watch TV.' },
        { label: 'Q: How often do you play sports?',      value: 'Twice a month.' }
      ]
    },
    vocab: 'stay 保持；checkup 體檢；birth 出生；height 身高；weight 體重；according to 根據',
    questions: [
      { id: 'R7-1', prompt: 'What can we NOT know from the reading?',
        choices: ['How tall is Jimmy?', 'How old is Jimmy?', 'Where does Jimmy live?', 'What does Jimmy usually eat?'], answer: 2,
        explanation: '表格沒提到居住地，所以無法得知 Where Jimmy lives。其他都有：身高 178 / 1993 年生 / 飲食。' },
      { id: 'R7-2', prompt: 'According to the reading, what can we say about Jimmy?',
        choices: ['Jimmy never eats meat.', 'Jimmy usually plays sports a lot.', 'Jimmy is short.', 'Jimmy may be at home on weekends.'], answer: 3,
        explanation: '週末活動「打電腦遊戲、睡覺、看電視」都是在家做的事 → Jimmy 週末可能在家。其他選項都與表格資料相反。' }
    ]
  }
];
