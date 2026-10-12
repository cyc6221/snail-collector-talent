// 應用狀態、儲存、以及由狀態推導出的計算（解鎖、已用點數…）
import { KEY, hasOwn } from './util.js';
import { sanitizeData, restore } from './schema.js';
import { toast } from './toast.js';

/* ---------- 預設資料：本體在 data/left.js、middle.js、right.js（window.SNAIL_DATA） ---------- */
const BRANCH_KEYS = ['left', 'middle', 'right'];
export function defaultData() {
  const src = window.SNAIL_DATA || {};
  const branches = BRANCH_KEYS.map(k => src[k]).filter(Boolean);
  if (!branches.length) {
    console.error('找不到 data/left.js、middle.js、right.js，請確認 data 資料夾有一起上傳。');
    return { branches: [{ name: '（找不到天賦資料）', note: '請確認 data 資料夾有一起上傳。', layers: [] }] };
  }
  return JSON.parse(JSON.stringify({ branches }));
}
export const defaultOwned = () => ({ blue: '', purple: '', orange: '' });

/* ---------- 儲存（讀寫都包 try/catch，失敗時照常運作） ---------- */
let storageWarned = false;
function loadSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return restore(JSON.parse(raw), defaultOwned());
  } catch (e) { return null; }
}
export function snapshot() {
  return { app: 'snail-collector-sim', version: 1, strict: state.strict, owned: state.owned, alloc: state.alloc, data: state.data };
}
export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot()));
  } catch (e) {
    if (!storageWarned) {
      storageWarned = true;
      toast('無法寫入瀏覽器儲存空間，變更只會保留在這次瀏覽。');
    }
  }
}

const saved = loadSaved();
export const hadSaved = !!saved;
export const state = Object.assign(
  { data: defaultData(), alloc: {}, owned: defaultOwned(), strict: true },
  saved || {},
  { edit: false, tab: 0 }
);
if (!saved) state.data = sanitizeData(state.data);

/* ---------- 變更通知：改完狀態呼叫 commit()（存檔＋重繪），只重繪呼叫 notify() ---------- */
const listeners = [];
export const onChange = fn => { listeners.push(fn); };
export const notify = () => listeners.forEach(fn => fn());
export function commit() { save(); notify(); }

/* ---------- 計算 ---------- */
export const lv = (id, a = state.alloc) => (hasOwn(a, id) ? a[id] : 0);
export const layerSum = (l, a = state.alloc) => l.nodes.reduce((s, n) => s + lv(n.id, a), 0);
export const layerCap = l => l.nodes.reduce((s, n) => s + n.max, 0);
export const effThr = l => Math.min(l.threshold, layerCap(l));

/** 第一個尚未達門檻的層（沒有則 -1）；該層之後的層都是鎖住的 */
export function firstBlock(b, a = state.alloc) {
  for (let i = 0; i < b.layers.length; i++) if (layerSum(b.layers[i], a) < effThr(b.layers[i])) return i;
  return -1;
}
export function unlockFlags(b, a = state.alloc) {
  const fb = firstBlock(b, a);
  return b.layers.map((_, i) => fb < 0 || i <= fb);
}

export function usedByColor() {
  const u = { blue: 0, purple: 0, orange: 0 };
  state.data.branches.forEach(b => b.layers.forEach(l => l.nodes.forEach(n => { u[n.color] += n.cost * lv(n.id); })));
  return u;
}
export function branchCost(b, useLevel) {
  const c = { blue: 0, purple: 0, orange: 0 };
  b.layers.forEach(l => l.nodes.forEach(n => { c[n.color] += n.cost * (useLevel ? lv(n.id) : n.max); }));
  return c;
}
export const ownedNum = c => (state.owned[c] === '' ? null : Number(state.owned[c]));

export function findNode(id) {
  const bs = state.data.branches;
  for (let bi = 0; bi < bs.length; bi++) {
    for (let li = 0; li < bs[bi].layers.length; li++) {
      const l = bs[bi].layers[li];
      for (let ni = 0; ni < l.nodes.length; ni++) {
        if (l.nodes[ni].id === id) return { bi, li, ni, b: bs[bi], l, n: l.nodes[ni] };
      }
    }
  }
  return null;
}
