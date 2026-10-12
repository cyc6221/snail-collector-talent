// 配點規則與所有「改資料」的動作；畫面層只呼叫這裡，不直接改 state
import { CN, clamp, toInt, newId } from './util.js';
import { sanitizeData, sanitizeAlloc } from './schema.js';
import {
  state, defaultData, lv, layerSum, effThr, firstBlock, unlockFlags,
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

  if (state.strict) {
    if (target > cur) {
      const fb = firstBlock(b);
      if (fb >= 0 && f.li > fb) {
        toast('第 ' + (f.li + 1) + ' 層尚未解鎖：請先讓第 ' + (fb + 1) + ' 層合計達 ' + effThr(b.layers[fb]) + ' 級。');
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
          toast('無法降級：第 ' + (f.li + 1) + ' 層合計會低於 ' + effThr(l) + ' 級，讓第 ' + (j + 1) + ' 層（已有配點）失去解鎖。請先減少後面層級的點數。');
          return;
        }
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

/* ---------- 編輯資料 ---------- */
function blankNode() {
  const taken = new Set();
  state.data.branches.forEach(b => b.layers.forEach(l => l.nodes.forEach(n => taken.add(n.id))));
  return { id: newId(taken), name: '新節點', color: 'blue', cost: 1, max: 5, effects: [], note: '' };
}

export function addNode(bi, li) {
  const l = state.data.branches[bi].layers[li];
  if (l.nodes.length >= 2) return;
  l.nodes.push(blankNode());
  commit();
}

export function addLayer(bi) {
  state.data.branches[bi].layers.push({ threshold: 5, nodes: [blankNode()] });
  commit();
}

export function removeNode(id) {
  const f = findNode(id);
  if (!f || f.l.nodes.length < 2) return;
  f.l.nodes.splice(f.ni, 1);
  delete state.alloc[id];
  commit();
}

export function removeLayer(bi, li) {
  const b = state.data.branches[bi];
  const l = b && b.layers[li];
  if (!l) return;
  l.nodes.forEach(n => delete state.alloc[n.id]);
  b.layers.splice(li, 1);
  commit();
}

export function setThreshold(bi, li, value) {
  const l = state.data.branches[bi].layers[li];
  l.threshold = toInt(value, 0, 999, l.threshold);
  commit();
}

/** 節點資料改回預設；配點保留，已不存在的節點配點移除 */
export function resetData() {
  state.data = sanitizeData(defaultData());
  state.alloc = sanitizeAlloc(state.alloc, state.data);
  commit();
}
