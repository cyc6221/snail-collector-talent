// 固定列與頁面面板：點數列、工具列狀態、能力加總
import { COLORS, COLOR_ORDER, CN, MAX_OWNED, $, esc, fmtVal } from './util.js';
import { state, save, lv, usedByColor, ownedNum } from './state.js';
import { isArmed } from './rules.js';
import { toast } from './toast.js';
import { TAGS, tagChipsHTML, statHTML } from './tags.js';

/* ---------- 點數列 ---------- */
export function buildPoints() {
  $('#chips').innerHTML = COLOR_ORDER.map(c => (
    '<div class="chip c-' + c + '" id="chip-' + c + '">' +
      '<span class="orb" aria-hidden="true"></span>' +
      '<span class="sr">' + CN[c] + '珠</span>' +
      '<label class="cf cf-own"><span class="k" aria-hidden="true">有</span><span class="sr">' + CN[c] + '珠擁有量（留空＝不限）</span>' +
        '<input type="text" inputmode="numeric" autocomplete="off" placeholder="不限" id="own-' + c + '"></label>' +
      '<div class="cf cf-used"><span class="k" aria-hidden="true">用</span><span class="sr">已用</span><b id="used-' + c + '">0</b></div>' +
      '<div class="cf cf-rem"><span class="k" id="remk-' + c + '" aria-hidden="true">剩</span><span class="sr" id="remsr-' + c + '">剩餘</span><b id="rem-' + c + '"></b></div>' +
    '</div>'
  )).join('');
  COLORS.forEach(c => {
    const input = $('#own-' + c);
    input.value = state.owned[c];
    // 只能輸入數字 0～9：連 + - . e 這類字元都擋下來，貼上或輸入法打進來的也會被濾掉並提示
    input.addEventListener('beforeinput', e => {
      if (e.data && /[^0-9]/.test(e.data) && !e.isComposing) { e.preventDefault(); toast('擁有量只能輸入數字 0～9。'); }
    });
    const onValue = () => {
      let digits = input.value.replace(/[^0-9]/g, '');
      if (digits !== input.value) { input.value = digits; toast('擁有量只能輸入數字 0～9。'); }
      const trimmed = digits.replace(/^0+(?=[0-9])/, '');   // 開頭的 0 自動消除：05→5、000→0
      if (trimmed !== digits) { digits = trimmed; input.value = digits; }
      const n = Number(digits);
      const over = digits !== '' && (!Number.isFinite(n) || n > MAX_OWNED);
      state.owned[c] = (digits === '' || over) ? '' : n;
      if (over) { input.value = ''; toast(CN[c] + '珠的擁有量最多 ' + MAX_OWNED + '，已清成空白（不限）。'); }   // 超過上限就清成空白＝不限
      save();
      updatePoints();
    };
    input.addEventListener('input', e => { if (!e.isComposing) onValue(); });
    input.addEventListener('compositionend', onValue);
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
  bc.textContent = isArmed('clear') ? '再按一次清空' : '清空配點';
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
  const tag = TAGS.find(t => t.id === state.tag);   // 篩選中的標籤（沒有＝全部）
  const list = m => {
    const rows = [...m.values()].filter(o => !tag || tag.stats.includes(o.stat));
    if (!rows.length) return '<p class="empty">' + (m.size ? '沒有「' + esc(tag.name) + '」的能力。' : '尚未配點。') + '</p>';
    return '<ul>' + rows.map(o =>
      '<li><span>' + statHTML(o.stat) + tagChipsHTML(o.stat) + '</span><b>' + fmtVal(o.v, o.unit, true) + '</b></li>').join('') + '</ul>';
  };
  const tagbar = '<div class="tagbar" role="group" aria-label="依標籤篩選">' +
    [{ id: '', name: '全部' }].concat(TAGS).map(t =>
      '<button type="button" class="tagbtn"' + (t.id ? ' data-tag="' + t.id + '"' : '') + ' data-tagf="' + t.id + '" aria-pressed="' + (t.id === state.tag) + '">' + esc(t.name) + '</button>').join('') + '</div>';
  const ex = state.data.extras, free = ex.filter(e => e.lane === null);   // 不屬於任何分支的額外節點（紅色天賦）
  const cards = state.data.branches.length + (free.length ? 1 : 0);
  $('#summary').innerHTML =
    '<h2 id="sumH">能力加總</h2>' + tagbar + '<div class="sum-grid" style="--n:' + cards + '">' +
    state.data.branches.map((b, bi) => '<div class="sum-card" data-b="' + bi + '"><h3>' + esc(b.name) + '</h3>' + list(totalsOf(b.layers.flatMap(l => l.nodes).concat(ex.filter(e => e.lane === bi)))) + '</div>').join('') +
    // 不屬於任何分支的額外節點（紅色天賦）獨立一項記錄，效果不與各分支相加；屬於某個分支的額外節點算在該分支裡
    (free.length ? '<div class="sum-card red"><h3>紅色天賦</h3>' + list(totalsOf(free)) + '</div>' : '') +
    '</div>';
}

// 標籤篩選：點一下切換，再點同一個回到「全部」
$('#summary').addEventListener('click', e => {
  const b = e.target.closest('[data-tagf]');
  if (!b) return;
  state.tag = b.dataset.tagf === state.tag ? '' : b.dataset.tagf;
  renderSummary();
  const again = $('#summary').querySelector('[data-tagf="' + state.tag + '"]');   // 重畫後把鍵盤焦點放回同一顆按鈕
  if (again) again.focus({ preventScroll: true });
});
