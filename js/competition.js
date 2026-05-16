/* ============================================================
   competition.js — 🏆 競賽模式
   - 與虛擬對手競賽，4 個對手藥師少女角色
   - 玩家選擇對手、題目類型、題目數量
   - 每題：玩家有限時答題，對手按自己速度+準確率回答
   - 終局：累計正確數高者勝
   ============================================================ */

(function () {
  'use strict';

  // ---------- 對手設定 ----------
  // 圖片來源優先序：
  //   1. 先試 app 內的 images/opponents/（若有跑過 copy_opponents.ps1）
  //   2. 失敗則改用原資料夾「../../MAOMAO PIC/<中文檔名>」
  //   3. 兩者都失敗才顯示 emoji
  const OPPONENTS = [
    { id: 'gyokuyou', name: '玉葉妃', emoji: '🌸', level: '初級',
      accuracy: 0.50, speedMs: 17000, speedJitter: 3000,
      img: 'images/opponents/gyokuyou.png',
      imgFallback: '../../MAOMAO PIC/玉葉妃.png' },
    { id: 'gaoshun',  name: '高順',   emoji: '🧔', level: '中級',
      accuracy: 0.70, speedMs: 11000, speedJitter: 2500,
      img: 'images/opponents/gaoshun.jpg',
      imgFallback: '../../MAOMAO PIC/高順.jpg' },
    { id: 'jinshi',   name: '壬氏',   emoji: '🎭', level: '高級',
      accuracy: 0.85, speedMs: 7500,  speedJitter: 2000,
      img: 'images/opponents/jinshi.jpg',
      imgFallback: '../../MAOMAO PIC/壬氏.jpg' },
    { id: 'maomao',   name: '貓貓',   emoji: '🦊', level: '頂級',
      accuracy: 0.95, speedMs: 5000,  speedJitter: 1500,
      img: 'images/opponents/maomao.jpg',
      imgFallback: '../../MAOMAO PIC/貓貓.jpg' },
  ];

  const PLAYER_TIME_MS = 22000; // 玩家每題 22 秒（已含閱讀時間）

  // ---------- 題目類型設定 ----------
  const QUESTION_TYPES = [
    { id: 'vocab',      label: '📝 字彙語法選擇', desc: '52 題 4 選 1（評量本/學測本）', count: 52 },
    { id: 'vocabcards', label: '🃏 單字中翻英',   desc: '33 字，中文選正確英文', count: 33 },
    { id: 'reading',    label: '📖 閱讀理解',     desc: '24 題（含 7 篇短文/圖表）', count: 24 },
    { id: 'mixed',      label: '🎲 隨機混合',     desc: '上述全部題目', count: 109 },
  ];

  const COUNT_OPTIONS = [5, 10, 15, 20];

  // ---------- 狀態 ----------
  let phase = 'setup'; // 'setup' | 'race' | 'result'
  let sel = { opponentId: null, typeId: null, count: 10 };
  let game = null;
  let container;

  function init() {
    container = document.getElementById('comp-area');
    renderSetup();
  }

  // ============================================================
  // 階段 1：設定
  // ============================================================
  function renderSetup() {
    phase = 'setup';
    container.innerHTML = `
      <section class="card">
        <div class="card-title">1️⃣ 選擇藥師少女的獨語角色</div>
        <div class="opp-grid" id="opp-grid">
          ${OPPONENTS.map(o => `
            <button class="opp-card ${sel.opponentId === o.id ? 'selected' : ''}" data-id="${o.id}">
              <div class="opp-avatar">
                <img src="${o.img}" alt="${o.name}"
                     data-fallback="${o.imgFallback}" data-emoji="${o.emoji}"
                     onerror="
                       if (this.dataset.fallback && this.src.indexOf(this.dataset.fallback) === -1) {
                         this.src = this.dataset.fallback;
                       } else {
                         this.style.display='none';
                         this.nextElementSibling.style.display='flex';
                       }
                     ">
                <div class="opp-emoji" style="display:none;">${o.emoji}</div>
              </div>
              <div class="opp-name">${o.name}</div>
              <div class="opp-level">${o.level}</div>
            </button>
          `).join('')}
        </div>
      </section>

      <section class="card">
        <div class="card-title">2️⃣ 題目類型</div>
        <div class="type-grid" id="type-grid">
          ${QUESTION_TYPES.map(t => `
            <button class="type-card ${sel.typeId === t.id ? 'selected' : ''}" data-id="${t.id}">
              <div class="type-label">${t.label}</div>
              <div class="type-desc">${t.desc}</div>
              <div class="type-count">共 ${t.count} 題</div>
            </button>
          `).join('')}
        </div>
      </section>

      <section class="card">
        <div class="card-title">3️⃣ 題目數量</div>
        <div class="count-grid">
          ${COUNT_OPTIONS.map(n => `
            <button class="count-btn ${sel.count === n ? 'selected' : ''}" data-n="${n}">${n}</button>
          `).join('')}
        </div>
        <p style="font-size:12px; color:var(--ink-soft); margin-top:8px; text-align:center;">
          ⏱ 貓貓欣每題 ${PLAYER_TIME_MS / 1000} 秒；對手依難度自動回答
        </p>
      </section>

      <div class="actions" style="margin-top: 16px;">
        <button class="btn btn-primary" id="btn-start">🏁 開始競賽</button>
      </div>
    `;

    container.querySelectorAll('.opp-card').forEach(el => {
      el.addEventListener('click', () => {
        sel.opponentId = el.dataset.id;
        renderSetup();
      });
    });
    container.querySelectorAll('.type-card').forEach(el => {
      el.addEventListener('click', () => {
        sel.typeId = el.dataset.id;
        renderSetup();
      });
    });
    container.querySelectorAll('.count-btn').forEach(el => {
      el.addEventListener('click', () => {
        sel.count = parseInt(el.dataset.n, 10);
        renderSetup();
      });
    });
    container.querySelector('#btn-start').addEventListener('click', startRace);
  }

  function startRace() {
    if (!sel.opponentId) { alert('請先選擇對手！'); return; }
    if (!sel.typeId) { alert('請先選擇題目類型！'); return; }
    const opp = OPPONENTS.find(o => o.id === sel.opponentId);
    const pool = buildQuestionPool(sel.typeId);
    if (!pool.length) { alert('題庫載入失敗！'); return; }
    const questions = shuffle(pool).slice(0, sel.count);

    game = {
      opp,
      questions,
      idx: 0,
      playerScore: 0,
      oppScore: 0,
      startTs: Date.now(),
      playerAnswer: null,
      oppAnswer: null,
      playerTimer: null,
      oppTimer: null,
      tickTimer: null,
    };
    renderRace();
  }

  // ============================================================
  // 階段 2：競賽中
  // ============================================================
  function renderRace() {
    phase = 'race';
    const q = game.questions[game.idx];
    const total = game.questions.length;
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="race-board">
        <div class="race-row opp">
          <div class="race-avatar">
            <img src="${game.opp.img}" alt="${game.opp.name}"
                 data-fallback="${game.opp.imgFallback}" data-emoji="${game.opp.emoji}"
                 onerror="
                   if (this.dataset.fallback && this.src.indexOf(this.dataset.fallback) === -1) {
                     this.src = this.dataset.fallback;
                   } else {
                     this.replaceWith(Object.assign(document.createElement('span'),{className:'race-emoji',textContent:this.dataset.emoji}));
                   }
                 ">
          </div>
          <div class="race-info">
            <div class="race-name">${game.opp.name}</div>
            <div class="progress-bar"><div class="progress-fill opp-fill" id="opp-fill"></div></div>
            <div class="race-score" id="opp-score">${game.oppScore} / ${total}</div>
          </div>
        </div>
        <div class="race-row me">
          <div class="race-avatar"><span class="race-emoji">🌟</span></div>
          <div class="race-info">
            <div class="race-name">貓貓欣</div>
            <div class="progress-bar"><div class="progress-fill me-fill" id="me-fill"></div></div>
            <div class="race-score" id="me-score">${game.playerScore} / ${total}</div>
          </div>
        </div>
      </div>

      <div class="race-question">
        <div class="race-qnum">題目 ${game.idx + 1} / ${total}</div>
        <div class="vocab-prompt" id="race-prompt">${escapeHtml(q.prompt)}</div>
        <div class="vocab-choices" id="race-choices">
          ${q.choices.map((c, i) => `
            <button class="vocab-choice" data-index="${i}">
              <span class="letter">${letters[i]}</span>
              <span class="text">${escapeHtml(c)}</span>
            </button>
          `).join('')}
        </div>

        <div class="race-status">
          <div class="race-timer">
            <span class="timer-icon">⏱</span>
            <div class="timer-bar"><div class="timer-fill" id="timer-fill"></div></div>
            <span class="timer-text" id="timer-text">${PLAYER_TIME_MS / 1000}s</span>
          </div>
          <div class="opp-status" id="opp-status">${game.opp.name} 思考中…</div>
        </div>

        <div class="race-feedback" id="race-feedback"></div>
      </div>
    `;

    game.playerAnswer = null;
    game.oppAnswer = null;
    updateBars();

    container.querySelectorAll('.vocab-choice').forEach(b => {
      b.addEventListener('click', () => onPlayerAnswer(parseInt(b.dataset.index, 10)));
    });

    // 玩家倒數
    const startedAt = Date.now();
    game.tickTimer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const remain = Math.max(0, PLAYER_TIME_MS - elapsed);
      const pct = (remain / PLAYER_TIME_MS) * 100;
      const fill = container.querySelector('#timer-fill');
      const text = container.querySelector('#timer-text');
      if (fill) fill.style.width = pct + '%';
      if (text) text.textContent = Math.ceil(remain / 1000) + 's';
      if (remain <= 0) {
        clearInterval(game.tickTimer);
        if (game.playerAnswer === null) onPlayerAnswer(-1); // 超時 → 視為錯
      }
    }, 100);

    // 對手回答（jitter）
    const oppDelay = game.opp.speedMs + (Math.random() * 2 - 1) * game.opp.speedJitter;
    game.oppTimer = setTimeout(() => {
      onOpponentAnswer();
    }, oppDelay);
  }

  function onPlayerAnswer(idx) {
    if (game.playerAnswer !== null) return;
    game.playerAnswer = idx;
    const q = game.questions[game.idx];
    const correct = (idx === q.answer);
    if (correct) game.playerScore++;

    // 標記玩家選的
    const buttons = container.querySelectorAll('.vocab-choice');
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add('correct');
      if (i === idx && idx !== q.answer) b.classList.add('wrong');
    });

    updateBars();
    maybeAdvance();
  }

  function onOpponentAnswer() {
    if (game.oppAnswer !== null) return;
    const q = game.questions[game.idx];
    const correct = Math.random() < game.opp.accuracy;
    game.oppAnswer = correct ? q.answer : pickWrongIndex(q.answer, q.choices.length);
    if (correct) game.oppScore++;

    const statusEl = container.querySelector('#opp-status');
    if (statusEl) {
      statusEl.classList.add(correct ? 'opp-correct' : 'opp-wrong');
      statusEl.textContent = correct ? `${game.opp.name} 答對了 ✓` : `${game.opp.name} 答錯了 ✗`;
    }

    updateBars();
    maybeAdvance();
  }

  function maybeAdvance() {
    if (game.playerAnswer === null) return;
    if (game.oppAnswer === null) return;
    // 兩邊都答完了，1.5 秒後進下一題
    clearTimeout(game.oppTimer);
    clearInterval(game.tickTimer);
    setTimeout(() => {
      game.idx++;
      if (game.idx >= game.questions.length) renderResult();
      else renderRace();
    }, 1500);
  }

  function updateBars() {
    const total = game.questions.length;
    const oppPct = (game.oppScore / total) * 100;
    const mePct  = (game.playerScore / total) * 100;
    const oppFill = container.querySelector('#opp-fill');
    const meFill  = container.querySelector('#me-fill');
    const oppScoreEl = container.querySelector('#opp-score');
    const meScoreEl  = container.querySelector('#me-score');
    if (oppFill) oppFill.style.width = oppPct + '%';
    if (meFill)  meFill.style.width  = mePct + '%';
    if (oppScoreEl) oppScoreEl.textContent = `${game.oppScore} / ${total}`;
    if (meScoreEl)  meScoreEl.textContent  = `${game.playerScore} / ${total}`;
  }

  // ============================================================
  // 階段 3：結算
  // ============================================================
  function renderResult() {
    phase = 'result';
    const total = game.questions.length;
    const me = game.playerScore;
    const op = game.oppScore;
    const elapsed = ((Date.now() - game.startTs) / 1000).toFixed(0);
    let title, banner, color;
    if (me > op) {
      title = '🎉 貓貓欣贏了！';
      banner = `貓貓欣打敗了 ${game.opp.name}！`;
      color = 'var(--green)';
    } else if (me < op) {
      title = '😢 貓貓欣輸了';
      banner = `${game.opp.name} 太強了，貓貓欣再挑戰一次！`;
      color = 'var(--red)';
    } else {
      title = '🤝 平手';
      banner = `貓貓欣跟 ${game.opp.name} 不分上下！`;
      color = 'var(--orange)';
    }

    container.innerHTML = `
      <div class="result-card" style="border-color: ${color};">
        <h2 style="color: ${color}; text-align:center; margin-bottom: 8px;">${title}</h2>
        <p style="text-align:center; color: var(--ink-soft); margin-bottom: 18px;">${banner}</p>

        <div class="result-stats">
          <div class="result-row">
            <div class="result-side">
              <span class="result-emoji">🌟</span>
              <span>貓貓欣</span>
            </div>
            <div class="result-num green">${me} / ${total}</div>
          </div>
          <div class="result-row">
            <div class="result-side">
              <span class="result-emoji">${game.opp.emoji}</span>
              <span>${game.opp.name}</span>
            </div>
            <div class="result-num orange">${op} / ${total}</div>
          </div>
          <div class="result-row" style="font-size: 13px; color: var(--ink-soft);">
            <div>總時間</div>
            <div>${elapsed} 秒</div>
          </div>
        </div>

        <div class="actions" style="margin-top: 16px;">
          <button class="btn" id="btn-again">🔁 再戰一場</button>
          <button class="btn btn-primary" id="btn-setup">⚙️ 重新設定</button>
          <a class="btn" href="index.html">← 主選單</a>
        </div>
      </div>
    `;
    container.querySelector('#btn-again').addEventListener('click', startRace);
    container.querySelector('#btn-setup').addEventListener('click', renderSetup);
  }

  // ============================================================
  // 題目池建立
  // ============================================================
  function buildQuestionPool(typeId) {
    if (typeId === 'vocab') return buildVocabQuiz();
    if (typeId === 'vocabcards') return buildVocabCards();
    if (typeId === 'reading') return buildReading();
    if (typeId === 'mixed') return [...buildVocabQuiz(), ...buildVocabCards(), ...buildReading()];
    return [];
  }

  function buildVocabQuiz() {
    const src = window.VOCAB_QUIZ_L5 || [];
    return src.map(q => ({
      id: q.id,
      prompt: q.prompt,
      choices: q.choices,
      answer: q.answer,
    }));
  }

  function buildVocabCards() {
    const words = window.VOCAB_WORDS_L5 || [];
    return words.map(w => {
      const wrong = shuffle(words.filter(x => x.word !== w.word)).slice(0, 3);
      const all = shuffle([w, ...wrong]);
      const answer = all.findIndex(x => x.word === w.word);
      return {
        id: 'VC' + w.num,
        prompt: w.meaning,
        choices: all.map(x => x.word),
        answer,
      };
    });
  }

  function buildReading() {
    const readings = window.READING_L5 || [];
    const list = [];
    readings.forEach(r => {
      (r.questions || []).forEach(q => {
        list.push({
          id: q.id,
          prompt: `📖 ${r.title}：${q.prompt}`,
          choices: q.choices,
          answer: q.answer,
        });
      });
    });
    return list;
  }

  // ---------- 工具 ----------
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pickWrongIndex(correct, n) {
    let r;
    do { r = Math.floor(Math.random() * n); } while (r === correct);
    return r;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // 啟動
  document.addEventListener('DOMContentLoaded', init);
})();
