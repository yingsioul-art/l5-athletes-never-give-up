/* ============================================================
   vocab_quiz_L5.js — 模式 6 字彙/語法選擇題庫
   - 4 選 1 題型
   - answer: 0-based index 指向 choices 陣列中的正解
   - source: 來源頁碼供回查
   - explanation: 給學生看的「為什麼」
   - en_full: 完整正確句（用於朗讀；可選）
   ============================================================ */

window.VOCAB_QUIZ_L5 = [
  // ───── 評量本 p.98 文法選擇 1-4 ─────
  {
    id: 'V001',
    source: '評量本 p.98 文法選擇 1',
    prompt: 'Sara ___ early, and I do, too.',
    choices: ['usually goes to school', 'usually go to school', 'go to school usually', 'goes to school usually'],
    answer: 0,
    explanation: '主詞 Sara 是三單，動詞 go 要加 -es；頻率副詞 usually 放在一般動詞前。',
    en_full: 'Sara usually goes to school early, and I do, too.',
    zh: 'Sara 通常很早上學，我也是。'
  },
  {
    id: 'V002',
    source: '評量本 p.98 文法選擇 2',
    prompt: 'Bob and Lisa ___ happy when (當) they have no tests.',
    choices: ['always', 'are always', "don't always", 'always are'],
    answer: 1,
    explanation: '主詞 Bob and Lisa 為複數，be 動詞用 are；頻率副詞 always 放在 be 動詞「後面」→ are always。',
    en_full: 'Bob and Lisa are always happy when they have no tests.',
    zh: '當沒有考試時，Bob 和 Lisa 總是很開心。'
  },
  {
    id: 'V003',
    source: '評量本 p.98 文法選擇 3',
    prompt: 'John: How often do you go to the bookstore? Andy: ___',
    choices: [
      'I often go to the bookstore with my classmates.',
      'We are on the way to the bookstore.',
      'I go to the bookstore once a week.',
      "I don't like the bookstore."
    ],
    answer: 2,
    explanation: '「How often...?」問頻率，要用 once / twice / X times a week 之類的次數回答。',
    en_full: 'I go to the bookstore once a week.',
    zh: '我一週去一次書店。'
  },
  {
    id: 'V004',
    source: '評量本 p.98 文法選擇 4',
    prompt: 'Alice: How often do you wash your hair? Betty: ___',
    choices: ['One day.', 'Twice a week.', "At five o'clock.", 'Three days.'],
    answer: 1,
    explanation: '「How often...?」問頻率，要用次數＋時間單位（twice a week = 一週兩次）。',
    en_full: 'Twice a week.',
    zh: '一週兩次。'
  },

  // ───── 評量本 p.99 字彙選擇 1-6 ─────
  {
    id: 'V005',
    source: '評量本 p.99 字彙選擇 1',
    prompt: 'Lisa likes movies very much. She ___ goes to see a movie on the weekend.',
    choices: ['never', 'seldom', 'always', 'really'],
    answer: 2,
    explanation: 'Lisa「非常喜歡電影」→ 週末「總是」去看；「really」是「真的」非頻率副詞。',
    en_full: 'Lisa likes movies very much. She always goes to see a movie on the weekend.',
    zh: 'Lisa 非常喜歡電影，她週末總是去看電影。'
  },
  {
    id: 'V006',
    source: '評量本 p.99 字彙選擇 2',
    prompt: 'Judy always takes a bus to school. She ___ walks to school.',
    choices: ['often', 'sometimes', 'never', 'usually'],
    answer: 2,
    explanation: '「always 搭巴士」對比「從不走路上學」→ never；其他副詞會矛盾。',
    en_full: 'Judy always takes a bus to school. She never walks to school.',
    zh: 'Judy 總是搭巴士上學，她從不走路上學。'
  },
  {
    id: 'V007',
    source: '評量本 p.99 字彙選擇 3',
    prompt: "Amy gets hurt, but she doesn't ___. She still trains and practices hard.",
    choices: ['rock', 'stop', 'notice', 'jump'],
    answer: 1,
    explanation: '受傷但「不停止」、繼續訓練 → stop (停止)。',
    en_full: "Amy gets hurt, but she doesn't stop. She still trains and practices hard.",
    zh: 'Amy 受傷了，但她不停止，仍然努力訓練和練習。'
  },
  {
    id: 'V008',
    source: '評量本 p.99 字彙選擇 4',
    prompt: 'Kevin: Can I ___ you a question? Mary: Sure. What\'s that?',
    choices: ['rock', 'notice', 'stop', 'ask'],
    answer: 3,
    explanation: '「問問題」用 ask；ask sb. a question 是常見搭配。',
    en_full: 'Can I ask you a question?',
    zh: '我可以問你一個問題嗎？'
  },
  {
    id: 'V009',
    source: '評量本 p.99 字彙選擇 5',
    prompt: 'Tony often walks to school, but he ___ takes the bus to school.',
    choices: ['sometimes', 'often', 'never', 'seldom'],
    answer: 0,
    explanation: 'Tony 經常走路，但「有時候」搭巴士；often 對比 sometimes 最通順（often 對 never 太絕對）。',
    en_full: 'Tony often walks to school, but he sometimes takes the bus to school.',
    zh: 'Tony 經常走路上學，但他有時候搭巴士上學。'
  },
  {
    id: 'V010',
    source: '評量本 p.99 字彙選擇 6',
    prompt: "Allen: George looks strong. Doris: Yes, he's a superman (超人)! He ___ goes to the doctor.",
    choices: ['each', 'even', 'often', 'seldom'],
    answer: 3,
    explanation: '超人很強壯 → 「很少」看醫生 (seldom)；often 反義。',
    en_full: "He's a superman! He seldom goes to the doctor.",
    zh: '他是超人！他很少去看醫生。'
  },

  // ───── 評量本 p.99 文法選擇 1-3 ─────
  {
    id: 'V011',
    source: '評量本 p.99 文法選擇 1',
    prompt: 'Emily and Sally ___ busy.',
    choices: ['always are', "don't always", 'always', 'are always'],
    answer: 3,
    explanation: '主詞為複數用 are；頻率副詞 always 放在 be 動詞「後面」→ are always。',
    en_full: 'Emily and Sally are always busy.',
    zh: 'Emily 和 Sally 總是很忙。'
  },
  {
    id: 'V012',
    source: '評量本 p.99 文法選擇 2',
    prompt: 'Joe: Is Steve late for his math class? Bill: No, ___.',
    choices: ['never', 'he never', 'he never does', 'he is never'],
    answer: 3,
    explanation: '原問句用 be 動詞 Is，簡答也要 be → 主詞 + be + 副詞 → he is never。',
    en_full: 'No, he is never (late for his math class).',
    zh: '不，他從不（數學課遲到）。'
  },
  {
    id: 'V013',
    source: '評量本 p.99 文法選擇 3',
    prompt: 'Tom always eats dinner at home, but Betty and Coco ___.',
    choices: ["doesn't always", 'never do', "always doesn't", 'does always'],
    answer: 1,
    explanation: '主詞 Betty and Coco 為複數 → 助動詞用 do；副詞 never 放在 do 前 → never do。',
    en_full: 'Tom always eats dinner at home, but Betty and Coco never do.',
    zh: 'Tom 總是在家吃晚餐，但 Betty 和 Coco 從來不(在家吃)。'
  },

  // ───── 評量本 p.100 文法選擇 4-13 ─────
  {
    id: 'V014',
    source: '評量本 p.100 文法選擇 4',
    prompt: 'Ben: ___ do you watch baseball games on TV? Eric: Once a week.',
    choices: ['How old', 'How long', 'How often', 'How tall'],
    answer: 2,
    explanation: '答句是「Once a week」表頻率 → 問句要用 How often。',
    en_full: 'How often do you watch baseball games on TV?',
    zh: '你多久看一次電視棒球比賽？'
  },
  {
    id: 'V015',
    source: '評量本 p.100 文法選擇 5',
    prompt: 'Amy: Is your father sometimes late for work? Lisa: Yes, ___.',
    choices: ['he sometimes is', 'he sometimes does', 'he does sometimes', 'he is sometimes'],
    answer: 3,
    explanation: '原問句用 be 動詞 Is → 簡答用 be；主詞 + be + 頻率副詞 → he is sometimes。',
    en_full: 'Yes, he is sometimes.',
    zh: '對，他有時候是（會遲到）。'
  },
  {
    id: 'V016',
    source: '評量本 p.100 文法選擇 6',
    prompt: 'Allen: ___ have you read (已經讀了) the book? Ella: Twice.',
    choices: ['How often', 'How much', 'How long', 'How many times'],
    answer: 3,
    explanation: '答 Twice（兩次）= 次數 → 問句用 How many times；How often 通常配 a week / a day 等回答。',
    en_full: 'How many times have you read the book?',
    zh: '你看過這本書幾次了？'
  },
  {
    id: 'V017',
    source: '評量本 p.100 文法選擇 7',
    prompt: 'John: Are you often at home on weekends? Mary: Yes, ___.',
    choices: ['I am often', 'I often am', 'I often do', 'I do often'],
    answer: 0,
    explanation: '原問句用 be 動詞 Are → 簡答用 am；主詞 + be + 副詞 → I am often。',
    en_full: 'Yes, I am often.',
    zh: '對，我週末經常在家。'
  },
  {
    id: 'V018',
    source: '評量本 p.100 文法選擇 8',
    prompt: '___ basketball after school?',
    choices: ['Does he often play', 'Is he often play', 'Does often he play', 'Does he play often'],
    answer: 0,
    explanation: '一般動詞句型：Does + 主詞 + 頻率副詞 + 原形動詞 → Does he often play。',
    en_full: 'Does he often play basketball after school?',
    zh: '他放學後經常打籃球嗎？'
  },
  {
    id: 'V019',
    source: '評量本 p.100 文法選擇 9',
    prompt: '___ do your homework before you go to bed, Tom.',
    choices: ['Sometimes', 'Always', 'Seldom', 'Very often'],
    answer: 1,
    explanation: '祈使句勸告語氣：「總是(在睡前)做作業」最合理 → Always；其他副詞語意不通。',
    en_full: 'Always do your homework before you go to bed, Tom.',
    zh: 'Tom，在你睡覺前要總是做完作業。'
  },
  {
    id: 'V020',
    source: '評量本 p.100 文法選擇 10',
    prompt: 'Judy: Does your father get up early every day? Paul: Yes, he ___ does.',
    choices: ['always', 'never', 'once', 'seldom'],
    answer: 0,
    explanation: '每天早起 = always；其他副詞與 Yes 矛盾。',
    en_full: 'Yes, he always does.',
    zh: '對，他每天總是早起。'
  },
  {
    id: 'V021',
    source: '評量本 p.100 文法選擇 11',
    prompt: 'Mr. Wang ___ busy on Saturday morning.',
    choices: ['does sometimes', 'sometimes does', 'is sometimes', 'sometimes is'],
    answer: 2,
    explanation: 'busy 是形容詞 → 動詞用 be 動詞 is；副詞放 be 動詞後 → is sometimes。',
    en_full: 'Mr. Wang is sometimes busy on Saturday morning.',
    zh: '王先生週六早上有時候會忙。'
  },
  {
    id: 'V022',
    source: '評量本 p.100 文法選擇 12',
    prompt: 'Lisa never goes to school late, but Bill ___.',
    choices: ['usually does', 'does usually', 'usually is', 'is usually'],
    answer: 0,
    explanation: '前半 goes 是一般動詞，Bill 後也要用 does 對比；副詞放 does 前 → usually does。',
    en_full: 'Lisa never goes to school late, but Bill usually does.',
    zh: 'Lisa 從不上學遲到，但 Bill 通常會遲到。'
  },
  {
    id: 'V023',
    source: '評量本 p.100 文法選擇 13',
    prompt: 'Mary: How often does the bus run? Helen: ___',
    choices: ['In thirty minutes.', 'At 10:00 in the morning.', 'Forty minutes early.', 'Every thirty minutes.'],
    answer: 3,
    explanation: '「How often...?」答頻率 → Every thirty minutes（每三十分鐘一班）。',
    en_full: 'Every thirty minutes.',
    zh: '每三十分鐘一班。'
  },

  // ───── 學測本 p.68 語法選擇 1-5 ─────
  {
    id: 'V024',
    source: '學測本 p.68 語法選擇 1',
    prompt: 'Zoe: ___ does your brother use the smartphone? Tina: He uses it every day.',
    choices: ['What day', 'What date', 'How often', 'How old'],
    answer: 2,
    explanation: '答句「every day」是頻率 → 問句要用 How often。',
    en_full: 'How often does your brother use the smartphone?',
    zh: '你弟弟多久用一次智慧型手機？'
  },
  {
    id: 'V025',
    source: '學測本 p.68 語法選擇 2',
    prompt: 'Jack goes to the art museum ___.',
    choices: ['four times a year', 'a year four times', 'four time a year', 'a year four time'],
    answer: 0,
    explanation: '次數寫法：「次數 + a + 時間單位」→ four times a year；time 有 s。',
    en_full: 'Jack goes to the art museum four times a year.',
    zh: 'Jack 一年去美術館四次。'
  },
  {
    id: 'V026',
    source: '學測本 p.68 語法選擇 3',
    prompt: 'In the restaurant, the beef noodles ___ very yummy.',
    choices: ['are always', 'always are', 'does always', 'always does'],
    answer: 0,
    explanation: 'noodles 複數用 be 動詞 are；副詞 always 放 be 動詞後 → are always。',
    en_full: 'In the restaurant, the beef noodles are always very yummy.',
    zh: '在那家餐廳，牛肉麵總是非常好吃。'
  },
  {
    id: 'V027',
    source: '學測本 p.68 語法選擇 4',
    prompt: 'It ___ in Keelung in winter.',
    choices: ['often rains', 'rains often', 'often rainy', 'rainy often'],
    answer: 0,
    explanation: 'rain 是動詞（下雨），副詞 often 放動詞前 → often rains；it 為三單，動詞加 -s。',
    en_full: 'It often rains in Keelung in winter.',
    zh: '基隆冬天經常下雨。'
  },
  {
    id: 'V028',
    source: '學測本 p.68 語法選擇 5',
    prompt: 'Mr. Chen takes a trip to Japan ___.',
    choices: ['two time a year', 'twice times a year', 'twice a year', 'a year twice'],
    answer: 2,
    explanation: '兩次的標準寫法是 twice；twice a year 表「一年兩次」。',
    en_full: 'Mr. Chen takes a trip to Japan twice a year.',
    zh: '陳先生一年去日本兩次。'
  },

  // ───── 學測本 p.69 語法選擇 6-10 ─────
  {
    id: 'V029',
    source: '學測本 p.69 語法選擇 6',
    prompt: 'The men ___ noodles in the restaurant on weekends.',
    choices: ['have usually', 'usually have', 'is usually having', 'is having usually'],
    answer: 1,
    explanation: '主詞 men 複數用原形動詞 have；副詞 usually 放動詞前 → usually have。',
    en_full: 'The men usually have noodles in the restaurant on weekends.',
    zh: '那些男人週末通常會在那家餐廳吃麵。'
  },
  {
    id: 'V030',
    source: '學測本 p.69 語法選擇 7',
    prompt: 'Ivy has a picnic ___.',
    choices: ['seldom', 'every two days', 'a week', 'every Sunday'],
    answer: 3,
    explanation: '空格在句尾，需要表「時間／頻率」的副詞片語；every Sunday 最自然合理。',
    en_full: 'Ivy has a picnic every Sunday.',
    zh: 'Ivy 每個星期天都會去野餐。'
  },
  {
    id: 'V031',
    source: '學測本 p.69 語法選擇 8',
    prompt: "Mandy: Does Jack always go to school on time? Victor: No, he ___. He's always late for school.",
    choices: ['never is', 'is never', 'never does', 'does never'],
    answer: 2,
    explanation: '原問句用 Does（一般動詞），否定簡答 → never does（never 在 does 前）。',
    en_full: "No, he never does. He's always late for school.",
    zh: '不，他從不準時，他總是上學遲到。'
  },
  {
    id: 'V032',
    source: '學測本 p.69 語法選擇 9',
    prompt: 'My mom is never late for work, but my dad ___.',
    choices: ['always is', 'is often', 'never is', 'is seldom'],
    answer: 1,
    explanation: '對比 mom never late → dad 應該是「常常遲到」；be 動詞後加副詞 → is often。',
    en_full: 'My mom is never late for work, but my dad is often.',
    zh: '我媽媽從不上班遲到，但我爸爸經常遲到。'
  },
  {
    id: 'V033',
    source: '學測本 p.69 語法選擇 10',
    prompt: 'Amanda cleans her room once in a blue moon. She ___ does it.',
    choices: ['seldom', 'never', 'usually', 'always'],
    answer: 0,
    explanation: '「once in a blue moon」= 千載難逢/極少；對應 seldom（很少）。',
    en_full: 'Amanda cleans her room once in a blue moon. She seldom does it.',
    zh: 'Amanda 千百年才打掃一次房間，她很少做這件事。'
  },

  // ───── 學測本 p.71 精熟區單題 1-10 ─────
  {
    id: 'V034',
    source: '學測本 p.71 精熟區 1',
    prompt: 'Look at the picture. What is the girl doing?',
    choices: ['She is swimming.', 'She is asking questions.', 'She is jumping rope.', 'She is doing her English homework.'],
    answer: 2,
    explanation: '圖中女孩在跳繩 → jumping rope。',
    en_full: 'She is jumping rope.',
    zh: '她正在跳繩。'
  },
  {
    id: 'V035',
    source: '學測本 p.71 精熟區 2',
    prompt: "Mom, I'm ___. Can I take a day off today?",
    choices: ['sick', 'hard', 'another', 'useful'],
    answer: 0,
    explanation: '請假一天 → 因為生病；sick 才合語意。',
    en_full: "Mom, I'm sick. Can I take a day off today?",
    zh: '媽，我生病了，今天可以請假嗎？'
  },
  {
    id: 'V036',
    source: '學測本 p.71 精熟區 3',
    prompt: 'Mary is ___ sad. She is always happy.',
    choices: ['usually', 'sometimes', 'never', 'seldom'],
    answer: 2,
    explanation: '對比 always happy → 「從不」難過 → never。',
    en_full: 'Mary is never sad. She is always happy.',
    zh: 'Mary 從不難過，她總是很開心。'
  },
  {
    id: 'V037',
    source: '學測本 p.71 精熟區 4',
    prompt: '___ basketball after school?',
    choices: ['Does often Nat play', 'Does Nat play often', 'Does Nat often play', 'Does play Nat often'],
    answer: 2,
    explanation: '一般動詞問句：Does + 主詞 + 副詞 + 原形動詞 → Does Nat often play。',
    en_full: 'Does Nat often play basketball after school?',
    zh: 'Nat 放學後經常打籃球嗎？'
  },
  {
    id: 'V038',
    source: '學測本 p.71 精熟區 5',
    prompt: 'Wendy ___ tennis with her friends in the gym.',
    choices: ['play sometimes', 'sometimes plays', 'sometimes play', 'plays sometimes'],
    answer: 1,
    explanation: 'Wendy 三單，動詞 play 加 -s → plays；副詞 sometimes 放動詞前 → sometimes plays。',
    en_full: 'Wendy sometimes plays tennis with her friends in the gym.',
    zh: 'Wendy 有時候在體育館跟朋友打網球。'
  },
  {
    id: 'V039',
    source: '學測本 p.71 精熟區 6',
    prompt: 'Leo: Do you have rain here in winter? Ann: Yes, ___.',
    choices: ['we usually do', "we usually don't", 'we often have', 'we never are'],
    answer: 0,
    explanation: '原句用 Do 助動詞，肯定簡答用 do → Yes, we usually do（usually 在 do 前）。',
    en_full: 'Yes, we usually do.',
    zh: '對，我們通常會有雨。'
  },
  {
    id: 'V040',
    source: '學測本 p.71 精熟區 7',
    prompt: 'Ted: ___ does your father have noodles? Mark: Every day. He loves noodles a lot.',
    choices: ['How many', 'How long', 'How often', 'How much'],
    answer: 2,
    explanation: '答 Every day（每天）是頻率 → 問句用 How often。',
    en_full: 'How often does your father have noodles?',
    zh: '你爸爸多久吃一次麵？'
  },
  {
    id: 'V041',
    source: '學測本 p.71 精熟區 8',
    prompt: 'Her bedroom ___ dirty. She ___ cleans it up every two days.',
    choices: ['is never; always', 'never is; usually', 'is always; often', 'always is; sometimes'],
    answer: 0,
    explanation: '每兩天打掃 → 房間「從不」髒 + 「總是」打掃；be 動詞前不放副詞 → is never。',
    en_full: 'Her bedroom is never dirty. She always cleans it up every two days.',
    zh: '她的房間從不髒，她每兩天總是打掃一次。'
  },
  {
    id: 'V042',
    source: '學測本 p.71 精熟區 9',
    prompt: 'I never have cola for lunch, but my brother and sister ___.',
    choices: ['have often', 'often do', 'often does', 'often have'],
    answer: 1,
    explanation: '對比省略句：用 do 替代「have cola」→ often do（副詞在 do 前）。brother and sister 複數用 do。',
    en_full: 'I never have cola for lunch, but my brother and sister often do.',
    zh: '我中午從不喝可樂，但我哥哥姐姐常常會喝。'
  },
  {
    id: 'V043',
    source: '學測本 p.71 精熟區 10',
    prompt: 'It often ___ in London in winter.',
    choices: ['has snow', 'is a lot of snow', 'is snowy', 'snows'],
    answer: 3,
    explanation: '「下雪」用動詞 snow（it 為三單 → snows）；often + snows。',
    en_full: 'It often snows in London in winter.',
    zh: '倫敦冬天經常下雪。'
  },

  // ───── 學測本 p.72 單題 11-15 ─────
  {
    id: 'V044',
    source: '學測本 p.72 精熟區 11',
    prompt: 'Nora usually goes to work late on Monday, but Nick ___.',
    choices: ['seldom does', 'never goes', 'seldom is', 'often does'],
    answer: 0,
    explanation: '對比「usually goes late」→ Nick 應為「很少遲到」→ seldom does（do 替代動詞片語）。',
    en_full: 'Nora usually goes to work late on Monday, but Nick seldom does.',
    zh: 'Nora 週一通常上班遲到，但 Nick 很少遲到。'
  },
  {
    id: 'V045',
    source: '學測本 p.72 精熟區 12',
    prompt: 'Alex ___ to school early.',
    choices: ['always goes', 'goes always', 'always is', 'is always'],
    answer: 0,
    explanation: '一般動詞 go，副詞 always 放動詞前 → always goes；Alex 三單，go → goes。',
    en_full: 'Alex always goes to school early.',
    zh: 'Alex 總是很早上學。'
  },
  {
    id: 'V046',
    source: '學測本 p.72 精熟區 13',
    prompt: 'Hagrid: How often do you take your son, Harry, to the park? James: ___. My wife and I have time only on Saturday morning.',
    choices: ['Every day.', 'Once a week.', 'Twice a year.', 'Only on weekdays.'],
    answer: 1,
    explanation: '「只有週六早上有時間」→ 一週去一次 → Once a week。',
    en_full: 'Once a week.',
    zh: '一週一次。'
  },
  {
    id: 'V047',
    source: '學測本 p.72 精熟區 14',
    prompt: 'Abby: Do you usually play basketball after school? Charlotte: ___',
    choices: ['Sometimes.', 'Yes, I do that once a week.', 'Yes, I never do.', 'Yes, I usually do.'],
    answer: 3,
    explanation: '原問句用 usually，肯定簡答對應「Yes, I usually do」；「Yes, I never do」自相矛盾。',
    en_full: 'Yes, I usually do.',
    zh: '對，我通常會打。'
  },
  {
    id: 'V048',
    source: '學測本 p.72 精熟區 15',
    prompt: 'Jack: ___ Cindy: Every evening. I love it!',
    choices: ['How old are your grandparents?', 'How often do you watch TV?', 'How many friends do you have?', 'How much pork do you need?'],
    answer: 1,
    explanation: '答 Every evening 是頻率 → 問句要用 How often。',
    en_full: 'How often do you watch TV?',
    zh: '你多久看一次電視？'
  },

  // ───── 學測本 p.72-73 題組 A 16-19（In the classroom 對話）─────
  {
    id: 'V049',
    source: '學測本 p.72 題組 A 16',
    prompt: 'David: Let\'s go to the movie In time after school! Ella: Sorry, I can\'t. Our school ___ has to train after school.',
    choices: ['sport', 'life', 'shop', 'team'],
    answer: 3,
    explanation: '「has to train」(訓練) 對應 sport team（運動隊）。',
    en_full: 'Our school team has to train after school.',
    zh: '我們學校的(運動)隊放學後要訓練。'
  },
  {
    id: 'V050',
    source: '學測本 p.72 題組 A 17',
    prompt: 'David: ___ do you train? Ella: We train every weekday.',
    choices: ['How about', 'How often', 'How much', 'How many'],
    answer: 1,
    explanation: '答 every weekday（每個平日）是頻率 → How often。',
    en_full: 'How often do you train?',
    zh: '你們多久訓練一次？'
  },
  {
    id: 'V051',
    source: '學測本 p.73 題組 A 18',
    prompt: 'David: How about Saturday afternoon? Ella: Sorry. My family ___ my grandparents every Saturday afternoon.',
    choices: ['always visit', 'visit always', 'never visit', 'visit never'],
    answer: 0,
    explanation: '一般動詞 visit，副詞 always 放動詞前 → always visit；every Saturday 表示「總是」。',
    en_full: 'My family always visit my grandparents every Saturday afternoon.',
    zh: '我家人每週六下午總是去拜訪祖父母。'
  },
  {
    id: 'V052',
    source: '學測本 p.73 題組 A 19',
    prompt: 'David: So, is Sunday morning OK with you? Ella: No, I can\'t get up ___ on weekends.',
    choices: ['fast', 'late', 'early', 'hard'],
    answer: 2,
    explanation: '「週末沒辦法早起」→ get up early；其他副詞語意不通。',
    en_full: "I can't get up early on weekends.",
    zh: '我週末沒辦法早起。'
  }
];
