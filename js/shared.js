/* ============================================================
   shared.js — 共用工具
   - speak(text):     使用 Web Speech API 朗讀英文
   - shuffle(array):  隨機排列
   - saveProgress / loadProgress: localStorage 進度
   - showFeedback(container, type, message): 顯示對錯回饋動畫
   - saveWrong / getWrongList:   錯題本
   - vibrate(pattern): 行動裝置震動回饋（桌機會靜默忽略）
   ============================================================ */

(function () {
  'use strict';

  // ---------- 朗讀（簡化直接呼叫）----------
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices(); // 觸發 voices 載入
    // keep-alive：避免長句到 ~15 秒被 Chrome 自動中斷
    setInterval(() => {
      try {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      } catch (_) {}
    }, 5000);
  }

  function speak(text, lang = 'en-US', rate = 0.9) {
    if (!('speechSynthesis' in window)) {
      console.warn('此瀏覽器不支援語音合成，請改用 Chrome / Edge / Safari');
      return;
    }
    if (!text) return;
    try { window.speechSynthesis.cancel(); } catch (_) {}
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = lang;
    u.rate = rate;
    window.speechSynthesis.speak(u);
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

  function vibrate(pattern = 30) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (_) { /* 忽略 */ }
    }
  }

  // ---------- localStorage 進度 ----------
  const KEY_PREFIX = 'L5_GRAMMAR_';

  function saveProgress(modeId, payload) {
    try {
      localStorage.setItem(KEY_PREFIX + modeId, JSON.stringify(payload));
    } catch (e) {
      console.warn('儲存進度失敗', e);
    }
  }

  function loadProgress(modeId, fallback = null) {
    try {
      const raw = localStorage.getItem(KEY_PREFIX + modeId);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  // ---------- 錯題本 ----------
  const WRONG_KEY = KEY_PREFIX + 'WRONG_LIST';
  const WRONG_MAX = 200; // 限制最大筆數

  function saveWrong(record) {
    // record 結構: { mode, id, prompt, userAnswer, correctAnswer, ts }
    try {
      const list = getWrongList();
      record.ts = Date.now();
      list.unshift(record); // 最新放最前面
      const trimmed = list.slice(0, WRONG_MAX);
      localStorage.setItem(WRONG_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('儲存錯題失敗', e);
    }
  }

  function getWrongList() {
    try {
      const raw = localStorage.getItem(WRONG_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function clearWrongList() {
    localStorage.removeItem(WRONG_KEY);
  }

  // ---------- 回饋訊息 ----------
  function showFeedback(container, type, message, duration = 1600) {
    if (!container) return;
    let fb = container.querySelector('.feedback');
    if (!fb) {
      fb = document.createElement('div');
      fb.className = 'feedback';
      container.appendChild(fb);
    }
    fb.className = 'feedback show ' + type;
    fb.textContent = message;
    if (duration > 0) {
      clearTimeout(fb._t);
      fb._t = setTimeout(() => {
        fb.classList.remove('show');
      }, duration);
    }
  }

  // ---------- 錯題重做 filter ----------
  // 從 URL ?redo=1 啟動「只做錯題」模式
  // 回傳 null（沒啟動或無錯題）或 { size, has(id) }
  function getRedoFilter(modeName) {
    const params = new URLSearchParams(location.search);
    if (params.get('redo') !== '1') return null;
    const wrongs = getWrongList().filter(w => w.mode === modeName);
    if (!wrongs.length) return null;
    const savedIds = wrongs.map(w => w.id);
    return {
      size: new Set(savedIds).size,
      // 配對：完全相同 OR 題目 id + "_xxx" 前綴（如 translate 用 T001_kb / T001_drag）
      has: (qId) => savedIds.some(s => s === qId || s.startsWith(qId + '_'))
    };
  }

  function clearWrongByMode(modeName) {
    try {
      const remaining = getWrongList().filter(w => w.mode !== modeName);
      localStorage.setItem(WRONG_KEY, JSON.stringify(remaining));
    } catch (_) {}
  }

  // ---------- 暴露到全域 ----------
  window.L5Shared = {
    speak,
    shuffle,
    vibrate,
    saveProgress,
    loadProgress,
    saveWrong,
    getWrongList,
    clearWrongList,
    clearWrongByMode,
    getRedoFilter,
    showFeedback,
  };

  // 模式標題對應（grammar.html 共用）
  window.MODE_TITLES = {
    pyramid:   '🏔️ 模式 1：頻率金字塔',
    position:  '🎯 模式 2：副詞位置點選',
    fillblank: '✍️ 模式 3：Look and Write 填空',
    howoften:  '🔗 模式 4：How often 連連看',
    spin:      '🎡 模式 5：Spin and Say 轉盤',
    vocab:     '📝 模式 6：字彙語法選擇',
    translate: '✏️ 模式 7：中翻英練習',
    reading:   '📖 模式 8：閱讀理解',
    transform: '🔧 模式 9：句型轉換',
  };
})();
