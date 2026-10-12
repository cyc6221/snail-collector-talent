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
            { stat: "蝸牛領導力", per: 2, unit: "" },
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
            { stat: "所有兵種生命", per: 1, unit: "" },
            { stat: "所有兵種防禦", per: 1, unit: "" },
          ]
        },
        {
          id: "arm-2b", name: "戰鬥指揮", color: "orange", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種攻擊", per: 1, unit: "" },
            { stat: "所有兵種追擊", per: 1, unit: "" },
          ]
        },
      ]
    },
    // 第 3 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-3a", name: "領導力", color: "blue", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛領導力", per: 2, unit: "" },
          ]
        },
      ]
    },
    // 第 4 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-4a", name: "防禦指揮", color: "purple", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種生命", per: 1, unit: "" },
            { stat: "所有兵種防禦", per: 1, unit: "" },
          ]
        },
        {
          id: "arm-4b", name: "戰鬥指揮", color: "orange", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種攻擊", per: 1, unit: "" },
            { stat: "所有兵種追擊", per: 1, unit: "" },
          ]
        },
      ]
    },
    // 第 5 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-5a", name: "領導力", color: "blue", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛領導力", per: 2, unit: "" },
          ]
        },
      ]
    },
    // 第 6 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-6a", name: "防禦指揮", color: "purple", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種生命", per: 1, unit: "" },
            { stat: "所有兵種防禦", per: 1, unit: "" },
          ]
        },
        {
          id: "arm-6b", name: "戰鬥指揮", color: "orange", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種攻擊", per: 1, unit: "" },
            { stat: "所有兵種追擊", per: 1, unit: "" },
          ]
        },
      ]
    },
    // 第 7 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-7a", name: "領導力", color: "blue", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛領導力", per: 2, unit: "" },
          ]
        },
      ]
    },
    // 第 8 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-8a", name: "防禦指揮", color: "purple", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種生命", per: 1, unit: "" },
            { stat: "所有兵種防禦", per: 1, unit: "" },
          ]
        },
        {
          id: "arm-8b", name: "戰鬥指揮", color: "orange", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種攻擊", per: 1, unit: "" },
            { stat: "所有兵種追擊", per: 1, unit: "" },
          ]
        },
      ]
    },
    // 第 9 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-9a", name: "領導力", color: "blue", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛領導力", per: 2, unit: "" },
          ]
        },
      ]
    },
    // 第 10 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-10a", name: "防禦指揮", color: "purple", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種生命", per: 1, unit: "" },
            { stat: "所有兵種防禦", per: 1, unit: "" },
          ]
        },
        {
          id: "arm-10b", name: "戰鬥指揮", color: "orange", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種攻擊", per: 1, unit: "" },
            { stat: "所有兵種追擊", per: 1, unit: "" },
          ]
        },
      ]
    },
    // 第 11 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-11a", name: "領導力", color: "blue", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛領導力", per: 2, unit: "" },
          ]
        },
      ]
    },
    // 第 12 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-12a", name: "防禦指揮", color: "purple", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種生命", per: 1, unit: "" },
            { stat: "所有兵種防禦", per: 1, unit: "" },
          ]
        },
        {
          id: "arm-12b", name: "戰鬥指揮", color: "orange", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種攻擊", per: 1, unit: "" },
            { stat: "所有兵種追擊", per: 1, unit: "" },
          ]
        },
      ]
    },
    // 第 13 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-13a", name: "領導力", color: "blue", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛領導力", per: 2, unit: "" },
          ]
        },
      ]
    },
    // 第 14 層
    {
      threshold: 5,
      nodes: [
        {
          id: "arm-14a", name: "防禦指揮", color: "purple", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種生命", per: 1, unit: "" },
            { stat: "所有兵種防禦", per: 1, unit: "" },
          ]
        },
        {
          id: "arm-14b", name: "戰鬥指揮", color: "orange", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "所有兵種攻擊", per: 1, unit: "" },
            { stat: "所有兵種追擊", per: 1, unit: "" },
          ]
        },
      ]
    },
  ]
};
