/* ============================================================
   mode-position.js — 模式 2：副詞位置點選
   - 隨機抽 10 題（或全部），每題顯示一個英文句子加上 ⬚ 位置
   - 玩家點 ⬚ 選擇副詞插入位置
   - 答對：該位置變綠 + 副詞滑入 + 朗讀完整句
   - 答錯：該位置變紅 + 正確位置變綠 + 顯示解釋 + 寫入錯題本
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
    const data = window.POSITION_L5;
    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗（position_L5.js）</p>';
      return;
    }
    const filter = window.L5Shared.getRedoFilter('position');
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

    // 組句子 row：每個 part 後面接一個 slot（共 parts.length 個 slot）
    let rowHtml = '';
    q.parts.forEach((part, i) => {
      rowHtml += `<span class="word">${escapeHtml(part)}</span>`;
      rowHtml += `<button class="slot" data-index="${i}" aria-label="位置 ${i + 1}">⬚</button>`;
    });
    rowHtml += `<span class="word period">.</span>`;

    container.innerHTML = `
      <div class="position-stage">
        <div class="adverb-banner">
          <span class="banner-label">把這個副詞放進句子裡 ↓</span>
          <span class="big-adverb">${escapeHtml(q.adverb)}</span>
          <button class="speaker-mini" id="btn-speak-adverb" title="聽發音">🔊</button>
        </div>

        <div class="sentence-row" id="sentence-row">${rowHtml}</div>

        <div class="zh-hint">${escapeHtml(q.zh)}</div>

        <div class="explanation-box" id="explanation-box" style="display:none;"></div>

        <div class="actions">
          <button class="btn" id="btn-skip">先跳過 ⏭</button>
          <button class="btn btn-primary" id="btn-next" style="display:none;">下一題 →</button>
        </div>
      </div>
    `;

    // 綁定事件
    container.querySelectorAll('.slot').forEach(s => {
      s.addEventListener('click', onSlotClick);
    });
    container.querySelector('#btn-speak-adverb').addEventListener('click', () => {
      window.L5Shared.speak(q.adverb);
    });
    container.querySelector('#btn-skip').addEventListener('click', skipQuestion);

    updateStats();
  }

  function onSlotClick(e) {
    if (answered) return;
    answered = true;
    const clickedIndex = parseInt(e.currentTarget.dataset.index, 10);
    const q = questions[idx];
    const isCorrect = clickedIndex === q.correct_index;

    const slots = container.querySelectorAll('.slot');
    slots.forEach(s => s.disabled = true);

    const clickedSlot = container.querySelector(`.slot[data-index="${clickedIndex}"]`);
    const correctSlot = container.querySelector(`.slot[data-index="${q.correct_index}"]`);

    if (isCorrect) {
      stats.correct++;
      window.L5Shared.vibrate(30);
      // 花俏的滑入動畫：副詞從橫條飛弧線進入 ⬚，途中變綠色 + 輕微旋轉
      flyAdverbIntoSlot(q.adverb, clickedSlot, () => {
        clickedSlot.classList.add('correct', 'pop');
        clickedSlot.innerHTML = `<span class="adverb-inline">${escapeHtml(q.adverb)}</span>`;
        window.L5Shared.showFeedback(container, 'correct', '✓ 答對了！', 1400);
        window.L5Shared.speak(q.en_full);
      });
    } else {
      stats.wrong++;
      clickedSlot.classList.add('wrong', 'shake');
      correctSlot.classList.add('correct');
      correctSlot.innerHTML = `<span class="adverb-inline">${escapeHtml(q.adverb)}</span>`;
      window.L5Shared.vibrate([40, 60, 40]);

      // 顯示解釋
      const box = container.querySelector('#explanation-box');
      box.style.display = 'block';
      box.innerHTML = `
        <div class="explain-title">💡 為什麼？</div>
        <div class="explain-text">${escapeHtml(q.explanation)}</div>
        <div class="explain-correct">正確句：<strong>${escapeHtml(q.en_full)}</strong></div>
      `;

      window.L5Shared.saveWrong({
        mode: 'position',
        id: q.id,
        prompt: `${q.parts.join(' ')} . (副詞: ${q.adverb})`,
        userAnswer: `位置 ${clickedIndex + 1}`,
        correctAnswer: q.en_full,
      });

      setTimeout(() => window.L5Shared.speak(q.en_full), 400);
    }

    container.querySelector('#btn-next').style.display = 'inline-block';
    container.querySelector('#btn-next').addEventListener('click', nextQuestion);
    container.querySelector('#btn-skip').style.display = 'none';
    updateStats();
  }

  function skipQuestion() {
    if (answered) return;
    // 跳過視為錯誤（鼓勵嘗試），但不寫入錯題本
    idx++;
    renderQuestion();
  }

  function nextQuestion() {
    idx++;
    renderQuestion();
  }

  // ---------- 結束畫面 ----------
  function renderEndScreen() {
    const total = stats.correct + stats.wrong;
    const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    let msg = '';
    if (pct >= 90) msg = '太厲害了！副詞位置完全掌握！';
    else if (pct >= 70) msg = '不錯喔，再加把勁就完美了！';
    else if (pct >= 50) msg = '繼續努力，多練幾次會更熟！';
    else msg = '別灰心，從錯誤中學習最有效！';

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

    // 儲存進度
    const prev = window.L5Shared.loadProgress('position') || {};
    const bestScore = Math.max(prev.bestScore || 0, stats.correct);
    window.L5Shared.saveProgress('position', {
      bestScore,
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

  // ---------- 花俏滑入動畫 ----------
  // 把橫條上的大副詞「複製一份」飛弧線進入目標 ⬚，
  // 中途由橘色轉綠色 + 輕微旋轉 + 縮放收尾，動畫結束才執行 onDone。
  function flyAdverbIntoSlot(adverbText, targetSlot, onDone) {
    const banner = container.querySelector('.big-adverb');
    if (!banner || !targetSlot) {
      if (onDone) onDone();
      return;
    }
    const fromRect = banner.getBoundingClientRect();
    const toRect   = targetSlot.getBoundingClientRect();

    // 飛行元素：仿造橫條上的大副詞
    const flying = document.createElement('span');
    flying.textContent = adverbText;
    flying.style.position = 'fixed';
    flying.style.left = fromRect.left + 'px';
    flying.style.top  = fromRect.top  + 'px';
    flying.style.width  = fromRect.width  + 'px';
    flying.style.height = fromRect.height + 'px';
    flying.style.display = 'flex';
    flying.style.alignItems = 'center';
    flying.style.justifyContent = 'center';
    flying.style.fontFamily = '"Microsoft JhengHei", "微軟正黑體", "Segoe UI", Arial, sans-serif';
    flying.style.fontSize = '36px';
    flying.style.fontWeight = '700';
    flying.style.color = 'var(--orange)';
    flying.style.zIndex = '9999';
    flying.style.pointerEvents = 'none';
    flying.style.willChange = 'transform, color';
    flying.style.transformOrigin = 'center center';
    flying.style.letterSpacing = '0.02em';
    document.body.appendChild(flying);

    // 起終點中心位移
    const dx = (toRect.left + toRect.width  / 2) - (fromRect.left + fromRect.width  / 2);
    const dy = (toRect.top  + toRect.height / 2) - (fromRect.top  + fromRect.height / 2);
    // 中間弧線：往上飄 60px 然後落下
    const arcLiftY = -60;
    // 終點縮放：把 36px 字縮到接近 18px（slot 內字大小）
    const endScale = 0.55;

    // 橘色副詞同時淡出
    banner.style.transition = 'opacity 0.25s, transform 0.25s';
    banner.style.opacity = '0';
    banner.style.transform = 'scale(0.92)';

    const anim = flying.animate(
      [
        // 起點
        { offset: 0,
          transform: 'translate(0, 0) scale(1) rotate(0deg)',
          color: '#c85a3f' /* --orange */ },
        // 中段（弧線最高點）
        { offset: 0.55,
          transform: `translate(${dx * 0.55}px, ${dy * 0.5 + arcLiftY}px) scale(0.85) rotate(-6deg)`,
          color: '#c85a3f' },
        // 收尾前（變綠色）
        { offset: 0.85,
          transform: `translate(${dx * 0.92}px, ${dy * 0.9 + arcLiftY * 0.2}px) scale(${endScale * 1.15}) rotate(4deg)`,
          color: '#2d5016' /* --green */ },
        // 終點（Q 彈一下）
        { offset: 1,
          transform: `translate(${dx}px, ${dy}px) scale(${endScale}) rotate(0deg)`,
          color: '#2d5016' }
      ],
      {
        duration: 720,
        easing: 'cubic-bezier(0.34, 1.32, 0.64, 1)',
        fill: 'forwards'
      }
    );

    anim.onfinish = () => {
      flying.remove();
      // 橫條副詞淡回（給下一題用）— 但目前題已答完，下一題會 re-render，所以不還原
      if (onDone) onDone();
    };
    anim.oncancel = () => {
      flying.remove();
      if (onDone) onDone();
    };
  }

  // ---------- 工具 ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ---------- 對外介面 ----------
  window.ModePosition = { init };
})();
