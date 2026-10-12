// 把 data/left.csv、middle.csv、right.csv（以及選用的額外樓層 top.csv）轉成網頁用的 .js
// 用法：node tools/build-data.mjs        （Windows 也可以雙擊 tools\build-data.bat）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(root, 'data');
// 一個檔案 = 一個分支；順序就是網頁上由左到右的順序
const BRANCH_KEYS = ['left', 'middle', 'right'];

const COLOR = {
  '藍': 'blue', '紫': 'purple', '橙': 'orange', '橘': 'orange',
  blue: 'blue', purple: 'purple', orange: 'orange'
};
// 表頭名稱（順序不拘，欄位可以多不能少；「分支說明」「備註」「層門檻」「最高等級」「點滿解鎖下一層」可省略）
const COLS = {
  branch: '分支', layer: '層', threshold: '層門檻', id: '節點ID', name: '名稱',
  color: '顏色', cost: '每級消耗', max: '最高等級', effects: '效果', note: '備註', branchNote: '分支說明',
  gate: '點滿解鎖下一層'
};
const REQUIRED = ['branch', 'layer', 'id', 'name', 'color', 'cost', 'effects'];

/* ---------- 讀 CSV（支援引號、欄位內換行、BOM、CRLF） ---------- */
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
    } else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/* ---------- 轉換與檢查 ---------- */
const errors = [];
const ids = new Map();           // 節點 id → 「檔名 第 N 列」，三個檔案之間也不能重複

function parseEffects(cell, fail) {
  const out = [];
  for (const part of cell.split(/[;；\n\r]+/)) {
    const s = part.trim();
    if (!s) continue;
    const seg = s.split(/[|｜]/).map(x => x.trim());
    const numStr = (seg[1] || '').replace(/[−–—－]/g, '-').replace(/[＋+,，]/g, '');
    const per = Number(numStr);
    if (seg.length < 2 || !seg[0] || numStr === '' || !Number.isFinite(per)) {
      fail(`效果「${s}」格式不對，應為「屬性 | 每級數值 | 單位」，多個效果用分號 ; 隔開。`);
      continue;
    }
    out.push({ stat: seg[0], per, unit: seg.slice(2).join('|').trim() });
  }
  return out;
}

const nodeLane = new Map();           // 分支節點 id → 所在欄位（0、1、2…），額外樓層的解鎖來源要用
function buildBranch(rows, file, laneIdx) {
  const fileFail = msg => errors.push(`${file}：${msg}`);
  if (!rows.length) { fileFail('是空的。'); return null; }
  const head = rows[0].map(h => h.trim());
  const idx = {};
  for (const [key, label] of Object.entries(COLS)) idx[key] = head.indexOf(label);
  const missing = REQUIRED.filter(key => idx[key] < 0);
  if (missing.length) {
    missing.forEach(key => fileFail(`找不到欄位「${COLS[key]}」，請確認第一列表頭。`));
    return null;
  }
  const cell = (r, key) => (idx[key] >= 0 && r[idx[key]] !== undefined ? r[idx[key]].trim() : '');

  let name = '';
  let note = '';
  const layers = new Map();
  rows.slice(1).forEach((r, k) => {
    const rowNo = k + 2;
    const fail = msg => errors.push(`${file} 第 ${rowNo} 列：${msg}`);
    if (r.every(c => c.trim() === '')) return;

    const bname = cell(r, 'branch');
    if (!bname) return fail('「分支」不能空白。');
    if (!name) name = bname;
    else if (bname !== name) return fail(`一個檔案只能有一個分支，這裡出現「${bname}」，但前面是「${name}」。`);
    if (cell(r, 'branchNote')) note = cell(r, 'branchNote');

    const layerNo = Number(cell(r, 'layer'));
    if (!Number.isInteger(layerNo) || layerNo < 1) return fail('「層」要是 1 以上的整數。');
    if (!layers.has(layerNo)) layers.set(layerNo, { threshold: null, nodes: [] });
    const layer = layers.get(layerNo);
    const thrCell = cell(r, 'threshold');
    if (thrCell !== '') {
      const t = Number(thrCell);
      if (!Number.isInteger(t) || t < 0) fail('「層門檻」要是 0 以上的整數（可留空，預設 5）。');
      else if (layer.threshold !== null && layer.threshold !== t) fail(`同一層的「層門檻」不一致（${layer.threshold} 與 ${t}）。`);
      else layer.threshold = t;
    }

    const id = cell(r, 'id');
    if (!/^[A-Za-z][\w-]{0,39}$/.test(id)) fail(`節點ID「${id}」不合規定：要以英文字母開頭，只能用英數、底線、連字號。`);
    else if (ids.has(id)) fail(`節點ID「${id}」重複（${ids.get(id)}也用了）。`);
    else { ids.set(id, `${file} 第 ${rowNo} 列`); nodeLane.set(id, laneIdx); }

    const nodeName = cell(r, 'name');
    if (!nodeName) fail('「名稱」不能空白。');
    const color = COLOR[cell(r, 'color').toLowerCase()];
    if (!color) fail(`顏色「${cell(r, 'color')}」看不懂，請填：藍／紫／橙。`);
    const cost = Number(cell(r, 'cost'));
    if (cell(r, 'cost') === '' || !Number.isInteger(cost) || cost < 0) fail('「每級消耗」要是 0 以上的整數。');
    const maxCell = cell(r, 'max');
    const max = maxCell === '' ? 5 : Number(maxCell);
    if (!Number.isInteger(max) || max < 1 || max > 99) fail('「最高等級」要是 1～99 的整數（可留空，預設 5）。');

    const gateCell = cell(r, 'gate').toLowerCase();
    if (gateCell !== '' && !['是', 'y', 'yes', 'true', '1'].includes(gateCell)) fail(`「點滿解鎖下一層」只能填「是」或留空，不能填「${cell(r, 'gate')}」。`);
    layer.nodes.push({ id, name: nodeName, color, cost, max, gate: gateCell !== '', note: cell(r, 'note'), effects: parseEffects(cell(r, 'effects'), fail) });
  });

  if (!name) { fileFail('沒有任何資料列。'); return null; }
  const nums = [...layers.keys()].sort((x, y) => x - y);
  nums.forEach((n, i) => { if (n !== i + 1) fileFail(`層數要從 1 連續編號，但缺少第 ${i + 1} 層。`); });
  return {
    name, note,
    layers: nums.map(n => {
      const l = layers.get(n);
      if (l.nodes.length > 2) console.warn(`提醒：${file} 第 ${n} 層有 ${l.nodes.length} 個節點（遊戲內通常是 1～2 個）。`);
      return { threshold: l.threshold === null ? 5 : l.threshold, nodes: l.nodes };
    })
  };
}

