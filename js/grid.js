// 天賦網格：每一列是一層、每一欄是一個分支；節點卡片與層間連線
import { COLOR_ORDER, CN, $, esc, fmtVal, nodeCost } from './util.js';
import { state, lv, layerCap, layerProgress, extraProgress, unlockFlags, branchCost, freeCost, findNode } from './state.js';

/** 各色點數；colors 指定要顯示哪幾色（沒有該色點數時顯示 0） */
function ptsHTML(c, colors) {
  const items = colors.map(k =>
    '<span class="pt c-' + k + '"><span class="orb sm" aria-hidden="true"></span><span class="sr">' + CN[k] + '</span>' + c[k] + '</span>');
  return items.length ? items.join('') : '<span class="pt">0</span>';
}

/** 「全點滿需要」與「目前已配」兩列；只顯示全點滿時用得到的顏色，已配同樣顯示這幾色 */
function costRowsHTML(full, cur) {
  const used = COLOR_ORDER.filter(k => full[k] > 0);
  return '<div class="b-cost"><span class="lbl">全點滿需要</span>' + ptsHTML(full, used) + '</div>' +
    '<div class="b-cost"><span class="lbl">目前已配</span>' + ptsHTML(cur, used) + '</div>';
}

/** 固定列裡的四張卡片：左・資源／中・戰力／右・兵種／紅色天賦，寬度相同；沒有紅色天賦時只有三張 */
export function renderSumStrip() {
  const cards = state.data.branches.map(b =>
    '<section class="sum-mini"><h2>' + esc(b.name) + '</h2>' + costRowsHTML(branchCost(b, false), branchCost(b, true)) + '</section>');
  if (state.data.extras.some(e => e.lane === null)) {
    cards.push('<section class="sum-mini red"><h2>紅色天賦</h2>' + costRowsHTML(freeCost(false), freeCost(true)) + '</section>');
  }
  const el = $('#sumstrip');
  el.style.setProperty('--n', cards.length);
  el.innerHTML = cards.join('');
}

/** 每級消耗：各色寶珠加數字（一般節點一種顏色，紅色天賦可以多種）。螢幕閱讀器仍會讀出「每級消耗」 */
function costHTML(n) {
  const c = nodeCost(n);
  return '<span class="n-cost" title="每級消耗"><span class="sr">每級消耗 </span>' + COLOR_ORDER.filter(k => c[k] > 0).map(k =>
    '<span class="pt c-' + k + '"><span class="orb sm" aria-hidden="true"></span><span class="sr">' + CN[k] + '</span>' + c[k] + '</span>').join('') + '</span>';
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
  const slots = state.data.branches.map(b => Math.max(1, ...b.layers.map(l => l.nodes.length)));
  const count = new Map();
  state.data.extras.forEach(e => { if (e.lane !== null) { const k = e.floor + ':' + e.lane; count.set(k, (count.get(k) || 0) + 1); } });
  count.forEach((n, k) => { const lane = Number(k.split(':')[1]); slots[lane] = Math.max(slots[lane], n); });
  return slots;
}

