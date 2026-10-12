// 固定列與頁面面板：點數列、工具列狀態、能力加總
import { COLORS, CN, $, esc, fmtVal } from './util.js';
import { state, save, lv, usedByColor, ownedNum } from './state.js';
import { isArmed } from './rules.js';

/* ---------- 點數列 ---------- */
const CHIP_ORDER = ['orange', 'purple', 'blue'];   // 頂部三張卡片由左到右的順序
export function buildPoints() {
  $('#chips').innerHTML = CHIP_ORDER.map(c => (
    '<div class="chip c-' + c + '" id="chip-' + c + '">' +
      '<span class="orb lg" aria-hidden="true"></span>' +
      '<div class="chip-main"><div class="chip-name">' + CN[c] + '點</div>' +
        '<div class="chip-used">已用 <b id="used-' + c + '">0</b></div></div>' +
      '<div class="chip-side">' +
        '<label class="chip-own"><span>擁有</span><span class="sr">' + CN[c] + '點數擁有量（留空＝不限）</span>' +
          '<input type="number" min="0" step="1" inputmode="numeric" placeholder="不限" id="own-' + c + '"></label>' +
        '<div class="chip-rem" id="rem-' + c + '"></div>' +
      '</div>' +
      '<div class="chip-bar" aria-hidden="true"><i id="bar-' + c + '"></i></div>' +
    '</div>'
  )).join('');
  COLORS.forEach(c => {
    const input = $('#own-' + c);
    input.value = state.owned[c];
    input.addEventListener('input', () => {
      const raw = input.value.trim();
      const v = Number(raw);
      state.owned[c] = (raw === '' || !Number.isFinite(v)) ? '' : Math.max(0, Math.round(v));
      save();
      updatePoints();
    });
  });
}
export function updatePoints() {
  const used = usedByColor();
  COLORS.forEach(c => {
    $('#used-' + c).textContent = used[c];
    const own = ownedNum(c);
    const chip = $('#chip-' + c), rem = $('#rem-' + c);
    $('#bar-' + c).style.width = (own === null ? 0 : own === 0 ? (used[c] > 0 ? 100 : 0) : Math.min(100, used[c] / own * 100)) + '%';
    chip.classList.toggle('over', own !== null && used[c] > own);
    chip.classList.toggle('unlimited', own === null);
    if (own === null) rem.textContent = '不限';
    else if (used[c] > own) rem.textContent = '超出 ' + (used[c] - own);
    else rem.textContent = '剩餘 ' + (own - used[c]);
  });
}

/** 匯入後把「擁有」輸入框同步成目前狀態 */
export function syncOwnedInputs() {
  COLORS.forEach(c => { $('#own-' + c).value = state.owned[c]; });
}

/* ---------- 工具列 ---------- */
export function updateTools() {
  const bc = $('#btnClear');
  bc.textContent = isArmed('clear') ? '再按一次確認清空' : '清空配點';
  bc.classList.toggle('armed', isArmed('clear'));
}

/* ---------- 能力加總 ---------- */
function branchTotals(b) {
  const m = new Map();
  b.layers.forEach(l => l.nodes.forEach(n => {
    const x = lv(n.id);
    if (!x) return;
    n.effects.forEach(e => {
      const k = e.stat + '\u0000' + e.unit;
      const o = m.get(k) || { stat: e.stat, unit: e.unit, v: 0 };
      o.v += e.per * x;
      m.set(k, o);
    });
  }));
  return m;
}

export function renderSummary() {
  const list = m => {
    if (!m.size) return '<p class="empty">尚未配點。</p>';
    return '<ul>' + [...m.values()].map(o =>
      '<li><span>' + esc(o.stat) + '</span><b>' + fmtVal(o.v, o.unit, true) + '</b></li>').join('') + '</ul>';
  };
  $('#summary').innerHTML =
    '<h2 id="sumH">能力加總</h2><div class="sum-grid">' +
    state.data.branches.map(b => '<div class="sum-card"><h3>' + esc(b.name) + '</h3>' + list(branchTotals(b)) + '</div>').join('') +
    '</div>';
}
