// 標籤系統：每個標籤列出它包含的能力（用能力名稱比對，和資料裡的 stat 完全一致）
import { esc } from './util.js';

export const TAGS = [
  { id: 'snail', name: '蝸牛', stats: ['蝸牛攻擊', '蝸牛防禦', '蝸牛生命', '蝸牛追擊', '火元素傷害', '水元素傷害', '土元素傷害', '風元素傷害'] },
  { id: 'troop', name: '兵種', stats: ['領導力', '兵種攻擊', '兵種防禦', '兵種生命', '兵種追擊', '上陣100兵種部隊火元素傷害', '上陣100兵種部隊水元素傷害', '上陣100兵種部隊土元素傷害', '上陣100兵種部隊風元素傷害'] }
];

export const tagsOf = stat => TAGS.filter(t => t.stats.includes(stat));

/** 能力名稱旁邊的小標籤（沒有標籤的能力回傳空字串） */
export const tagChipsHTML = stat => tagsOf(stat).map(t => '<span class="tag" data-tag="' + t.id + '">' + esc(t.name) + '</span>').join('');

/** 場景名稱：出現在能力名稱裡時，會用方框標出來（例如「物種戰爭部隊對敵人傷害」的「物種戰爭」）。要加場景就在這裡多放一個名稱 */
export const SCENES = ['物種戰爭', '神域戰鬥', '兵種演練', '神域單體戰', '蝸牛格鬥', '基因模擬訓練', '探索戰鬥'];
const sceneRe = new RegExp('(' + SCENES.join('|') + ')');

/** 能力名稱的 HTML：已跳脫，場景名稱包成 .scene 方框 */
export const statHTML = stat => String(stat).split(sceneRe).map((part, i) => (i % 2 ? '<span class="scene">' + esc(part) + '</span>' : esc(part))).join('');
