// 固定列與頁面面板：點數列、工具列狀態、能力加總
import { COLORS, COLOR_ORDER, CN, $, esc, fmtVal } from './util.js';
import { state, save, lv, usedByColor, ownedNum } from './state.js';
import { isArmed } from './rules.js';

/* ---------- 點數列 ---------- */
export function buildPoints() {
  $('#chips').innerHTML = COLOR_ORDER.map(c => (
    '<div class="chip c-' + c + '" id="chip-' + c + '">' +
      '<span class="orb" aria-hidden="true"></span>' +
      '<span class="sr">' + CN[c] + '珠</span>' +
      '<label class="cf cf-own"><span class="k" aria-hidden="true">有</span><span class="sr">' + CN[c] + '珠擁有量（留空＝不限）</span>' +
        '<input type="number" min="0" step="1" inputmode="numeric" placeholder="不限" id="own-' + c + '"></label>' +
      '<div class="cf cf-used"><span class="k" aria-hidden="true">用</span><span class="sr">已用</span><b id="used-' + c + '">0</b></div>' +
      '<div class="cf cf-rem"><span class="k" id="remk-' + c + '" aria-hidden="true">剩</span><span class="sr" id="remsr-' + c + '">剩餘</span><b id="rem-' + c + '"></b></div>' +
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
    const chip = $('#chip-' + c), rem = $('#rem-' + c), remk = $('#remk-' + c), remsr = $('#remsr-' + c);
    const over = own !== null && used[c] > own;
    chip.classList.toggle('over', over);
    chip.classList.toggle('unlimited', own === null);
    remk.textContent = over ? '超' : '剩';
    remsr.textContent = over ? '超出' : '剩餘';
    rem.textContent = own === null ? '不限' : Math.abs(own - used[c]);
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
function totalsOf(nodes) {
  const m = new Map();
  nodes.forEach(n => {
    const x = lv(n.id);
    if (!x) return;
    n.effects.forEach(e => {
      const k = e.stat + '\u0000' + e.unit;
      const o = m.get(k) || { stat: e.stat, unit: e.unit, v: 0 };
      o.v += e.per * x;
      m.set(k, o);
    });
  });
  return m;
}

export function renderSummary() {
  const list = m => {
    if (!m.size) return '<p class="empty">尚未配點。</p>';
    return '<ul>' + [...m.values()].map(o =>
      '<li><span>' + esc(o.stat) + '</span><b>' + fmtVal(o.v, o.unit, true) + '</b></li>').join('') + '</ul>';
  };
  const ex = state.data.extras, free = ex.filter(e => e.lane === null);   // 不屬於任何分支的額外節點（紅色天賦）
  const cards = state.data.branches.length + (free.length ? 1 : 0);
  $('#summary').innerHTML =
    '<h2 id="sumH">能力加總</h2><div class="sum-grid" style="--n:' + cards + '">' +
    state.data.branches.map((b, bi) => '<div class="sum-card"><h3>' + esc(b.name) + '</h3>' + list(totalsOf(b.layers.flatMap(l => l.nodes).concat(ex.filter(e => e.lane === bi)))) + '</div>').join('') +
    // 不屬於任何分支的額外節點（紅色天賦）獨立一項記錄，效果不與各分支相加；屬於某個分支的額外節點算在該分支裡
    (free.length ? '<div class="sum-card red"><h3>紅色天賦</h3>' + list(totalsOf(free)) + '</div>' : '') +
    '</div>';
}
