// 常數與純函式小工具（不碰 DOM 狀態）
export const COLORS = ['blue', 'purple', 'orange'];
export const CN = { blue: '藍', purple: '紫', orange: '橙' };
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
