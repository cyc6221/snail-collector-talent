// 快速配點頁：一組預設的配點方案，按下去直接套用到目前的配點
import { COLOR_ORDER, CN, $, esc, nodeCost } from './util.js';
import { state, commit, lv, usedByColor, ownedNum } from './state.js';
import { isArmed, confirmTwice } from './rules.js';
import { toast } from './toast.js';

const allNodes = () => state.data.branches.flatMap(b => b.layers.flatMap(l => l.nodes)).concat(state.data.extras);

/**
 * 方案清單：build() 回傳要套用的整份配點（節點 id → 等級）。
 * 之後要加新的方案，在這裡多放一項就會自動出現在頁面上。
 */
const PRESETS = [
  {
    id: 'all',
    title: '全部點',
    desc: '所有天賦點滿',
    build: () => Object.fromEntries(allNodes().map(n => [n.id, n.max]))
  }
];

/** 方案套用後各色要花的點數 */
function costOf(alloc) {
  const c = { blue: 0, purple: 0, orange: 0 };
  allNodes().forEach(n => { const nc = nodeCost(n), x = alloc[n.id] || 0; for (const k in c) c[k] += nc[k] * x; });
  return c;
}
const same = a => { const cur = state.alloc; return Object.keys(a).every(id => (cur[id] || 0) === a[id]) && Object.keys(cur).every(id => (cur[id] || 0) === (a[id] || 0)); };

export function renderQuick() {
  const ae = document.activeElement, focusId = ae && ae.dataset && ae.dataset.preset;   // 重畫後把鍵盤焦點放回同一顆按鈕
  $('#quick').innerHTML =
    '<h2 id="quickH">快速配點</h2>' +
    '<div class="q-grid">' + PRESETS.map(p => {
      const alloc = p.build(), cost = costOf(alloc), done = same(alloc);
      const label = done ? '目前已經是這個配點' : isArmed('quick:' + p.id) ? '再按一次以覆蓋目前配點' : '套用';
      return '<article class="q-card">' +
        '<div class="q-text"><h3>' + esc(p.title) + '</h3><p class="q-desc">' + esc(p.desc) + '</p></div>' +
        '<div class="q-cost"><span class="lbl">需要</span>' + COLOR_ORDER.filter(k => cost[k] > 0).map(k =>
          '<span class="pt c-' + k + '"><span class="orb sm" aria-hidden="true"></span><span class="sr">' + CN[k] + '</span>' + cost[k] + '</span>').join('') + '</div>' +
        '<button type="button" class="btn primary' + (isArmed('quick:' + p.id) ? ' armed' : '') + '" data-preset="' + p.id + '"' + (done ? ' disabled' : '') + '>' + label + '</button>' +
      '</article>';
    }).join('') + '</div>';
  if (focusId) { const b = $('#quick').querySelector('[data-preset="' + focusId + '"]'); if (b && !b.disabled) b.focus({ preventScroll: true }); }
}

function apply(p) {
  state.alloc = p.build();
  commit();
  const used = usedByColor(), over = COLOR_ORDER.filter(c => ownedNum(c) !== null && used[c] > ownedNum(c));
  toast('已套用「' + p.title + '」。' + (over.length ? over.map(c => CN[c]).join('、') + '珠超出你填的擁有量（已標紅）。' : ''));
}

$('#quick').addEventListener('click', e => {
  const b = e.target.closest('[data-preset]');
  if (!b || b.disabled) return;
  const p = PRESETS.find(x => x.id === b.dataset.preset);
  if (!p) return;
  if (allNodes().some(n => lv(n.id) > 0)) confirmTwice('quick:' + p.id, () => apply(p), '套用「' + p.title + '」會覆蓋目前所有配點，再按一次才會套用。');
  else apply(p);
});
