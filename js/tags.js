// 標籤系統：每個標籤列出它包含的能力（用能力名稱比對，和資料裡的 stat 完全一致）
import { esc } from './util.js';

export const TAGS = [
  { id: 'snail', name: '蝸牛', stats: ['蝸牛攻擊', '蝸牛防禦', '蝸牛生命', '蝸牛追擊', '火元素傷害', '水元素傷害', '土元素傷害', '風元素傷害', '源獸協助蝸牛戰鬥造成傷害'] },
  { id: 'troop', name: '兵種', stats: ['領導力', '兵種攻擊', '兵種防禦', '兵種生命', '兵種追擊', '上陣100兵種部隊火元素傷害', '上陣100兵種部隊水元素傷害', '上陣100兵種部隊土元素傷害', '上陣100兵種部隊風元素傷害', '源獸協助部落戰鬥造成傷害'] },
  { id: 'home', name: '家園', stats: ['蘑菇園蘑菇產量', '蘑菇園最大容量', '時光機最大容量', '時光機探索加速產量', '蝌蚪池最大容量', '蝌蚪池黑蝌蚪產量', '木材工坊木材產量', '木材工坊最大容量', '石材工坊石材產量', '石材工坊最大容量', '博物館黑蝌蚪產量', '博物館勳章產量', '自動採集機白蝌蚪數量', '自動採集機古代貨幣數量', '火箭艙室採集效率', '火箭艙室容量上限', '蟲洞裝置提煉速度'] }
];

export const tagsOf = stat => TAGS.filter(t => t.stats.includes(stat));

/** 能力名稱旁邊的小標籤（沒有標籤的能力回傳空字串） */
export const tagChipsHTML = stat => tagsOf(stat).map(t => '<span class="tag" data-tag="' + t.id + '">' + esc(t.name) + '</span>').join('');

/**
 * 場景名稱：出現在能力名稱裡時，會用方框標出來（例如「物種戰爭部隊對敵人傷害」的「物種戰爭」）。
 * 分組決定方框的顏色：kind 空字串＝一般場景（中性色），'element'＝元素（統一一種顏色）。要加場景就在對應的 names 多放一個名稱
 */
export const SCENES = [
  { kind: '', names: ['物種戰爭', '神域戰鬥', '兵種演練', '神域單體戰', '蝸牛格鬥', '基因模擬訓練', '探索戰鬥'] },
  { kind: 'element', names: ['火元素', '水元素', '土元素', '風元素'] }
];
const sceneKind = new Map(SCENES.flatMap(g => g.names.map(n => [n, g.kind])));
const sceneRe = new RegExp('(' + [...sceneKind.keys()].join('|') + ')');

/** 能力名稱的 HTML：已跳脫，場景名稱包成 .scene 方框（元素另加 .scene-element 換顏色） */
export const statHTML = stat => String(stat).split(sceneRe).map((part, i) => {
  if (!(i % 2)) return esc(part);
  const kind = sceneKind.get(part);
  return '<span class="scene' + (kind ? ' scene-' + kind : '') + '">' + esc(part) + '</span>';
}).join('');