/* ---------- 額外樓層（top.csv，第 16 層以後）----------
 * 一列一個節點：樓層、所在分支（可空）、解鎖來源節點與所需等級合計。
 * 紅色節點每級可同時花多種點數，且不屬於任何分支；其他顏色的節點要指定所在分支。
 */
const TOP_COLS = {
  floor: '樓層', lane: '分支', id: '節點ID', name: '名稱', color: '顏色', costs: '每級消耗', max: '最高等級',
  effects: '效果', from: '解鎖來源節點', need: '解鎖所需等級合計', note: '備註'
};
const TOP_REQUIRED = ['floor', 'id', 'name', 'color', 'costs', 'effects', 'from', 'need'];

function buildTop(rows, file, builtBranches) {
  const fileFail = msg => errors.push(`${file}：${msg}`);
  if (!rows.length) { fileFail('是空的。'); return []; }
  const head = rows[0].map(h => h.trim());
  const idx = {};
  for (const [key, label] of Object.entries(TOP_COLS)) idx[key] = head.indexOf(label);
  const missing = TOP_REQUIRED.filter(key => idx[key] < 0);
  if (missing.length) { missing.forEach(key => fileFail(`找不到欄位「${TOP_COLS[key]}」，請確認第一列表頭。`)); return []; }
  const cell = (r, key) => (idx[key] >= 0 && r[idx[key]] !== undefined ? r[idx[key]].trim() : '');
  const maxLayers = Math.max(0, ...builtBranches.map(([, b]) => b.layers.length));
  const laneOfName = c => {
    for (let i = 0; i < builtBranches.length; i++) {
      const [key, b] = builtBranches[i];
      if (c === key || c === b.name || c === b.name.split('・')[0]) return i;
    }
    return -1;
  };

  const nodes = [];
  rows.slice(1).forEach((r, k) => {
    const rowNo = k + 2;
    const fail = msg => errors.push(`${file} 第 ${rowNo} 列：${msg}`);
    if (r.every(c => c.trim() === '')) return;

    const floor = Number(cell(r, 'floor'));
    if (!Number.isInteger(floor) || floor <= maxLayers) fail(`「樓層」要是大於 ${maxLayers}（各分支的最高層）的整數。`);

    const colorCell = cell(r, 'color').toLowerCase();
    const COLOR_TOP = { '紅': 'red', red: 'red', ...COLOR };
    const color = COLOR_TOP[colorCell];
    if (!color) fail(`顏色看不懂：「${cell(r, 'color')}」，請填：紅／藍／紫／橙。`);

    const laneCell = cell(r, 'lane');
    let lane = null;
    if (laneCell !== '') {
      lane = laneOfName(laneCell);
      if (lane < 0) { fail(`「分支」填「${laneCell}」不是任何分支，請填：${builtBranches.map(([, b]) => b.name.split('・')[0]).join('／')}，或留空（只有紅色節點可以留空）。`); lane = null; }
    } else if (color && color !== 'red') fail('非紅色的節點必須指定「分支」。');

    const id = cell(r, 'id');
    if (!/^[A-Za-z][\w-]{0,39}$/.test(id)) fail(`節點ID「${id}」不合規定：要以英文字母開頭，只能用英數、底線、連字號。`);
    else if (ids.has(id)) fail(`節點ID「${id}」重複（${ids.get(id)}也用了）。`);
    else ids.set(id, `${file} 第 ${rowNo} 列`);

    const name = cell(r, 'name');
    if (!name) fail('「名稱」不能空白。');

    // 每級消耗：單一整數（用節點顏色），或「藍 5; 紫 5; 橘 5」這種多色寫法（紅色節點一定要這樣寫）
    const costCell = cell(r, 'costs');
    let cost = 0, costs = null;
    if (/^\d+$/.test(costCell) && color !== 'red') cost = Number(costCell);
    else {
      costs = { blue: 0, purple: 0, orange: 0 };
      let rest = costCell;
      for (const m of costCell.matchAll(/(藍|紫|橙|橘|blue|purple|orange)\s*(\d+)/gi)) {
        costs[COLOR[m[1].toLowerCase()]] += Number(m[2]);
        rest = rest.replace(m[0], '');
      }
      if (rest.replace(/[\s;；,，、]/g, '') !== '' || Object.values(costs).every(v => v === 0)) {
        fail(`「每級消耗」要寫成整數，或「藍 5; 紫 5; 橘 5」這種格式（紅色節點一定要用後者），目前是「${costCell}」。`);
      }
    }

    const maxCell = cell(r, 'max');
    const max = maxCell === '' ? 5 : Number(maxCell);
    if (!Number.isInteger(max) || max < 1 || max > 99) fail('「最高等級」要是 1～99 的整數（可留空，預設 5）。');

    const from = cell(r, 'from').split(/[;；,，、\s]+/).filter(Boolean);
    if (!from.length) fail('「解鎖來源節點」不能空白，請填節點ID，多個用分號隔開。');
    const need = Number(cell(r, 'need'));
    if (!Number.isInteger(need) || need < 1) fail('「解鎖所需等級合計」要是 1 以上的整數。');

    nodes.push({ rowNo, id, name, color, floor, lane, cost, costs, max, note: cell(r, 'note'), unlock: { from, need }, effects: parseEffects(cell(r, 'effects'), fail) });
  });

  // 跨列檢查：解鎖來源存在且樓層較低、樓層連續、同一格不重疊
  const byId = new Map(nodes.map(n => [n.id, n]));
  nodes.forEach(n => {
    const fail = msg => errors.push(`${file} 第 ${n.rowNo} 列：${msg}`);
    n.unlock.from.forEach(f => {
      if (f === n.id) return fail('「解鎖來源節點」不能是自己。');
      if (!ids.has(f)) return fail(`「解鎖來源節點」裡的「${f}」不是已存在的節點ID。`);
      const src = byId.get(f);
      if (src && src.floor >= n.floor) fail(`「解鎖來源節點」「${f}」在第 ${src.floor} 層，必須比這個節點（第 ${n.floor} 層）低。`);
    });
  });
  const floors = [...new Set(nodes.map(n => n.floor).filter(Number.isInteger))].sort((a, b) => a - b);
  floors.forEach((f, i) => { if (f !== maxLayers + 1 + i) fileFail(`樓層要從 ${maxLayers + 1} 開始連續編號，但缺少第 ${maxLayers + 1 + i} 層。`); });
  floors.forEach(f => {
    const row = nodes.filter(n => n.floor === f);
    const free = row.filter(n => n.lane === null);
    if (free.length && row.length > 1) errors.push(`${file}：第 ${f} 層有「不屬於任何分支」的節點，這一層就只能有這一個節點。`);
    const perLane = new Map();
    row.filter(n => n.lane !== null).forEach(n => { perLane.set(n.lane, (perLane.get(n.lane) || 0) + 1); if (perLane.get(n.lane) > 2) errors.push(`${file} 第 ${n.rowNo} 列：第 ${f} 層同一個分支最多 2 個額外節點。`); });
  });
  if (!nodes.length && !errors.some(e => e.startsWith(file))) fileFail('沒有任何資料列。');
  return nodes;
}

