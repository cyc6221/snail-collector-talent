# 最強蝸牛・收藏家天賦模擬器

一次看完左・中・右三個分支的所有天賦層級，自由配點，即時加總能力。

**線上使用：<https://cyc6221.github.io/snail-collector-talent/>**

> 非官方玩家自製工具，數值整理自玩家攻略，以遊戲內為準。

## 怎麼用

- 點 ＋／−、「點滿」，或直接點等級圓點設定等級（再點一次目前等級就降一級）。
- 頂部填入你擁有的藍／紫／橙點數（預設不限制，留空＝不限），超出會標紅。
- 整張天賦圖一次攤開，後面的層級也看得到（變淡表示還沒解鎖）。照遊戲規則，一層的等級合計達門檻，才能點下一層。
- 點上方「能力加總」查看總加成，隨時可以切回來繼續調整。
- 「匯出／匯入」可用 JSON 分享整套配點。資料只存在你的瀏覽器，不會上傳。

## 資料來源

- 數值整理自玩家攻略，資料持續更新中。

發現錯誤或有新資料，歡迎開 Issue，或直接修改 `data/` 的 CSV 後發 Pull Request。

## 開發

純前端，沒有任何相依套件。

```bash
node tools/serve.mjs        # 本機預覽 http://localhost:8000（不能直接雙擊 index.html）
node tools/build-data.mjs   # 修改 data/*.csv 後，重新產生 data/*.js
```

- 天賦資料在 `data/`，欄位說明見 [data/README.md](data/README.md)。
- 程式在 `js/`（ES modules），樣式在 `css/`。
- 部署：把整個資料夾放上 GitHub Pages（Settings → Pages → `main` / root）。
