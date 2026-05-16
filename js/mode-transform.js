/* ============================================================
   mode-transform.js — 模式 9：句型轉換（3 種輸入方式）
   - ⌨️ 打字：textarea + 寬鬆比對
   - 🖊️ 手寫：canvas + 看答案自評
   - 🧩 拖拉：tile 拖到句子區 + 順序比對（預設）
   ============================================================ */

(function () {
  'use strict';

  let container = null;
  let questions = [];
  let idx = 0;
  let answered = false;
  let stats = { correct: 0, wrong: 0 };
  let inputMethod = 'drag'; // 'drag' | 'keyboard' | 'handwriting'

  let drag = { tile: null, clone: null, offX: 0, offY: 0 };
  let canvas = null, ctx = null, drawing = false;

  function init(rootEl) {
    container = rootEl;
    const data = window.TRANSFORM_L5;
    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗</p>';
      return;
    }
    const filter = window.L5Shared.getRedoFilter('transform');
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
    inputMethod = 'drag';
    renderQuestion();
  }

  function renderQuestion() {
    if (idx >= questions.length) { renderEndScreen(); return; }
    answered = false;
    const q = questions[idx];

    let originalHtml = escapeHtml(q.original);
    if (q.underline_text) {
      const target = escapeHtml(q.underline_text);
      originalHtml = originalHtml.replace(target, `<u class="emphasis">${target}</u>`);
    }

    container.innerHTML = `
      <div class="transform-stage">
        <div class="reading-source">📚 ${escapeHtml(q.source || '')}</div>

        <div class="transform-original">
          <span class="label">原句</span>
          <div class="text">${originalHtml}</div>
        </div>

        <div class="translate-hint">💡 提示：${escapeHtml(q.hint)}</div>

        <div class="input-method-switch" id="input-method-switch">
          <button data-method="drag" class="${inputMethod==='drag'?'active':''}">🧩 拖拉</button>
          <button data-method="keyboard" class="${inputMethod==='keyboard'?'active':''}">⌨️ 打字</button>
          <button data-method="handwriting" class="${inputMethod==='handwriting'?'active':''}">🖊️ 手寫</button>
        </div>

        <div id="input-area"></div>

        <div class="explanation-box" id="explanation-box" style="display:none;"></div>
      </div>
    `;

    container.querySelectorAll('#input-method-switch button').forEach(b => {
      b.addEventListener('click', () => switchMethod(b.dataset.method));
    });

    renderInputArea();
    updateStats();
  }

  function switchMethod(m) {
    if (m === inputMethod) return;
    inputMethod = m;
    answered = false;
    container.querySelector('#explanation-box').style.display = 'none';
    container.querySelectorAll('#input-method-switch button').forEach(b => {
      b.classList.toggle('active', b.dataset.method === m);
    });
    renderInputArea();
  }

  function renderInputArea() {
    const area = container.querySelector('#input-area');
    if (inputMethod === 'drag') renderDrag(area);
    else if (inputMethod === 'keyboard') renderKeyboard(area);
    else renderHandwriting(area);
  }

  // ============= ⌨️ 打字 =============
  function renderKeyboard(area) {
    area.innerHTML = `
      <textarea class="translate-input" id="t-input" rows="2"
                placeholder="輸入改寫後的句子... (Ctrl+Enter 送出)"
                autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>
      <div class="actions">
        <button class="btn" id="btn-show">💡 看答案</button>
        <button class="btn btn-primary" id="btn-submit">送出 ✓</button>
        <button class="btn btn-primary" id="btn-next" style="display:none;">下一題 →</button>
      </div>
    `;
    const input = area.querySelector('#t-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); checkKeyboard(); }
    });
    area.querySelector('#btn-submit').addEventListener('click', checkKeyboard);
    area.querySelector('#btn-show').addEventListener('click', revealKeyboard);
    input.focus();
  }

  function checkKeyboard() {
    if (answered) return;
    const input = container.querySelector('#t-input');
    const userRaw = input.value.trim();
    if (!userRaw) { window.L5Shared.showFeedback(container, 'wrong', '請先輸入句子！', 1500); return; }
    answered = true;
    const q = questions[idx];
    const ok = normalize(userRaw) === normalize(q.answer);
    input.disabled = true;
    if (ok) {
      stats.correct++;
      input.classList.add('correct');
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 改寫正確！', 1600);
      setTimeout(() => window.L5Shared.speak(q.answer), 200);
      showExplanationMild(q);
    } else {
      stats.wrong++;
      input.classList.add('wrong');
      window.L5Shared.vibrate([40, 60, 40]);
      showExplanationWrong(q, userRaw);
      window.L5Shared.saveWrong({
        mode: 'transform', id: q.id + '_kb',
        prompt: `${q.original}（${q.hint}）`,
        userAnswer: userRaw, correctAnswer: q.answer,
      });
      setTimeout(() => window.L5Shared.speak(q.answer), 400);
    }
    showNextButton();
    updateStats();
  }

  function revealKeyboard() {
    if (answered) return;
    answered = true;
    const q = questions[idx];
    const input = container.querySelector('#t-input');
    input.value = q.answer;
    input.disabled = true;
    input.classList.add('correct');
    window.L5Shared.showFeedback(container, 'info', '已顯示答案，下次自己挑戰！', 1800);
    setTimeout(() => window.L5Shared.speak(q.answer), 200);
    showExplanationMild(q);
    showNextButton();
  }

  // ============= 🖊️ 手寫 =============
  function renderHandwriting(area) {
    area.innerHTML = `
      <canvas id="hw-canvas"></canvas>
      <div class="canvas-toolbar">
        <button class="btn" id="hw-clear">🧹 清空</button>
        <button class="btn" id="hw-reveal">👀 看答案</button>
        <button class="btn btn-primary" id="hw-next" style="display:none;">下一題 →</button>
      </div>
      <div id="hw-reveal-box"></div>
      <p class="handwriting-note">💡 手寫無法自動批改，按「看答案」自我核對。</p>
    `;
    initCanvas();
    area.querySelector('#hw-clear').addEventListener('click', clearCanvas);
    area.querySelector('#hw-reveal').addEventListener('click', revealHandwriting);
  }

  function initCanvas() {
    canvas = container.querySelector('#hw-canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#2d5016';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawGuides();
    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault(); drawing = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      e.preventDefault();
      const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke();
    });
    const stop = () => { drawing = false; };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    canvas.addEventListener('pointerleave', stop);
  }

  function drawGuides() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr, h = canvas.height / dpr;
    ctx.save();
    ctx.strokeStyle = 'rgba(45, 80, 22, 0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    [h * 0.3, h * 0.7].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); });
    ctx.setLineDash([]);
    ctx.restore();
  }

  function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuides();
    container.querySelector('#hw-reveal-box').innerHTML = '';
  }

  function revealHandwriting() {
    const q = questions[idx];
    container.querySelector('#hw-reveal-box').innerHTML =
      `<div class="reveal-answer">${escapeHtml(q.answer)}</div>`;
    window.L5Shared.speak(q.answer);
    container.querySelector('#hw-next').style.display = 'inline-block';
    container.querySelector('#hw-next').onclick = () => { idx++; renderQuestion(); };
    showExplanationMild(q);
  }

  // ============= 🧩 拖拉 =============
  function renderDrag(area) {
    const q = questions[idx];
    const answerTokens = tokenize(q.answer);
    const distractors = q.distractors || [];
    const allTiles = window.L5Shared.shuffle([...answerTokens, ...distractors]);

    area.innerHTML = `
      <div class="drag-sentence" id="drag-sentence">
        <span class="drag-sentence-hint">⬇ 拖到這裡組成改寫後的句子</span>
      </div>
      <div class="drag-tray" id="drag-tray">
        ${allTiles.map((t, i) => `
          <button class="drag-tile ${isPunctuation(t) ? 'punct' : ''}"
                  data-token="${escapeAttr(t)}" data-tile-id="t${i}">${escapeHtml(t)}</button>
        `).join('')}
      </div>
      <div class="actions">
        <button class="btn" id="btn-clear">🧹 重排</button>
        <button class="btn" id="btn-show">💡 看答案</button>
        <button class="btn btn-primary" id="btn-submit">送出 ✓</button>
        <button class="btn btn-primary" id="btn-next" style="display:none;">下一題 →</button>
      </div>
    `;

    area.querySelectorAll('.drag-tile').forEach(tile => {
      tile.addEventListener('pointerdown', onTileDown);
      tile.addEventListener('click', onTileClick);
    });
    area.querySelector('#btn-clear').onclick = clearSentence;
    area.querySelector('#btn-show').onclick = revealDrag;
    area.querySelector('#btn-submit').onclick = checkDrag;
    area.querySelector('#drag-sentence').addEventListener('click', (e) => {
      const t = e.target.closest('.drag-tile');
      if (t && !answered) returnTileToTray(t);
    });
  }

  function tokenize(s) { return String(s).match(/[A-Za-z']+|[.,!?;:"'"]/g) || []; }
  function isPunctuation(t) { return /^[.,!?;:"'"]+$/.test(t); }

  function onTileClick(e) {
    if (answered) return;
    const tile = e.currentTarget;
    if (tile._dragged) { tile._dragged = false; return; }
    if (tile.parentElement.id === 'drag-tray') moveTileToSentence(tile);
    else if (tile.parentElement.id === 'drag-sentence') returnTileToTray(tile);
  }
  function moveTileToSentence(tile) {
    const sent = container.querySelector('#drag-sentence');
    const hint = sent.querySelector('.drag-sentence-hint');
    if (hint) hint.style.display = 'none';
    sent.appendChild(tile);
  }
  function returnTileToTray(tile) {
    const tray = container.querySelector('#drag-tray');
    tray.appendChild(tile);
    const sent = container.querySelector('#drag-sentence');
    if (!sent.querySelector('.drag-tile')) {
      const hint = sent.querySelector('.drag-sentence-hint');
      if (hint) hint.style.display = '';
    }
  }
  function clearSentence() {
    if (answered) return;
    container.querySelectorAll('#drag-sentence .drag-tile').forEach(t => returnTileToTray(t));
  }

  function onTileDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (answered) return;
    const tile = e.currentTarget;
    e.preventDefault();
    drag.tile = tile; tile.classList.add('dragging'); tile._dragged = false;
    const rect = tile.getBoundingClientRect();
    drag.clone = tile.cloneNode(true);
    drag.clone.classList.remove('dragging');
    Object.assign(drag.clone.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '9999',
      width: rect.width + 'px', left: rect.left + 'px', top: rect.top + 'px',
      opacity: '0.92', transform: 'scale(1.06)', transition: 'none'
    });
    document.body.appendChild(drag.clone);
    drag.offX = e.clientX - rect.left; drag.offY = e.clientY - rect.top;
    try { tile.setPointerCapture(e.pointerId); } catch (_) {}
    tile.addEventListener('pointermove', onTileMove);
    tile.addEventListener('pointerup', onTileUp);
    tile.addEventListener('pointercancel', onTileUp);
  }
  function onTileMove(e) {
    if (!drag.tile || !drag.clone) return;
    e.preventDefault();
    drag.clone.style.left = (e.clientX - drag.offX) + 'px';
    drag.clone.style.top = (e.clientY - drag.offY) + 'px';
    drag.tile._dragged = true;
    const target = findDropTargetUnder(e.clientX, e.clientY);
    container.querySelectorAll('.drag-sentence.drag-over, .drag-tray.drag-over')
      .forEach(z => z.classList.remove('drag-over'));
    if (target) target.classList.add('drag-over');
  }
  function onTileUp(e) {
    if (!drag.tile) return;
    const tile = drag.tile;
    const target = findDropTargetUnder(e.clientX, e.clientY);
    cleanupDrag();
    if (target) {
      const ref = elementUnderExcept(e.clientX, e.clientY, tile);
      if (ref && ref.classList.contains('drag-tile') && ref.parentElement === target) {
        const r = ref.getBoundingClientRect();
        const placeBefore = e.clientX < r.left + r.width / 2;
        target.insertBefore(tile, placeBefore ? ref : ref.nextSibling);
      } else { target.appendChild(tile); }
      const sent = container.querySelector('#drag-sentence');
      const hint = sent.querySelector('.drag-sentence-hint');
      if (hint) hint.style.display = sent.querySelectorAll('.drag-tile').length ? 'none' : '';
    }
  }
  function findDropTargetUnder(x, y) {
    const el = document.elementFromPoint(x, y);
    return el ? (el.closest('.drag-sentence') || el.closest('.drag-tray')) : null;
  }
  function elementUnderExcept(x, y, except) {
    if (drag.clone) drag.clone.style.display = 'none';
    const el = document.elementFromPoint(x, y);
    if (drag.clone) drag.clone.style.display = '';
    return (el && el !== except && !except.contains(el)) ? el : null;
  }
  function cleanupDrag() {
    if (drag.clone) { drag.clone.remove(); drag.clone = null; }
    if (drag.tile) {
      drag.tile.classList.remove('dragging');
      drag.tile.removeEventListener('pointermove', onTileMove);
      drag.tile.removeEventListener('pointerup', onTileUp);
      drag.tile.removeEventListener('pointercancel', onTileUp);
      drag.tile = null;
    }
    container.querySelectorAll('.drag-sentence.drag-over, .drag-tray.drag-over')
      .forEach(z => z.classList.remove('drag-over'));
  }

  function checkDrag() {
    if (answered) return;
    const sentTiles = Array.from(container.querySelectorAll('#drag-sentence .drag-tile'));
    if (!sentTiles.length) {
      window.L5Shared.showFeedback(container, 'wrong', '請先拖入 tile 組成句子！', 1500);
      return;
    }
    answered = true;
    const userTokens = sentTiles.map(t => t.dataset.token);
    const userSentence = joinTokens(userTokens);
    const q = questions[idx];
    const expectedTokens = tokenize(q.answer);
    const ok = arraysEqualCI(expectedTokens, userTokens);

    if (ok) {
      sentTiles.forEach(t => t.classList.add('correct'));
      stats.correct++;
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 改寫正確！', 1600);
      setTimeout(() => window.L5Shared.speak(q.answer), 200);
      showExplanationMild(q);
    } else {
      sentTiles.forEach(t => t.classList.add('wrong'));
      stats.wrong++;
      window.L5Shared.vibrate([40, 60, 40]);
      showExplanationWrong(q, userSentence);
      window.L5Shared.saveWrong({
        mode: 'transform', id: q.id + '_drag',
        prompt: `${q.original}（${q.hint}）`,
        userAnswer: userSentence, correctAnswer: q.answer,
      });
      setTimeout(() => window.L5Shared.speak(q.answer), 400);
    }
    container.querySelector('#btn-submit').style.display = 'none';
    container.querySelector('#btn-show').style.display = 'none';
    container.querySelector('#btn-clear').style.display = 'none';
    const next = container.querySelector('#btn-next');
    next.style.display = 'inline-block';
    next.onclick = () => { idx++; renderQuestion(); };
    updateStats();
  }

  function revealDrag() {
    if (answered) return;
    answered = true;
    const q = questions[idx];
    const target = tokenize(q.answer);
    const sent = container.querySelector('#drag-sentence');
    const tray = container.querySelector('#drag-tray');
    sent.querySelectorAll('.drag-tile').forEach(t => tray.appendChild(t));
    sent.querySelector('.drag-sentence-hint').style.display = 'none';
    const usedIds = new Set();
    target.forEach(tok => {
      const found = Array.from(tray.querySelectorAll('.drag-tile'))
        .find(t => !usedIds.has(t.dataset.tileId) && t.dataset.token.toLowerCase() === tok.toLowerCase());
      if (found) {
        usedIds.add(found.dataset.tileId);
        found.classList.add('correct');
        sent.appendChild(found);
      }
    });
    window.L5Shared.showFeedback(container, 'info', '已顯示答案順序，下次自己挑戰！', 1800);
    setTimeout(() => window.L5Shared.speak(q.answer), 200);
    showExplanationMild(q);
    container.querySelector('#btn-submit').style.display = 'none';
    container.querySelector('#btn-show').style.display = 'none';
    container.querySelector('#btn-clear').style.display = 'none';
    const next = container.querySelector('#btn-next');
    next.style.display = 'inline-block';
    next.onclick = () => { idx++; renderQuestion(); };
  }

  // ============= 共用 =============
  function normalize(s) {
    return String(s || '').toLowerCase()
      .replace(/[“”"'‘’]/g, '')
      .replace(/[.,!?;:—\-–]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  function joinTokens(t) { return t.join(' ').replace(/\s+([.,!?;:"'])/g, '$1'); }
  function arraysEqualCI(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i].toLowerCase() !== b[i].toLowerCase()) return false;
    return true;
  }

  function showExplanationMild(q) {
    if (!q.explanation) return;
    const box = container.querySelector('#explanation-box');
    box.style.display = 'block';
    box.classList.add('mild');
    box.innerHTML = `<div class="explain-title">📖 補充說明</div><div class="explain-text">${escapeHtml(q.explanation)}</div>`;
  }
  function showExplanationWrong(q, userText) {
    const box = container.querySelector('#explanation-box');
    box.style.display = 'block';
    box.classList.remove('mild');
    box.innerHTML = `
      <div class="explain-title">💡 正確改寫</div>
      <div class="explain-correct"><strong>${escapeHtml(q.answer)}</strong></div>
      <div class="explain-text" style="margin-top:8px;"><strong>說明：</strong>${escapeHtml(q.explanation || '')}</div>
      <div class="explain-text" style="margin-top:6px; font-size:12px; color: var(--ink-soft);">你寫的：${escapeHtml(userText)}</div>
    `;
  }
  function showNextButton() {
    const submit = container.querySelector('#btn-submit');
    const show = container.querySelector('#btn-show');
    const next = container.querySelector('#btn-next');
    if (submit) submit.style.display = 'none';
    if (show) show.style.display = 'none';
    if (next) { next.style.display = 'inline-block'; next.onclick = () => { idx++; renderQuestion(); }; }
  }

  function renderEndScreen() {
    const total = stats.correct + stats.wrong;
    const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    let msg = pct >= 90 ? '太厲害了！句型轉換完全掌握！' :
              pct >= 70 ? '不錯喔，再加把勁就完美！' :
              pct >= 50 ? '繼續努力，這類題目最考細節！' : '別灰心，可以回頭複習文法重點。';
    container.innerHTML = `
      <div class="end-screen" style="text-align:center; padding: 30px 10px;">
        <h2>🎉 完成這一輪！</h2>
        <p style="color: var(--ink-soft); margin-bottom: 20px;">${msg}</p>
        <div style="display:flex; justify-content:center; gap: 30px; margin-bottom: 24px;">
          <div><div style="color: var(--ink-soft); font-size: 12px;">答對</div><div style="font-size: 32px; color: var(--green); font-weight: 700;">${stats.correct}</div></div>
          <div><div style="color: var(--ink-soft); font-size: 12px;">答錯</div><div style="font-size: 32px; color: var(--red); font-weight: 700;">${stats.wrong}</div></div>
          <div><div style="color: var(--ink-soft); font-size: 12px;">正確率</div><div style="font-size: 32px; color: var(--orange); font-weight: 700;">${pct}%</div></div>
        </div>
        <div class="actions">
          <button class="btn btn-primary" id="btn-replay">🔁 再練一次</button>
          <a class="btn" href="index.html">← 回主選單</a>
        </div>
      </div>
    `;
    container.querySelector('#btn-replay').addEventListener('click', () => init(container));
    const prev = window.L5Shared.loadProgress('transform') || {};
    window.L5Shared.saveProgress('transform', {
      bestScore: Math.max(prev.bestScore || 0, stats.correct),
      totalQuestions: questions.length,
      attempts: (prev.attempts || 0) + 1,
      lastTs: Date.now(),
      completed: stats.correct === questions.length,
    });
  }

  function updateStats() {
    const total = questions.length;
    const p = document.getElementById('stat-progress'), c = document.getElementById('stat-correct'), w = document.getElementById('stat-wrong');
    if (p) p.textContent = `${Math.min(idx + 1, total)} / ${total}`;
    if (c) c.textContent = String(stats.correct);
    if (w) w.textContent = String(stats.wrong);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  window.ModeTransform = { init };
})();
