// 配點規則：畫面層只呼叫這裡，不直接改 state
import { CN, clamp } from './util.js';
import {
  state, lv, layerSum, layerProgress, firstBlock, unlockFlags,
  usedByColor, ownedNum, findNode, commit, notify
} from './state.js';
import { toast } from './toast.js';

/* ---------- 配點 ---------- */
export function setLevel(id, target) {
  const f = findNode(id);
  if (!f) return;
  const { b, l, n } = f;
  target = clamp(target, 0, n.max);
  const cur = lv(id);
  if (target === cur) return;

  if (target > cur) {
    const fb = firstBlock(b);
    if (fb >= 0 && f.li > fb) {
      // 要點第 N 層，必須先解鎖第 N-1 層並讓它合計達標：提示一律指向上一層
      const p = layerProgress(b.layers[f.li - 1]);
      toast(p.pass
        ? '第 ' + (f.li + 1) + ' 層尚未解鎖：請先解鎖第 ' + f.li + ' 層。'
        : p.gated.length
          ? '第 ' + (f.li + 1) + ' 層尚未解鎖：請先點滿第 ' + f.li + ' 層的「' + p.gated.map(g => g.name).join('、') + '」。'
          : '第 ' + (f.li + 1) + ' 層尚未解鎖：請先讓第 ' + f.li + ' 層合計達 ' + p.need + ' 級。');
      return;
    }
    const own = ownedNum(n.color);
    if (own !== null && n.cost > 0) {
      const remain = own - usedByColor()[n.color];
      const afford = Math.max(0, Math.floor(remain / n.cost));
      const allowed = cur + afford;
      if (allowed < target) {
        if (allowed <= cur) {
          toast(CN[n.color] + '點數不足，無法再升級「' + n.name + '」。');
          return;
        }
        target = allowed;
        toast(CN[n.color] + '點數不足，「' + n.name + '」只升到 ' + target + ' 級。');
      }
    }
  } else {
    const next = Object.assign({}, state.alloc);
    if (target > 0) next[id] = target; else delete next[id];
    const before = unlockFlags(b), after = unlockFlags(b, next);
    for (let j = f.li + 1; j < b.layers.length; j++) {
      if (before[j] && !after[j] && layerSum(b.layers[j], next) > 0) {
        const pr = layerProgress(l);
        toast(pr.gated.length
          ? '無法降級：第 ' + (f.li + 1) + ' 層的「' + pr.gated.map(g => g.name).join('、') + '」需維持點滿，否則第 ' + (j + 1) + ' 層（已有配點）會失去解鎖。請先減少後面層級的點數。'
          : '無法降級：第 ' + (f.li + 1) + ' 層合計會低於 ' + pr.need + ' 級，讓第 ' + (j + 1) + ' 層（已有配點）失去解鎖。請先減少後面層級的點數。');
        return;
      }
    }
  }
  if (target > 0) state.alloc[id] = target; else delete state.alloc[id];
  commit();
}

export function clearAlloc() {
  state.alloc = {};
  commit();
}

/* ---------- 二次確認（破壞性操作） ---------- */
let armed = null, armedTimer = 0;
export const isArmed = key => armed === key;
export function confirmTwice(key, fn, hint) {
  if (armed === key) {
    armed = null;
    clearTimeout(armedTimer);
    fn();
    return;
  }
  armed = key;
  clearTimeout(armedTimer);
  armedTimer = setTimeout(() => { armed = null; notify(); }, 3500);
  notify();
  toast(hint || '再按一次以確認。');
}
