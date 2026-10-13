// 標籤系統：每個標籤列出它包含的能力（用能力名稱比對，和資料裡的 stat 完全一致）
import { esc } from './util.js';

export const TAGS = [
  { id: 'snail', name: '蝸牛', stats: ['蝸牛攻擊', '蝸牛防禦', '蝸牛生命', '蝸牛追擊'] },
  { id: 'troop', name: '兵種', stats: ['領導力', '兵種攻擊', '兵種防禦', '兵種生命', '兵種追擊'] }
];

export const tagsOf = stat => TAGS.filter(t => t.stats.includes(stat));

/** 能力名稱旁邊的小標籤（沒有標籤的能力回傳空字串） */
export const tagChipsHTML = stat => tagsOf(stat).map(t => '<span class="tag" data-tag="' + t.id + '">' + esc(t.name) + '</span>').join('');
