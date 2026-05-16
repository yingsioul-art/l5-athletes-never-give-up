/* ============================================================
   mode-howoften.js — 模式 4：How often 連連看
   - 左欄：5 個 How often 問句卡片
   - 右欄：5 個答句卡片（順序打亂）
   - 點問句 → 點答句，配對成功亮綠線；錯誤紅閃並還原
   - 全部連完播放慶祝動畫
   ============================================================ */

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  let container = null;
  let pairs = [];           // 原始 5 組資料
  let leftCards = [];        // 問句 DOM
  let rightCards = [];       // 答句 DOM
  let svgEl = null;
  let stageEl = null;
  let selected = null;       // { id, side, el }
  let matched = 0;
  let stats = { correct: 0, wrong: 0 };

  // ---------- 入口 ----------
  function init(rootEl) {
    container = rootEl;
    const data = window.HOWOFTEN_L5;
    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗（howoften_L5.js）</p>';
      return;
    }
    pairs = window.L5Shared.shuffle(data); // 整組順序也打亂
    selected = null;
    matched = 0;
    stats = { correct: 0, wrong: 0 };
    render();
  }

  // ---------- 渲染 ----------
  function render() {
    const shuffledAnswers = window.L5Shared.shuffle(pairs);

    container.innerHTML = `
      <h2 style="text-align:center; margin-bottom: 6px;">連連看 🔗</h2>
      <p class="subtitle" style="text-align:center; margin-bottom: 14px;">點問句，再點正確的答句</p>

      <div class="match-stage hide-zh" id="match-stage">
        <div class="match-grid" id="match-grid">
          <div class="match-column" id="match-questions">
            ${pairs.map(p => `
              <button class="match-card" data-id="${p.id}" data-side="q" aria-label="問句">
                <div class="match-en">${escapeHtml(p.question)}</div>
                <div class="match-zh">${escapeHtml(p.zh_question)}</div>
              </button>
            `).join('')}
          </div>
          <div class="match-column" id="match-answers">
            ${shuffledAnswers.map(p => `
              <button class="match-card" data-id="${p.id}" data-side="a" aria-label="答句">
                <div class="match-en">${escapeHtml(p.answer)}</div>
                <div class="match-zh">${escapeHtml(p.zh_answer)}</div>
              </button>
            `).join('')}
          </div>
          <svg class="match-svg" id="match-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>
        </div>
      </div>

      <div class="actions">
        <button class="btn" id="btn-toggle-zh">💡 顯示中文</button>
        <button class="btn" id="btn-reshuffle">🔄 重新洗牌</button>
      </div>
    `;

    stageEl = container.querySelector('#match-grid');
    svgEl = container.querySelector('#match-svg');
    leftCards = Array.from(container.querySelectorAll('#match-questions .match-card'));
    rightCards = Array.from(container.querySelectorAll('#match-answers .match-card'));

    [...leftCards, ...rightCards].forEach(c => c.addEventListener('click', onCardClick));
    container.querySelector('#btn-reshuffle').addEventListener('click', () => init(container));
    container.querySelector('#btn-toggle-zh').addEventListener('click', toggleZh);

    updateStats();
  }

  // ---------- 卡片點擊 ----------
  function onCardClick(e) {
    const card = e.currentTarget;
    if (card.classList.contains('matched')) return;

    // 首次點擊
    if (!selected) {
      selectCard(card);
      return;
    }

    // 同一張：取消選取
    if (selected.el === card) {
      deselect();
      return;
    }

    // 同欄：切換選取
    if (selected.side === card.dataset.side) {
      deselect();
      selectCard(card);
      return;
    }

    // 跨欄：判定配對
    const ok = selected.id === card.dataset.id;
    if (ok) {
      // 答對
      const qEl = selected.side === 'q' ? selected.el : card;
      const aEl = selected.side === 'q' ? card : selected.el;
      lockPair(qEl, aEl);
      const pair = pairs.find(p => p.id === card.dataset.id);
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 連對了！', 1200);
      setTimeout(() => window.L5Shared.speak(pair.answer, 'en-US', 0.95), 100);
      stats.correct++;
      matched++;
      if (matched === pairs.length) celebrate();
    } else {
      // 答錯
      const a = selected.el, b = card;
      a.classList.add('wrong', 'shake');
      b.classList.add('wrong', 'shake');
      window.L5Shared.vibrate([40, 60, 40]);
      window.L5Shared.showFeedback(container, 'wrong', '不對，再試試！', 1200);
      stats.wrong++;
      setTimeout(() => {
        a.classList.remove('wrong', 'shake');
        b.classList.remove('wrong', 'shake');
      }, 600);
    }
    deselect();
    updateStats();
  }

  function toggleZh() {
    // #match-stage 才是 CSS .hide-zh 的目標元素（stageEl 指的是 #match-grid，用於 SVG）
    const stage = container.querySelector('#match-stage');
    if (!stage) return;
    const isHidden = stage.classList.toggle('hide-zh');
    const btn = container.querySelector('#btn-toggle-zh');
    if (btn) btn.textContent = isHidden ? '💡 顯示中文' : '🙈 隱藏中文';
  }

  function selectCard(card) {
    selected = { id: card.dataset.id, side: card.dataset.side, el: card };
    card.classList.add('selected');
  }

  function deselect() {
    if (selected && selected.el) selected.el.classList.remove('selected');
    selected = null;
  }

  function lockPair(qEl, aEl) {
    qEl.classList.remove('selected');
    aEl.classList.remove('selected');
    qEl.classList.add('matched', 'pop');
    aEl.classList.add('matched', 'pop');
    setTimeout(() => {
      qEl.classList.remove('pop');
      aEl.classList.remove('pop');
    }, 360);
    drawLineBetween(qEl, aEl);
  }

  // ---------- 連線（SVG）----------
  function drawLineBetween(qEl, aEl) {
    if (!stageEl || !svgEl) return;
    const stageRect = stageEl.getBoundingClientRect();
    const r1 = qEl.getBoundingClientRect();
    const r2 = aEl.getBoundingClientRect();

    const x1 = r1.right - stageRect.left;
    const y1 = r1.top + r1.height / 2 - stageRect.top;
    const x2 = r2.left - stageRect.left;
    const y2 = r2.top + r2.height / 2 - stageRect.top;

    // 同步 SVG 尺寸給瀏覽器精確繪製
    svgEl.setAttribute('width', stageRect.width);
    svgEl.setAttribute('height', stageRect.height);
    svgEl.setAttribute('viewBox', `0 0 ${stageRect.width} ${stageRect.height}`);

    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#2d5016'); // --green
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-linecap', 'round');

    // 用 stroke-dashoffset 動畫畫線
    const len = Math.hypot(x2 - x1, y2 - y1);
    line.setAttribute('stroke-dasharray', String(len));
    line.setAttribute('stroke-dashoffset', String(len));
    line.style.transition = 'stroke-dashoffset 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    svgEl.appendChild(line);

    requestAnimationFrame(() => {
      line.setAttribute('stroke-dashoffset', '0');
    });
  }

  // ---------- 全部配對完成 ----------
  function celebrate() {
    setTimeout(() => {
      // 把所有 matched 卡片加上慶祝光暈
      container.querySelectorAll('.match-card.matched').forEach((c, i) => {
        setTimeout(() => c.classList.add('celebrate'), i * 80);
      });
      setTimeout(() => {
        showEndScreen();
      }, 1400);
    }, 600);
  }

  function showEndScreen() {
    const wrongCount = stats.wrong;
    let msg = '';
    if (wrongCount === 0) msg = '太厲害了！一次連對！';
    else if (wrongCount <= 2) msg = '不錯喔，再快一點就完美！';
    else if (wrongCount <= 4) msg = '繼續加油，再玩一次會更熟！';
    else msg = '別灰心，多練幾次就會記得！';

    const total = pairs.length;
    container.innerHTML = `
      <div class="end-screen" style="text-align:center; padding: 30px 10px;">
        <h2>🎉 全部連對了！</h2>
        <p style="color: var(--ink-soft); margin-bottom: 20px;">${msg}</p>
        <div style="display:flex; justify-content:center; gap: 30px; margin-bottom: 24px;">
          <div>
            <div style="color: var(--ink-soft); font-size: 12px;">連對</div>
            <div style="font-size: 32px; color: var(--green); font-weight: 700;">${total}</div>
          </div>
          <div>
            <div style="color: var(--ink-soft); font-size: 12px;">嘗試錯誤</div>
            <div style="font-size: 32px; color: var(--red); font-weight: 700;">${wrongCount}</div>
          </div>
        </div>
        <div class="actions">
          <button class="btn btn-primary" id="btn-replay">🔁 再玩一次</button>
          <a class="btn" href="index.html">← 回主選單</a>
        </div>
      </div>
    `;
    container.querySelector('#btn-replay').addEventListener('click', () => init(container));

    const prev = window.L5Shared.loadProgress('howoften') || {};
    window.L5Shared.saveProgress('howoften', {
      bestScore: pairs.length,
      totalQuestions: pairs.length,
      attempts: (prev.attempts || 0) + 1,
      bestWrong: Math.min(prev.bestWrong ?? Infinity, wrongCount),
      lastTs: Date.now(),
      completed: true,
    });
  }

  // ---------- 統計列 ----------
  function updateStats() {
    const total = pairs.length;
    const progressEl = document.getElementById('stat-progress');
    const correctEl = document.getElementById('stat-correct');
    const wrongEl = document.getElementById('stat-wrong');
    if (progressEl) progressEl.textContent = `${matched} / ${total}`;
    if (correctEl) correctEl.textContent = String(stats.correct);
    if (wrongEl) wrongEl.textContent = String(stats.wrong);
  }

  // ---------- 工具 ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ---------- 對外介面 ----------
  window.ModeHowOften = { init };
})();