function renderTop(nodes) {
  const q = s => JSON.stringify(s);
  const effLine = e => `{ stat: ${q(e.stat)}, per: ${e.per}, unit: ${q(e.unit)} }`;
  let o = `/*
 * 額外樓層（第 16 層以後）——此檔由 data/top.csv 自動產生，請不要直接修改。
 * 要更新：改 data/top.csv，再執行 node tools/build-data.mjs（Windows 可雙擊 tools\\build-data.bat）。
 */
window.SNAIL_DATA = window.SNAIL_DATA || {};
window.SNAIL_DATA.top = {
  nodes: [
`;
  o += nodes.map(n => `    {
      id: ${q(n.id)}, name: ${q(n.name)}, color: ${q(n.color)}, floor: ${n.floor}, lane: ${n.lane === null ? 'null' : n.lane}, max: ${n.max},
${n.costs ? `      costs: { blue: ${n.costs.blue}, purple: ${n.costs.purple}, orange: ${n.costs.orange} },` : `      cost: ${n.cost},`}
      unlock: { from: [${n.unlock.from.map(q).join(', ')}], need: ${n.unlock.need} },
      note: ${q(n.note)},
      effects: [
${n.effects.map(e => '        ' + effLine(e) + ',\n').join('')}      ]
    },
`).join('');
  return o + `  ]
};
`;
}

