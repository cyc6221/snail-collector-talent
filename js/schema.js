// 驗證與還原（匯入、localStorage 共用）：任何外來資料都先過這裡
import { COLORS, hasOwn, toInt, toStr, newId } from './util.js';

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
        const id = typeof n.id === 'string' && /^[A-Za-z][\w-]{0,39}$/.test(n.id) && !seen.has(n.id) ? n.id : newId(seen);
        seen.add(id);
        const effects = (Array.isArray(n.effects) ? n.effects : []).slice(0, 12).map(e => {
          if (!e || typeof e !== 'object') return null;
          const per = Number(e.per);
          const stat = toStr(e.stat, 40);
          if (!stat || !Number.isFinite(per)) return null;
          return { stat, per, unit: toStr(e.unit, 10) };
        }).filter(Boolean);
        return {
          id,
          name: toStr(n.name, 40, '未命名'),
          color: COLORS.includes(n.color) ? n.color : 'blue',
          cost: toInt(n.cost, 0, 999, 1),
          max: toInt(n.max, 1, 99, 5),
          effects,
          note: toStr(n.note, 120)
        };
      }).filter(Boolean);
      if (!nodes.length) return null;
      return { threshold: toInt(l.threshold, 0, 999, 5), nodes };
    }).filter(Boolean);
    return { name: toStr(b.name, 20, '分支' + (bi + 1)), note: toStr(b.note, 200), layers };
  });
  return { branches };
}

export function sanitizeAlloc(src, data) {
  const out = {};
  if (!src || typeof src !== 'object') return out;
  data.branches.forEach(b => b.layers.forEach(l => l.nodes.forEach(n => {
    if (hasOwn(src, n.id)) {
      const v = toInt(src[n.id], 0, n.max, 0);
      if (v > 0) out[n.id] = v;
    }
  })));
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
