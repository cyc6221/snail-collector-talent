/*
 * 天賦資料（左・資源）——此檔由 data/left.csv 自動產生，請不要直接修改。
 * 要更新：改 data/left.csv，再執行 node tools/build-data.mjs（Windows 可雙擊 tools\build-data.bat）。
 */
window.SNAIL_DATA = window.SNAIL_DATA || {};
window.SNAIL_DATA.left = {
  name: "左・資源",
  note: "",
  layers: [
    // 第 1 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-1a", name: "珠寶工匠", color: "blue", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "抽獎綠珠轉藍珠", per: 1, unit: "%" },
          ]
        },
      ]
    },
    // 第 2 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-2b", name: "珠寶大師", color: "orange", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "抽獎紫珠轉橘珠", per: 1, unit: "%" },
          ]
        },
        {
          id: "res-2a", name: "珠寶專家", color: "purple", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "抽獎藍珠轉紫珠", per: 1, unit: "%" },
          ]
        },
      ]
    },
    // 第 3 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-3a", name: "蘑菇培育", color: "blue", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "蘑菇園蘑菇產量", per: 5, unit: "%" },
            { stat: "蘑菇園最大容量", per: 5, unit: "%" },
          ]
        },
      ]
    },
    // 第 4 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-4b", name: "時空管理員", color: "orange", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "時光機最大容量", per: 5, unit: "%" },
            { stat: "時光機探索加速產量", per: 5, unit: "%" },
          ]
        },
        {
          id: "res-4a", name: "蝌蚪養殖", color: "purple", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "蝌蚪池最大容量", per: 5, unit: "%" },
            { stat: "蝌蚪池黑蝌蚪產量", per: 5, unit: "%" },
          ]
        },
      ]
    },
    // 第 5 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-5a", name: "土木工程", color: "blue", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "木材工坊木材產量", per: 5, unit: "%" },
            { stat: "石材工坊石材產量", per: 5, unit: "%" },
            { stat: "木材工坊最大容量", per: 5, unit: "%" },
            { stat: "石材工坊最大容量", per: 5, unit: "%" },
          ]
        },
      ]
    },
    // 第 6 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-6b", name: "進階基因工程", color: "orange", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "所有基因研究加速", per: 3, unit: "%" },
            { stat: "所有基因免費速度", per: 30, unit: "m" },
          ]
        },
        {
          id: "res-6a", name: "基因工程", color: "purple", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "所有基因研究加速", per: 3, unit: "%" },
          ]
        },
      ]
    },
    // 第 7 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-7a", name: "行銷達人", color: "blue", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "博物館勳章產量", per: 3, unit: "%" },
            { stat: "博物館黑蝌蚪產量", per: 3, unit: "%" },
          ]
        },
      ]
    },
    // 第 8 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-8b", name: "進階靈魂儀式", color: "orange", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "供奉速度", per: 1, unit: "%" },
            { stat: "每次供奉食物／石材／木材數量", per: 3, unit: "%" },
          ]
        },
        {
          id: "res-8a", name: "靈魂儀式", color: "purple", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "供奉速度", per: 1, unit: "%" },
          ]
        },
      ]
    },
    // 第 9 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-9a", name: "流水線", color: "blue", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "蟲洞裝置提煉速度", per: 2, unit: "%" },
          ]
        },
      ]
    },
    // 第 10 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-10b", name: "進階遺傳學", color: "orange", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "克隆兵種速度", per: 3, unit: "%" },
            { stat: "醫療兵種速度", per: 1, unit: "%" },
            { stat: "克隆兵種黑蝌蚪消耗", per: -2, unit: "%" },
            { stat: "醫療兵種黑蝌蚪消耗", per: -1, unit: "%" },
          ]
        },
        {
          id: "res-10a", name: "遺傳學", color: "purple", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "克隆兵種速度", per: 3, unit: "%" },
            { stat: "醫療兵種速度", per: 1, unit: "%" },
          ]
        },
      ]
    },
    // 第 11 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-11a", name: "高效開採", color: "blue", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "自動採集機白蝌蚪數量", per: 20, unit: "" },
            { stat: "自動採集機古代貨幣數量", per: 60, unit: "" },
          ]
        },
      ]
    },
    // 第 12 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-12b", name: "首席科學家", color: "orange", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "所有基因研究加速", per: 4, unit: "%" },
            { stat: "所有基因免費速度", per: 60, unit: "m" },
          ]
        },
        {
          id: "res-12a", name: "科學家", color: "purple", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "所有基因研究加速", per: 4, unit: "%" },
          ]
        },
      ]
    },
    // 第 13 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-13a", name: "提煉學徒", color: "blue", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "提煉綠建材轉藍建材", per: 1, unit: "%" },
          ]
        },
      ]
    },
    // 第 14 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-14b", name: "提煉大師", color: "orange", cost: 6, max: 5,
          note: "",
          gate: true,
          effects: [
            { stat: "提煉紫建材轉橘建材", per: 1, unit: "%" },
          ]
        },
        {
          id: "res-14a", name: "提煉專家", color: "purple", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "提煉藍建材轉紫建材", per: 1, unit: "%" },
          ]
        },
      ]
    },
    // 第 15 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-15a", name: "能源工程", color: "orange", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "火箭艙室採集效率", per: 5, unit: "%" },
            { stat: "火箭艙室容量上限", per: 10, unit: "%" },
          ]
        },
      ]
    },
  ]
};
