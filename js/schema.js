// 驗證與還原（匯入、localStorage 共用）：任何外來資料都先過這裡
import { COLORS, hasOwn, toInt, toStr, newId } from './util.js';

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

  // 紅色天賦：不屬於任何分支；每級可同時花多種顏色的點數；解鎖條件是「指定的分支節點等級合計」
  const reds = (Array.isArray(d.reds) ? d.reds : []).slice(0, 4).map(n => {
    if (!n || typeof n !== 'object') return null;
    const costs = {};
    COLORS.forEach(k => { costs[k] = toInt(n.costs && n.costs[k], 0, 999, 0); });
    const u = n.unlock && typeof n.unlock === 'object' ? n.unlock : {};
    return {
      id: uniqueId(n, seen),
      name: toStr(n.name, 40, '未命名'),
      color: 'red',
      cost: 0,
      costs,
      max: toInt(n.max, 1, 99, 3),
      effects: cleanEffects(n.effects),
      note: toStr(n.note, 120),
      unlock: { from: (Array.isArray(u.from) ? u.from : []).filter(x => typeof x === 'string').slice(0, 12), need: toInt(u.need, 0, 999, 5) }
    };
  }).filter(Boolean);
  // 解鎖來源必須是真的存在的一般節點，不然忽略
  const known = new Set(branches.flatMap(b => b.layers.flatMap(l => l.nodes.map(n => n.id))));
  reds.forEach(r => { r.unlock.from = r.unlock.from.filter(id => known.has(id)); });
  return { branches, reds };
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
  (data.reds || []).forEach(take);
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
