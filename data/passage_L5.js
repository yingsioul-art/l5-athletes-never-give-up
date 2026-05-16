/* ============================================================
   passage_L5.js — L5 課本主課文「Athletes Never Give Up」
   - 2 段，共 10 句
   - 每句附課本 Reading 頁的單字編號（#1-11 + 特殊 #①②③）+ 文法
   - 附 5 條 Post-reading 勵志名言（含中譯）
   ============================================================ */

window.PASSAGE_L5 = {
  title: "Athletes Never Give Up",
  subtitle: "Lesson 5 主課文",
  paragraphs: [
    {
      // 第 1 段：訓練的日常
      sentences: [
        {
          en: "The life of an athlete is never easy.",
          zh: "運動員的生活從不容易。",
          vocab: [
            { word: 'life',    num: 1,    label: '#1',  pos: 'n.', meaning: '生活；人生' },
            { word: 'athlete', num: '①', label: '#①', pos: 'n.', meaning: '運動員（特殊字）' }
          ],
          grammar: [
            { point: 'be 動詞 + never + 形容詞',
              explanation: 'never 放在 be 動詞 (is) 後面 + 形容詞；表示「從不/絕不」是這樣。' }
          ]
        },
        {
          en: "At the National Sports Training Center, athletes train for many hours a day, from early morning to late evening.",
          zh: "在國家訓練中心，運動員一天訓練好幾個小時，從清晨到傍晚。",
          vocab: [
            { word: 'early', num: 2, label: '#2', pos: 'adj.', meaning: '早的（修飾 morning）' }
          ],
          idioms: [
            { phrase: 'from A to B', meaning: '從 A 到 B（時間/地點範圍）；例：from early morning to late evening 從清晨到傍晚' }
          ],
          grammar: [
            { point: 'train for + 時間長度',
              explanation: 'train for many hours = 訓練多久；for + 時間表「持續多久」。' },
            { point: 'X hours a day',
              explanation: '「一天 X 小時」：a day 等同 each day；many hours a day = 一天好幾個小時。' }
          ]
        },
        {
          en: "At the NSTC, athletes train every day.",
          zh: "在 NSTC，運動員每天訓練。",
          grammar: [
            { point: 'every day 放句尾',
              explanation: 'every day = 每天（兩個字分開）；不要寫成 everyday（那是形容詞「日常的」）。' }
          ]
        },
        {
          en: "Some athletes run, some swim, and others jump rope.",
          zh: "有些運動員跑步，有些游泳，還有些跳繩。",
          vocab: [
            { word: 'swim',      num: 3, label: '#3', pos: 'v.',   meaning: '游泳' },
            { word: 'jump rope', num: 4, label: '#4', pos: 'phr.', meaning: '跳繩' }
          ],
          grammar: [
            { point: 'Some ... some ... others ...',
              explanation: '列舉用法：「有些…有些…其他…」。三組都接複數動詞（run / swim / jump）原形，因為主詞 some / others 都視為複數。' }
          ]
        },
        {
          en: "Sometimes, they get hurt during training, but they do not give up.",
          zh: "有時候，他們在訓練中受傷，但他們不放棄。",
          vocab: [
            { word: 'get hurt', num: 5, label: '#5', pos: 'phr.', meaning: '受傷（被動意味）' },
            { word: 'during',   num: 6, label: '#6', pos: 'prep.', meaning: '在……期間' }
          ],
          idioms: [
            { phrase: 'give up', meaning: '放棄（不可分離片語動詞）' }
          ],
          grammar: [
            { point: 'Sometimes 放句首',
              explanation: 'sometimes 是少數可放句首的頻率副詞（always / never 不可）。' },
            { point: 'they do not + 原形動詞',
              explanation: '主詞複數的否定句：do not (don\'t) + 原形動詞；give up 不變成 gives up。' }
          ]
        },
        {
          en: "Sometimes, they are sick, but they do not stop.",
          zh: "有時候，他們生病，但他們不停下來。",
          vocab: [
            { word: 'sick', num: 7, label: '#7', pos: 'adj.', meaning: '生病的' },
            { word: 'stop', num: 8, label: '#8', pos: 'v.',   meaning: '停止' }
          ],
          grammar: [
            { point: 'be + 形容詞 vs do + 原形動詞',
              explanation: '前半 they are sick 用 be 動詞 + 形容詞；後半 they do not stop 用 do + 原形動詞。兩種句型不能混。' }
          ]
        },
        {
          en: "They train again the next day.",
          zh: "他們隔天再繼續訓練。",
          grammar: [
            { point: 'again 副詞位置',
              explanation: 'again 通常放在動詞後或句尾：train again = 再次訓練。' },
            { point: 'the next day',
              explanation: '「隔天/接下來那天」固定用 the next day（要有 the）。' }
          ]
        }
      ]
    },
    {
      // 第 2 段：背後的努力
      sentences: [
        {
          en: "In many sports, people often care about the trophies, but they seldom notice the athletes' hard work.",
          zh: "在很多運動比賽中，人們常常關注獎盃，但他們很少注意到運動員背後的努力。",
          vocab: [
            { word: 'sports',   num: 9,  label: '#9',  pos: 'n.', meaning: '運動（複數）' },
            { word: 'care',     num: 10, label: '#10', pos: 'v.', meaning: '在乎（care about = 關心、在意）' },
            { word: 'trophies', num: '②', label: '#②', pos: 'n.', meaning: '獎盃（trophy 的複數，特殊字）' },
            { word: 'notice',   num: 11, label: '#11', pos: 'v.', meaning: '注意到' }
          ],
          idioms: [
            { phrase: 'care about', meaning: '在乎、關心（固定搭配 care + about + 受詞）' },
            { phrase: 'hard work', meaning: '辛勤的努力（不可數）' }
          ],
          grammar: [
            { point: '頻率副詞 often / seldom 放動詞前',
              explanation: 'often care、seldom notice：頻率副詞放在一般動詞前。' },
            { point: '所有格 \'s',
              explanation: 'the athletes\' hard work：athletes 為複數所有格 → 字尾只加 \'（不加 s）。' }
          ]
        },
        {
          en: "There is a lot of effort behind each story.",
          zh: "每個故事背後都有許多努力。",
          vocab: [
            { word: 'effort', num: '③', label: '#③', pos: 'n.', meaning: '努力（特殊字，不可數）' }
          ],
          grammar: [
            { point: 'There is + 不可數名詞',
              explanation: 'effort 是不可數名詞 → 用 There is（單數動詞）+ a lot of effort；不能說 efforts。' },
            { point: 'behind 介系詞',
              explanation: 'behind = 在…後面（可指實體位置或抽象「背後」）。' },
            { point: 'each + 單數名詞',
              explanation: 'each 後接單數名詞：each story（一個故事）；不能說 each stories。' }
          ]
        },
        {
          en: "Let's cheer for them all.",
          zh: "讓我們一起為他們所有人歡呼吧。",
          idioms: [
            { phrase: "Let's + 原形動詞", meaning: '「我們一起去…吧」；Let\'s 是 Let us 的縮寫。' },
            { phrase: 'cheer for sb.', meaning: '為某人加油、喝采' },
            { phrase: 'them all', meaning: '他們全部（all 強調全部，可放代名詞後）' }
          ]
        }
      ]
    }
  ],
  // Post-reading 5 條勵志名言
  quotes: [
    { en: "You are your only limit.",                       zh: "你是你自己唯一的極限。" },
    { en: "Don't be afraid to fail. Be afraid not to try.", zh: "不要害怕失敗，要害怕不去嘗試。" },
    { en: "No pain, no gain.",                              zh: "沒有付出，沒有收穫。" },
    { en: "Dream big, work hard, and never give up.",       zh: "夢想要大、認真努力、永不放棄。" },
    { en: "Dreams don't work unless you do.",               zh: "夢想不會自己實現，除非你努力。" }
  ]
};
