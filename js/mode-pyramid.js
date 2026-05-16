/* ============================================================
   mode-pyramid.js — 模式 1：頻率金字塔拖拉
   - 6 層由上而下從寬到窄（100% always 在頂端，0% never 在底部）
   - 6 張副詞卡在右側托盤，可拖到金字塔對應百分比的格子
   - 拖對：格子變綠 + 卡片消失 + 朗讀單字 + 震動
   - 拖錯：卡片彈回 + 搖晃 + 紅色提示
   - 全部完成：依序金色光暈 + 朗讀
   ============================================================ */

(function () {
  'use strict';

  // 由上而下的百分比排列（頂端最頻繁，底部最罕見）
  const TARGETS_ORDER = [100, 90, 70, 50, 10, 0];
  // 由上而下的格子寬度：從寬到窄（依使用者規格）
  const WIDTH_BY_LEVEL = ['96%', '88%', '80%', '72%', '64%', '56%'];

  let container = null;
  let placedCount = 0;

  // 拖拉狀態
  let dragging = null;
  let dragClone = null;
  let offsetX = 0;
  let offsetY = 0;

  // ---------- 入口 ----------
  function init(rootEl) {
    container = rootEl;
    placedCount = 0;
    render();
  }

  // ---------- 渲染 ----------
  function render() {
    const data = window.PYRAMID_L5;
    if (!Array.isArray(data) || data.length !== 6) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗（pyramid_L5.js）</p>';
      return;
    }

    container.innerHTML = `
      <h2 style="text-align:center; margin-bottom: 6px;">把副詞拖到對的百分比 🎯</h2>
      <p class="subtitle" style="text-align:center; margin-bottom: 16px;">100% = 總是發生；0% = 從未發生</p>
      <div class="pyramid-stage">
        <div class="pyramid-zone" id="pyramid-zone"></div>
        <div class="adverb-tray">
          <div class="adverb-tray-title">副詞卡（拖我）</div>
          <div id="tray-cards"></div>
        </div>
      </div>
      <div class="actions">
        <button class="btn" id="btn-reset">🔄 重新開始</button>
      </div>
    `;

    // 渲染金字塔層
    const zone = container.querySelector('#pyramid-zone');
    TARGETS_ORDER.forEach((pct, i) => {
      const item = data.find(d => d.percent === pct);
      if (!item) return;
      const level = document.createElement('div');
      level.className = 'pyramid-level';
      level.style.width = WIDTH_BY_LEVEL[i];
      level.dataset.targetId = item.id;
      level.dataset.percent = String(pct);
      level.innerHTML = `
        <span class="pct">${pct}%</span>
        <span class="placeholder" style="color:var(--ink-soft); font-size:13px;">拖到這裡</span>
      `;
      zone.appendChild(level);
    });

    // 渲染副詞卡（順序打亂）
    const tray = container.querySelector('#tray-cards');
    const shuffled = window.L5Shared.shuffle(data);
    shuffled.forEach(item => {
      const card = document.createElement('div');
      card.className = 'adverb-card';
      card.dataset.id = item.id;
      card.innerHTML = `<div class="word">${item.word}</div><div class="zh">${item.zh}</div>`;
      tray.appendChild(card);
      card.addEventListener('pointerdown', onPointerDown);
    });

    // 重置按鈕
    container.querySelector('#btn-reset').addEventListener('click', reset);

    updateStats();
  }

  // ---------- 拖拉處理 ----------
  function onPointerDown(e) {
    // 只處理主指標（左鍵或單指）
    if (e.button !== undefined && e.button !== 0) return;
    const card = e.currentTarget;
    if (card.classList.contains('placed')) return;

    e.preventDefault();
    dragging = card;
    card.classList.add('dragging');

    // 建立浮動的視覺 clone
    const rect = card.getBoundingClientRect();
    dragClone = card.cloneNode(true);
    dragClone.classList.remove('dragging');
    dragClone.style.position = 'fixed';
    dragClone.style.pointerEvents = 'none';
    dragClone.style.zIndex = '9999';
    dragClone.style.width = rect.width + 'px';
    dragClone.style.left = rect.left + 'px';
    dragClone.style.top = rect.top + 'px';
    dragClone.style.opacity = '0.92';
    dragClone.style.transform = 'scale(1.04)';
    dragClone.style.transition = 'none';
    document.body.appendChild(dragClone);

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // pointer capture 讓後續事件都到 card 上
    try { card.setPointerCapture(e.pointerId); } catch (_) {}
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerup', onPointerUp);
    card.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(e) {
    if (!dragging || !dragClone) return;
    e.preventDefault();
    dragClone.style.left = (e.clientX - offsetX) + 'px';
    dragClone.style.top = (e.clientY - offsetY) + 'px';

    // 高亮被 hover 的格子
    document.querySelectorAll('.pyramid-level.drag-over').forEach(l => l.classList.remove('drag-over'));
    const lvl = findLevelUnder(e.clientX, e.clientY);
    if (lvl && !lvl.classList.contains('locked')) lvl.classList.add('drag-over');
  }

  function onPointerUp(e) {
    if (!dragging) return;
    const card = dragging;
    const targetLevel = findLevelUnder(e.clientX, e.clientY);
    const matched = targetLevel && !targetLevel.classList.contains('locked') &&
                    targetLevel.dataset.targetId === card.dataset.id;

    cleanup();

    if (matched) {
      lockLevel(targetLevel, card);
      window.L5Shared.vibrate(30);
      placedCount++;
      if (placedCount === 6) celebrate();
    } else {
      card.classList.add('shake');
      window.L5Shared.vibrate([40, 60, 40]);
      let msg = '位置不對，再試試看！';
      if (targetLevel && targetLevel.classList.contains('locked')) {
        msg = '這格已經放過了，找別格試試！';
      } else if (!targetLevel) {
        msg = '要拖到金字塔的格子裡喔！';
      }
      window.L5Shared.showFeedback(container, 'wrong', msg, 1400);
      setTimeout(() => card.classList.remove('shake'), 320);
    }
    updateStats();
  }

  function findLevelUnder(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest('.pyramid-level');
  }

  function lockLevel(level, card) {
    const data = window.PYRAMID_L5.find(d => d.id === card.dataset.id);
    if (!data) return;
    level.classList.remove('drag-over');
    level.classList.add('locked', 'pop');
    level.innerHTML = `
      <span class="pct">${data.percent}%</span>
      <span class="filled-word">${data.word}</span>
      <span class="filled-zh">${data.zh}</span>
    `;
    card.classList.add('placed');
    setTimeout(() => level.classList.remove('pop'), 340);
    window.L5Shared.speak(data.word);
  }

  function cleanup() {
    if (dragClone) {
      dragClone.remove();
      dragClone = null;
    }
    if (dragging) {
      dragging.classList.remove('dragging');
      dragging.removeEventListener('pointermove', onPointerMove);
      dragging.removeEventListener('pointerup', onPointerUp);
      dragging.removeEventListener('pointercancel', onPointerUp);
      dragging = null;
    }
    document.querySelectorAll('.pyramid-level.drag-over').forEach(l => l.classList.remove('drag-over'));
  }

  // ---------- 完成動畫 ----------
  function celebrate() {
    const levels = container.querySelectorAll('.pyramid-level.locked');
    levels.forEach((lvl, i) => {
      setTimeout(() => {
        lvl.classList.add('celebrate');
        const word = lvl.querySelector('.filled-word')?.textContent || '';
        if (word) window.L5Shared.speak(word, 'en-US', 0.85);
      }, i * 700);
    });
    setTimeout(() => {
      window.L5Shared.showFeedback(container, 'correct', '🎉 太厲害了！全部排對！', 3000);
      saveCompletion();
    }, levels.length * 700);
  }

  function saveCompletion() {
    const prev = window.L5Shared.loadProgress('pyramid') || {};
    const attempts = (prev.attempts || 0) + 1;
    window.L5Shared.saveProgress('pyramid', {
      bestScore: 6,
      totalQuestions: 6,
      attempts,
      lastTs: Date.now(),
      completed: true,
    });
  }

  // ---------- 統計列 ----------
  function updateStats() {
    const total = 6;
    const progressEl = document.getElementById('stat-progress');
    const correctEl = document.getElementById('stat-correct');
    if (progressEl) progressEl.textContent = `${placedCount} / ${total}`;
    if (correctEl) correctEl.textContent = String(placedCount);
    // 此模式拖錯不計入錯誤累計（會自動彈回），所以 stat-wrong 保持 0
  }

  function reset() {
    placedCount = 0;
    render();
  }

  // ---------- 對外介面 ----------
  window.ModePyramid = { init, reset };
})();
