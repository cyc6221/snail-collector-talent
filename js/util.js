// 常數與純函式小工具（不碰 DOM 狀態）
export const COLORS = ['blue', 'purple', 'orange'];
export const CN = { blue: '藍', purple: '紫', orange: '橘', red: '紅' };   // red 不是點數顏色，只用來標示紅色天賦
export const COLOR_ORDER = ['orange', 'purple', 'blue'];   // 畫面上顯示各色點數時的由左到右順序
export const KEY = 'snail-collector-sim:v1';

export const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
export const $ = (s, r = document) => r.querySelector(s);
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const toInt = (v, lo, hi, def) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? clamp(n, lo, hi) : def;
};
export const toStr = (v, max, def = '') => {
  if (typeof v !== 'string') return def;
  const t = v.trim().slice(0, max);
  return t || def;
};

/** 節點每級要花的各色點數：一般節點是單一顏色（color／cost），紅色天賦可以同時花多種顏色（costs） */
export function nodeCost(n) {
  const c = { blue: 0, purple: 0, orange: 0 };
  if (n.costs) COLORS.forEach(k => { c[k] = n.costs[k] || 0; });
  else if (hasOwn(c, n.color)) c[n.color] = n.cost;
  return c;
}

export function fmtVal(v, unit, signed) {
  v = Math.round(v * 10000) / 10000;
  const u = unit ? (unit === '%' || unit === '％' ? unit : ' ' + unit) : '';
  if (v === 0) return '0' + u;
  return (v < 0 ? '−' : (signed ? '+' : '')) + Math.abs(v) + u;
}

export function newId(taken) {
  let id;
  do { id = 'n' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3); } while (taken.has(id));
  return id;
}