/** 全部分支排成一張對齊的網格：每一列是一層，每一欄是一個分支 */
export function gridHTML() {
  const bs = state.data.branches;
  const rows = Math.max(0, ...bs.map(b => b.layers.length));
  const flags = bs.map(b => unlockFlags(b));
  const tabCls = bi => (bi === state.tab ? ' on-tab' : '');
  const slots = laneSlots();
  let h = '';

  // 分支標題只在窄螢幕（分頁模式）顯示；寬螢幕改由固定列裡的四張卡片顯示（見 renderSumStrip）
  bs.forEach((b, bi) => {
    h += '<header class="g-cell g-head' + tabCls(bi) + '" style="grid-column:' + (bi + 2) + ';grid-row:1">' +
      '<h2>' + esc(b.name) + '</h2>' + costRowsHTML(branchCost(b, false), branchCost(b, true)) +
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

  return h + extrasHTML(rows, slots);
}

/**
 * 上一層與這一層之間的「匯流排」連線。
 * 扇入：多個來源匯合到一個節點（例如三個分支的第 15 層 → 第 16 層）；
 * 扇出：一個來源分岔到多個節點（例如第 16 層 → 三個分支的第 17 層）。
 * 中心欄位（hub）有標籤顯示解鎖進度；各欄位的線在欄位間距處接起來。
 */
function busRowHTML(S, T, row, p, title) {
  const all = [...new Set([...S, ...T])].sort((a, b) => a - b);
  const fanIn = T.length === 1 || S.length > 1;
  const hub = fanIn ? T[Math.floor((T.length - 1) / 2)] : S[0];
  const hl = all.some(x => x < hub), hr = all.some(x => x > hub);
  const lit = p.pass ? ' lit' : '';
  const gate = '<span class="gate' + (p.pass ? ' pass' : '') + '" title="' + esc(title) + '">' + (p.pass ? '✓ ' : '') + p.cur + ' / ' + p.need + '</span>';
  return all.map(bi => {
    const role = bi < hub ? 'l' : bi > hub ? 'r' : 'm' + (hl ? ' hl' : '') + (hr ? ' hr' : '');
    const isHub = bi === hub;
    const up = fanIn
      ? (S.includes(bi) || isHub ? '<i class="zone up ru ru-' + role + '"></i>' : '<i class="zone"></i>')
      : (isHub ? '<i class="zone up u1"></i>' : '<i class="zone"></i>');
    const dn = fanIn
      ? (isHub ? '<i class="zone dn d1"></i>' : '<i class="zone"></i>')
      : '<i class="zone dn rd rd-' + role + '"></i>';
    return '<div class="g-cell g-conn g-rconn' + lit + (bi === state.tab ? ' on-tab' : '') + '" style="grid-column:' + (bi + 2) + ';grid-row:' + row + '">' +
      up + (isHub ? gate : '<span></span>') + dn + '</div>';
  }).join('');
}

/** 分支內的連線：上一層的節點（1～2 個）→ 標籤（解鎖進度）→ 這一層的節點（1～2 個），與一般的層間連線同形 */
function laneConnHTML(bi, row, upCount, downCount, p, title) {
  return '<div class="g-cell g-conn' + (p.pass ? ' lit' : '') + (bi === state.tab ? ' on-tab' : '') + '" style="grid-column:' + (bi + 2) + ';grid-row:' + row + '">' +
    '<i class="zone up u' + Math.min(2, Math.max(1, upCount)) + '"></i>' +
    '<span class="gate' + (p.pass ? ' pass' : '') + '" title="' + esc(title) + '">' + (p.pass ? '✓ ' : '') + p.cur + ' / ' + p.need + '</span>' +
    '<i class="zone dn d' + Math.min(2, Math.max(1, downCount)) + '"></i></div>';
}

/**
 * 額外樓層（第 16 層以後）：每個節點放在自己的欄位（所在分支；沒有指定就放在解鎖來源欄位的中間），
 * 與上一層之間用匯流排連起來。
 */
function extrasHTML(rows, slots) {
  const ex = state.data.extras;
  if (!ex.length) return '';
  const nLane = state.data.branches.length;
  const floors = [...new Set(ex.map(e => e.floor))].sort((a, b) => a - b);

  // 每個額外節點所在的欄位（樓層由低到高處理，來源若是更低樓層的額外節點，欄位已經決定好）
  const laneOf = new Map();
  const srcLane = id => { const f = findNode(id); return !f ? null : f.extra ? (laneOf.has(id) ? laneOf.get(id) : null) : f.bi; };
  floors.forEach(fl => ex.filter(e => e.floor === fl).forEach(e => {
    if (e.lane !== null) { laneOf.set(e.id, e.lane); return; }
    const ls = [...new Set(e.unlock.from.map(srcLane).filter(x => x !== null))].sort((a, b) => a - b);
    laneOf.set(e.id, ls.length ? ls[Math.floor((ls.length - 1) / 2)] : Math.floor((nLane - 1) / 2));
  }));

  let h = '';
  floors.forEach((fl, k) => {
    const nodes = ex.filter(e => e.floor === fl);
    const connRow = 2 * rows + 1 + 2 * k, nodeRow = connRow + 1;
    const byLane = new Map();                                  // 欄位 → 這一層放在這個欄位的節點（1～2 個）
    nodes.forEach(e => { const l = laneOf.get(e.id); if (!byLane.has(l)) byLane.set(l, []); byLane.get(l).push(e); });
    const T = [...byLane.keys()].sort((x, y) => x - y);
    const S = [...new Set(nodes.flatMap(e => e.unlock.from.map(srcLane)).filter(x => x !== null))].sort((x, y) => x - y);
    const srcNames = e => e.unlock.from.map(id => { const f = findNode(id); return f ? f.n.name : ''; }).filter(Boolean).join('、');

    // 每個節點的解鎖來源都在自己的欄位 → 各分支各自連線；否則用匯流排（匯合或分岔）
    const laneWise = nodes.every(e => e.unlock.from.length > 0 && e.unlock.from.every(id => srcLane(id) === laneOf.get(e.id)));
    if (laneWise) {
      T.forEach(bi => {
        const group = byLane.get(bi), first = group[0], p = extraProgress(first);
        const upCount = new Set(group.flatMap(e => e.unlock.from)).size;
        h += laneConnHTML(bi, connRow, upCount, group.length, p, '第 ' + (fl - 1) + ' 層的「' + srcNames(first) + '」等級 ' + p.cur + ' / ' + p.need + '，才解鎖第 ' + fl + ' 層');
      });
    } else if (S.length) {
      const first = nodes[0], p = extraProgress(first);
      h += busRowHTML(S, T, connRow, p, '「' + srcNames(first) + '」等級合計 ' + p.cur + ' 級，達 ' + p.need + ' 級才解鎖第 ' + fl + ' 層');
    }

    h += '<div class="g-num on-tab" style="grid-row:' + nodeRow + '"><span>' + fl + '</span><span class="sr">第 ' + fl + ' 層</span></div>';
    T.forEach(lane => {
      const group = byLane.get(lane);
      const free = group.some(e => e.lane === null);
      const onTab = free ? ' on-tab' : (lane === state.tab ? ' on-tab' : '');   // 不屬於任何分支的節點，每個分支分頁都看得到
      const locked = group.every(e => !extraProgress(e).pass);
      h += '<div class="g-cell g-layer g-extra' + (locked ? ' locked' : '') + onTab + '" data-layer="' + fl + '" style="grid-column:' + (lane + 2) + ';grid-row:' + nodeRow + ';--slots:' + slots[lane] + '">' +
        '<div class="nodes n' + group.length + '">' + group.map(nodeHTML).join('') + '</div></div>';
    });
  });
  return h;
}

export function renderTabs() {
  $('#tabs').innerHTML = state.data.branches.map((b, i) =>
    '<button type="button" class="tab" data-tab="' + i + '" data-fk="tab:' + i + '" aria-current="' + (i === state.tab) + '">' + esc(b.name) + '</button>'
  ).join('');
}
