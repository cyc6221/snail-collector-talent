// 天賦網格：每一列是一層、每一欄是一個分支；節點卡片與層間連線
import { COLOR_ORDER, CN, $, esc, fmtVal } from './util.js';
import { state, lv, layerCap, layerProgress, redProgress, unlockFlags, branchCost, findNode } from './state.js';

/** 各色點數；colors 指定要顯示哪幾色（沒有該色點數時顯示 0） */
function ptsHTML(c, colors) {
  const items = colors.map(k =>
    '<span class="pt c-' + k + '"><span class="orb sm" aria-hidden="true"></span><span class="sr">' + CN[k] + '</span>' + c[k] + '</span>');
  return items.length ? items.join('') : '<span class="pt">0</span>';
}

function costHTML(n) {
  if (!n.costs) return '<span class="n-cost"><span class="sr">' + CN[n.color] + '點，</span>每級 ' + n.cost + '</span>';
  return '<span class="n-cost">每級 ' + COLOR_ORDER.filter(k => n.costs[k] > 0).map(k =>
    '<span class="pt c-' + k + '"><span class="orb sm" aria-hidden="true"></span><span class="sr">' + CN[k] + '</span>' + n.costs[k] + '</span>').join('') + '</span>';
}

function nodeHTML(n) {
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
  const id = esc(n.id);
  return (
    '<article class="node c-' + n.color + '" data-n="' + id + '">' +
      '<div class="n-top"><span class="orb" aria-hidden="true"></span><h3 class="n-name">' + esc(n.name) + '</h3>' +
        costHTML(n) + '</div>' +
      (n.note ? '<details class="n-note"><summary>' + '備註' + '</summary><p>' + esc(n.note) + '</p></details>' : '') +
      '<ul class="effects">' + eff + '</ul>' +
      '<div class="ctrl">' +
        '<div class="ctrl-row">' +
          '<button type="button" class="step" data-act="dec" data-id="' + id + '" data-fk="dec:' + id + '" aria-label="' + esc(n.name) + ' 降一級"' + (cur <= 0 ? ' disabled' : '') + '>−</button>' +
          '<span class="dots" role="group" aria-label="' + esc(n.name) + ' 等級">' + dots + '</span>' +
          '<button type="button" class="step" data-act="inc" data-id="' + id + '" data-fk="inc:' + id + '" aria-label="' + esc(n.name) + ' 升一級"' + (cur >= n.max ? ' disabled' : '') + '>＋</button>' +
        '</div>' +
        '<div class="ctrl-row">' +
          '<button type="button" class="fill" data-act="zero" data-id="' + id + '" data-fk="zero:' + id + '"' + (cur <= 0 ? ' disabled' : '') + '>歸零</button>' +
          '<span class="lvl">' + cur + '<small> / ' + n.max + '</small></span>' +
          '<button type="button" class="fill" data-act="max" data-id="' + id + '" data-fk="max:' + id + '"' + (cur >= n.max ? ' disabled' : '') + '>點滿</button>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

/** 兩層之間的連線：上方節點匯合 → 門檻（本層合計 / 門檻）→ 再分岔到下方節點 */
function connHTML(b, bi, li, row, flags) {
  const l = b.layers[li], next = b.layers[li + 1];
  const { cur, need, pass, gated } = layerProgress(l);
  const lit = pass && flags[li];
  // 兩個節點、其中只有一個是「點滿解鎖」的節點：連線只從那個節點出發，另一個不連
  const gi = gated.length === 1 && l.nodes.length === 2 ? l.nodes.indexOf(gated[0]) : -1;
  const gate = (pass ? '✓ ' : '') + cur + ' / ' + need;
  const title = gated.length
    ? '第 ' + (li + 1) + ' 層的「' + gated.map(n => n.name).join('、') + '」需點滿（' + cur + ' / ' + need + ' 級），才解鎖下一層；其他節點不影響'
    : '第 ' + (li + 1) + ' 層合計 ' + cur + ' 級，達 ' + need + ' 級才解鎖下一層' + (layerCap(l) < l.threshold ? '（本層最高僅 ' + layerCap(l) + ' 級，以此計）' : '');
  return (
    '<div class="g-cell g-conn' + (lit ? ' lit' : '') + (bi === state.tab ? ' on-tab' : '') + '" style="grid-column:' + (bi + 2) + ';grid-row:' + row + '">' +
      '<i class="zone up ' + (gi >= 0 ? 'u2g' + gi : 'u' + l.nodes.length) + '"></i>' +
      '<span class="gate' + (pass ? ' pass' : '') + '" title="' + esc(title) + '">' + gate + '</span>' +
      '<i class="zone dn d' + next.nodes.length + '"></i>' +
    '</div>'
  );
}

/** 每個分支欄位需要的「卡片格數」＝該分支單層最多幾個節點；欄寬依此等比分配，所有卡片寬度相同 */
export function laneSlots() {
  return state.data.branches.map(b => Math.max(1, ...b.layers.map(l => l.nodes.length)));
}

/** 全部分支排成一張對齊的網格：每一列是一層，每一欄是一個分支 */
export function gridHTML() {
  const bs = state.data.branches;
  const rows = Math.max(0, ...bs.map(b => b.layers.length));
  const flags = bs.map(b => unlockFlags(b));
  const tabCls = bi => (bi === state.tab ? ' on-tab' : '');
  const slots = laneSlots();
  let h = '';

  bs.forEach((b, bi) => {
    const full = branchCost(b, false);
    const used = COLOR_ORDER.filter(k => full[k] > 0);     // 這個分支用到的顏色；「已配」同樣顯示這幾色
    h += '<header class="g-cell g-head' + tabCls(bi) + '" style="grid-column:' + (bi + 2) + ';grid-row:1">' +
      '<h2>' + esc(b.name) + '</h2>' +
      '<div class="b-cost"><span class="lbl">全點滿需要</span>' + ptsHTML(full, used) + '</div>' +
      '<div class="b-cost"><span class="lbl">目前已配</span>' + ptsHTML(branchCost(b, true), used) + '</div>' +
    '</header>';
  });

  for (let li = 0; li < rows; li++) {
    const row = 2 + li * 2;
    const inTab = li < (bs[state.tab] ? bs[state.tab].layers.length : 0);
    h += '<div class="g-num' + (inTab ? ' on-tab' : '') + '" style="grid-row:' + row + '"><span>' + (li + 1) + '</span><span class="sr">第 ' + (li + 1) + ' 層</span></div>';
    bs.forEach((b, bi) => {
      const l = b.layers[li];
      if (!l) return;
      const locked = !flags[bi][li];
      h += '<div class="g-cell g-layer' + (locked ? ' locked' : '') + tabCls(bi) + '" data-layer="' + (li + 1) + '" style="grid-column:' + (bi + 2) + ';grid-row:' + row + ';--slots:' + slots[bi] + '">' +
        '<div class="nodes n' + l.nodes.length + '">' + l.nodes.map(nodeHTML).join('') + '</div>' +
      '</div>';
      if (b.layers[li + 1]) h += connHTML(b, bi, li, row + 1, flags[bi]);
    });
  }

  return h + redRowHTML(rows, slots);
}

/**
 * 紅色天賦（第 16 層）：不屬於任何分支。解鎖來源所在的各個分支各拉一條線，匯合到中間那個分支的欄位，
 * 再接到紅色節點（放在中間欄位正下方）。
 */
function redRowHTML(rows, slots) {
  const reds = state.data.reds;
  if (!reds.length) return '';
  const r = reds[0];                                         // 畫面目前只排一個紅色天賦（資料轉換工具會檢查）
  const lanes = [...new Set(r.unlock.from.map(id => findNode(id)).filter(Boolean).map(f => f.bi))].sort((a, b) => a - b);
  const mid = lanes.length ? lanes[Math.floor((lanes.length - 1) / 2)] : Math.floor((state.data.branches.length - 1) / 2);
  const connRow = 2 * rows + 1, nodeRow = 2 * rows + 2;
  const p = redProgress(r);
  const lit = p.pass ? ' lit' : '';
  const names = r.unlock.from.map(id => { const f = findNode(id); return f ? f.n.name : ''; }).filter(Boolean).join('、');
  const title = '「' + names + '」等級合計 ' + p.cur + ' 級，達 ' + p.need + ' 級才解鎖「' + r.name + '」';
  let h = '';

  lanes.forEach(bi => {
    const role = bi < mid ? 'ru-l' : bi > mid ? 'ru-r' : 'ru-m' + (lanes.some(x => x < mid) ? ' hl' : '') + (lanes.some(x => x > mid) ? ' hr' : '');
    h += '<div class="g-cell g-conn g-rconn' + lit + (bi === state.tab ? ' on-tab' : '') + '" style="grid-column:' + (bi + 2) + ';grid-row:' + connRow + '">' +
      '<i class="zone up ru ' + role + '"></i>' +
      (bi === mid
        ? '<span class="gate' + (p.pass ? ' pass' : '') + '" title="' + esc(title) + '">' + (p.pass ? '✓ ' : '') + p.cur + ' / ' + p.need + '</span><i class="zone dn d1"></i>'
        : '<span></span><i class="zone"></i>') +
    '</div>';
  });

  h += '<div class="g-num on-tab" style="grid-row:' + nodeRow + '"><span>' + (rows + 1) + '</span><span class="sr">第 ' + (rows + 1) + ' 層</span></div>';
  h += '<div class="g-cell g-layer g-red' + (p.pass ? '' : ' locked') + ' on-tab" data-layer="' + (rows + 1) + '" style="grid-column:' + (mid + 2) + ';grid-row:' + nodeRow + ';--slots:' + slots[mid] + '">' +
    '<div class="nodes n1">' + nodeHTML(r) + '</div></div>';
  return h;
}

export function renderTabs() {
  $('#tabs').innerHTML = state.data.branches.map((b, i) =>
    '<button type="button" class="tab" data-tab="' + i + '" data-fk="tab:' + i + '" aria-current="' + (i === state.tab) + '">' + esc(b.name) + '</button>'
  ).join('');
}
