/* ============================================================
   mode-spin.js — 模式 5：Spin and Say（3 種輸入方式）
   - 轉盤旋轉抽動詞片語 + 隨機主詞 + 隨機副詞
   - ⌨️ 打字：textarea 輸入整句，三項自動批改
   - 🖊️ 手寫：canvas + 看答案自評
   - 🧩 拖拉：4 張詞牌（正確動詞 + 錯誤動詞）拖入 3 個句子格（預設）
   ============================================================ */

(function () {
  'use strict';

  let container = null;
  let spinning = false;
  let answered = false;
  let stats = { correct: 0, wrong: 0 };
  let current = { subject: null, adverb: null, verb: null };
  let inputMethod = 'drag'; // 'drag' | 'keyboard' | 'handwriting'
  let slots = [null, null, null];
  let drag = { tile: null, clone: null, offX: 0, offY: 0 };
  let canvas = null, ctx = null, drawing = false;

  function init(rootEl) {
    container = rootEl;
    const data = window.SPIN_L5;
    if (!data || !data.verbs) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗</p>';
      return;
    }
    stats = { correct: 0, wrong: 0 };
    spinning = false;
    answered = false;
    current = { subject: null, adverb: null, verb: null };
    slots = [null, null, null];
    inputMethod = 'drag';
    render();
  }

  function render() {
    container.innerHTML = `
      <h2 style="text-align:center; margin-bottom: 6px;">Spin and Say 🎡</h2>
      <p class="subtitle" style="text-align:center; margin-bottom: 16px;">按中間圓鈕轉動，再用三種方式造句</p>

      <div class="spin-stage">
        <div class="spin-wheel" id="spin-wheel">
          <div class="wheel-decoration" id="wheel-decoration"></div>
          <div class="wheel-pointer">▼</div>
          <div class="wheel-inner">
            <div class="verb-display" id="verb-display">按下方按鈕開始</div>
            <button class="wheel-spin-btn" id="btn-spin" aria-label="旋轉">🎲</button>
          </div>
        </div>

        <div class="assembly-area" id="assembly-area" style="display:none;">
          <div class="prompt-row">
            <span class="badge subject" id="badge-subject">She</span>
            <span class="plus">+</span>
            <span class="badge adverb" id="badge-adverb">always</span>
            <span class="plus">+</span>
            <span class="badge verb" id="badge-verb">draw a picture</span>
          </div>
          <p class="prompt-hint">用上面三個元素，組成一個完整句子（注意三單變化）</p>

          <div class="input-method-switch" id="input-method-switch">
            <button data-method="drag" class="${inputMethod==='drag'?'active':''}">🧩 拖拉</button>
            <button data-method="keyboard" class="${inputMethod==='keyboard'?'active':''}">⌨️ 打字</button>
            <button data-method="handwriting" class="${inputMethod==='handwriting'?'active':''}">🖊️ 手寫</button>
          </div>

          <div id="input-area"></div>

          <div class="explanation-box" id="explanation-box" style="display:none;"></div>
        </div>
      </div>
    `;

    container.querySelector('#btn-spin').addEventListener('click', spin);
    container.querySelectorAll('#input-method-switch button').forEach(b => {
      b.addEventListener('click', () => switchMethod(b.dataset.method));
    });
    updateStats();
  }

  function switchMethod(m) {
    if (m === inputMethod) return;
    inputMethod = m;
    answered = false;
    slots = [null, null, null];
    container.querySelector('#explanation-box').style.display = 'none';
    container.querySelectorAll('#input-method-switch button').forEach(b => {
      b.classList.toggle('active', b.dataset.method === m);
    });
    renderInputArea();
  }

  function renderInputArea() {
    const area = container.querySelector('#input-area');
    if (!area || !current.verb) return;
    if (inputMethod === 'drag') renderDrag(area);
    else if (inputMethod === 'keyboard') renderKeyboard(area);
    else renderHandwriting(area);
  }

  // ---------- 旋轉 ----------
  function spin() {
    if (spinning) return;
    spinning = true;
    answered = false;
    slots = [null, null, null];

    container.querySelector('#assembly-area').style.display = 'none';
    container.querySelector('#explanation-box').style.display = 'none';

    const data = window.SPIN_L5;
    const allSubjects = [...data.subjects_be, ...data.subjects_s];
    current.verb    = data.verbs[Math.floor(Math.random() * data.verbs.length)];
    current.subject = allSubjects[Math.floor(Math.random() * allSubjects.length)];
    current.adverb  = data.frequencies[Math.floor(Math.random() * data.frequencies.length)];

    const decoration = container.querySelector('#wheel-decoration');
    decoration.style.transform = `rotate(${1800 + Math.floor(Math.random() * 720)}deg)`;

    const display = container.querySelector('#verb-display');
    let elapsed = 0;
    let interval = 55;
    const btn = container.querySelector('#btn-spin');
    btn.disabled = true; btn.textContent = '⏳';
    window.L5Shared.vibrate(15);

    const cycle = () => {
      if (elapsed >= 2200) {
        display.textContent = current.verb;
        display.classList.add('settle');
        setTimeout(() => display.classList.remove('settle'), 500);
        btn.disabled = false; btn.textContent = '🔄';
        onSpinEnd();
        return;
      }
      display.textContent = data.verbs[Math.floor(Math.random() * data.verbs.length)];
      elapsed += interval;
      interval = Math.min(interval * 1.06, 220);
      setTimeout(cycle, interval);
    };
    cycle();
  }

  function onSpinEnd() {
    spinning = false;
    container.querySelector('#assembly-area').style.display = 'block';
    container.querySelector('#badge-subject').textContent = current.subject;
    container.querySelector('#badge-adverb').textContent = current.adverb;
    container.querySelector('#badge-verb').textContent = current.verb;
    renderInputArea();
    window.L5Shared.speak(`${current.subject}, ${current.adverb}, ${current.verb}`, 'en-US', 0.85);
  }

  // ============= 動詞變化規則 =============
  function conjugate(verb, useS) {
    if (!useS) return verb;
    if (verb === 'have') return 'has';
    if (verb === 'do')   return 'does';
    if (verb === 'go')   return 'goes';
    if (/(ch|sh|ss|x|o)$/.test(verb)) return verb + 'es';
    if (/[^aeiou]y$/.test(verb)) return verb.slice(0, -1) + 'ies';
    return verb + 's';
  }

  function buildExpectedSentence() {
    const useS = window.SPIN_L5.subjects_s.includes(current.subject);
    const verbTokens = current.verb.split(/\s+/);
    const verbForm = conjugate(verbTokens[0], useS);
    const rest = verbTokens.slice(1).join(' ');
    return `${current.subject} ${current.adverb} ${verbForm}${rest ? ' ' + rest : ''}.`;
  }

  // ============= ⌨️ 打字 =============
  function renderKeyboard(area) {
    area.innerHTML = `
      <textarea class="translate-input" id="s-input" rows="2"
                placeholder="例：She always draws a picture."
                autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>
      <div class="actions">
        <button class="btn" id="btn-show">💡 看答案</button>
        <button class="btn btn-primary" id="btn-submit">送出 ✓</button>
        <button class="btn btn-primary" id="btn-next" style="display:none;">再轉一次 →</button>
      </div>
    `;
    const input = area.querySelector('#s-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); checkKeyboard(); }
    });
    area.querySelector('#btn-submit').onclick = checkKeyboard;
    area.querySelector('#btn-show').onclick = revealKeyboard;
    input.focus();
  }

  function checkKeyboard() {
    if (answered) return;
    const input = container.querySelector('#s-input');
    const userRaw = input.value.trim();
    if (!userRaw) { window.L5Shared.showFeedback(container, 'wrong', '請先輸入句子！', 1500); return; }
    answered = true;
    input.disabled = true;
    const useS = window.SPIN_L5.subjects_s.includes(current.subject);
    const verbTokens = current.verb.split(/\s+/);
    const verbForm = conjugate(verbTokens[0], useS);
    const tokens = userRaw.toLowerCase().replace(/[.!?]+$/, '').replace(/\s+/g, ' ').split(' ');
    const checks = {
      subject: tokens[0] === current.subject.toLowerCase(),
      adverb:  tokens.length >= 2 && tokens[1] === current.adverb.toLowerCase(),
      verb:    tokens.length >= 3 && tokens[2] === verbForm.toLowerCase(),
    };
    const expected = buildExpectedSentence();
    const allPass = checks.subject && checks.adverb && checks.verb;
    if (allPass) {
      stats.correct++;
      input.classList.add('correct');
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 三項全對！', 1600);
      setTimeout(() => window.L5Shared.speak(userRaw), 200);
    } else {
      stats.wrong++;
      input.classList.add('wrong');
      window.L5Shared.vibrate([40, 60, 40]);
      const issues = [];
      if (!checks.subject) issues.push(`主詞應為 <strong>${escapeHtml(current.subject)}</strong>${tokens[0] ? `，你寫了 <em>${escapeHtml(tokens[0])}</em>` : ''}。`);
      if (!checks.adverb) issues.push(`頻率副詞 <strong>${escapeHtml(current.adverb)}</strong> 要放在主詞與動詞之間（第二個字）。`);
      if (!checks.verb) {
        issues.push(useS
          ? `三單主詞 <strong>${escapeHtml(current.subject)}</strong> 後動詞要加 -s/-es，應為 <strong>${escapeHtml(verbForm)}</strong>。`
          : `主詞 <strong>${escapeHtml(current.subject)}</strong> 不是三單，動詞用原形 <strong>${escapeHtml(verbForm)}</strong>。`);
      }
      const box = container.querySelector('#explanation-box');
      box.style.display = 'block';
      box.classList.remove('mild');
      box.innerHTML = `
        <div class="explain-title">💡 哪裡可以更好？</div>
        <div class="explain-text">${issues.map(t => '• ' + t).join('<br>')}</div>
        <div class="explain-correct">建議答案：<strong>${escapeHtml(expected)}</strong></div>
      `;
      window.L5Shared.saveWrong({
        mode: 'spin', id: `${current.subject}_${current.adverb}_${verbTokens[0]}_kb`,
        prompt: `主詞=${current.subject}, 副詞=${current.adverb}, 動詞片語=${current.verb}`,
        userAnswer: userRaw, correctAnswer: expected,
      });
      setTimeout(() => window.L5Shared.speak(expected), 400);
    }
    showNextButton();
    saveSession();
    updateStats();
  }

  function revealKeyboard() {
    if (answered) return;
    answered = true;
    const input = container.querySelector('#s-input');
    const expected = buildExpectedSentence();
    input.value = expected;
    input.disabled = true;
    input.classList.add('correct');
    window.L5Shared.showFeedback(container, 'info', '已顯示答案，下次自己挑戰！', 1800);
    setTimeout(() => window.L5Shared.speak(expected), 200);
    showNextButton();
  }

  // ============= 🖊️ 手寫 =============
  function renderHandwriting(area) {
    area.innerHTML = `
      <canvas id="hw-canvas"></canvas>
      <div class="canvas-toolbar">
        <button class="btn" id="hw-clear">🧹 清空</button>
        <button class="btn" id="hw-reveal">👀 看答案</button>
        <button class="btn btn-primary" id="hw-next" style="display:none;">再轉一次 →</button>
      </div>
      <div id="hw-reveal-box"></div>
      <p class="handwriting-note">💡 手寫無法自動批改，按「看答案」自我核對。</p>
    `;
    initCanvas();
    area.querySelector('#hw-clear').onclick = clearCanvas;
    area.querySelector('#hw-reveal').onclick = revealHandwriting;
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
    const expected = buildExpectedSentence();
    container.querySelector('#hw-reveal-box').innerHTML =
      `<div class="reveal-answer">${escapeHtml(expected)}</div>`;
    window.L5Shared.speak(expected);
    const next = container.querySelector('#hw-next');
    next.style.display = 'inline-block';
    next.onclick = spin;
  }

  // ============= 🧩 拖拉 =============
  function renderDrag(area) {
    const useS = window.SPIN_L5.subjects_s.includes(current.subject);
    const verbTokens = current.verb.split(/\s+/);
    const verbCorrectFirst = conjugate(verbTokens[0], useS);
    const verbWrongFirst   = conjugate(verbTokens[0], !useS);
    const rest = verbTokens.slice(1).join(' ');
    const verbCorrect = rest ? `${verbCorrectFirst} ${rest}` : verbCorrectFirst;
    const verbWrong   = rest ? `${verbWrongFirst} ${rest}`   : verbWrongFirst;

    const tiles = [
      { role: 'subject', correct: true,  text: current.subject },
      { role: 'adverb',  correct: true,  text: current.adverb  },
      { role: 'verb',    correct: true,  text: verbCorrect },
      { role: 'verb',    correct: false, text: verbWrong },
    ];
    const shuffled = window.L5Shared.shuffle(tiles);

    area.innerHTML = `
      <div class="sentence-slots" id="sentence-slots">
        <div class="sentence-slot" data-pos="0"><span class="slot-label">主詞</span></div>
        <div class="sentence-slot" data-pos="1"><span class="slot-label">副詞</span></div>
        <div class="sentence-slot" data-pos="2"><span class="slot-label">動詞片語</span></div>
        <span class="sentence-period">.</span>
      </div>
      <div class="tile-tray" id="tile-tray">
        ${shuffled.map((t, i) => `
          <button class="word-tile ${t.role}"
                  data-role="${t.role}"
                  data-correct="${t.correct}"
                  data-text="${escapeAttr(t.text)}"
                  data-tile-id="st${i}">${escapeHtml(t.text)}</button>
        `).join('')}
      </div>
      <div class="actions">
        <button class="btn" id="btn-clear">🧹 清空</button>
        <button class="btn btn-primary" id="btn-submit">送出 ✓</button>
        <button class="btn btn-primary" id="btn-next" style="display:none;">再轉一次 →</button>
      </div>
    `;

    slots = [null, null, null];
    area.querySelectorAll('.word-tile').forEach(t => {
      t.addEventListener('pointerdown', onTileDown);
      t.addEventListener('click', onTileClick);
    });
    area.querySelector('#btn-clear').onclick = clearAllSlots;
    area.querySelector('#btn-submit').onclick = checkDrag;
  }

  function onTileClick(e) {
    if (answered) return;
    const tile = e.currentTarget;
    if (tile._dragged) { tile._dragged = false; return; }
    if (tile.parentElement.classList.contains('sentence-slot')) {
      returnTileToTray(tile);
    } else if (tile.parentElement.classList.contains('tile-tray')) {
      const emptyIdx = slots.indexOf(null);
      if (emptyIdx === -1) return;
      const slot = container.querySelector(`.sentence-slot[data-pos="${emptyIdx}"]`);
      if (slot) placeTileInSlot(tile, slot);
    }
  }

  function placeTileInSlot(tile, slot) {
    const pos = parseInt(slot.dataset.pos, 10);
    const existing = slot.querySelector('.word-tile');
    if (existing && existing !== tile) returnTileToTray(existing);
    if (tile.parentElement) tile.parentElement.removeChild(tile);
    const label = slot.querySelector('.slot-label');
    if (label) label.style.display = 'none';
    slot.appendChild(tile);
    slot.classList.add('filled');
    slots = slots.map(s => (s === tile.dataset.tileId ? null : s));
    slots[pos] = tile.dataset.tileId;
  }

  function returnTileToTray(tile) {
    const tray = container.querySelector('#tile-tray');
    const slot = tile.closest('.sentence-slot');
    if (slot) {
      slot.classList.remove('filled');
      const label = slot.querySelector('.slot-label');
      if (label) label.style.display = '';
      slots[parseInt(slot.dataset.pos, 10)] = null;
    }
    if (tile.parentElement) tile.parentElement.removeChild(tile);
    tray.appendChild(tile);
  }

  function clearAllSlots() {
    if (answered) return;
    container.querySelectorAll('.sentence-slot .word-tile').forEach(t => returnTileToTray(t));
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
      opacity: '0.92', transform: 'scale(1.05)', transition: 'none'
    });
    document.body.appendChild(drag.clone);
    drag.offX = e.clientX - rect.left;
    drag.offY = e.clientY - rect.top;
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
    container.querySelectorAll('.sentence-slot.drag-over').forEach(s => s.classList.remove('drag-over'));
    const target = findSlotUnder(e.clientX, e.clientY);
    if (target) target.classList.add('drag-over');
  }
  function onTileUp(e) {
    if (!drag.tile) return;
    const tile = drag.tile;
    const slot = findSlotUnder(e.clientX, e.clientY);
    cleanupDrag();
    if (slot) placeTileInSlot(tile, slot);
    else if (tile.closest('.sentence-slot')) returnTileToTray(tile);
  }
  function findSlotUnder(x, y) {
    const el = document.elementFromPoint(x, y);
    return el ? el.closest('.sentence-slot') : null;
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
    container.querySelectorAll('.sentence-slot.drag-over').forEach(s => s.classList.remove('drag-over'));
  }

  function checkDrag() {
    if (answered) return;
    if (slots.some(s => s === null)) {
      window.L5Shared.showFeedback(container, 'wrong', '三個格子都要填滿！', 1500);
      return;
    }
    answered = true;
    const slotEls = [0, 1, 2].map(i => container.querySelector(`.sentence-slot[data-pos="${i}"]`));
    const tileInSlot = slotEls.map(s => s.querySelector('.word-tile'));
    const checks = {
      subject:  tileInSlot[0].dataset.role === 'subject',
      adverb:   tileInSlot[1].dataset.role === 'adverb',
      verbForm: tileInSlot[2].dataset.role === 'verb' && tileInSlot[2].dataset.correct === 'true',
    };
    slotEls.forEach((s, i) => {
      const ok = i === 0 ? checks.subject : i === 1 ? checks.adverb : checks.verbForm;
      s.classList.add(ok ? 'correct' : 'wrong');
    });
    const allPass = checks.subject && checks.adverb && checks.verbForm;
    const expected = buildExpectedSentence();
    const useS = window.SPIN_L5.subjects_s.includes(current.subject);

    if (allPass) {
      stats.correct++;
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 三項全對！', 1600);
      setTimeout(() => window.L5Shared.speak(expected), 200);
    } else {
      stats.wrong++;
      window.L5Shared.vibrate([40, 60, 40]);
      const issues = [];
      if (!checks.subject) issues.push(`第一格應放主詞 <strong>${escapeHtml(current.subject)}</strong>，你放了 <em>${escapeHtml(tileInSlot[0].dataset.text)}</em>。`);
      if (!checks.adverb) issues.push(`第二格應放副詞 <strong>${escapeHtml(current.adverb)}</strong>，你放了 <em>${escapeHtml(tileInSlot[1].dataset.text)}</em>。`);
      if (!checks.verbForm) {
        if (tileInSlot[2].dataset.role !== 'verb') {
          issues.push('第三格應放動詞片語，你放錯類型了。');
        } else {
          issues.push(useS
            ? `三單主詞 <strong>${escapeHtml(current.subject)}</strong> 後動詞要加 -s/-es；你選了 <em>${escapeHtml(tileInSlot[2].dataset.text)}</em>。`
            : `主詞 <strong>${escapeHtml(current.subject)}</strong> 不是三單，動詞用原形；你選了 <em>${escapeHtml(tileInSlot[2].dataset.text)}</em>。`);
        }
      }
      const box = container.querySelector('#explanation-box');
      box.style.display = 'block';
      box.classList.remove('mild');
      box.innerHTML = `
        <div class="explain-title">💡 看看哪裡可以調整</div>
        <div class="explain-text">${issues.map(t => '• ' + t).join('<br>')}</div>
        <div class="explain-correct">正確句子：<strong>${escapeHtml(expected)}</strong></div>
      `;
      window.L5Shared.saveWrong({
        mode: 'spin', id: `${current.subject}_${current.adverb}_${current.verb.split(' ')[0]}_drag`,
        prompt: `主詞=${current.subject}, 副詞=${current.adverb}, 動詞片語=${current.verb}`,
        userAnswer: tileInSlot.map(t => t.dataset.text).join(' '),
        correctAnswer: expected,
      });
      setTimeout(() => window.L5Shared.speak(expected), 400);
    }
    container.querySelector('#btn-submit').style.display = 'none';
    container.querySelector('#btn-clear').style.display = 'none';
    const next = container.querySelector('#btn-next');
    next.style.display = 'inline-block';
    next.onclick = spin;
    saveSession();
    updateStats();
  }

  // ============= 共用 =============
  function showNextButton() {
    const submit = container.querySelector('#btn-submit');
    const show = container.querySelector('#btn-show');
    const next = container.querySelector('#btn-next');
    if (submit) submit.style.display = 'none';
    if (show) show.style.display = 'none';
    if (next) { next.style.display = 'inline-block'; next.onclick = spin; }
  }

  function saveSession() {
    const prev = window.L5Shared.loadProgress('spin') || {};
    window.L5Shared.saveProgress('spin', {
      bestScore: Math.max(prev.bestScore || 0, stats.correct),
      totalQuestions: stats.correct + stats.wrong,
      attempts: (prev.attempts || 0) + 1,
      lastTs: Date.now(),
      completed: stats.correct >= 5,
    });
  }

  function updateStats() {
    const p = document.getElementById('stat-progress'), c = document.getElementById('stat-correct'), w = document.getElementById('stat-wrong');
    if (p) p.textContent = `${stats.correct + stats.wrong} 題`;
    if (c) c.textContent = String(stats.correct);
    if (w) w.textContent = String(stats.wrong);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  window.ModeSpin = { init };
})();
