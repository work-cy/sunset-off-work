import React from "react";
import { SUN_COLORS } from "./config.js";

const lerp = (a, b, t) => a + (b - a) * t;

export const Sun = ({ cx, cy, rx, ry, armsUp, frame, rayOpacity, clipY }) => {
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
        {/* 光柱：从日心向外渐隐。objectBoundingBox 空间会随元素一起旋转，
            所以每根楔子都用自己的包围盒，方向自然对齐。 */}
        <linearGradient id="rayFade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={SUN_COLORS.glow} stopOpacity="0.42" />
          <stop offset="30%" stopColor={SUN_COLORS.glow} stopOpacity="0.1" />
          <stop offset="100%" stopColor={SUN_COLORS.glow} stopOpacity="0" />
        </linearGradient>
        {/* 光柱只该出现在天上。不做裁剪的话向下的那些会扫过海面，
            变成一圈硬邦邦的放射线。 */}
        <clipPath id="skyOnly">
          <rect x={-3000} y={-3000} width={6000} height={clipY + 3000} />
        </clipPath>
      </defs>

      {rayOpacity > 0.004 ? (
        <g clipPath="url(#skyOnly)" opacity={rayOpacity}>
          {Array.from({ length: 14 }, (_, i) => {
            const halfWidth = rx * (0.04 + (i % 3) * 0.018);
            const length = rx * (4 + (i % 4) * 1.3);
            return (
              <path
                key={i}
                d={`M ${cx - halfWidth} ${cy} L ${cx} ${cy - length} L ${
                  cx + halfWidth
                } ${cy} Z`}
                fill="url(#rayFade)"
                transform={`rotate(${(i / 14) * 360 + frame * 0.035} ${cx} ${cy})`}
              />
            );
          })}
        </g>
      ) : null}

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
