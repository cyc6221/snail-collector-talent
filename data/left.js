/*
 * 天賦資料（左・資源）——此檔由 data/left.csv 自動產生，請不要直接修改。
 * 要更新：改 data/left.csv，再執行 node tools/build-data.mjs（Windows 可雙擊 tools\build-data.bat）。
 */
window.SNAIL_DATA = window.SNAIL_DATA || {};
window.SNAIL_DATA.left = {
  name: "左・資源",
  note: "資料來源為 2020 年攻略，節點名稱多為暫定，偶數層的紫／橙對應是推測。",
  layers: [
    // 第 1 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-1a", name: "珠寶工匠", color: "blue", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "抽到綠珠轉藍珠機率", per: 1, unit: "%" },
          ]
        },
      ]
    },
    // 第 2 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-2a", name: "珠寶專家", color: "purple", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "抽到藍珠轉紫珠機率", per: 1, unit: "%" },
          ]
        },
        {
          id: "res-2b", name: "珠寶大師", color: "orange", cost: 1, max: 5,
          note: "",
          effects: [
            { stat: "抽到紫珠轉橙珠機率", per: 1, unit: "%" },
          ]
        },
      ]
    },
    // 第 3 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-3a", name: "蘑菇園增產", color: "blue", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "蘑菇園產量", per: 5, unit: "%" },
          ]
        },
      ]
    },
    // 第 4 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-4a", name: "時空管理員", color: "purple", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "時光機探索產量", per: 5, unit: "%" },
            { stat: "時光機容量", per: 5, unit: "%" },
          ]
        },
        {
          id: "res-4b", name: "黑蝌蚪養殖", color: "orange", cost: 2, max: 5,
          note: "",
          effects: [
            { stat: "黑蝌蚪池產量", per: 5, unit: "%" },
            { stat: "黑蝌蚪池容量", per: 5, unit: "%" },
          ]
        },
      ]
    },
    // 第 5 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-5a", name: "工坊增產", color: "blue", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "木材工坊產量", per: 5, unit: "%" },
            { stat: "石材工坊產量", per: 5, unit: "%" },
            { stat: "工坊容量", per: 5, unit: "%" },
          ]
        },
      ]
    },
    // 第 6 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-6a", name: "基因研究 I", color: "purple", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "DNA研究加速", per: 3, unit: "%" },
            { stat: "免費加速時間", per: 30, unit: "分鐘" },
          ]
        },
        {
          id: "res-6b", name: "基因研究 II", color: "orange", cost: 3, max: 5,
          note: "",
          effects: [
            { stat: "DNA研究加速", per: 3, unit: "%" },
          ]
        },
      ]
    },
    // 第 7 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-7a", name: "博物館經營", color: "blue", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "高麗博物館勳章產量", per: 3, unit: "%" },
            { stat: "高麗博物館黑蝌蚪產量", per: 3, unit: "%" },
          ]
        },
      ]
    },
    // 第 8 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-8a", name: "供奉 I", color: "purple", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "獻祭速度", per: 1, unit: "%" },
            { stat: "每次獻祭食物／石材／木材", per: 3, unit: "%" },
          ]
        },
        {
          id: "res-8b", name: "供奉 II", color: "orange", cost: 4, max: 5,
          note: "",
          effects: [
            { stat: "獻祭速度", per: 1, unit: "%" },
          ]
        },
      ]
    },
    // 第 9 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-9a", name: "車輛組裝", color: "blue", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "組裝車輛速度", per: 3, unit: "%" },
          ]
        },
      ]
    },
    // 第 10 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-10a", name: "克隆 I", color: "purple", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "克隆速度", per: 3, unit: "%" },
            { stat: "克隆黑蝌蚪消耗", per: -2, unit: "%" },
          ]
        },
        {
          id: "res-10b", name: "克隆 II", color: "orange", cost: 5, max: 5,
          note: "",
          effects: [
            { stat: "克隆速度", per: 3, unit: "%" },
          ]
        },
      ]
    },
    // 第 11 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-11a", name: "神域回收", color: "blue", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "神域森林／岩石／遺跡回收速度", per: 4, unit: "%" },
          ]
        },
      ]
    },
    // 第 12 層
    {
      threshold: 5,
      nodes: [
        {
          id: "res-12a", name: "基因研究 III", color: "purple", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "DNA研究加速", per: 4, unit: "%" },
            { stat: "免費加速時間", per: 60, unit: "分鐘" },
          ]
        },
        {
          id: "res-12b", name: "基因研究 IV", color: "orange", cost: 6, max: 5,
          note: "",
          effects: [
            { stat: "DNA研究加速", per: 4, unit: "%" },
          ]
        },
      ]
    },
  ]
};
