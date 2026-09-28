import React from "react";
import { PLANE_COLORS } from "./config.js";

// 机头朝右。形状用一套局部坐标（机身长约 1），再整体缩放到 wingspan。
const FUSELAGE = [
  [0.5, 0.0],
  [0.36, -0.052],
  [-0.34, -0.07],
  [-0.5, -0.028],
  [-0.42, 0.046],
  [0.16, 0.076],
  [0.4, 0.044],
];

const WING = [
  [0.14, 0.028],
  [-0.3, 0.3],
  [-0.48, 0.28],
  [-0.12, 0.018],
];

const TAIL = [
  [-0.2, -0.062],
  [-0.4, -0.32],
  [-0.52, -0.31],
  [-0.46, -0.052],
];

const toPath = (points, scale, cx, cy) =>
  points
    .map(
      ([x, y], i) =>
        `${i === 0 ? "M" : "L"} ${(cx + x * scale).toFixed(2)} ${(
          cy +
          y * scale
        ).toFixed(2)}`
    )
    .join(" ") + " Z";

export const Plane = ({ x, y, wingspan, opacity, speed }) => {
  // 尾迹：飞机一出现就有，随速度变长。参考片里下降阶段也已经拖着两条尾迹。
  const trail = 0.45 + 0.55 * Math.min(1, speed * 60);
  const trailLength = wingspan * (0.9 + trail * 3.2);

  return (
    <g opacity={opacity}>
      {trail > 0.02 ? (
        <g
          stroke={PLANE_COLORS.contrail}
          strokeWidth={wingspan * 0.035}
          strokeLinecap="round"
          opacity={0.42 * trail}
        >
          <line
            x1={x - wingspan * 0.45}
            y1={y - wingspan * 0.045}
            x2={x - trailLength}
            y2={y - wingspan * 0.045}
          />
          <line
            x1={x - wingspan * 0.45}
            y1={y + wingspan * 0.03}
            x2={x - trailLength}
            y2={y + wingspan * 0.03}
          />
        </g>
      ) : null}

      <path d={toPath(FUSELAGE, wingspan, x, y)} fill={PLANE_COLORS.body} />
      <path d={toPath(WING, wingspan, x, y)} fill={PLANE_COLORS.body} />
      <path d={toPath(TAIL, wingspan, x, y)} fill={PLANE_COLORS.body} />
    </g>
  );
};
