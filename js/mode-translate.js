/* ============================================================
   mode-translate.js — 模式 7：中翻英練習（多輸入方式）
   - ⌨️ 鍵盤打字：textarea + 自動寬鬆比對
   - 🖊️ 手寫練習：Canvas 畫板 + 看答案自評（不自動批改）
   - 🧩 拖拉組句：英文 tile 打亂 → 拖到句子格中組成順序 → 自動比對
   ============================================================ */

(function () {
  'use strict';

  let container = null;
  let questions = [];
  let idx = 0;
  let answered = false;
  let stats = { correct: 0, wrong: 0 };
  let inputMethod = 'keyboard'; // 'keyboard' | 'handwriting' | 'drag'

  // Canvas 狀態
  let canvas = null, ctx = null, drawing = false;

  // 拖拉狀態
  let placedTokens = [];   // 已放進句子區的 token 文字陣列（依順序）
  let drag = { tile: null, clone: null, offX: 0, offY: 0 };

  // ---------- 入口 ----------
  function init(rootEl) {
    container = rootEl;
    const data = window.TRANSLATE_L5;
    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗（translate_L5.js）</p>';
      return;
    }
    const filter = window.L5Shared.getRedoFilter('translate');
    let dataset = data;
    if (filter) {
      // translate 存錯題時會加 _kb/_drag 後綴，filter.has 已處理前綴比對
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

  // ---------- 渲染題目骨架 ----------
  function renderQuestion() {
    if (idx >= questions.length) {
      renderEndScreen();
      return;
    }
    answered = false;
    placedTokens = [];
    const q = questions[idx];

    container.innerHTML = `
      <div class="translate-stage">
        <div class="translate-source">📚 ${escapeHtml(q.source || '')}</div>

        <div class="translate-zh">
          <span class="zh-label">中文</span>
          <div class="zh-text">${escapeHtml(q.zh)}</div>
        </div>

        ${q.hint ? `<div class="translate-hint">💡 提示：${escapeHtml(q.hint)}</div>` : ''}

        <div class="input-method-switch" id="input-method-switch">
          <button data-method="keyboard" class="${inputMethod==='keyboard'?'active':''}">⌨️ 打字</button>
          <button data-method="handwriting" class="${inputMethod==='handwriting'?'active':''}">🖊️ 手寫</button>
          <button data-method="drag" class="${inputMethod==='drag'?'active':''}">🧩 拖拉</button>
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

  function switchMethod(method) {
    if (method === inputMethod) return;
    inputMethod = method;
    answered = false;
    placedTokens = [];
    container.querySelectorAll('#input-method-switch button').forEach(b => {
      b.classList.toggle('active', b.dataset.method === method);
    });
    container.querySelector('#explanation-box').style.display = 'none';
    renderInputArea();
  }

  function renderInputArea() {
    const area = container.querySelector('#input-area');
    if (!area) return;
    if (inputMethod === 'keyboard') renderKeyboard(area);
    else if (inputMethod === 'handwriting') renderHandwriting(area);
    else if (inputMethod === 'drag') renderDrag(area);
  }

  // ============================================================
  // ⌨️ 鍵盤打字
  // ============================================================
  function renderKeyboard(area) {
    area.innerHTML = `
      <textarea class="translate-input" id="translate-input"
                placeholder="輸入英文翻譯..." rows="2"
                autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>
      <div class="actions">
        <button class="btn" id="btn-show-answer">💡 看答案</button>
        <button class="btn btn-primary" id="btn-submit">送出 ✓</button>
        <button class="btn btn-primary" id="btn-next" style="display:none;">下一題 →</button>
      </div>
    `;
    const input = area.querySelector('#translate-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); checkKeyboard(); }
    });
    area.querySelector('#btn-submit').addEventListener('click', checkKeyboard);
    area.querySelector('#btn-show-answer').addEventListener('click', revealAnswerKeyboard);
    input.focus();
  }

  function checkKeyboard() {
    if (answered) return;
    const input = container.querySelector('#translate-input');
    const userRaw = input.value.trim();
    if (!userRaw) {
      window.L5Shared.showFeedback(container, 'wrong', '請先輸入翻譯！', 1500);
      return;
    }
    answered = true;
    const q = questions[idx];
    const ok = isAnswerCorrect(userRaw, q.answers);
    input.disabled = true;
    finalizeAnswer(ok, userRaw, q);
  }

  function revealAnswerKeyboard() {
    if (answered) return;
    answered = true;
    const q = questions[idx];
    const input = container.querySelector('#translate-input');
    input.value = q.en_full;
    input.disabled = true;
    input.classList.add('correct');
    window.L5Shared.showFeedback(container, 'info', '已顯示答案，下次自己挑戰！', 1800);
    setTimeout(() => window.L5Shared.speak(q.en_full), 200);
    showExplanationMild(q);
    showNextButton();
  }

  // ============================================================
  // 🖊️ 手寫練習
  // ============================================================
  function renderHandwriting(area) {
    area.innerHTML = `
      <canvas id="handwriting-canvas" aria-label="手寫畫板"></canvas>
      <div class="canvas-toolbar">
        <button class="btn" id="btn-clear-canvas">🧹 清空</button>
        <button class="btn" id="btn-reveal-handwriting">👀 看答案</button>
        <button class="btn btn-primary" id="btn-next-handwriting" style="display:none;">下一題 →</button>
      </div>
      <div id="reveal-box-handwriting"></div>
      <p class="handwriting-note">
        💡 手寫無法自動批改；寫完後按「看答案」自我核對。練習肌肉記憶最有效！
      </p>
    `;
    initHandwritingCanvas();
    area.querySelector('#btn-clear-canvas').addEventListener('click', clearCanvas);
    area.querySelector('#btn-reveal-handwriting').addEventListener('click', revealAnswerHandwriting);
  }

  function initHandwritingCanvas() {
    canvas = container.querySelector('#handwriting-canvas');
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
    drawCanvasGuides();

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const start = (e) => {
      e.preventDefault();
      drawing = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    };
    const move = (e) => {
      if (!drawing) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    };
    const end = (e) => { drawing = false; };

    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('pointerleave', end);
  }

  function drawCanvasGuides() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.save();
    ctx.strokeStyle = 'rgba(45, 80, 22, 0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    [h * 0.3, h * 0.7].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();
  }

  function clearCanvas() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvasGuides();
    container.querySelector('#reveal-box-handwriting').innerHTML = '';
  }

  function revealAnswerHandwriting() {
    const q = questions[idx];
    container.querySelector('#reveal-box-handwriting').innerHTML = `
      <div class="reveal-answer">${escapeHtml(q.en_full)}</div>
    `;
    window.L5Shared.speak(q.en_full);
    container.querySelector('#btn-next-handwriting').style.display = 'inline-block';
    container.querySelector('#btn-next-handwriting').onclick = () => { idx++; renderQuestion(); };
    showExplanationMild(q);
  }

  // ============================================================
  // 🧩 拖拉組句
  // ============================================================
  function renderDrag(area) {
    const q = questions[idx];
    const tokens = tokenize(q.en_full);
    const shuffled = window.L5Shared.shuffle(tokens);

    area.innerHTML = `
      <div class="drag-sentence" id="drag-sentence">
        <span class="drag-sentence-hint">⬇ 拖到這裡組成句子</span>
      </div>

      <div class="drag-tray" id="drag-tray"></div>

      <div class="actions">
        <button class="btn" id="btn-clear-drag">🧹 重排</button>
        <button class="btn" id="btn-show-answer-drag">💡 看答案</button>
        <button class="btn btn-primary" id="btn-submit-drag">送出 ✓</button>
        <button class="btn btn-primary" id="btn-next-drag" style="display:none;">下一題 →</button>
      </div>
    `;

    const tray = area.querySelector('#drag-tray');
    shuffled.forEach((tok, i) => {
      const tile = document.createElement('button');
      tile.className = 'drag-tile' + (isPunctuation(tok) ? ' punct' : '');
      tile.dataset.token = tok;
      tile.dataset.tileId = 'tile-' + i;
      tile.textContent = tok;
      tile.addEventListener('pointerdown', onTileDown);
      tile.addEventListener('click', onTileClick);
      tray.appendChild(tile);
    });

    area.querySelector('#btn-clear-drag').addEventListener('click', clearDrag);
    area.querySelector('#btn-show-answer-drag').addEventListener('click', revealAnswerDrag);
    area.querySelector('#btn-submit-drag').addEventListener('click', checkDrag);

    // 點擊句子區的 tile：送回 tray
    area.querySelector('#drag-sentence').addEventListener('click', (e) => {
      const t = e.target.closest('.drag-tile');
      if (t && !answered) returnTileToTray(t);
    });
  }

  function tokenize(s) {
    // 切出單字與標點為獨立 token
    return String(s).match(/[A-Za-z']+|[.,!?;:"'"]/g) || [];
  }
  function isPunctuation(tok) {
    return /^[.,!?;:"'"]+$/.test(tok);
  }

  function onTileClick(e) {
    if (answered) return;
    const tile = e.currentTarget;
    if (tile._dragged) { tile._dragged = false; return; } // 拖拉剛結束的不要再 click
    if (tile.parentElement.id === 'drag-tray') {
      // tray → 移到句子末
      moveTileToSentence(tile);
    } else if (tile.parentElement.id === 'drag-sentence') {
      // 句子 → 送回 tray
      returnTileToTray(tile);
    }
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

  // ── 拖拉事件 ──
  function onTileDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (answered) return;
    const tile = e.currentTarget;
    e.preventDefault();
    drag.tile = tile;
    tile.classList.add('dragging');
    tile._dragged = false;

    const rect = tile.getBoundingClientRect();
    drag.clone = tile.cloneNode(true);
    drag.clone.classList.remove('dragging');
    Object.assign(drag.clone.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '9999',
      width: rect.width + 'px', left: rect.left + 'px', top: rect.top + 'px',
      opacity: '0.92', transform: 'scale(1.06)', transition: 'none'
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

    const target = findDropTargetUnder(e.clientX, e.clientY);
    container.querySelectorAll('.drag-sentence.drag-over, .drag-tray.drag-over').forEach(z => z.classList.remove('drag-over'));
    if (target) target.classList.add('drag-over');
  }

  function onTileUp(e) {
    if (!drag.tile) return;
    const tile = drag.tile;
    const target = findDropTargetUnder(e.clientX, e.clientY);
    cleanupDrag();

    if (target) {
      // 找到放開位置最接近的 tile，插入其前/後
      const targetTile = elementUnderExcept(e.clientX, e.clientY, tile);
      if (targetTile && targetTile.classList.contains('drag-tile') && targetTile.parentElement === target) {
        const r = targetTile.getBoundingClientRect();
        const placeBefore = e.clientX < r.left + r.width / 2;
        target.insertBefore(tile, placeBefore ? targetTile : targetTile.nextSibling);
      } else {
        target.appendChild(tile);
      }
      // 更新 sentence hint 顯示
      const sent = container.querySelector('#drag-sentence');
      const hint = sent.querySelector('.drag-sentence-hint');
      if (hint) hint.style.display = sent.querySelectorAll('.drag-tile').length ? 'none' : '';
    }
  }

  function findDropTargetUnder(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest('.drag-sentence') || el.closest('.drag-tray');
  }
  function elementUnderExcept(x, y, except) {
    if (drag.clone) drag.clone.style.display = 'none';
    const el = document.elementFromPoint(x, y);
    if (drag.clone) drag.clone.style.display = '';
    if (el && el !== except && !except.contains(el)) return el;
    return null;
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
    container.querySelectorAll('.drag-sentence.drag-over, .drag-tray.drag-over').forEach(z => z.classList.remove('drag-over'));
  }

  function clearDrag() {
    if (answered) return;
    container.querySelectorAll('#drag-sentence .drag-tile').forEach(t => returnTileToTray(t));
  }

  function checkDrag() {
    if (answered) return;
    const sentTiles = Array.from(container.querySelectorAll('#drag-sentence .drag-tile'));
    if (sentTiles.length === 0) {
      window.L5Shared.showFeedback(container, 'wrong', '請先拖入 tile 組句！', 1500);
      return;
    }
    const userTokens = sentTiles.map(t => t.dataset.token);
    const userSentence = joinTokens(userTokens);

    const q = questions[idx];
    // 跟所有可接受答案的 token 序列比對
    const ok = q.answers.some(a => arraysEqualCI(tokenize(a), userTokens));

    answered = true;
    if (ok) {
      sentTiles.forEach(t => t.classList.add('correct'));
      stats.correct++;
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 順序正確！', 1600);
      setTimeout(() => window.L5Shared.speak(q.en_full), 200);
      showExplanationMild(q);
    } else {
      sentTiles.forEach(t => t.classList.add('wrong'));
      stats.wrong++;
      window.L5Shared.vibrate([40, 60, 40]);
      const box = container.querySelector('#explanation-box');
      box.style.display = 'block';
      box.classList.remove('mild');
      box.innerHTML = `
        <div class="explain-title">💡 正確順序</div>
        <div class="explain-correct"><strong>${escapeHtml(q.en_full)}</strong></div>
        <div class="explain-text" style="margin-top:8px;">
          <strong>說明：</strong>${escapeHtml(q.explanation || '')}
        </div>
        <div class="explain-text" style="margin-top:6px; font-size:12px; color: var(--ink-soft);">
          你的順序：${escapeHtml(userSentence)}
        </div>
      `;
      window.L5Shared.saveWrong({
        mode: 'translate',
        id: q.id + '_drag',
        prompt: q.zh + '（拖拉）',
        userAnswer: userSentence,
        correctAnswer: q.en_full,
      });
      setTimeout(() => window.L5Shared.speak(q.en_full), 400);
    }
    container.querySelector('#btn-submit-drag').style.display = 'none';
    container.querySelector('#btn-show-answer-drag').style.display = 'none';
    container.querySelector('#btn-clear-drag').style.display = 'none';
    const next = container.querySelector('#btn-next-drag');
    next.style.display = 'inline-block';
    next.onclick = () => { idx++; renderQuestion(); };
    updateStats();
  }

  function revealAnswerDrag() {
    if (answered) return;
    answered = true;
    const q = questions[idx];
    // 把所有 tile 按答案順序排到句子區
    const targetTokens = tokenize(q.en_full);
    const sent = container.querySelector('#drag-sentence');
    const tray = container.querySelector('#drag-tray');
    sent.querySelectorAll('.drag-tile').forEach(t => tray.appendChild(t));
    sent.querySelector('.drag-sentence-hint').style.display = 'none';
    const remaining = Array.from(tray.querySelectorAll('.drag-tile'));
    targetTokens.forEach(tok => {
      const found = remaining.find(t => !t._used && t.dataset.token === tok);
      if (found) {
        found._used = true;
        found.classList.add('correct');
        sent.appendChild(found);
      }
    });
    window.L5Shared.showFeedback(container, 'info', '已顯示答案順序，下次自己挑戰！', 1800);
    setTimeout(() => window.L5Shared.speak(q.en_full), 200);
    showExplanationMild(q);

    container.querySelector('#btn-submit-drag').style.display = 'none';
    container.querySelector('#btn-show-answer-drag').style.display = 'none';
    container.querySelector('#btn-clear-drag').style.display = 'none';
    const next = container.querySelector('#btn-next-drag');
    next.style.display = 'inline-block';
    next.onclick = () => { idx++; renderQuestion(); };
  }

  function joinTokens(tokens) {
    return tokens.join(' ').replace(/\s+([.,!?;:"'])/g, '$1');
  }
  function arraysEqualCI(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].toLowerCase() !== b[i].toLowerCase()) return false;
    }
    return true;
  }

  // ============================================================
  // 共用：批改後續、寬鬆比對、結束畫面
  // ============================================================
  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[“”"'‘’]/g, '')
      .replace(/[.,!?;:—\-–]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function isAnswerCorrect(userInput, accepted) {
    const userN = normalize(userInput);
    if (!userN) return false;
    return accepted.some(a => normalize(a) === userN);
  }

  function finalizeAnswer(ok, userRaw, q) {
    const input = container.querySelector('#translate-input');
    if (ok) {
      stats.correct++;
      input.classList.add('correct');
      window.L5Shared.vibrate(30);
      window.L5Shared.showFeedback(container, 'correct', '✓ 答對了！', 1600);
      setTimeout(() => window.L5Shared.speak(q.en_full), 200);
      showExplanationMild(q);
    } else {
      stats.wrong++;
      input.classList.add('wrong');
      window.L5Shared.vibrate([40, 60, 40]);
      const box = container.querySelector('#explanation-box');
      box.style.display = 'block';
      box.classList.remove('mild');
      box.innerHTML = `
        <div class="explain-title">💡 標準答案</div>
        <div class="explain-correct"><strong>${escapeHtml(q.en_full)}</strong></div>
        ${q.answers.length > 1 ? `
          <div class="explain-text" style="margin-top:6px; font-size:12px;">
            其他可接受寫法：${q.answers.filter(a => a !== q.en_full).map(a => `<div>• ${escapeHtml(a)}</div>`).join('')}
          </div>` : ''}
        <div class="explain-text" style="margin-top:8px;">
          <strong>說明：</strong>${escapeHtml(q.explanation || '')}
        </div>
        <div class="explain-text" style="margin-top:6px; font-size:12px; color: var(--ink-soft);">
          你寫的：${escapeHtml(userRaw)}
        </div>
      `;
      window.L5Shared.saveWrong({
        mode: 'translate',
        id: q.id + '_kb',
        prompt: q.zh,
        userAnswer: userRaw,
        correctAnswer: q.en_full,
      });
      setTimeout(() => window.L5Shared.speak(q.en_full), 400);
    }
    showNextButton();
    updateStats();
  }

  function showExplanationMild(q) {
    if (!q.explanation) return;
    const box = container.querySelector('#explanation-box');
    if (!box || box.style.display === 'block') return;
    box.style.display = 'block';
    box.classList.add('mild');
    box.innerHTML = `
      <div class="explain-title">📖 補充說明</div>
      <div class="explain-text">${escapeHtml(q.explanation)}</div>
    `;
  }

  function showNextButton() {
    const submit = container.querySelector('#btn-submit');
    const show = container.querySelector('#btn-show-answer');
    const next = container.querySelector('#btn-next');
    if (submit) submit.style.display = 'none';
    if (show) show.style.display = 'none';
    if (next) {
      next.style.display = 'inline-block';
      next.onclick = () => { idx++; renderQuestion(); };
    }
  }

  function renderEndScreen() {
    const total = stats.correct + stats.wrong;
    const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    let msg = '';
    if (pct >= 90) msg = '太厲害了！中翻英完全掌握！';
    else if (pct >= 70) msg = '不錯喔，再加把勁就完美！';
    else if (pct >= 50) msg = '繼續努力，多寫幾題就熟了！';
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
    const prev = window.L5Shared.loadProgress('translate') || {};
    window.L5Shared.saveProgress('translate', {
      bestScore: Math.max(prev.bestScore || 0, stats.correct),
      totalQuestions: questions.length,
      attempts: (prev.attempts || 0) + 1,
      lastTs: Date.now(),
      completed: stats.correct === questions.length,
    });
  }

  function updateStats() {
    const total = questions.length;
    const progressEl = document.getElementById('stat-progress');
    const correctEl = document.getElementById('stat-correct');
    const wrongEl = document.getElementById('stat-wrong');
    if (progressEl) progressEl.textContent = `${Math.min(idx + 1, total)} / ${total}`;
    if (correctEl) correctEl.textContent = String(stats.correct);
    if (wrongEl) wrongEl.textContent = String(stats.wrong);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  window.ModeTranslate = { init };
})();
