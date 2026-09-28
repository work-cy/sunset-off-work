import React, { useMemo } from "react";

const hash01 = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

const parseRgb = (value) => value.match(/\d+/g).map(Number);

const mixRgb = (from, to, t) => {
  const a = parseRgb(from);
  const b = parseRgb(to);
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(
    a[1] + (b[1] - a[1]) * t
  )}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
};

export const Clouds = ({
  frame,
  width,
  height,
  horizonY,
  light,
  dark,
  count = 11,
}) => {
  const clouds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const s = i * 7.31 + 3;
        return {
          yNorm: 0.05 + hash01(s + 1) * 0.52,
          xNorm: hash01(s + 2) * 1.35 - 0.175,
          w: 0.16 + hash01(s + 3) * 0.32,
          h: 0.013 + hash01(s + 4) * 0.021,
          o: 0.18 + hash01(s + 5) * 0.3,
          speed: 0.25 + hash01(s + 6) * 0.7,
        };
      }),
    [count]
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      {clouds.map((cloud, i) => {
        // 缓慢向右飘，飘出画面后从左侧绕回来
        const xNorm = ((cloud.xNorm + frame * cloud.speed * 0.0006) % 1.35) - 0.175;
        const cx = xNorm * width;
        const cy = cloud.yNorm * horizonY * height;
        const w = cloud.w * width;
        const h = cloud.h * height;
        // 越靠近海平线越受光，越高越沉
        const fill = mixRgb(light, dark, Math.min(1, cloud.yNorm / 0.55));

        return (
          <g key={i} fill={fill} opacity={cloud.o}>
            <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} />
            <ellipse cx={cx - w * 0.22} cy={cy + h * 0.2} rx={w * 0.3} ry={h * 0.64} />
            <ellipse cx={cx + w * 0.26} cy={cy + h * 0.14} rx={w * 0.26} ry={h * 0.72} />
          </g>
        );
      })}
    </svg>
  );
};