/* ---------- 輸出 <key>.js ---------- */
function render(key, b) {
  const q = s => JSON.stringify(s);
  const effLine = e => `{ stat: ${q(e.stat)}, per: ${e.per}, unit: ${q(e.unit)} }`;
  let o = `/*
 * 天賦資料（${b.name}）——此檔由 data/${key}.csv 自動產生，請不要直接修改。
 * 要更新：改 data/${key}.csv，再執行 node tools/build-data.mjs（Windows 可雙擊 tools\\build-data.bat）。
 */
window.SNAIL_DATA = window.SNAIL_DATA || {};
window.SNAIL_DATA.${key} = {
  name: ${q(b.name)},
  note: ${q(b.note)},
  layers: [
`;
  o += b.layers.map((l, i) => {
    let t = `    // 第 ${i + 1} 層\n    {\n      threshold: ${l.threshold},\n      nodes: [\n`;
    t += l.nodes.map(n => {
      let u = `        {\n          id: ${q(n.id)}, name: ${q(n.name)}, color: ${q(n.color)}, cost: ${n.cost}, max: ${n.max},\n          note: ${q(n.note)},\n${n.gate ? '          gate: true,\n' : ''}          effects: [\n`;
      u += n.effects.map(e => `            ${effLine(e)},\n`).join('');
      return u + `          ]\n        },\n`;
    }).join('');
    return t + `      ]\n    },\n`;
  }).join('');
  return o + `  ]\n};\n`;
}

/* ---------- 主程式 ---------- */
const built = [];
for (const key of BRANCH_KEYS) {
  const csv = path.join(DATA_DIR, key + '.csv');
  if (!fs.existsSync(csv)) { errors.push(`找不到 data/${key}.csv`); continue; }
  const b = buildBranch(parseCSV(fs.readFileSync(csv, 'utf8')), key + '.csv', BRANCH_KEYS.indexOf(key));
  if (b) built.push([key, b]);
}
const topCsv = path.join(DATA_DIR, 'top.csv');
let top = null;
if (fs.existsSync(topCsv)) top = buildTop(parseCSV(fs.readFileSync(topCsv, 'utf8')), 'top.csv', built);
if (errors.length) {
  console.error('CSV 有 ' + errors.length + ' 個問題，尚未更新任何 .js 檔：\n');
  errors.forEach(e => console.error('  • ' + e));
  process.exit(1);
}
for (const [key, b] of built) {
  fs.writeFileSync(path.join(DATA_DIR, key + '.js'), render(key, b));
  const nodes = b.layers.reduce((s, l) => s + l.nodes.length, 0);
  console.log(`完成：${key}.csv → ${key}.js（${b.name}：${b.layers.length} 層、${nodes} 個節點）`);
}
if (top) {
  fs.writeFileSync(path.join(DATA_DIR, 'top.js'), renderTop(top));
  const floors = [...new Set(top.map(n => n.floor))].sort((a, b) => a - b);
  console.log(`完成：top.csv → top.js（額外樓層 第 ${floors.join('、')} 層：${top.length} 個節點）`);
}
