/* ============================================================
   mode-fillblank.js — 模式 3：Look and Write 填空（3 種輸入方式）
   - ⌨️ 打字：input 框直接打字（預設）
   - 🖊️ 手寫：canvas 畫板 + 看答案自評
   - 🧩 拖拉：每個 ___ 變成 drop slot，tile 拖入或點擊填入
   ============================================================ */

(function () {
  'use strict';

  let container = null;
  let questions = [];
  let idx = 0;
  let answered = false;
  let stats = { correct: 0, wrong: 0 };
  let inputMethod = 'keyboard'; // 'keyboard' | 'drag' | 'handwriting'

  let drag = { tile: null, clone: null, offX: 0, offY: 0 };
  let canvas = null, ctx = null, drawing = false;

  // 干擾項目池（拖拉模式用）
  const DISTRACTOR_POOL = [
    'is', 'am', 'are', 'was', 'do', 'does',
    'always', 'usually', 'often', 'sometimes', 'seldom', 'never',
    'play', 'plays', 'go', 'goes', 'sing', 'sings', 'jump', 'jumps',
    'cares', 'care', 'reads', 'read', 'sleep', 'sleeps'
  ];

  function init(rootEl) {
    container = rootEl;
    const data = window.FILLBLANK_L5;
    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗</p>';
      return;
    }
    const filter = window.L5Shared.getRedoFilter('fillblank');
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
    inputMethod = 'keyboard';
    renderQuestion();
  }

  function renderQuestion() {
    if (idx >= questions.length) { renderEndScreen(); return; }
    answered = false;
    const q = questions[idx];

    container.innerHTML = `
      <div class="fillblank-stage">
        <div class="fillblank-hint-box">
          <span class="hint-label">提示</span>
          <span class="hint-text">${escapeHtml(q.hint)}</span>
        </div>

        <div class="input-method-switch" id="input-method-switch">
          <button data-method="keyboard" class="${inputMethod==='keyboard'?'active':''}">⌨️ 打字</button>
          <button data-method="drag" class="${inputMethod==='drag'?'active':''}">🧩 拖拉</button>
          <button data-method="handwriting" class="${inputMethod==='handwriting'?'active':''}">🖊️ 手寫</button>
        </div>

        <div id="input-area"></div>

        <div class="zh-hint">${escapeHtml(q.zh)}</div>
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
    if (inputMethod === 'keyboard') renderKeyboard(area);
    else if (inputMethod === 'drag') renderDrag(area);
    else renderHandwriting(area);
  }

  // ============= ⌨️ 打字 =============
  function renderKeyboard(area) {
    const q = questions[idx];
    const parts = q.template.split('___');
    const blankCount = parts.length - 1;
    let sentenceHtml = '';
    parts.forEach((seg, i) => {
      sentenceHtml += escapeHtml(seg);
      if (i < blankCount) {
        sentenceHtml += `<input type="text" class="blank-input" data-index="${i}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" />`;
      }
    });

    area.innerHTML = `
      <div class="fillblank-sentence">${sentenceHtml}</div>
      <div class="actions">
        <button class="btn" id="btn-show">💡 看答案</button>
        <button class="btn btn-primary" id="btn-submit">送出 ✓</button>
        <button class="btn btn-primary" id="btn-next" style="display:none;">下一題 →</button>
      </div>
    `;

    const inputs = area.querySelectorAll('.blank-input');
    inputs.forEach((input, i) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (i < inputs.length - 1) inputs[i + 1].focus();
          else checkKeyboard();
        }
      });
    });
    area.querySelector('#btn-submit').addEventListener('click', checkKeyboard);
    area.querySelector('#btn-show').addEventListener('click', revealKeyboard);
    if (inputs[0]) inputs[0].focus();
  }

  function isAnswerCorrect(userInput, accepted) {
    const user = String(userInput || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (Array.isArray(accepted)) {
      return accepted.some(a => {
        if (typeof a === 'string') return user === a.trim().toLowerCase();
        if (a instanceof RegExp) return a.test(user);
        return false;
      });
    }
    return user === String(accepted).trim().toLowerCase();
  }

  function checkKeyboard() {
    if (answered) return;
    answered = true;
    const q = questions[idx];
    const inputs = container.querySelectorAll('.blank-input');
    const userAnswers = Array.from(inputs).map(i => i.value);
    let allCorrect = true;
    inputs.forEach((input, i) => {
      const ok = isAnswerCorrect(userAnswers[i], q.answers[i]);
      input.disabled = true;
      input.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) allCorrect = false;
    });
    if (allCorrect) {
      stats.correct++;
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 答對了！', 1500);
      setTimeout(() => window.L5Shared.speak(q.en_full), 200);
      showExplanationMild(q);
    } else {
      stats.wrong++;
      window.L5Shared.vibrate([40, 60, 40]);
      inputs.forEach((input, i) => {
        if (input.classList.contains('wrong')) {
          const correctText = Array.isArray(q.answers[i])
            ? q.answers[i].filter(a => typeof a === 'string')[0] || ''
            : q.answers[i];
          const tip = document.createElement('span');
          tip.className = 'correct-tip';
          tip.textContent = `→ ${correctText}`;
          input.insertAdjacentElement('afterend', tip);
        }
      });
      showExplanationWrong(q, userAnswers.map((a, i) => a || '(空)').join(' / '));
      window.L5Shared.saveWrong({
        mode: 'fillblank', id: q.id + '_kb',
        prompt: `${q.template}（${q.hint}）`,
        userAnswer: userAnswers.join(' / '),
        correctAnswer: q.en_full,
      });
      setTimeout(() => window.L5Shared.speak(q.en_full), 400);
    }
    showNextButton();
    updateStats();
  }

  function revealKeyboard() {
    if (answered) return;
    answered = true;
    const q = questions[idx];
    const inputs = container.querySelectorAll('.blank-input');
    inputs.forEach((input, i) => {
      const a = Array.isArray(q.answers[i])
        ? (q.answers[i].filter(x => typeof x === 'string')[0] || '')
        : q.answers[i];
      input.value = a;
      input.disabled = true;
      input.classList.add('correct');
    });
    window.L5Shared.showFeedback(container, 'info', '已顯示答案，下次自己挑戰！', 1800);
    setTimeout(() => window.L5Shared.speak(q.en_full), 200);
    showExplanationMild(q);
    showNextButton();
  }

  // ============= 🧩 拖拉 =============
  function renderDrag(area) {
    const q = questions[idx];
    const parts = q.template.split('___');
    const blankCount = parts.length - 1;
    const correctTiles = q.answers.map(a =>
      Array.isArray(a) ? (a.filter(x => typeof x === 'string')[0] || '') : String(a)
    );

    // 產生 2-3 個誘餌，避免與正解重複（不分大小寫）
    const correctLower = new Set(correctTiles.map(t => t.toLowerCase()));
    const distractors = window.L5Shared.shuffle(DISTRACTOR_POOL.filter(d => !correctLower.has(d.toLowerCase()))).slice(0, 2);
    const allTiles = window.L5Shared.shuffle([...correctTiles, ...distractors]);

    let sentenceHtml = '';
    parts.forEach((seg, i) => {
      sentenceHtml += escapeHtml(seg);
      if (i < blankCount) {
        sentenceHtml += `<span class="blank-slot" data-pos="${i}"><span class="slot-placeholder">___</span></span>`;
      }
    });

    area.innerHTML = `
      <div class="fillblank-sentence" id="fb-sentence">${sentenceHtml}</div>
      <div class="drag-tray" id="drag-tray">
        ${allTiles.map((t, i) => `
          <button class="drag-tile" data-token="${escapeAttr(t)}" data-tile-id="t${i}">${escapeHtml(t)}</button>
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
    area.querySelectorAll('.blank-slot').forEach(slot => {
      slot.addEventListener('click', (e) => {
        const t = e.target.closest('.drag-tile');
        if (t && !answered) returnTileToTray(t);
      });
    });
    area.querySelector('#btn-clear').onclick = clearSlots;
    area.querySelector('#btn-show').onclick = revealDrag;
    area.querySelector('#btn-submit').onclick = checkDrag;
  }

  function onTileClick(e) {
    if (answered) return;
    const tile = e.currentTarget;
    if (tile._dragged) { tile._dragged = false; return; }
    if (tile.parentElement.classList.contains('blank-slot')) {
      returnTileToTray(tile);
    } else if (tile.parentElement.id === 'drag-tray') {
      // 點 tile 自動填到下一個空 slot
      const slot = findNextEmptySlot();
      if (slot) placeTileInSlot(tile, slot);
    }
  }

  function findNextEmptySlot() {
    return container.querySelector('.blank-slot:not(.filled)');
  }

  function placeTileInSlot(tile, slot) {
    // 若 slot 已有 tile：先把它退回 tray
    const existing = slot.querySelector('.drag-tile');
    if (existing && existing !== tile) returnTileToTray(existing);
    // 隱藏 placeholder
    const ph = slot.querySelector('.slot-placeholder');
    if (ph) ph.style.display = 'none';
    if (tile.parentElement) tile.parentElement.removeChild(tile);
    slot.appendChild(tile);
    slot.classList.add('filled');
  }
  function returnTileToTray(tile) {
    const slot = tile.closest('.blank-slot');
    const tray = container.querySelector('#drag-tray');
    if (slot) {
      slot.classList.remove('filled');
      const ph = slot.querySelector('.slot-placeholder');
      if (ph) ph.style.display = '';
    }
    if (tile.parentElement) tile.parentElement.removeChild(tile);
    tray.appendChild(tile);
  }
  function clearSlots() {
    if (answered) return;
    container.querySelectorAll('.blank-slot .drag-tile').forEach(t => returnTileToTray(t));
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
    container.querySelectorAll('.blank-slot.drag-over, .drag-tray.drag-over')
      .forEach(z => z.classList.remove('drag-over'));
    const target = findDropTarget(e.clientX, e.clientY);
    if (target) target.classList.add('drag-over');
  }
  function onTileUp(e) {
    if (!drag.tile) return;
    const tile = drag.tile;
    const target = findDropTarget(e.clientX, e.clientY);
    cleanupDrag();
    if (target) {
      if (target.classList.contains('blank-slot')) placeTileInSlot(tile, target);
      else if (target.id === 'drag-tray') returnTileToTray(tile);
    }
  }
  function findDropTarget(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest('.blank-slot') || el.closest('#drag-tray');
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
    container.querySelectorAll('.blank-slot.drag-over, .drag-tray.drag-over')
      .forEach(z => z.classList.remove('drag-over'));
  }

  function checkDrag() {
    if (answered) return;
    const slots = container.querySelectorAll('.blank-slot');
    if (Array.from(slots).some(s => !s.querySelector('.drag-tile'))) {
      window.L5Shared.showFeedback(container, 'wrong', '請先把所有空格都填上！', 1500);
      return;
    }
    answered = true;
    const q = questions[idx];
    let allCorrect = true;
    const userTokens = [];
    slots.forEach((slot, i) => {
      const tile = slot.querySelector('.drag-tile');
      const token = tile.dataset.token;
      userTokens.push(token);
      const ok = isAnswerCorrect(token, q.answers[i]);
      slot.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) allCorrect = false;
    });

    if (allCorrect) {
      stats.correct++;
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 全部對了！', 1500);
      setTimeout(() => window.L5Shared.speak(q.en_full), 200);
      showExplanationMild(q);
    } else {
      stats.wrong++;
      window.L5Shared.vibrate([40, 60, 40]);
      showExplanationWrong(q, userTokens.join(' / '));
      window.L5Shared.saveWrong({
        mode: 'fillblank', id: q.id + '_drag',
        prompt: `${q.template}（${q.hint}）`,
        userAnswer: userTokens.join(' / '),
        correctAnswer: q.en_full,
      });
      setTimeout(() => window.L5Shared.speak(q.en_full), 400);
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
    const slots = container.querySelectorAll('.blank-slot');
    const tray = container.querySelector('#drag-tray');
    slots.forEach(s => {
      const t = s.querySelector('.drag-tile');
      if (t) returnTileToTray(t);
    });
    slots.forEach((slot, i) => {
      const ans = Array.isArray(q.answers[i])
        ? (q.answers[i].filter(x => typeof x === 'string')[0] || '')
        : q.answers[i];
      const found = Array.from(tray.querySelectorAll('.drag-tile'))
        .find(t => t.dataset.token.toLowerCase() === ans.toLowerCase());
      if (found) {
        placeTileInSlot(found, slot);
        found.classList.add('correct');
      }
    });
    window.L5Shared.showFeedback(container, 'info', '已顯示答案，下次自己挑戰！', 1800);
    setTimeout(() => window.L5Shared.speak(q.en_full), 200);
    showExplanationMild(q);
    container.querySelector('#btn-submit').style.display = 'none';
    container.querySelector('#btn-show').style.display = 'none';
    container.querySelector('#btn-clear').style.display = 'none';
    const next = container.querySelector('#btn-next');
    next.style.display = 'inline-block';
    next.onclick = () => { idx++; renderQuestion(); };
  }

  // ============= 🖊️ 手寫 =============
  function renderHandwriting(area) {
    const q = questions[idx];
    area.innerHTML = `
      <div class="fillblank-sentence">${renderTemplateForDisplay(q)}</div>
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

  function renderTemplateForDisplay(q) {
    return q.template.split('___').map((seg, i, arr) =>
      escapeHtml(seg) + (i < arr.length - 1 ? '<span class="blank-display">___</span>' : '')
    ).join('');
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
      if (!drawing) return; e.preventDefault();
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
      `<div class="reveal-answer">${escapeHtml(q.en_full)}</div>`;
    window.L5Shared.speak(q.en_full);
    container.querySelector('#hw-next').style.display = 'inline-block';
    container.querySelector('#hw-next').onclick = () => { idx++; renderQuestion(); };
    showExplanationMild(q);
  }

  // ============= 共用 =============
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
      <div class="explain-title">💡 為什麼？</div>
      <div class="explain-text">${escapeHtml(q.explanation)}</div>
      <div class="explain-correct">正確句：<strong>${escapeHtml(q.en_full)}</strong></div>
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
    let msg = pct >= 90 ? '太厲害了！Look and Write 完全掌握！' :
              pct >= 70 ? '不錯喔，主詞動詞變化要再注意！' :
              pct >= 50 ? '繼續努力，多寫幾次就會熟！' : '別灰心，再開一輪就有進步！';
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
    const prev = window.L5Shared.loadProgress('fillblank') || {};
    const bestScore = Math.max(prev.bestScore || 0, stats.correct);
    window.L5Shared.saveProgress('fillblank', {
      bestScore,
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

  window.ModeFillBlank = { init };
})();
