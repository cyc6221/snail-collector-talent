// 配點規則：畫面層只呼叫這裡，不直接改 state
import { CN, COLORS, clamp, nodeCost } from './util.js';
import {
  state, lv, layerSum, layerProgress, extraProgress, firstBlock, unlockFlags,
  usedByColor, ownedNum, findNode, commit, notify
} from './state.js';
import { toast } from './toast.js';

/* ---------- 配點 ---------- */
/** 額外樓層節點的解鎖來源，用在提示文字（例如：第 15 層的「能源工程、元素大師、元素操控」） */
function sourceText(e) {
  const fs = e.unlock.from.map(findNode).filter(Boolean);
  const floors = [...new Set(fs.map(f => (f.extra ? f.n.floor : f.li + 1)))];
  return (floors.length === 1 ? '第 ' + floors[0] + ' 層的' : '') + '「' + fs.map(f => f.n.name).join('、') + '」';
}

export function setLevel(id, target) {
  const f = findNode(id);
  if (!f) return;
  const { n } = f;
  target = clamp(target, 0, n.max);
  const cur = lv(id);
  if (target === cur) return;

  if (target > cur) {
    if (f.extra) {
      const p = extraProgress(n);
      if (!p.pass) {
        toast('「' + n.name + '」尚未解鎖：請先讓' + sourceText(n) + '等級合計達 ' + p.need + ' 級（目前 ' + p.cur + '）。');
        return;
      }
    } else {
      const fb = firstBlock(f.b);
      if (fb >= 0 && f.li > fb) {
        // 要點第 N 層，必須先解鎖第 N-1 層並讓它合計達標：提示一律指向上一層
        const p = layerProgress(f.b.layers[f.li - 1]);
        toast(p.pass
          ? '第 ' + (f.li + 1) + ' 層尚未解鎖：請先解鎖第 ' + f.li + ' 層。'
          : p.gated.length
            ? '第 ' + (f.li + 1) + ' 層尚未解鎖：請先點滿第 ' + f.li + ' 層的「' + p.gated.map(g => g.name).join('、') + '」。'
            : '第 ' + (f.li + 1) + ' 層尚未解鎖：請先讓第 ' + f.li + ' 層合計達 ' + p.need + ' 級。');
        return;
      }
    }
    // 點數上限：每一種要花的顏色都要夠；可升幾級就升幾級
    const cost = nodeCost(n), used = usedByColor();
    let canAdd = target - cur, shortColor = null;
    for (const c of COLORS) {
      const own = ownedNum(c);
      if (own === null || cost[c] <= 0) continue;
      const afford = Math.max(0, Math.floor((own - used[c]) / cost[c]));
      if (afford < canAdd) { canAdd = afford; shortColor = c; }
    }
    if (shortColor) {
      if (canAdd <= 0) {
        toast(CN[shortColor] + '珠不足，無法再升級「' + n.name + '」。');
        return;
      }
      target = cur + canAdd;
      toast(CN[shortColor] + '珠不足，「' + n.name + '」只升到 ' + target + ' 級。');
    }
  } else {
    const next = Object.assign({}, state.alloc);
    if (target > 0) next[id] = target; else delete next[id];
    if (!f.extra) {
      const { b, l } = f;
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
    // 降級若會讓已有配點的額外節點失去解鎖，同樣要阻止（例如降第 15 層會讓武道之王失去解鎖，降武道之王會讓第 17 層失去解鎖）
    for (const e of state.data.extras) {
      if (lv(e.id) > 0 && extraProgress(e).pass && !extraProgress(e, next).pass) {
        toast('無法降級：' + sourceText(e) + '等級合計會低於 ' + e.unlock.need + ' 級，讓「' + e.name + '」（已有配點）失去解鎖。請先減少「' + e.name + '」的點數。');
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
