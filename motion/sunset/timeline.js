import { GEOMETRY, REFLECTION, SEA_KEYFRAMES, SKY_KEYFRAMES } from "./config.js";

// 相位以秒标注，再按实际 fps 换算。改 fps 不会改变节奏。
const PHASES = Object.freeze({
  establishEnd: 2,
  descendEnd: 7,
  boardEnd: 10,
  liftEnd: 17,
  departEnd: 24,
  nightStart: 22,
  total: 28,
});

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;

const smoothstep = (t) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

const easeOutCubic = (t) => 1 - (1 - clamp01(t)) ** 3;
const easeInCubic = (t) => clamp01(t) ** 3;

const seg = (frame, from, to) => clamp01((frame - from) / Math.max(1, to - from));

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const lerpColor = (from, to, t) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return `rgb(${Math.round(lerp(a[0], b[0], t))}, ${Math.round(
    lerp(a[1], b[1], t)
  )}, ${Math.round(lerp(a[2], b[2], t))})`;
};

// 在时间轴上取一组渐变关键色并插值。
const sampleStops = (keyframes, progress) => {
  let index = 0;
  while (index < keyframes.length - 2 && progress > keyframes[index + 1].at) {
    index += 1;
  }

  const a = keyframes[index];
  const b = keyframes[index + 1] ?? a;
  const span = b.at - a.at;
  const t = span <= 0 ? 0 : clamp01((progress - a.at) / span);

  return a.stops.map(([offset, color], i) => [
    offset,
    lerpColor(color, b.stops[i][1], t),
  ]);
};

const toCssGradient = (stops, angle) =>
  `linear-gradient(${angle}, ${stops
    .map(([offset, color]) => `${color} ${(offset * 100).toFixed(2)}%`)
    .join(", ")})`;

// 天空的色标覆盖整幅画面，可以直接用；海面那个 div 只占海平线以下的部分，
// 所以要把画布坐标重新映射到 div 内部坐标，否则渐变会被整体拉长。
const toSeaGradient = (stops) => {
  const span = 1 - GEOMETRY.horizonY;
  return toCssGradient(
    stops.map(([offset, color]) => [(offset - GEOMETRY.horizonY) / span, color]),
    "to bottom"
  );
};

export const resolveTimeline = (fps) => {
  const at = (seconds) => Math.round(seconds * fps);
  return {
    fps,
    establishEnd: at(PHASES.establishEnd),
    descendEnd: at(PHASES.descendEnd),
    boardEnd: at(PHASES.boardEnd),
    liftEnd: at(PHASES.liftEnd),
    departEnd: at(PHASES.departEnd),
    nightStart: at(PHASES.nightStart),
    total: at(PHASES.total),
  };
};

// 飞机在画面里的归一化位置。t=0 时还在画面上方之外。
const planeAt = (frame, timeline) => {
  const { descendEnd, boardEnd, departEnd } = timeline;

  let x = 0.5;
  if (frame > boardEnd) {
    // 起飞后才开始横向移动，且越走越快
    const t = easeInCubic(seg(frame, boardEnd, departEnd));
    x = lerp(0.5, 1.25, t);
  }

  let y;
  if (frame <= timeline.establishEnd) {
    y = -0.1;
  } else if (frame <= descendEnd) {
    // 下降：先快后慢，像在稳住高度
    y = lerp(-0.1, 0.205, easeOutCubic(seg(frame, timeline.establishEnd, descendEnd)));
  } else if (frame <= boardEnd) {
    y = 0.205;
  } else if (frame <= timeline.liftEnd) {
    y = lerp(0.205, 0.185, smoothstep(seg(frame, boardEnd, timeline.liftEnd)));
  } else {
    // 拉升出画
    y = lerp(0.185, -0.14, easeInCubic(seg(frame, timeline.liftEnd, departEnd)));
  }

  return { x, y };
};

export const buildSceneProps = ({ frame, fps }) => {
  const timeline = resolveTimeline(fps);
  const lastFrame = Math.max(1, timeline.total - 1);
  const bounded = Math.min(Math.max(0, Math.floor(frame)), lastFrame);
  const progress = bounded / lastFrame;

  const plane = planeAt(bounded, timeline);
  // 横向速度用中心差分取。座椅滞后于飞机，这个滞后就是「荡」的来源。
  const ahead = planeAt(bounded + 1, timeline);
  const behind = planeAt(bounded - 1, timeline);
  const planeVelocityX = (ahead.x - behind.x) / 2;
  const planeSpeed = Math.hypot(ahead.x - behind.x, ahead.y - behind.y) / 2;

  const seatY = plane.y + GEOMETRY.ropeLength;
  const swingLag = Math.min(0.13, Math.max(0, planeVelocityX * 5.5));

  // 就位前太阳沉在海平线上；就位时爬上座椅，屁股贴着座面。
  const boardT = smoothstep(seg(bounded, timeline.descendEnd, timeline.boardEnd));
  const seatedSunY = seatY - GEOMETRY.sunRadiusY * 0.92;
  const sunY = lerp(GEOMETRY.sunRestY, seatedSunY, boardT);

  // 攀爬时先微蹲再起跳，起跳带一点过冲
  const anticipation =
    -0.018 * Math.sin(Math.PI * clamp01(seg(bounded, timeline.descendEnd, timeline.descendEnd + 18)));
  const overshoot =
    0.014 *
    Math.sin(Math.PI * clamp01(seg(bounded, timeline.descendEnd + 30, timeline.boardEnd)));
  const sunYFinal = sunY + (boardT > 0 && boardT < 1 ? anticipation + overshoot : 0);

  const seatX = plane.x - swingLag;
  const sunX = seatX;

  const boarding = boardT > 0.05;
  const planeOpacity = bounded < timeline.establishEnd ? 0 : 1;

  const starsOpacity = smoothstep(seg(bounded, timeline.nightStart, timeline.total - 1));

  // 倒影只在太阳还贴着海平面时存在
  const reflectionOpacity =
    REFLECTION.peakOpacity * (1 - smoothstep(seg(bounded, timeline.boardEnd, timeline.departEnd)));

  return {
    frame: bounded,
    progress,
    timeline,
    skyGradient: toCssGradient(sampleStops(SKY_KEYFRAMES, progress), "to bottom"),
    seaGradient: toSeaGradient(sampleStops(SEA_KEYFRAMES, progress)),
    starsOpacity,
    reflection: {
      opacity: reflectionOpacity,
      color: REFLECTION.color,
      x: sunX,
    },
    sun: {
      x: sunX,
      y: sunYFinal,
      radiusX: GEOMETRY.sunRadiusX,
      radiusY: GEOMETRY.sunRadiusY,
      boarding,
      // 爬上座椅后手臂才抬起来抓绳子
      armsUp: boardT,
    },
    swing: {
      planeX: plane.x,
      planeY: plane.y,
      seatX,
      seatY: plane.y + GEOMETRY.ropeLength,
      planeOpacity,
    },
    plane: {
      x: plane.x,
      y: plane.y,
      opacity: planeOpacity,
      speed: planeSpeed,
    },
  };
};
