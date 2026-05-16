/* ============================================================
   mode-vocab.js — 模式 6：字彙/語法選擇題（4 選 1）
   - 通用 4 選 1 模式，可承載：副詞語意辨識、單字詞義、句型選擇、How often 答題
   - 答對 → 該選項變綠 + 朗讀完整句 + 顯示解釋
   - 答錯 → 該選項變紅 + 標出正確選項變綠 + 顯示解釋 + 記入錯題本
   ============================================================ */

(function () {
  'use strict';

  let container = null;
  let questions = [];
  let idx = 0;
  let answered = false;
  let stats = { correct: 0, wrong: 0 };

  // ---------- 入口 ----------
  function init(rootEl) {
    container = rootEl;
    const data = window.VOCAB_QUIZ_L5;
    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗（vocab_quiz_L5.js）</p>';
      return;
    }
    // 錯題重做模式：只篩出曾經答錯的題目
    const filter = window.L5Shared.getRedoFilter('vocab');
    let dataset = data;
    if (filter) {
      dataset = data.filter(q => filter.has(q.id));
      if (!dataset.length) {
        container.innerHTML = '<p style="text-align:center;padding:40px 0;">此模式的錯題已全部清空 🎉 <a href="index.html">回主選單</a></p>';
        return;
      }
    }
    questions = window.L5Shared.shuffle(dataset);
    idx = 0;
    stats = { correct: 0, wrong: 0 };
    answered = false;
    renderQuestion();
  }

  // ---------- 渲染題目 ----------
  function renderQuestion() {
    if (idx >= questions.length) {
      renderEndScreen();
      return;
    }
    answered = false;
    const q = questions[idx];
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="vocab-stage">
        <div class="vocab-source">📚 ${escapeHtml(q.source || '')}</div>
        <div class="vocab-prompt">${escapeHtml(q.prompt)}</div>

        <div class="vocab-choices" id="vocab-choices">
          ${q.choices.map((c, i) => `
            <button class="vocab-choice" data-index="${i}">
              <span class="letter">${letters[i]}</span>
              <span class="text">${escapeHtml(c)}</span>
            </button>
          `).join('')}
        </div>

        <div class="explanation-box" id="explanation-box" style="display:none;"></div>

        <div class="actions">
          <button class="btn btn-primary" id="btn-next" style="display:none;">下一題 →</button>
        </div>
      </div>
    `;

    container.querySelectorAll('.vocab-choice').forEach(b => {
      b.addEventListener('click', onChoiceClick);
    });
    updateStats();
  }

  function onChoiceClick(e) {
    if (answered) return;
    answered = true;
    const clickedIdx = parseInt(e.currentTarget.dataset.index, 10);
    const q = questions[idx];
    const isCorrect = clickedIdx === q.answer;

    const buttons = container.querySelectorAll('.vocab-choice');
    buttons.forEach(b => b.disabled = true);

    const clickedBtn = container.querySelector(`.vocab-choice[data-index="${clickedIdx}"]`);
    const correctBtn = container.querySelector(`.vocab-choice[data-index="${q.answer}"]`);

    if (isCorrect) {
      stats.correct++;
      clickedBtn.classList.add('correct', 'pop');
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 答對了！', 1400);
      if (q.en_full) setTimeout(() => window.L5Shared.speak(q.en_full), 200);
    } else {
      stats.wrong++;
      clickedBtn.classList.add('wrong');
      correctBtn.classList.add('correct');
      window.L5Shared.vibrate([40, 60, 40]);

      const box = container.querySelector('#explanation-box');
      box.style.display = 'block';
      box.innerHTML = `
        <div class="explain-title">💡 為什麼？</div>
        <div class="explain-text">${escapeHtml(q.explanation || '')}</div>
        ${q.zh ? `<div class="explain-correct">中文：<strong>${escapeHtml(q.zh)}</strong></div>` : ''}
      `;

      window.L5Shared.saveWrong({
        mode: 'vocab',
        id: q.id,
        prompt: q.prompt,
        userAnswer: q.choices[clickedIdx],
        correctAnswer: q.choices[q.answer],
      });

      if (q.en_full) setTimeout(() => window.L5Shared.speak(q.en_full), 400);
    }

    // 答對時也顯示解釋（不擋下一題流程）
    if (isCorrect && q.explanation) {
      const box = container.querySelector('#explanation-box');
      box.style.display = 'block';
      box.innerHTML = `
        <div class="explain-title">📖 補充說明</div>
        <div class="explain-text">${escapeHtml(q.explanation)}</div>
        ${q.zh ? `<div class="explain-correct">中文：<strong>${escapeHtml(q.zh)}</strong></div>` : ''}
      `;
      box.classList.add('mild');
    }

    const next = container.querySelector('#btn-next');
    next.style.display = 'inline-block';
    next.addEventListener('click', () => { idx++; renderQuestion(); });

    updateStats();
  }

  // ---------- 結束畫面 ----------
  function renderEndScreen() {
    const total = stats.correct + stats.wrong;
    const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    let msg = '';
    if (pct >= 90) msg = '太厲害了！字彙與句型完全掌握！';
    else if (pct >= 70) msg = '不錯喔，再加把勁就完美！';
    else if (pct >= 50) msg = '繼續努力，多複習就會進步！';
    else msg = '別灰心，從錯題本找出弱點再來！';

    container.innerHTML = `
      <div class="end-screen" style="text-align:center; padding: 30px 10px;">
        <h2>🎉 完成這一輪！</h2>
        <p style="color: var(--ink-soft); margin-bottom: 20px;">${msg}</p>
        <div style="display:flex; justify-content:center; gap: 30px; margin-bottom: 24px;">
          <div>
            <div style="color: var(--ink-soft); font-size: 12px;">答對</div>
            <div style="font-size: 32px; color: var(--green); font-weight: 700;">${stats.correct}</div>
          </div>
          <div>
            <div style="color: var(--ink-soft); font-size: 12px;">答錯</div>
            <div style="font-size: 32px; color: var(--red); font-weight: 700;">${stats.wrong}</div>
          </div>
          <div>
            <div style="color: var(--ink-soft); font-size: 12px;">正確率</div>
            <div style="font-size: 32px; color: var(--orange); font-weight: 700;">${pct}%</div>
          </div>
        </div>
        <div class="actions">
          <button class="btn btn-primary" id="btn-replay">🔁 再練一次</button>
          <a class="btn" href="index.html">← 回主選單</a>
        </div>
      </div>
    `;
    container.querySelector('#btn-replay').addEventListener('click', () => init(container));

    const prev = window.L5Shared.loadProgress('vocab') || {};
    window.L5Shared.saveProgress('vocab', {
      bestScore: Math.max(prev.bestScore || 0, stats.correct),
      totalQuestions: questions.length,
      attempts: (prev.attempts || 0) + 1,
      lastTs: Date.now(),
      completed: stats.correct === questions.length,
    });
  }

  // ---------- 統計列 ----------
  function updateStats() {
    const total = questions.length;
    const progressEl = document.getElementById('stat-progress');
    const correctEl = document.getElementById('stat-correct');
    const wrongEl = document.getElementById('stat-wrong');
    if (progressEl) progressEl.textContent = `${Math.min(idx + 1, total)} / ${total}`;
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
  window.ModeVocab = { init };
})();
