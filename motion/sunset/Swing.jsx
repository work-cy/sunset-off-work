import React from "react";
import { GEOMETRY } from "./config.js";

const ROPE_COLOR = "#F2EDE4";

// 两根绳从飞机腹部垂下，末端挂一块细长的座板。
// 绳长固定，飞机上升时整个秋千跟着抬起来。
export const Swing = ({ planeX, planeY, seatX, seatY, seatWidth, opacity, scale }) => {
  const ropeGap = GEOMETRY.ropeLength * 0.03;
  const halfSeat = seatWidth / 2;
  const seatH = GEOMETRY.seatHeight * scale;

  // 座板略微倾斜，做出一点透视
  const tilt = -0.012 * scale;

  return (
    <g opacity={opacity}>
      <g stroke={ROPE_COLOR} strokeWidth={scale * 0.0022} strokeLinecap="round">
        <line
          x1={planeX - ropeGap}
          y1={planeY}
          x2={seatX - halfSeat}
          y2={seatY}
        />
        <line
          x1={planeX + ropeGap}
          y1={planeY}
          x2={seatX + halfSeat}
          y2={seatY}
        />
      </g>

      {/* 座板：细长的空心平行四边形 */}
      <polygon
        points={[
          `${seatX - halfSeat},${seatY}`,
          `${seatX + halfSeat},${seatY}`,
          `${seatX + halfSeat + tilt},${seatY + seatH}`,
          `${seatX - halfSeat + tilt},${seatY + seatH}`,
        ].join(" ")}
        fill="none"
        stroke={ROPE_COLOR}
        strokeWidth={scale * 0.0026}
        strokeLinejoin="round"
      />
    </g>
  );
};
