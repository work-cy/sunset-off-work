import React, { useMemo } from "react";

const hash01 = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

// 海平线上的远山：两座低矮的圆丘，把纵深拉开。
export const Islands = ({ color, width, height, horizonY }) => {
  const y = horizonY * height;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <path
        d={`M ${0.04 * width} ${y} Q ${0.15 * width} ${y - 0.062 * height} ${
          0.29 * width
        } ${y} Z`}
        fill={color}
      />
      <path
        d={`M ${0.7 * width} ${y} Q ${0.79 * width} ${y - 0.042 * height} ${
          0.91 * width
        } ${y} Z`}
        fill={color}
      />
    </svg>
  );
};

// 几只远处的小鸟。翅膀用正弦扇动，整体缓慢向右漂。
export const Birds = ({ color, frame, width, height, count = 6 }) => {
  const birds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const s = i * 11.7 + 5;
        return {
          yNorm: 0.08 + hash01(s + 1) * 0.4,
          xNorm: hash01(s + 2),
          size: 9 + hash01(s + 3) * 11,
          speed: 0.5 + hash01(s + 4) * 0.9,
          phase: hash01(s + 5) * Math.PI * 2,
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
      {birds.map((bird, i) => {
        const xNorm = ((bird.xNorm + frame * bird.speed * 0.00042) % 1.2) - 0.1;
        const cx = xNorm * width;
        const cy = bird.yNorm * height;
        const span = bird.size;
        const flap = Math.sin(frame * 0.11 + bird.phase);
        const lift = span * (0.55 + flap * 0.3);

        // 两只翅膀都向上鼓。中点的抬升量要够大，否则小尺寸下会缩成一根横线。
        return (
          <path
            key={i}
            d={`M ${cx - span} ${cy - lift * 0.18} Q ${cx - span * 0.5} ${
              cy - lift
            } ${cx} ${cy} Q ${cx + span * 0.5} ${cy - lift} ${cx + span} ${
              cy - lift * 0.18
            }`}
            stroke={color}
            strokeWidth={Math.max(1.6, span * 0.15)}
            strokeLinecap="round"
            fill="none"
            opacity={0.75}
          />
        );
      })}
    </svg>
  );
};
