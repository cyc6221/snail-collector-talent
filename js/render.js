// 總繪製：整張網格重畫，並保留鍵盤焦點
import { $ } from './util.js';
import { state } from './state.js';
import { gridHTML, renderTabs, laneSlots } from './grid.js';
import { renderSummary, updatePoints, updateTools } from './panels.js';

export function render() {
  const ae = document.activeElement;
  const fk = ae && ae !== document.body && ae.dataset && ae.dataset.fk && ae.closest('#tabs, #branches') ? ae.dataset.fk : null;

  const branchesEl = $('#branches');
  branchesEl.style.setProperty('--lanes', laneSlots().map(s => 'minmax(0, ' + s + 'fr)').join(' '));
  if (state.tab >= state.data.branches.length) state.tab = 0;
  renderTabs();
  branchesEl.innerHTML = gridHTML();
  renderSummary();
  updatePoints();
  updateTools();

  if (fk) {
    const all = [...document.querySelectorAll('[data-fk]')];
    let t = all.find(x => x.dataset.fk === fk);
    if (!t || t.disabled) {
      const m = /^[a-z-]+:([^:]+)/.exec(fk);
      const art = m && [...document.querySelectorAll('.node')].find(x => x.dataset.n === m[1]);
      if (art) {
        const on = art.querySelectorAll('.dot.on');
        t = on.length ? on[on.length - 1] : art.querySelector('.dot');
      }
    }
    if (t) t.focus({ preventScroll: true });
  }
}
