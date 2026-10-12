// 進入點：綁定事件、頁面切換、啟動
import { $ } from './util.js';
import { state, hadSaved, save, lv, findNode, onChange } from './state.js';
import { setLevel, clearAlloc, confirmTwice } from './rules.js';
import { render } from './render.js';
import { buildPoints } from './panels.js';
import './dialogs.js';
import { toast } from './toast.js';

/* ---------- 分支區：配點按鈕（事件委派） ---------- */
$('#branches').addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const act = el.dataset.act, id = el.dataset.id;

  switch (act) {
    case 'inc': setLevel(id, lv(id) + 1); break;
    case 'dec': setLevel(id, lv(id) - 1); break;
    case 'max': { const f = findNode(id); if (f) setLevel(id, f.n.max); break; }
    case 'zero': setLevel(id, 0); break;
    case 'dot': {
      const k = Number(el.dataset.k);
      setLevel(id, k === lv(id) ? k - 1 : k);
      break;
    }
  }
});

$('#tabs').addEventListener('click', e => {
  const el = e.target.closest('[data-tab]');
  if (!el) return;
  state.tab = Number(el.dataset.tab);
  render();
  window.scrollTo({ top: 0 });
});

/* ---------- 工具列 ---------- */
$('#btnClear').addEventListener('click', () => confirmTwice('clear', () => {
  clearAlloc();
  toast('已清空所有配點。');
}, '再按一次以清空所有配點。'));

/* ---------- 頁面切換：天賦配點 ⇄ 能力加總（各自記住捲動位置） ---------- */
const scrollPos = {};
let view = null;
const viewFromHash = () => (location.hash === '#/summary' ? 'summary' : 'build');

function showView(next) {
  if (next === view) return;
  if (view) scrollPos[view] = window.scrollY;
  view = next;
  const build = view === 'build';
  $('#tabs').hidden = !build;
  $('#branches').hidden = !build;
  $('#summary').hidden = build;
  document.querySelectorAll('#viewnav .vbtn').forEach(b => b.setAttribute('aria-current', String(b.dataset.view === view)));
  // 第一次進入能力加總時，捲到頁首下方（讓頂部固定列和內容在視線內）
  const top = view in scrollPos ? scrollPos[view] : (build ? 0 : $('.top').offsetHeight);
  window.scrollTo(0, top);
  updateElevator();
}

$('#viewnav').addEventListener('click', e => {
  const b = e.target.closest('[data-view]');
  if (!b || b.dataset.view === view) return;
  location.hash = b.dataset.view === 'summary' ? '#/summary' : '#/';
});
window.addEventListener('hashchange', () => showView(viewFromHash()));
try { history.scrollRestoration = 'manual'; } catch (e) { /* ignore */ }

/* ---------- 電梯：▲ 回到頂端／樓層數字（可輸入）／▼ 到最底端 ---------- */
const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
const floorInput = $('#floorInput'), btnTop = $('#btnTop'), btnBottom = $('#btnBottom');
const lastFloor = () => Math.max(1, ...state.data.branches.map(b => b.layers.length)) + (state.data.reds.length ? 1 : 0);   // 紅色天賦是最後一層
const layerEl = n => [...document.querySelectorAll('.g-layer[data-layer="' + n + '"]')].find(x => x.offsetParent);   // 窄螢幕只看得到一個分支

/** 目前所在樓層：固定列下方的閱讀線已經捲過的最後一層（捲到底就是最高層） */
function currentFloor() {
  const doc = document.documentElement;
  if (doc.scrollHeight - window.innerHeight - window.scrollY < 5) return lastFloor();
  const line = $('#points').getBoundingClientRect().bottom + 80;
  let cur = 1;
  for (let n = 1; n <= lastFloor(); n++) {
    const el = layerEl(n);
    if (el && el.getBoundingClientRect().top <= line) cur = n;
  }
  return cur;
}

function updateElevator() {
  const doc = document.documentElement, y = window.scrollY;
  btnTop.disabled = y < 5;                                   // 淡化，不消失
  btnBottom.disabled = doc.scrollHeight - window.innerHeight - y < 5;
  const build = view === 'build';
  floorInput.disabled = !build;
  if (!build) floorInput.value = '–';
  else if (document.activeElement !== floorInput) floorInput.value = currentFloor();   // 輸入中不要被覆蓋
}
let elevatorFrame = 0;
const scheduleElevator = () => { if (!elevatorFrame) elevatorFrame = requestAnimationFrame(() => { elevatorFrame = 0; updateElevator(); }); };

function jumpToFloor(raw) {
  const n = Math.min(lastFloor(), parseInt(raw, 10));
  if (!(n >= 1)) { updateElevator(); return; }                 // 空白或 0：不跳，恢復顯示目前樓層
  floorInput.value = n;
  const el = layerEl(n);
  if (el) el.scrollIntoView({ behavior: smooth(), block: 'start' });
}

floorInput.addEventListener('input', () => { floorInput.value = floorInput.value.replace(/[^0-9]/g, ''); });   // 只接受阿拉伯數字
floorInput.addEventListener('focus', () => floorInput.select());
floorInput.addEventListener('blur', updateElevator);
floorInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); jumpToFloor(floorInput.value); floorInput.blur(); }
  else if (e.key === 'Escape') floorInput.blur();
});
btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: smooth() }));
btnBottom.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: smooth() }));
window.addEventListener('scroll', scheduleElevator, { passive: true });
window.addEventListener('resize', scheduleElevator);

// 固定列的高度交給樣式（scroll-margin-top），跳轉後層列才不會被固定列蓋住
new ResizeObserver(() => document.documentElement.style.setProperty('--bar-h', $('#points').offsetHeight + 'px')).observe($('#points'));

/* ---------- 啟動 ---------- */
onChange(() => { render(); updateElevator(); });
buildPoints();
render();
showView(viewFromHash());
if (!hadSaved) save();
$('#fileWarn').hidden = true;      // 能跑到這裡代表模組載入成功，隱藏「請用本機伺服器」的提示
