// 天賦網格：每一列是一層、每一欄是一個分支；節點卡片與層間連線
import { COLORS, CN, $, esc, fmtVal } from './util.js';
import { state, lv, layerSum, layerCap, effThr, unlockFlags, branchCost } from './state.js';
import { isArmed } from './rules.js';

function ptsHTML(c) {
  const items = COLORS.filter(k => c[k] > 0).map(k =>
    '<span class="pt c-' + k + '"><span class="orb sm" aria-hidden="true"></span><span class="sr">' + CN[k] + '</span>' + c[k] + '</span>');
  return items.length ? items.join('') : '<span class="muted">—</span>';
}

function nodeHTML(n, layer) {
  const cur = lv(n.id);
  let dots = '';
  for (let k = 1; k <= n.max; k++) {
    dots += '<button type="button" class="dot' + (k <= cur ? ' on' : '') + '" data-act="dot" data-id="' + esc(n.id) + '" data-k="' + k +
      '" data-fk="dot:' + esc(n.id) + ':' + k + '" aria-label="' + esc(n.name) + ' 設為 ' + k + ' 級" aria-pressed="' + (k <= cur) + '"><i></i></button>';
  }
  const eff = n.effects.length ? n.effects.map(e =>
    '<li><span class="e-stat">' + esc(e.stat) + '</span><span class="e-vals">' +
      '<span class="e-per">每級 ' + fmtVal(e.per, e.unit, true) + '</span>' +
      '<span class="e-tot' + (cur ? '' : ' zero') + '">目前 <b>' + fmtVal(e.per * cur, e.unit, true) + '</b></span></span></li>'
  ).join('') : '<li class="muted">（無效果）</li>';
  const only = layer.nodes.length === 1;
  const del = isArmed('node:' + n.id);
  const id = esc(n.id);
  return (
    '<article class="node c-' + n.color + '" data-n="' + id + '">' +
      '<div class="n-top"><span class="orb" aria-hidden="true"></span><h3 class="n-name">' + esc(n.name) + '</h3>' +
        '<span class="n-cost"><span class="sr">' + CN[n.color] + '點，</span>每級 ' + n.cost + '</span></div>' +
      (n.note ? '<details class="n-note"><summary>' + '備註' + '</summary><p>' + esc(n.note) + '</p></details>' : '') +
      '<ul class="effects">' + eff + '</ul>' +
      '<div class="ctrl">' +
        '<div class="ctrl-row">' +
          '<button type="button" class="step" data-act="dec" data-id="' + id + '" data-fk="dec:' + id + '" aria-label="' + esc(n.name) + ' 降一級"' + (cur <= 0 ? ' disabled' : '') + '>−</button>' +
          '<span class="dots" role="group" aria-label="' + esc(n.name) + ' 等級">' + dots + '</span>' +
          '<button type="button" class="step" data-act="inc" data-id="' + id + '" data-fk="inc:' + id + '" aria-label="' + esc(n.name) + ' 升一級"' + (cur >= n.max ? ' disabled' : '') + '>＋</button>' +
        '</div>' +
        '<div class="ctrl-row">' +
          '<button type="button" class="fill" data-act="max" data-id="' + id + '" data-fk="max:' + id + '"' + (cur >= n.max ? ' disabled' : '') + '>點滿</button>' +
          '<span class="lvl">' + cur + '<small> / ' + n.max + '</small></span>' +
        '</div>' +
      '</div>' +
      '<div class="n-edit edit-only">' +
        '<button type="button" class="mini" data-act="edit" data-id="' + id + '" data-fk="edit:' + id + '">編輯</button>' +
        '<button type="button" class="mini danger' + (del ? ' armed' : '') + '" data-act="del-node" data-id="' + id + '" data-fk="del-node:' + id + '"' +
          (only ? ' disabled title="這層只剩一個節點，請改用「刪除此層」"' : '') + '>' + (del ? '再按一次確認' : '刪除') + '</button>' +
      '</div>' +
    '</article>'
  );
}

