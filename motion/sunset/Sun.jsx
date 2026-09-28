import React from "react";
import { SUN_COLORS } from "./config.js";

const lerp = (a, b, t) => a + (b - a) * t;

export const Sun = ({ cx, cy, rx, ry, armsUp }) => {
  // 手臂从下垂抬到抓绳子。绳子在这个高度大约落在 ±1.02rx 处，
  // 所以手要伸到日面轮廓之外一点，才像真的抓住了绳。
  const armFrom = { x: rx * 0.9, y: ry * 0.58 };
  const armTo = { x: rx * 1.0, y: -ry * 0.3 };
  const handX = lerp(armFrom.x, armTo.x, armsUp);
  const handY = lerp(armFrom.y, armTo.y, armsUp);

  const faceOpacity = Math.min(1, armsUp * 1.7);
  const stroke = rx * 0.082;

  return (
    <g>
      <defs>
        <linearGradient id="sunBody" x1="0.15" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={SUN_COLORS.top} />
          <stop offset="52%" stopColor={SUN_COLORS.mid} />
          <stop offset="100%" stopColor={SUN_COLORS.bottom} />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor={SUN_COLORS.glow} stopOpacity="0.5" />
          <stop offset="45%" stopColor={SUN_COLORS.glow} stopOpacity="0.16" />
          <stop offset="100%" stopColor={SUN_COLORS.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={rx * 3.2} fill="url(#sunGlow)" />

      {/* 腿。画在日面之前，才能垂到座椅下方露出来。 */}
      <g
        stroke={SUN_COLORS.face}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        opacity={faceOpacity}
      >
        <path
          d={`M ${cx - rx * 0.31} ${cy + ry * 0.88} L ${cx - rx * 0.37} ${
            cy + ry * 1.78
          }`}
        />
        <path
          d={`M ${cx + rx * 0.31} ${cy + ry * 0.88} L ${cx + rx * 0.37} ${
            cy + ry * 1.78
          }`}
        />
      </g>

      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#sunBody)" />

      <g opacity={faceOpacity}>
        {/* 眼睛 */}
        <ellipse
          cx={cx - rx * 0.31}
          cy={cy - ry * 0.06}
          rx={rx * 0.093}
          ry={ry * 0.125}
          fill={SUN_COLORS.face}
        />
        <ellipse
          cx={cx + rx * 0.31}
          cy={cy - ry * 0.06}
          rx={rx * 0.093}
          ry={ry * 0.125}
          fill={SUN_COLORS.face}
        />
        {/* 微笑 */}
        <path
          d={`M ${cx - rx * 0.17} ${cy + ry * 0.25} Q ${cx} ${cy + ry * 0.46} ${
            cx + rx * 0.17
          } ${cy + ry * 0.25}`}
          stroke={SUN_COLORS.face}
          strokeWidth={stroke * 0.85}
          strokeLinecap="round"
          fill="none"
        />
        {/* 手臂 */}
        <path
          d={`M ${cx - rx * 0.78} ${cy + ry * 0.16} Q ${
            cx - rx * 0.98
          } ${cy + lerp(ry * 0.55, ry * 0.02, armsUp)} ${cx - handX} ${
            cy + handY
          }`}
          stroke={SUN_COLORS.face}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${cx + rx * 0.78} ${cy + ry * 0.16} Q ${
            cx + rx * 0.98
          } ${cy + lerp(ry * 0.55, ry * 0.02, armsUp)} ${cx + handX} ${
            cy + handY
          }`}
          stroke={SUN_COLORS.face}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </g>
  );
};
