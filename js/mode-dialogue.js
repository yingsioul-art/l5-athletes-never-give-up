/* ============================================================
   mode-dialogue.js — 對話練習（含講解）
   - 開場場景 + 6 句對話
   - 每句獨立朗讀 + 中文 + 講解（單字 / 慣用語 / 文法）
   - 角色扮演模式：選 Reporter 或 Amanda，該角色台詞先隱藏
   - 附 3 題聽力理解選擇題
   ============================================================ */

(function () {
  'use strict';

  let container = null;
  let showZh = true;
  let showAllAnn = false;
  let roleplayId = null;

  function init(rootEl) {
    container = rootEl;
    showZh = true;
    showAllAnn = false;
    roleplayId = null;
    render();
  }

  function render() {
    const data = window.DIALOGUE_L5;
    if (!data || !Array.isArray(data.lines)) {
      container.innerHTML = '<p style="color:var(--red);text-align:center;padding:40px 0;">資料載入失敗</p>';
      return;
    }
    const speakerMap = {};
    data.speakers.forEach(s => { speakerMap[s.id] = s; });

    let html = `
      <div class="reading-stage ${showZh ? 'show-zh' : ''} ${showAllAnn ? 'show-ann' : ''}">
        <h2 style="text-align:center; margin-bottom:6px;">${escapeHtml(data.title)}</h2>
        <p class="subtitle" style="text-align:center; margin-bottom: 14px;">${escapeHtml(data.subtitle || '')}</p>

        <div class="passage-toolbar">
          <button class="btn" id="btn-read-all">🔊 朗讀全段</button>
          <button class="btn" id="btn-toggle-zh">${showZh ? '🙈 隱藏中文' : '💡 顯示中文'}</button>
          <button class="btn" id="btn-toggle-ann">${showAllAnn ? '📕 收合全部講解' : '📖 展開全部講解'}</button>
        </div>

        <div class="roleplay-bar">
          <span class="rp-label">🎭 角色扮演</span>
          ${data.speakers.map(s => `
            <button class="rp-btn ${roleplayId === s.id ? 'active' : ''}" data-id="${s.id}">
              ${s.emoji} 我扮演 ${escapeHtml(s.name)}
            </button>
          `).join('')}
          ${roleplayId ? `<button class="rp-btn rp-clear" id="rp-clear">✗ 退出</button>` : ''}
        </div>
    `;

    if (data.setting) {
      html += renderSettingBlock(data.setting);
    }

    html += `<div class="dialogue-body">`;
    data.lines.forEach((line, i) => {
      html += renderDialogueLine(line, i, speakerMap);
    });
    html += `</div>`;

    if (Array.isArray(data.comprehension) && data.comprehension.length) {
      html += renderComprehension(data.comprehension);
    }

    html += `</div>`;
    container.innerHTML = html;

    // 綁定
    container.querySelector('#btn-toggle-zh').addEventListener('click', () => { showZh = !showZh; render(); });
    container.querySelector('#btn-toggle-ann').addEventListener('click', () => { showAllAnn = !showAllAnn; render(); });
    container.querySelector('#btn-read-all').addEventListener('click', readAll);

    container.querySelectorAll('.rp-btn[data-id]').forEach(b => {
      b.addEventListener('click', () => {
        roleplayId = b.dataset.id;
        render();
      });
    });
    const clearBtn = container.querySelector('#rp-clear');
    if (clearBtn) clearBtn.addEventListener('click', () => { roleplayId = null; render(); });

    container.querySelectorAll('.ann-toggle').forEach(b => {
      b.addEventListener('click', () => {
        const box = b.parentElement.querySelector('.ann-box');
        if (!box) return;
        box.classList.toggle('open');
        b.textContent = box.classList.contains('open') ? '🔼 收合講解' : '🔍 看講解';
      });
    });
    container.querySelectorAll('.rp-reveal').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.idx, 10);
        const lineEl = container.querySelector(`.dialogue-line[data-idx="${idx}"]`);
        if (lineEl) {
          lineEl.querySelectorAll('.rp-hidden').forEach(el => el.classList.remove('rp-hidden'));
          const promptEl = lineEl.querySelector('.rp-prompt');
          if (promptEl) promptEl.style.display = 'none';
        }
      });
    });

    container.querySelectorAll('.comp-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const qIdx = parseInt(btn.dataset.qi, 10);
        const cIdx = parseInt(btn.dataset.ci, 10);
        const ans = parseInt(btn.dataset.ans, 10);
        const block = btn.closest('.comp-question');
        if (block.dataset.answered === '1') return;
        block.dataset.answered = '1';
        block.querySelectorAll('.comp-choice').forEach((b, i) => {
          b.disabled = true;
          if (i === ans) b.classList.add('correct');
          if (i === cIdx && i !== ans) b.classList.add('wrong');
        });
        const expl = block.querySelector('.comp-explain');
        if (expl) expl.style.display = 'block';
      });
    });
  }

  function renderSettingBlock(setting) {
    return `
      <div class="dialogue-setting">
        <div class="setting-label">場景</div>
        <div class="setting-en">${escapeHtml(setting.en)}</div>
        <div class="setting-zh">${escapeHtml(setting.zh)}</div>
        ${hasAnnotations(setting) ? `
          <button class="ann-toggle">🔍 看講解</button>
          <div class="ann-box">
            ${renderVocab(setting.vocab)}
            ${renderGrammar(setting.grammar)}
          </div>` : ''}
      </div>
    `;
  }

  function renderDialogueLine(line, i, speakerMap) {
    const sp = speakerMap[line.speaker];
    const hide = roleplayId === line.speaker;
    return `
      <div class="dialogue-line speaker-${sp.color} ${hide ? 'rp-hide' : ''}" data-idx="${i}">
        <div class="line-speaker">
          <span class="line-emoji">${sp.emoji}</span>
          <span class="line-name">${escapeHtml(sp.name)}</span>
        </div>
        <div class="line-content">
          ${hide ? `
            <div class="rp-prompt">
              👉 換你說！按下方「揭示」可看答案
              <button class="btn rp-reveal" data-idx="${i}">👁 揭示</button>
            </div>
            <div class="line-en rp-hidden">${escapeHtml(line.en)}</div>
            <div class="line-zh rp-hidden">${escapeHtml(line.zh)}</div>
          ` : `
            <div class="line-en">${escapeHtml(line.en)}</div>
            <div class="line-zh">${escapeHtml(line.zh)}</div>
          `}
          <button class="speaker-mini line-speaker-btn" data-text="${escAttr(line.en)}" onclick="speakDialogue(this)">🔊</button>
          ${hasAnnotations(line) ? `
            <button class="ann-toggle">🔍 看講解</button>
            <div class="ann-box">
              ${renderVocab(line.vocab)}
              ${renderIdioms(line.idioms)}
              ${renderGrammar(line.grammar)}
            </div>` : ''}
        </div>
      </div>
    `;
  }

  function renderComprehension(items) {
    const letters = ['A', 'B', 'C', 'D'];
    return `
      <div class="dialogue-comp">
        <h3 class="comp-title">📝 對話理解 ${items.length} 題</h3>
        ${items.map((q, qi) => `
          <div class="comp-question" data-answered="0">
            <div class="comp-prompt">${qi + 1}. ${escapeHtml(q.prompt)}</div>
            <div class="comp-prompt-zh">${escapeHtml(q.zh_prompt || '')}</div>
            <div class="comp-choices">
              ${q.choices.map((c, ci) => `
                <button class="vocab-choice comp-choice"
                        data-qi="${qi}" data-ci="${ci}" data-ans="${q.answer}">
                  <span class="letter">${letters[ci]}</span>
                  <span class="text">${escapeHtml(c)}</span>
                </button>
              `).join('')}
            </div>
            <div class="comp-explain" style="display:none;">
              💡 ${escapeHtml(q.explanation || '')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function hasAnnotations(o) {
    if (!o) return false;
    return (Array.isArray(o.vocab) && o.vocab.length) ||
           (Array.isArray(o.idioms) && o.idioms.length) ||
           (Array.isArray(o.grammar) && o.grammar.length);
  }

  function renderVocab(arr) {
    if (!Array.isArray(arr) || !arr.length) return '';
    return `
      <div class="ann-section ann-vocab">
        <div class="ann-section-title">📖 單字</div>
        <ul>
          ${arr.map(v => `
            <li>
              <span class="ann-num">${escapeHtml(v.label || ('L5#' + (v.num != null ? v.num : '補充')))}</span>
              <strong>${escapeHtml(v.word)}</strong>
              <em>${escapeHtml(v.pos || '')}</em>
              ${escapeHtml(v.meaning || '')}
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
        <ul>${arr.map(i => `<li><strong>${escapeHtml(i.phrase)}</strong> ─ ${escapeHtml(i.meaning)}</li>`).join('')}</ul>
      </div>
    `;
  }
  function renderGrammar(arr) {
    if (!Array.isArray(arr) || !arr.length) return '';
    return `
      <div class="ann-section ann-grammar">
        <div class="ann-section-title">📐 文法重點</div>
        <ul>
          ${arr.map(g => `<li><div class="g-point">${escapeHtml(g.point)}</div><div class="g-explain">${escapeHtml(g.explanation)}</div></li>`).join('')}
        </ul>
      </div>
    `;
  }

  function readAll() {
    const data = window.DIALOGUE_L5;
    const text = data.lines.map(l => l.en).join(' ');
    window.L5Shared.speak(text);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  window.speakDialogue = function (btn) {
    if (btn && btn.dataset && btn.dataset.text) window.L5Shared.speak(btn.dataset.text);
  };

  window.ModeDialogue = { init };
})();
