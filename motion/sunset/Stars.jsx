import React, { useMemo } from "react";

// 确定性伪随机：同一帧永远得到同样的星空，渲染才可复现。
const hash01 = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const Stars = ({ opacity, width, height, horizonY, count = 110 }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        cx: hash01(i * 3.17 + 1) * width,
        cy: hash01(i * 7.73 + 2) * horizonY * height,
        r: 0.7 + hash01(i * 5.31 + 3) * 1.7,
        o: 0.3 + hash01(i * 2.91 + 4) * 0.7,
      })),
    [count, height, horizonY, width]
  );

  if (opacity <= 0.002) {
    return null;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#FFFFFF"
          opacity={star.o * opacity}
        />
      ))}
    </svg>
  );
};
