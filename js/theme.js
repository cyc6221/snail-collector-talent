// 外觀：淺色／深色，選擇只存在這個瀏覽器（不會進匯出的設定）
// 還沒選過時照系統的深淺色；按過一次切換之後，就以選的為準
import { $, THEME_KEY } from './util.js';

const query = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

let chosen = null;     // 'light' | 'dark'；null＝還沒選過
try { const v = localStorage.getItem(THEME_KEY); if (v === 'light' || v === 'dark') chosen = v; } catch (e) { /* 讀不到就照系統 */ }

const isDark = () => chosen ? chosen === 'dark' : !!query && query.matches;

function apply() {
  const dark = isDark();
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const btn = $('#btnTheme');
  btn.textContent = dark ? '切換為淺色模式' : '切換為深色模式';
  btn.title = '目前是' + (dark ? '深色' : '淺色') + '模式';
}

$('#btnTheme').addEventListener('click', () => {
  chosen = isDark() ? 'light' : 'dark';
  try { localStorage.setItem(THEME_KEY, chosen); } catch (e) { /* 存不了就只在這次瀏覽有效 */ }
  apply();
});
if (query) query.addEventListener('change', () => { if (!chosen) apply(); });   // 還沒選過時，系統切換深淺色就跟著變
apply();
