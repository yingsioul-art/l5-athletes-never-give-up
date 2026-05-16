/* ============================================================
   mode-passage.js — 課文閱讀（含講解）
   - 2 段、10 句課文
   - 每句獨立朗讀 + 中文翻譯
   - 每句可展開講解：單字（連結 L5 vocab 頁編號）/ 慣用語 / 文法
   - 全文朗讀 / 切換中文 / 全部展開講解 等工具列
   ============================================================ */

(function () {
  'use strict';

  let container = null;
  let showZh = true;        // 預設顯示中文
  let showAllAnn = false;   // 是否全部展開講解

  function init(rootEl) {
    container = rootEl;
    showZh = true;
    showAllAnn = false;
    render();
  }

  function render() {
    const data = window.PASSAGE_L5;
    if (!data || !Array.isArray(data.paragraphs)) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗</p>';
      return;
    }

    let html = `
      <div class="reading-stage ${showZh ? 'show-zh' : ''} ${showAllAnn ? 'show-ann' : ''}">
        <h2 style="text-align:center; margin-bottom:6px;">${escapeHtml(data.title)}</h2>
        <p class="subtitle" style="text-align:center; margin-bottom: 14px;">${escapeHtml(data.subtitle || '')}</p>

        <div class="passage-toolbar">
          <button class="btn" id="btn-read-all">🔊 朗讀全文</button>
          <button class="btn" id="btn-toggle-zh">${showZh ? '🙈 隱藏中文' : '💡 顯示中文'}</button>
          <button class="btn" id="btn-toggle-ann">${showAllAnn ? '📕 收合全部講解' : '📖 展開全部講解'}</button>
        </div>
    `;

    data.paragraphs.forEach((para, pIdx) => {
      html += `<div class="passage-para-group"><div class="para-label">第 ${pIdx + 1} 段</div>`;
      para.sentences.forEach((s, sIdx) => {
        html += renderSentence(s, pIdx, sIdx);
      });
      html += `</div>`;
    });

    if (Array.isArray(data.quotes) && data.quotes.length) {
      html += `
        <div class="passage-quotes">
          <h3 class="quote-title">💭 Post-reading 名言</h3>
          ${data.quotes.map(q => `
            <div class="quote-card">
              <button class="speaker-mini" data-text="${escAttr(q.en)}" onclick="speakPassage(this)">🔊</button>
              <div class="quote-content">
                <div class="quote-en">"${escapeHtml(q.en)}"</div>
                <div class="quote-zh">${escapeHtml(q.zh)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;

    container.querySelector('#btn-toggle-zh').addEventListener('click', () => { showZh = !showZh; render(); });
    container.querySelector('#btn-toggle-ann').addEventListener('click', () => { showAllAnn = !showAllAnn; render(); });
    container.querySelector('#btn-read-all').addEventListener('click', readAll);
    container.querySelectorAll('.ann-toggle').forEach(b => {
      b.addEventListener('click', () => {
        const box = b.parentElement.querySelector('.ann-box');
        if (!box) return;
        box.classList.toggle('open');
        b.textContent = box.classList.contains('open') ? '🔼 收合講解' : '🔍 看講解';
      });
    });
  }

  function renderSentence(s, pIdx, sIdx) {
    return `
      <div class="passage-sentence" data-p="${pIdx}" data-s="${sIdx}">
        <button class="speaker-mini sentence-speaker" data-text="${escAttr(s.en)}" onclick="speakPassage(this)">🔊</button>
        <div class="sentence-content">
          <div class="sentence-en">${escapeHtml(s.en)}</div>
          <div class="sentence-zh">${escapeHtml(s.zh)}</div>
          ${renderAnnotationBlock(s)}
        </div>
      </div>
    `;
  }

  function renderAnnotationBlock(s) {
    if (!hasAnnotations(s)) return '';
    return `
      <button class="ann-toggle">🔍 看講解</button>
      <div class="ann-box">
        ${renderVocab(s.vocab)}
        ${renderIdioms(s.idioms)}
        ${renderGrammar(s.grammar)}
      </div>
    `;
  }

  function hasAnnotations(s) {
    return (Array.isArray(s.vocab) && s.vocab.length) ||
           (Array.isArray(s.idioms) && s.idioms.length) ||
           (Array.isArray(s.grammar) && s.grammar.length);
  }

  function renderVocab(arr) {
    if (!Array.isArray(arr) || !arr.length) return '';
    return `
      <div class="ann-section ann-vocab">
        <div class="ann-section-title">📖 單字（Reading 頁）</div>
        <ul>
          ${arr.map(v => `
            <li>
              <span class="ann-num">${escapeHtml(v.label || '#' + v.num)}</span>
              <strong>${escapeHtml(v.word)}</strong>
              <em>${escapeHtml(v.pos)}</em>
              ${escapeHtml(v.meaning)}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  function renderIdioms(arr) {
    if (!Array.isArray(arr) || !arr.length) return '';
    return `
      <div class="ann-section ann-idiom">
        <div class="ann-section-title">💡 慣用語／片語</div>
        <ul>
          ${arr.map(i => `
            <li><strong>${escapeHtml(i.phrase)}</strong> ─ ${escapeHtml(i.meaning)}</li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  function renderGrammar(arr) {
    if (!Array.isArray(arr) || !arr.length) return '';
    return `
      <div class="ann-section ann-grammar">
        <div class="ann-section-title">📐 文法重點</div>
        <ul>
          ${arr.map(g => `
            <li>
              <div class="g-point">${escapeHtml(g.point)}</div>
              <div class="g-explain">${escapeHtml(g.explanation)}</div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  function readAll() {
    const data = window.PASSAGE_L5;
    const text = data.paragraphs
      .map(p => p.sentences.map(s => s.en).join(' '))
      .join(' ');
    window.L5Shared.speak(text);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  window.speakPassage = function (btn) {
    if (btn && btn.dataset && btn.dataset.text) window.L5Shared.speak(btn.dataset.text);
  };

  window.ModePassage = { init };
})();
