/* ============================================================
   mode-reading.js — 模式 8：閱讀理解
   - 一篇閱讀（passage）+ 多個子題
   - 顯示方式依 type 不同：
       cloze    → 文章內 {{N}} 變成標籤
       passage  → 純文字段落
       dialogue → 對話（逐行）
       chart    → HTML 表格
       table    → key-value 雙欄表
   - 完成一篇後自動進下一篇；全部完成顯示總結
   ============================================================ */

(function () {
  'use strict';

  let container = null;
  let readings = [];
  let readingIdx = 0;
  let qIdx = 0;
  let answered = false;
  let stats = { correct: 0, wrong: 0 };
  let totalQuestions = 0;

  function init(rootEl) {
    container = rootEl;
    const data = window.READING_L5;
    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗（reading_L5.js）</p>';
      return;
    }
    // 錯題重做：保留有錯題子題的篇章，且僅留錯過的子題
    const filter = window.L5Shared.getRedoFilter('reading');
    let dataset = data;
    if (filter) {
      dataset = data
        .map(r => ({ ...r, questions: (r.questions || []).filter(q => filter.has(q.id)) }))
        .filter(r => r.questions.length > 0);
      if (!dataset.length) {
        container.innerHTML = '<p style="text-align:center;padding:40px 0;">此模式的錯題已全部清空 🎉 <a href="index.html">回主選單</a></p>';
        return;
      }
    }
    readings = window.L5Shared.shuffle(dataset); // 隨機篇章順序
    readingIdx = 0;
    qIdx = 0;
    stats = { correct: 0, wrong: 0 };
    answered = false;
    totalQuestions = readings.reduce((sum, r) => sum + (r.questions?.length || 0), 0);
    renderQuestion();
  }

  // ---------- 渲染當前題目 ----------
  function renderQuestion() {
    if (readingIdx >= readings.length) {
      renderEndScreen();
      return;
    }
    const reading = readings[readingIdx];
    if (qIdx >= reading.questions.length) {
      // 一篇結束，顯示「✅ 這篇完成」+ 下一篇按鈕
      renderReadingComplete(reading);
      return;
    }
    answered = false;
    const q = reading.questions[qIdx];
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="reading-stage">
        <div class="reading-source">📚 ${escapeHtml(reading.source || '')} · 第 ${readingIdx + 1}/${readings.length} 篇 · 第 ${qIdx + 1}/${reading.questions.length} 題</div>

        <details class="reading-passage" open>
          <summary>${escapeHtml(reading.title || '閱讀本文')}（點我可收合）</summary>
          <div class="reading-passage-body">${renderPassage(reading)}</div>
          ${reading.vocab ? `<div class="reading-vocab">📖 ${escapeHtml(reading.vocab)}</div>` : ''}
        </details>

        <div class="reading-question">
          <div class="reading-prompt">${escapeHtml(q.prompt)}</div>
          <div class="vocab-choices" id="reading-choices">
            ${q.choices.map((c, i) => `
              <button class="vocab-choice" data-index="${i}">
                <span class="letter">${letters[i]}</span>
                <span class="text">${escapeHtml(c)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="explanation-box" id="explanation-box" style="display:none;"></div>

        <div class="actions">
          <button class="btn btn-primary" id="btn-next" style="display:none;">下一題 →</button>
        </div>
      </div>
    `;

    container.querySelectorAll('.vocab-choice').forEach(b => b.addEventListener('click', onChoiceClick));
    updateStats();
  }

  // ---------- 渲染本文 ----------
  function renderPassage(reading) {
    const t = reading.type;
    if (t === 'cloze') return renderCloze(reading.passage);
    if (t === 'passage' || t === 'dialogue') return renderText(reading.passage);
    if (t === 'chart') return renderChart(reading.passage);
    if (t === 'table') return renderTable(reading.passage);
    return escapeHtml(String(reading.passage || ''));
  }

  function renderText(s) {
    // 把換行變段落
    return String(s).split(/\n+/).map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      return `<p class="reading-line">${escapeHtml(trimmed)}</p>`;
    }).join('');
  }

  function renderCloze(s) {
    // 把 {{N}} 換成可標示的徽章
    const html = escapeHtml(String(s)).replace(/\{\{(\d+)\}\}/g, (m, n) => `<span class="cloze-blank">${n}</span>`);
    return html.split(/\n+/).map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      return `<p class="reading-line">${trimmed}</p>`;
    }).join('');
  }

  function renderChart(passage) {
    const { headers = [], rows = [] } = passage || {};
    return `
      <table class="reading-chart">
        <thead>
          <tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td class="row-label">${escapeHtml(r.label)}</td>
              ${r.cells.map(c => `<td class="row-cell">${escapeHtml(c || '')}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  }

  function renderTable(passage) {
    const { rows = [] } = passage || {};
    return `
      <table class="reading-table">
        <tbody>
          ${rows.map(r => `
            <tr>
              <th>${escapeHtml(r.label)}</th>
              <td>${escapeHtml(r.value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  }

  // ---------- 點擊處理 ----------
  function onChoiceClick(e) {
    if (answered) return;
    answered = true;
    const clickedIdx = parseInt(e.currentTarget.dataset.index, 10);
    const reading = readings[readingIdx];
    const q = reading.questions[qIdx];
    const isCorrect = clickedIdx === q.answer;

    container.querySelectorAll('.vocab-choice').forEach(b => b.disabled = true);
    const clicked = container.querySelector(`.vocab-choice[data-index="${clickedIdx}"]`);
    const correct = container.querySelector(`.vocab-choice[data-index="${q.answer}"]`);

    if (isCorrect) {
      stats.correct++;
      clicked.classList.add('correct', 'pop');
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 答對了！', 1400);

      if (q.explanation) {
        const box = container.querySelector('#explanation-box');
        box.style.display = 'block';
        box.classList.add('mild');
        box.innerHTML = `
          <div class="explain-title">📖 補充說明</div>
          <div class="explain-text">${escapeHtml(q.explanation)}</div>
        `;
      }
    } else {
      stats.wrong++;
      clicked.classList.add('wrong');
      correct.classList.add('correct');
      window.L5Shared.vibrate([40, 60, 40]);

      const box = container.querySelector('#explanation-box');
      box.style.display = 'block';
      box.classList.remove('mild');
      box.innerHTML = `
        <div class="explain-title">💡 為什麼？</div>
        <div class="explain-text">${escapeHtml(q.explanation || '')}</div>
      `;

      window.L5Shared.saveWrong({
        mode: 'reading',
        id: q.id,
        prompt: q.prompt,
        userAnswer: q.choices[clickedIdx],
        correctAnswer: q.choices[q.answer],
      });
    }

    const next = container.querySelector('#btn-next');
    next.style.display = 'inline-block';
    next.addEventListener('click', () => { qIdx++; renderQuestion(); });
    updateStats();
  }

  // ---------- 一篇結束 ----------
  function renderReadingComplete(reading) {
    container.innerHTML = `
      <div class="reading-stage" style="text-align:center; padding: 30px 12px;">
        <h2>✅ 完成這一篇！</h2>
        <p style="color: var(--ink-soft); margin: 10px 0 20px;">
          <strong>${escapeHtml(reading.title || '')}</strong>
        </p>
        <div class="actions" style="justify-content:center;">
          <button class="btn btn-primary" id="btn-next-reading">下一篇 →</button>
        </div>
      </div>
    `;
    container.querySelector('#btn-next-reading').addEventListener('click', () => {
      readingIdx++;
      qIdx = 0;
      renderQuestion();
    });
  }

  // ---------- 結束畫面 ----------
  function renderEndScreen() {
    const total = stats.correct + stats.wrong;
    const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    let msg = '';
    if (pct >= 90) msg = '太厲害了！閱讀理解掌握度極高！';
    else if (pct >= 70) msg = '不錯喔，再加強細節理解就完美！';
    else if (pct >= 50) msg = '繼續努力，閱讀需要慢慢培養！';
    else msg = '別灰心，先把不熟的單字補一補再來！';

    container.innerHTML = `
      <div class="end-screen" style="text-align:center; padding: 30px 10px;">
        <h2>🎉 7 篇閱讀全部完成！</h2>
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
          <button class="btn btn-primary" id="btn-replay">🔁 再讀一輪</button>
          <a class="btn" href="index.html">← 回主選單</a>
        </div>
      </div>
    `;
    container.querySelector('#btn-replay').addEventListener('click', () => init(container));

    const prev = window.L5Shared.loadProgress('reading') || {};
    window.L5Shared.saveProgress('reading', {
      bestScore: Math.max(prev.bestScore || 0, stats.correct),
      totalQuestions: totalQuestions,
      attempts: (prev.attempts || 0) + 1,
      lastTs: Date.now(),
      completed: stats.correct === totalQuestions,
    });
  }

  function updateStats() {
    const done = stats.correct + stats.wrong;
    const progressEl = document.getElementById('stat-progress');
    const correctEl = document.getElementById('stat-correct');
    const wrongEl = document.getElementById('stat-wrong');
    if (progressEl) progressEl.textContent = `${done} / ${totalQuestions}`;
    if (correctEl) correctEl.textContent = String(stats.correct);
    if (wrongEl) wrongEl.textContent = String(stats.wrong);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  window.ModeReading = { init };
})();
