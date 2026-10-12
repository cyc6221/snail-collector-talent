/*
 * 天賦資料（中・戰力）——此檔由 data/middle.csv 自動產生，請不要直接修改。
 * 要更新：改 data/middle.csv，再執行 node tools/build-data.mjs（Windows 可雙擊 tools\build-data.bat）。
 */
window.SNAIL_DATA = window.SNAIL_DATA || {};
window.SNAIL_DATA.middle = {
  name: "中・戰力",
  note: "目前只知道前兩層。",
  layers: [
    // 第 1 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-1a", name: "綜合格鬥", color: "blue", cost: 1, max: 5,
          note: "待確認：每級消耗",
          effects: [
            { stat: "蝸牛攻擊", per: 30, unit: "" },
            { stat: "蝸牛防禦", per: 30, unit: "" },
          ]
        },
      ]
    },
    // 第 2 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-2a", name: "體能訓練", color: "blue", cost: 1, max: 5,
          note: "待確認：每級消耗",
          effects: [
            { stat: "蝸牛生命", per: 300, unit: "" },
            { stat: "蝸牛追擊", per: 30, unit: "" },
          ]
        },
      ]
    },
  ]
};
