// 對話框：節點編輯、匯出／匯入
import { COLORS, $ } from './util.js';
import { restore } from './schema.js';
import { state, lv, findNode, snapshot, commit } from './state.js';
import { syncOwnedInputs } from './panels.js';
import { toast } from './toast.js';

const nodeDlg = $('#nodeDlg'), nodeForm = $('#nodeForm');
let editingId = null;

export function openNodeDialog(id) {
  const f = findNode(id);
  if (!f) return;
  editingId = id;
  const n = f.n, F = nodeForm.elements;
  F.name.value = n.name;
  F.color.value = n.color;
  F.cost.value = n.cost;
  F.max.value = n.max;
  F.effects.value = n.effects.map(e => e.stat + ' | ' + e.per + ' | ' + e.unit).join('\n');
  F.note.value = n.note;
  $('#nodeErr').textContent = '';
  nodeDlg.showModal();
  F.name.focus();
}

function parseEffects(text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(/[|｜]/).map(s => s.trim());
    if (parts.length < 2 || !parts[0]) throw new Error('第 ' + (i + 1) + ' 行格式應為「屬性 | 每級數值 | 單位」。');
    const numStr = parts[1].replace(/[−–—－]/g, '-').replace(/[＋+,，]/g, '');
    const per = Number(numStr);
    if (numStr === '' || !Number.isFinite(per)) throw new Error('第 ' + (i + 1) + ' 行的每級數值「' + parts[1] + '」不是數字。');
    out.push({ stat: parts[0].slice(0, 40), per, unit: parts.slice(2).join('|').trim().slice(0, 10) });
  }
  if (out.length > 12) throw new Error('每個節點最多 12 個效果。');
  return out;
}

nodeForm.addEventListener('submit', e => {
  e.preventDefault();
  const F = nodeForm.elements;
  const f = findNode(editingId);
  if (!f) { nodeDlg.close(); return; }
  try {
    const name = F.name.value.trim();
    if (!name) throw new Error('請輸入節點名稱。');
    const cost = Number(F.cost.value), max = Number(F.max.value);
    if (F.cost.value === '' || !Number.isInteger(cost) || cost < 0 || cost > 999) throw new Error('每級消耗要是 0～999 的整數。');
    if (F.max.value === '' || !Number.isInteger(max) || max < 1 || max > 99) throw new Error('最高等級要是 1～99 的整數。');
    const effects = parseEffects(F.effects.value);
    Object.assign(f.n, { name: name.slice(0, 40), color: COLORS.includes(F.color.value) ? F.color.value : 'blue', cost, max, effects, note: F.note.value.trim().slice(0, 120) });
    if (lv(f.n.id) > max) state.alloc[f.n.id] = max;
    nodeDlg.close();
    commit();
  } catch (err) {
    $('#nodeErr').textContent = err.message;
  }
});

document.addEventListener('click', e => {
  const c = e.target.closest('[data-close]');
  if (c) c.closest('dialog').close();
});

/* =========================================================
 *  匯出／匯入
 * ======================================================= */
const ioDlg = $('#ioDlg'), ioText = $('#ioText'), ioErr = $('#ioErr');
let importArmed = false, importTimer = 0;
function resetImportBtn() {
  importArmed = false;
  clearTimeout(importTimer);
  const b = $('#ioImport');
  b.textContent = '匯入並覆蓋目前設定';
  b.classList.remove('armed');
}

$('#btnIO').addEventListener('click', () => {
  ioText.value = JSON.stringify(snapshot(), null, 2);
  ioErr.textContent = '';
  resetImportBtn();
  ioDlg.showModal();
  ioText.focus();
  ioText.select();
});
ioDlg.addEventListener('close', resetImportBtn);

$('#ioCopy').addEventListener('click', async () => {
  ioText.focus();
  ioText.select();
  try {
    await navigator.clipboard.writeText(ioText.value);
    toast('已複製到剪貼簿。');
  } catch (e) {
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e2) { /* ignore */ }
    toast(ok ? '已複製到剪貼簿。' : '無法自動複製，請手動按 Ctrl+C。');
  }
});

$('#ioImport').addEventListener('click', () => {
  ioErr.textContent = '';
  let next;
  try {
    let parsed;
    try { parsed = JSON.parse(ioText.value); } catch (e) { throw new Error('不是有效的 JSON，請確認內容完整貼上。'); }
    next = restore(parsed, state.owned);
  } catch (err) {
    ioErr.textContent = '匯入失敗：' + err.message;
    resetImportBtn();
    return;
  }
  if (!importArmed) {
    importArmed = true;
    const b = $('#ioImport');
    b.textContent = '再按一次確認覆蓋';
    b.classList.add('armed');
    importTimer = setTimeout(resetImportBtn, 3500);
    return;
  }
  resetImportBtn();
  Object.assign(state, next);
  syncOwnedInputs();
  ioDlg.close();
  commit();
  toast('已匯入設定。');
});
