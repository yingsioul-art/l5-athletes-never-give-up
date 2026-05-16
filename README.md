# 🏆 Athletes Never Give Up — L5 練習簿

七年級下學期第五課英文學習互動 App，純 HTML / CSS / JavaScript，**離線可用**，無需後端。

## ✨ 功能總覽

### 文法觀念與練習（共 9 個模式）
| 模式 | 描述 | 題量 |
|---|---|---|
| 🏔️ 頻率金字塔 | 拖拉副詞到對的百分比 | 6 個副詞 |
| 🎯 副詞位置點選 | 點 ⬚ 把副詞插進句子（含飛行動畫） | 10 題 |
| ✍️ 填空練習 | 打字 / 拖拉 / 手寫 三種輸入 | 28 題 |
| 🔗 How often 連連看 | 問句配答句，SVG 亮綠線 | 5 組 |
| 🎡 Spin and Say | 轉盤造句，3 種輸入方式 | 12×6×6 隨機 |
| 🔧 句型轉換 | 拖拉 tile 改寫句子 | 9 題 |
| 📝 字彙語法選擇 | 4 選 1 含詳解 | 52 題 |
| ✏️ 中翻英練習 | 打字 / 手寫 / 拖拉 | 12 題 |
| 📖 閱讀理解 | 7 篇 24 題：對話/圖表/短文 | 24 題 |

### 字彙練習
- 🃏 **L5 單字練習**：33 個課本單字，4 種模式（字卡 / 中翻英 / 拼字選擇 / 拼字輸入＋手寫）

### 🏆 藥師少女的獨語競賽
與 4 個《藥師少女的獨語》角色比賽答題：
- 🌸 玉葉妃（初級）
- 🧔 高順（中級）
- 🎭 壬氏（高級）
- 🦊 貓貓（頂級）

選擇對手、題型（4 種）、題數（5/10/15/20），限時答題決勝負。

### 📊 錯題本
答錯題目自動歸類，可重做（vocab / fillblank / position / translate / transform / reading 6 個模式支援）。

## 🚀 使用方式

**線上版**（GitHub Pages）：直接打開部署後的網址

**本地版**：
1. 下載/clone 整個倉庫
2. 雙擊 `index.html` 即可開始（不需要 server）

## 🛠 技術棧
- 純 HTML5 / CSS3 / Vanilla JavaScript（無 framework）
- Web Speech API（朗讀）
- Pointer Events API（拖拉，桌機+觸控）
- localStorage（進度與錯題本）
- 響應式設計（手機 / 平板 / 桌機）

## 📂 檔案結構
```
.
├── index.html                  主選單
├── grammar.html                文法練習統一頁（依 ?mode= 切換 9 個模式）
├── vocab-cards.html            單字練習頁
├── competition.html            藥師少女的獨語競賽
├── wrongbook.html              錯題本
├── css/style.css               全站樣式
├── js/
│   ├── shared.js               共用工具（speak/shuffle/save/feedback/錯題本）
│   ├── mode-*.js               9 個模式各自的邏輯檔
│   └── competition.js
├── data/
│   ├── vocab_words_L5.js       33 個單字
│   ├── vocab_quiz_L5.js        52 題字彙語法選擇
│   ├── fillblank_L5.js         28 題填空
│   ├── position_L5.js          10 題副詞位置
│   ├── pyramid_L5.js           6 個頻率副詞
│   ├── howoften_L5.js          5 組 How often
│   ├── spin_L5.js              轉盤資料
│   ├── translate_L5.js         12 題翻譯
│   ├── transform_L5.js         9 題句型轉換
│   └── reading_L5.js           7 篇閱讀（24 題）
└── images/opponents/           4 個對手角色頭像
```

## 📜 授權
本專案僅供個人學習與教學使用，《藥師少女的獨語》角色圖片版權屬原作者。

---

L5 Athletes Never Give Up · 七年級下學期 · Lesson 5
