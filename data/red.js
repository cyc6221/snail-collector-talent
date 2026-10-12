/*
 * 紅色天賦（第 16 層）——此檔由 data/red.csv 自動產生，請不要直接修改。
 * 要更新：改 data/red.csv，再執行 node tools/build-data.mjs（Windows 可雙擊 tools\build-data.bat）。
 */
window.SNAIL_DATA = window.SNAIL_DATA || {};
window.SNAIL_DATA.red = {
  nodes: [
    {
      id: "red-16a", name: "武道之王", color: 'red', max: 3,
      costs: { blue: 5, purple: 5, orange: 5 },
      unlock: { from: ["res-15a", "pow-15a", "arm-15a"], need: 5 },
      note: "",
      effects: [
        { stat: "蝸牛生命", per: 2, unit: "%" },
        { stat: "蝸牛攻擊", per: 2, unit: "%" },
        { stat: "蝸牛防禦", per: 2, unit: "%" },
        { stat: "蝸牛追擊", per: 2, unit: "%" },
      ]
    },
  ]
};