/** 兩層之間的連線：上方節點匯合 → 門檻（本層合計 / 門檻）→ 再分岔到下方節點 */
function connHTML(b, bi, li, row, flags) {
  const l = b.layers[li], next = b.layers[li + 1];
  const sum = layerSum(l), thr = effThr(l);
  const pass = sum >= thr;
  const lit = pass && !(state.strict && !flags[li]);
  const gate = state.edit
    ? '<label class="gate-in">門檻 <input type="number" class="thr-in" min="0" max="999" step="1" inputmode="numeric" value="' + l.threshold +
      '" data-thr data-b="' + bi + '" data-l="' + li + '" data-fk="thr:' + bi + ':' + li + '" aria-label="第 ' + (li + 1) + ' 層解鎖門檻"></label>' +
      '<span class="gate-sum">' + sum + ' / ' + thr + '</span>'
    : (pass ? '✓ ' : '') + sum + ' / ' + thr;
  const title = '第 ' + (li + 1) + ' 層合計 ' + sum + ' 級，達 ' + thr + ' 級才解鎖下一層' + (layerCap(l) < l.threshold ? '（本層最高僅 ' + layerCap(l) + ' 級，以此計）' : '');
  return (
    '<div class="g-cell g-conn' + (lit ? ' lit' : '') + (bi === state.tab ? ' on-tab' : '') + '" style="grid-column:' + (bi + 2) + ';grid-row:' + row + '">' +
      '<i class="zone up u' + l.nodes.length + '"></i>' +
      '<span class="gate' + (pass ? ' pass' : '') + '" title="' + esc(title) + '">' + gate + '</span>' +
      '<i class="zone dn d' + next.nodes.length + '"></i>' +
    '</div>'
  );
}

/** 全部分支排成一張對齊的網格：每一列是一層，每一欄是一個分支 */
export function gridHTML() {
  const bs = state.data.branches;
  const rows = Math.max(0, ...bs.map(b => b.layers.length));
  const flags = bs.map(b => unlockFlags(b));
  const tabCls = bi => (bi === state.tab ? ' on-tab' : '');
  let h = '';

  bs.forEach((b, bi) => {
    h += '<header class="g-cell g-head' + tabCls(bi) + '" style="grid-column:' + (bi + 2) + ';grid-row:1">' +
      '<h2>' + esc(b.name) + '</h2>' +
      '<div class="b-cost"><span class="lbl">全點滿需要</span>' + ptsHTML(branchCost(b, false)) + '</div>' +
      (Object.values(branchCost(b, true)).some(v => v > 0) ? '<div class="b-cost"><span class="lbl">目前已配</span>' + ptsHTML(branchCost(b, true)) + '</div>' : '') +
    '</header>';
  });

  for (let li = 0; li < rows; li++) {
    const row = 2 + li * 2;
    const inTab = li < (bs[state.tab] ? bs[state.tab].layers.length : 0);
    h += '<div class="g-num' + (inTab ? ' on-tab' : '') + '" style="grid-row:' + row + '"><span>' + (li + 1) + '</span><span class="sr">第 ' + (li + 1) + ' 層</span></div>';
    bs.forEach((b, bi) => {
      const l = b.layers[li];
      if (!l) return;
      const locked = state.strict && !flags[bi][li];
      const delLayer = isArmed('layer:' + bi + ':' + li);
      h += '<div class="g-cell g-layer' + (locked ? ' locked' : '') + tabCls(bi) + '" style="grid-column:' + (bi + 2) + ';grid-row:' + row + '">' +
        '<div class="nodes n' + l.nodes.length + '">' + l.nodes.map(n => nodeHTML(n, l)).join('') + '</div>' +
        '<div class="l-edit edit-only">' +
          (l.nodes.length < 2 ? '<button type="button" class="mini" data-act="add-node" data-b="' + bi + '" data-l="' + li + '" data-fk="add-node:' + bi + ':' + li + '">＋新增節點</button>' : '') +
          '<button type="button" class="mini danger' + (delLayer ? ' armed' : '') + '" data-act="del-layer" data-b="' + bi + '" data-l="' + li + '" data-fk="del-layer:' + bi + ':' + li + '">' + (delLayer ? '再按一次確認' : '刪除此層') + '</button>' +
        '</div>' +
      '</div>';
      if (b.layers[li + 1]) h += connHTML(b, bi, li, row + 1, flags[bi]);
    });
  }

  bs.forEach((b, bi) => {
    h += '<div class="g-cell g-add edit-only' + tabCls(bi) + '" style="grid-column:' + (bi + 2) + ';grid-row:' + (2 + rows * 2) + '">' +
      '<button type="button" class="mini" data-act="add-layer" data-b="' + bi + '" data-fk="add-layer:' + bi + '">＋新增一層</button></div>';
  });
  return h;
}

export function renderTabs() {
  $('#tabs').innerHTML = state.data.branches.map((b, i) =>
    '<button type="button" class="tab" data-tab="' + i + '" data-fk="tab:' + i + '" aria-current="' + (i === state.tab) + '">' + esc(b.name) + '</button>'
  ).join('');
}
