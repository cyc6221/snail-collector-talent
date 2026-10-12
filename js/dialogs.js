// 對話框：匯出／匯入
import { $ } from './util.js';
import { restore } from './schema.js';
import { state, snapshot, commit } from './state.js';
import { syncOwnedInputs } from './panels.js';
import { toast } from './toast.js';

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
    next = restore(parsed, state.data, state.owned);
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
