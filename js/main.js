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
}

$('#viewnav').addEventListener('click', e => {
  const b = e.target.closest('[data-view]');
  if (!b || b.dataset.view === view) return;
  location.hash = b.dataset.view === 'summary' ? '#/summary' : '#/';
});
window.addEventListener('hashchange', () => showView(viewFromHash()));
try { history.scrollRestoration = 'manual'; } catch (e) { /* ignore */ }

/* ---------- 啟動 ---------- */
onChange(render);
buildPoints();
render();
showView(viewFromHash());
if (!hadSaved) save();
$('#fileWarn').hidden = true;      // 能跑到這裡代表模組載入成功，隱藏「請用本機伺服器」的提示
