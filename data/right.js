/*
 * 天賦資料（右・兵種）——此檔由 data/right.csv 自動產生，請不要直接修改。
 * 要更新：改 data/right.csv，再執行 node tools/build-data.mjs（Windows 可雙擊 tools\build-data.bat）。
 */
window.SNAIL_DATA = window.SNAIL_DATA || {};
window.SNAIL_DATA.right = {
  name: "右・兵種",
  note: "",
  layers: [
    // 第 1 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-1a", name: "領導力", color: "blue", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "領導力", per: 1, unit: "" },
          ]
        },
      ]
    },
    // 第 2 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-2a", name: "防禦指揮", color: "purple", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "兵種生命", per: 1, unit: "" },
            { stat: "兵種防禦", per: 1, unit: "" },
          ]
        },
        {
          id: "arm-2b", name: "進攻指揮", color: "orange", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "兵種攻擊", per: 1, unit: "" },
            { stat: "兵種追擊", per: 1, unit: "" },
          ]
        },
      ]
    },
  ]
};
