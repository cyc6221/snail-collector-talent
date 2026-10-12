/*
 * 天賦資料（中・戰力）——此檔由 data/middle.csv 自動產生，請不要直接修改。
 * 要更新：改 data/middle.csv，再執行 node tools/build-data.mjs（Windows 可雙擊 tools\build-data.bat）。
 */
window.SNAIL_DATA = window.SNAIL_DATA || {};
window.SNAIL_DATA.middle = {
  name: "中・戰力",
  note: "",
  layers: [
    // 第 1 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-1a", name: "綜合格鬥", color: "blue", cost: 1, max: 5,
          note: "",
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
          note: "",
          effects: [
            { stat: "蝸牛生命", per: 300, unit: "" },
            { stat: "蝸牛追擊", per: 30, unit: "" },
          ]
        },
      ]
    },
    // 第 3 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-3a", name: "荒野求生", color: "blue", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛攻擊", per: 36, unit: "" },
            { stat: "蝸牛防禦", per: 36, unit: "" },
            { stat: "探索戰鬥對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 4 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-4a", name: "探險家", color: "blue", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛生命", per: 360, unit: "" },
            { stat: "蝸牛追擊", per: 36, unit: "" },
            { stat: "探索戰鬥對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 5 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-5a", name: "戰鬥大師", color: "blue", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛攻擊", per: 42, unit: "" },
            { stat: "蝸牛防禦", per: 42, unit: "" },
            { stat: "基因模擬訓練對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 6 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-6a", name: "防禦大師", color: "blue", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛生命", per: 420, unit: "" },
            { stat: "蝸牛追擊", per: 42, unit: "" },
            { stat: "基因模擬訓練對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 7 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-7a", name: "弒神者", color: "blue", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛攻擊", per: 48, unit: "" },
            { stat: "蝸牛防禦", per: 48, unit: "" },
            { stat: "神域單體戰對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 8 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-8a", name: "狂熱信徒", color: "blue", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛生命", per: 480, unit: "" },
            { stat: "蝸牛追擊", per: 48, unit: "" },
            { stat: "神域單體戰對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 9 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-9a", name: "跆拳道", color: "blue", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛攻擊", per: 54, unit: "" },
            { stat: "蝸牛防禦", per: 54, unit: "" },
            { stat: "蝸牛格鬥對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 10 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-10a", name: "空手道", color: "blue", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛生命", per: 540, unit: "" },
            { stat: "蝸牛追擊", per: 54, unit: "" },
            { stat: "蝸牛格鬥對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 11 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-11a", name: "致命武力", color: "blue", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛攻擊", per: 60, unit: "" },
            { stat: "蝸牛防禦", per: 60, unit: "" },
            { stat: "弱點判定成功對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 12 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-12a", name: "生存大師", color: "blue", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛生命", per: 600, unit: "" },
            { stat: "蝸牛追擊", per: 60, unit: "" },
            { stat: "弱點判定成功對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 13 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-13a", name: "絕對武力", color: "blue", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛攻擊", per: 66, unit: "" },
            { stat: "蝸牛防禦", per: 66, unit: "" },
            { stat: "弱點判定成功對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
    // 第 14 層
    {
      threshold: 5,
      nodes: [
        {
          id: "pow-14a", name: "不死者", color: "blue", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "蝸牛生命", per: 660, unit: "" },
            { stat: "蝸牛追擊", per: 66, unit: "" },
            { stat: "弱點判定成功對敵人傷害", per: 0.5, unit: "%" },
          ]
        },
      ]
    },
  ]
};
