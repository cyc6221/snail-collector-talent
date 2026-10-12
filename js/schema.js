// 驗證與還原（匯入、localStorage 共用）：任何外來資料都先過這裡
import { COLORS, hasOwn, toInt, toStr, newId } from './util.js';

export const MAX_EXTRAS = 60;      // 額外樓層（第 16 層以後）節點數量上限

function cleanEffects(src) {
  return (Array.isArray(src) ? src : []).slice(0, 12).map(e => {
    if (!e || typeof e !== 'object') return null;
    const per = Number(e.per);
    const stat = toStr(e.stat, 40);
    if (!stat || !Number.isFinite(per)) return null;
    return { stat, per, unit: toStr(e.unit, 10) };
  }).filter(Boolean);
}

function uniqueId(n, seen) {
  const id = typeof n.id === 'string' && /^[A-Za-z][\w-]{0,39}$/.test(n.id) && !seen.has(n.id) ? n.id : newId(seen);
  seen.add(id);
  return id;
}

export function sanitizeData(d) {
  if (!d || typeof d !== 'object' || !Array.isArray(d.branches) || !d.branches.length) {
    throw new Error('找不到 branches（至少要有一個分支）');
  }
  if (d.branches.length > 6) throw new Error('分支最多 6 個');
  const seen = new Set();
  const branches = d.branches.map((b, bi) => {
    if (!b || typeof b !== 'object') throw new Error('第 ' + (bi + 1) + ' 個分支格式錯誤');
    const layers = (Array.isArray(b.layers) ? b.layers : []).slice(0, 60).map(l => {
      if (!l || typeof l !== 'object') return null;
      const nodes = (Array.isArray(l.nodes) ? l.nodes : []).slice(0, 4).map(n => {
        if (!n || typeof n !== 'object') return null;
        return {
          id: uniqueId(n, seen),
          name: toStr(n.name, 40, '未命名'),
          color: COLORS.includes(n.color) ? n.color : 'blue',
          cost: toInt(n.cost, 0, 999, 1),
          max: toInt(n.max, 1, 99, 5),
          effects: cleanEffects(n.effects),
          gate: n.gate === true,        // true：這個節點必須點滿，才能解鎖下一層
          note: toStr(n.note, 120)
        };
      }).filter(Boolean);
      if (!nodes.length) return null;
      return { threshold: toInt(l.threshold, 0, 999, 5), nodes };
    }).filter(Boolean);
    return { name: toStr(b.name, 20, '分支' + (bi + 1)), note: toStr(b.note, 200), layers };
  });

  // 額外樓層（第 16 層以後）：每個節點有樓層、所在分支（可空）與解鎖條件（指定節點的等級合計）。
  // 紅色天賦每級可同時花多種顏色（costs）；一般顏色的節點用 cost
  const nodeCount = branches.length;
  const extras = (Array.isArray(d.extras) ? d.extras : []).slice(0, MAX_EXTRAS).map(n => {
    if (!n || typeof n !== 'object') return null;
    const isRed = n.color === 'red';
    const costs = {};
    COLORS.forEach(k => { costs[k] = toInt(n.costs && n.costs[k], 0, 999, 0); });
    const u = n.unlock && typeof n.unlock === 'object' ? n.unlock : {};
    const e = {
      id: uniqueId(n, seen),
      name: toStr(n.name, 40, '未命名'),
      color: isRed ? 'red' : (COLORS.includes(n.color) ? n.color : 'blue'),
      cost: toInt(n.cost, 0, 999, 0),
      max: toInt(n.max, 1, 99, isRed ? 3 : 5),
      effects: cleanEffects(n.effects),
      note: toStr(n.note, 120),
      floor: toInt(n.floor, 1, 99, 16),
      lane: Number.isInteger(n.lane) && n.lane >= 0 && n.lane < nodeCount ? n.lane : null,   // 所在分支（欄位）；空＝不屬於任何分支
      unlock: { from: (Array.isArray(u.from) ? u.from : []).filter(x => typeof x === 'string').slice(0, 12), need: toInt(u.need, 0, 999, 5) }
    };
    if (isRed || Object.values(costs).some(v => v > 0)) e.costs = costs;
    return e;
  }).filter(Boolean);
  // 解鎖來源必須是真的存在的節點（一般節點或其他額外節點），不然忽略
  const known = new Set(branches.flatMap(b => b.layers.flatMap(l => l.nodes.map(n => n.id))));
  extras.forEach(e => known.add(e.id));
  extras.forEach(e => { e.unlock.from = e.unlock.from.filter(id => known.has(id) && id !== e.id); });
  return { branches, extras };
}

export function sanitizeAlloc(src, data) {
  const out = {};
  if (!src || typeof src !== 'object') return out;
  const take = n => {
    if (hasOwn(src, n.id)) {
      const v = toInt(src[n.id], 0, n.max, 0);
      if (v > 0) out[n.id] = v;
    }
  };
  data.branches.forEach(b => b.layers.forEach(l => l.nodes.forEach(take)));
  (data.extras || []).forEach(take);
  return out;
}

export function sanitizeOwned(src, fallback) {
  const out = {};
  COLORS.forEach(c => {
    if (!src || typeof src !== 'object' || !hasOwn(src, c)) { out[c] = fallback[c]; return; }
    const v = src[c];
    out[c] = (v === '' || v === null || v === undefined) ? '' : toInt(v, 0, 1e6, '');
  });
  return out;
}

/** 還原配點與擁有點數（天賦資料永遠讀 data/*.js，檔案中的 data 欄位一律忽略） */
export function restore(o, data, owned) {
  if (!o || typeof o !== 'object') throw new Error('內容不是設定物件');
  if (!('alloc' in o) && !('owned' in o)) throw new Error('找不到配點（alloc）或擁有點數（owned），不是這個工具匯出的設定。');
  return {
    alloc: sanitizeAlloc(o.alloc, data),
    owned: sanitizeOwned(o.owned, owned)
  };
}
