export const VIDEO = Object.freeze({
  width: 1080,
  height: 1440,
  fps: 30,
  durationInSeconds: 28,
});

// 画布几何，全部用 0–1 归一化，换分辨率不用改。
export const GEOMETRY = Object.freeze({
  horizonY: 0.76,
  // 日落时太阳半沉：圆心几乎贴着海平线
  sunRestY: 0.755,
  // 半径分两个轴写：x 按画面宽、y 按画面高，否则竖幅下太阳会被拉扁。
  sunRadiusX: 0.065,
  sunRadiusY: 0.04875,
  planeWingspan: 0.075,
  seatWidth: 0.145,
  seatHeight: 0.012,
  ropeLength: 0.475,
  limbWidth: 0.0055,
});

// 太阳。取样自参考视频：顶部金 → 中部橙 → 底部红橙。
export const SUN_COLORS = Object.freeze({
  top: "#F9D05C",
  mid: "#F0A32E",
  bottom: "#D2552A",
  glow: "#F7A83C",
  face: "#1A1819",
});

export const PLANE_COLORS = Object.freeze({
  body: "#4F5869",
  contrail: "#FFFFFF",
});

// 天空渐变随时间的四组关键色，之间线性插值。
// 前三组差别很小（日落持续很久），最后一组是入夜，变化极快。
// 每条是 [位置, 色值]，位置是占画面高度的比例。
export const SKY_KEYFRAMES = Object.freeze([
  {
    at: 0,
    stops: [
      [0.0, "#F49A17"],
      [0.28, "#E48A2E"],
      [0.5, "#BD6E50"],
      [0.65, "#84616B"],
      [0.76, "#6E5A72"],
    ],
  },
  {
    at: 0.68,
    stops: [
      [0.0, "#EE9520"],
      [0.28, "#DE8430"],
      [0.5, "#B56648"],
      [0.65, "#805D6C"],
      [0.76, "#6A586E"],
    ],
  },
  {
    at: 0.88,
    stops: [
      [0.0, "#6B3F20"],
      [0.28, "#573832"],
      [0.5, "#42344A"],
      [0.65, "#2C2743"],
      [0.76, "#211E37"],
    ],
  },
  {
    at: 1,
    stops: [
      [0.0, "#0D1826"],
      [0.28, "#0C1626"],
      [0.5, "#0C1627"],
      [0.65, "#111928"],
      [0.76, "#131B28"],
    ],
  },
]);

// 海面的色标同样用画布绝对坐标写，转 CSS 时再按海面 div 的高度重新映射。
export const SEA_KEYFRAMES = Object.freeze([
  {
    at: 0,
    stops: [
      [0.76, "#6E6A78"],
      [0.86, "#505769"],
      [1.0, "#2A4055"],
    ],
  },
  {
    at: 0.68,
    stops: [
      [0.76, "#6A6474"],
      [0.86, "#4C5364"],
      [1.0, "#263A4E"],
    ],
  },
  {
    at: 0.88,
    stops: [
      [0.76, "#3A3A4C"],
      [0.86, "#2A3040"],
      [1.0, "#1A2432"],
    ],
  },
  {
    at: 1,
    stops: [
      [0.76, "#131E29"],
      [0.86, "#0A1828"],
      [1.0, "#0A1926"],
    ],
  },
]);

// 海面上那道金色倒影。太阳被吊走之后就没了。
export const REFLECTION = Object.freeze({
  color: "#E8A24A",
  peakOpacity: 0.72,
});

// 云：靠近海平线的受光偏暖，高处的偏冷，两者随时间一起沉下去。
export const CLOUD_KEYFRAMES = Object.freeze([
  { at: 0, light: "#F7BE72", dark: "#B06A70" },
  { at: 0.68, light: "#F2B264", dark: "#A66268" },
  { at: 0.88, light: "#5E3C3C", dark: "#3A2F48" },
  { at: 1, light: "#16202E", dark: "#0E1726" },
]);

// 海平线上的远山剪影，比天空略深一档，负责把纵深拉开。
export const SCENERY_KEYFRAMES = Object.freeze([
  { at: 0, color: "#7A6280" },
  { at: 0.68, color: "#745C7C" },
  { at: 0.88, color: "#272244" },
  { at: 1, color: "#0D1722" },
]);

export const BIRD_COLOR = "#3A2F44";

export const TITLE = Object.freeze({
  main: "太阳下班",
  sub: "THE SUN CLOCKS OFF",
  // 太阳被拖走之后标题才浮出来
  startSeconds: 23.2,
  fadeSeconds: 1.8,
  y: 0.38,
});
