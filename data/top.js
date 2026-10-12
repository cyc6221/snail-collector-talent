/*
 * 額外樓層（第 16 層以後）——此檔由 data/top.csv 自動產生，請不要直接修改。
 * 要更新：改 data/top.csv，再執行 node tools/build-data.mjs（Windows 可雙擊 tools\build-data.bat）。
 */
window.SNAIL_DATA = window.SNAIL_DATA || {};
window.SNAIL_DATA.top = {
  nodes: [
    {
      id: "red-16a", name: "武道之王", color: "red", floor: 16, lane: null, max: 3,
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
    {
      id: "res-17a", name: "部落勇者", color: "blue", floor: 17, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["red-16a"], need: 3 },
      note: "",
      effects: [
        { stat: "部落每日追隨者產出", per: 3, unit: "%" },
      ]
    },
    {
      id: "pow-17a", name: "致命武力", color: "blue", floor: 17, lane: 1, max: 5,
      cost: 6,
      unlock: { from: ["red-16a"], need: 3 },
      note: "",
      effects: [
        { stat: "蝸牛攻擊", per: 72, unit: "" },
        { stat: "蝸牛防禦", per: 72, unit: "" },
        { stat: "弱點判定成功對敵人傷害", per: 0.5, unit: "%" },
      ]
    },
    {
      id: "arm-17a", name: "領導力", color: "blue", floor: 17, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["red-16a"], need: 3 },
      note: "",
      effects: [
        { stat: "蝸牛領導力", per: 2, unit: "" },
      ]
    },
    {
      id: "res-18b", name: "部落領主", color: "orange", floor: 18, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["res-17a"], need: 5 },
      note: "",
      effects: [
        { stat: "部落每日近衛命石產出", per: 3, unit: "%" },
        { stat: "部落每日尖兵命石產出", per: 3, unit: "%" },
        { stat: "部落每日信徒命石產出", per: 3, unit: "%" },
        { stat: "部落每日祭司命石產出", per: 3, unit: "%" },
      ]
    },
    {
      id: "res-18a", name: "部落菁英", color: "purple", floor: 18, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["res-17a"], need: 5 },
      note: "",
      effects: [
        { stat: "部落每日琥珀產出", per: 3, unit: "%" },
      ]
    },
    {
      id: "pow-18a", name: "破敵先鋒", color: "purple", floor: 18, lane: 1, max: 5,
      cost: 6,
      unlock: { from: ["pow-17a"], need: 5 },
      note: "",
      effects: [
        { stat: "戰鬥首回合對敵人傷害", per: 1.2, unit: "%" },
        { stat: "對敵人傷害", per: 0.6, unit: "%" },
      ]
    },
    {
      id: "arm-18a", name: "防禦指揮", color: "purple", floor: 18, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["arm-17a"], need: 5 },
      note: "",
      effects: [
        { stat: "所有兵種生命", per: 1, unit: "" },
        { stat: "所有兵種防禦", per: 1, unit: "" },
      ]
    },
    {
      id: "arm-18b", name: "戰鬥指揮", color: "orange", floor: 18, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["arm-17a"], need: 5 },
      note: "",
      effects: [
        { stat: "所有兵種攻擊", per: 1, unit: "" },
        { stat: "所有兵種追擊", per: 1, unit: "" },
      ]
    },
    {
      id: "res-19a", name: "聖壇守護", color: "orange", floor: 19, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["res-18b", "res-18a"], need: 5 },
      note: "",
      effects: [
        { stat: "山林聖堂神性結晶產量", per: 3, unit: "%" },
        { stat: "荒漠聖堂神性結晶產量", per: 3, unit: "%" },
        { stat: "凍土聖堂神性結晶產量", per: 3, unit: "%" },
        { stat: "草原聖堂神性結晶產量", per: 3, unit: "%" },
        { stat: "沼澤聖堂神性結晶產量", per: 3, unit: "%" },
      ]
    },
    {
      id: "pow-19a", name: "源獸契約", color: "orange", floor: 19, lane: 1, max: 5,
      cost: 6,
      unlock: { from: ["pow-18a"], need: 5 },
      note: "",
      effects: [
        { stat: "源獸協助蝸牛戰鬥造成傷害", per: 2, unit: "%" },
        { stat: "源獸協助部落戰鬥造成傷害", per: 2, unit: "%" },
      ]
    },
    {
      id: "arm-19a", name: "演練大師", color: "orange", floor: 19, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["arm-18a", "arm-18b"], need: 5 },
      note: "",
      effects: [
        { stat: "兵種演練部隊對敵人傷害", per: 1, unit: "%" },
        { stat: "兵種演練部隊傷害減免", per: 1, unit: "%" },
      ]
    },
    {
      id: "red-20a", name: "元素領主", color: "red", floor: 20, lane: null, max: 3,
      costs: { blue: 5, purple: 5, orange: 5 },
      unlock: { from: ["res-19a", "pow-19a", "arm-19a"], need: 5 },
      note: "",
      effects: [
        { stat: "火元素傷害", per: 2, unit: "%" },
        { stat: "水元素傷害", per: 2, unit: "%" },
        { stat: "土元素傷害", per: 2, unit: "%" },
        { stat: "風元素傷害", per: 2, unit: "%" },
      ]
    },
    {
      id: "res-21a", name: "催化學徒", color: "blue", floor: 21, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["red-20a"], need: 3 },
      note: "",
      effects: [
        { stat: "催化綠孢子轉藍孢子機率", per: 1, unit: "%" },
      ]
    },
    {
      id: "pow-21a", name: "生存大師", color: "blue", floor: 21, lane: 1, max: 5,
      cost: 6,
      unlock: { from: ["red-20a"], need: 3 },
      note: "",
      effects: [
        { stat: "蝸牛生命", per: 720, unit: "" },
        { stat: "蝸牛追擊", per: 72, unit: "" },
        { stat: "弱點判定成功對敵人傷害", per: 0.5, unit: "%" },
      ]
    },
    {
      id: "arm-21a", name: "領導力", color: "blue", floor: 21, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["red-20a"], need: 3 },
      note: "",
      effects: [
        { stat: "蝸牛領導力", per: 2, unit: "" },
      ]
    },
    {
      id: "res-22b", name: "催化大師", color: "orange", floor: 22, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["res-21a"], need: 5 },
      note: "",
      effects: [
        { stat: "催化紫孢子轉橘孢子機率", per: 0.3, unit: "%" },
      ]
    },
    {
      id: "res-22a", name: "部落菁英", color: "purple", floor: 22, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["res-21a"], need: 5 },
      note: "",
      effects: [
        { stat: "催化藍孢子轉紫孢子機率", per: 0.6, unit: "%" },
      ]
    },
    {
      id: "pow-22a", name: "破敵先鋒", color: "purple", floor: 22, lane: 1, max: 5,
      cost: 6,
      unlock: { from: ["pow-21a"], need: 5 },
      note: "",
      effects: [
        { stat: "戰鬥首回合對敵人傷害", per: 1.2, unit: "%" },
        { stat: "對敵人傷害", per: 0.6, unit: "%" },
      ]
    },
    {
      id: "arm-22a", name: "防禦指揮", color: "purple", floor: 22, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["arm-21a"], need: 5 },
      note: "",
      effects: [
        { stat: "所有兵種生命", per: 1, unit: "" },
        { stat: "所有兵種防禦", per: 1, unit: "" },
      ]
    },
    {
      id: "arm-22b", name: "戰鬥指揮", color: "orange", floor: 22, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["arm-21a"], need: 5 },
      note: "",
      effects: [
        { stat: "所有兵種攻擊", per: 1, unit: "" },
        { stat: "所有兵種追擊", per: 1, unit: "" },
      ]
    },
    {
      id: "res-23a", name: "催化宗師", color: "orange", floor: 23, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["res-22b", "res-22a"], need: 5 },
      note: "",
      effects: [
        { stat: "催化獲得究極體源獸機率", per: 0.4, unit: "%" },
      ]
    },
    {
      id: "pow-23a", name: "源獸契約", color: "orange", floor: 23, lane: 1, max: 5,
      cost: 6,
      unlock: { from: ["pow-22a"], need: 5 },
      note: "",
      effects: [
        { stat: "源獸協助蝸牛戰鬥造成傷害", per: 2, unit: "%" },
        { stat: "源獸協助部落戰鬥造成傷害", per: 2, unit: "%" },
      ]
    },
    {
      id: "arm-23a", name: "物種霸主", color: "orange", floor: 23, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["arm-22a", "arm-22b"], need: 5 },
      note: "",
      effects: [
        { stat: "物種戰爭部隊傷害減免", per: 1, unit: "%" },
        { stat: "物種戰爭部隊對敵人傷害", per: 1, unit: "%" },
      ]
    },
    {
      id: "red-24a", name: "武道之王", color: "red", floor: 24, lane: null, max: 3,
      costs: { blue: 5, purple: 5, orange: 5 },
      unlock: { from: ["res-23a", "pow-23a", "arm-23a"], need: 5 },
      note: "",
      effects: [
        { stat: "蝸牛生命", per: 2, unit: "%" },
        { stat: "蝸牛攻擊", per: 2, unit: "%" },
        { stat: "蝸牛防禦", per: 2, unit: "%" },
        { stat: "蝸牛追擊", per: 2, unit: "%" },
      ]
    },
    {
      id: "res-25a", name: "神墟勇者", color: "blue", floor: 25, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["red-24a"], need: 3 },
      note: "",
      effects: [
        { stat: "起源密林黑蝌蚪產出速度", per: 3, unit: "%" },
        { stat: "堅磐高地黑蝌蚪產出速度", per: 3, unit: "%" },
        { stat: "幽嵐蘑域黑蝌蚪產出速度", per: 3, unit: "%" },
        { stat: "湮滅火山黑蝌蚪產出速度", per: 3, unit: "%" },
      ]
    },
    {
      id: "pow-25a", name: "致命武力", color: "blue", floor: 25, lane: 1, max: 5,
      cost: 6,
      unlock: { from: ["red-24a"], need: 3 },
      note: "",
      effects: [
        { stat: "蝸牛攻擊", per: 72, unit: "" },
        { stat: "蝸牛防禦", per: 72, unit: "" },
        { stat: "弱點判定成功對敵人傷害", per: 0.5, unit: "%" },
      ]
    },
    {
      id: "arm-25a", name: "領導力", color: "blue", floor: 25, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["red-24a"], need: 3 },
      note: "",
      effects: [
        { stat: "蝸牛領導力", per: 2, unit: "" },
      ]
    },
    {
      id: "res-26b", name: "神墟守望者", color: "orange", floor: 26, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["res-25a"], need: 5 },
      note: "",
      effects: [
        { stat: "起源密林地晶產出速度", per: 3, unit: "%" },
        { stat: "堅磐高地地晶產出速度", per: 3, unit: "%" },
        { stat: "幽嵐蘑域地晶產出速度", per: 3, unit: "%" },
        { stat: "湮滅火山地晶產出速度", per: 3, unit: "%" },
      ]
    },
    {
      id: "res-26a", name: "神墟漫步者", color: "purple", floor: 26, lane: 0, max: 5,
      cost: 6,
      unlock: { from: ["res-25a"], need: 5 },
      note: "",
      effects: [
        { stat: "起源密林紀元寶箱產出速度", per: 3, unit: "%" },
        { stat: "堅磐高地紀元寶箱產出速度", per: 3, unit: "%" },
        { stat: "幽嵐蘑域紀元寶箱產出速度", per: 3, unit: "%" },
        { stat: "湮滅火山紀元寶箱產出速度", per: 3, unit: "%" },
      ]
    },
    {
      id: "pow-26a", name: "破敵先鋒", color: "purple", floor: 26, lane: 1, max: 5,
      cost: 6,
      unlock: { from: ["pow-25a"], need: 5 },
      note: "",
      effects: [
        { stat: "戰鬥首回合對敵人傷害", per: 1.2, unit: "%" },
        { stat: "對敵人傷害", per: 0.6, unit: "%" },
      ]
    },
    {
      id: "arm-26a", name: "防禦指揮", color: "purple", floor: 26, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["arm-25a"], need: 5 },
      note: "",
      effects: [
        { stat: "所有兵種生命", per: 1, unit: "" },
        { stat: "所有兵種防禦", per: 1, unit: "" },
      ]
    },
    {
      id: "arm-26b", name: "戰鬥指揮", color: "orange", floor: 26, lane: 2, max: 5,
      cost: 6,
      unlock: { from: ["arm-25a"], need: 5 },
      note: "",
      effects: [
        { stat: "所有兵種攻擊", per: 1, unit: "" },
        { stat: "所有兵種追擊", per: 1, unit: "" },
      ]
    },
  ]
};
