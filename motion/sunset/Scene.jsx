import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GEOMETRY, VIDEO } from "./config.js";
import { buildSceneProps } from "./timeline.js";
import { Stars } from "./Stars.jsx";
import { Sun } from "./Sun.jsx";
import { Swing } from "./Swing.jsx";
import { Plane } from "./Plane.jsx";
import { Clouds } from "./Clouds.jsx";
import { Birds, Islands } from "./Scenery.jsx";
import { Title } from "./Title.jsx";

const { width: W, height: H } = VIDEO;
const HORIZON = GEOMETRY.horizonY * H;

// 海面上那道金色倒影：一串横向光带，越往下越宽越淡。
const Reflection = ({ x, opacity, color }) => {
  const bands = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        return {
          y: HORIZON + (i + 0.5) * (t * 26 + 9),
          w: W * (0.06 + t * 0.46),
          h: 4 + t * 13,
          o: (1 - t) ** 1.7,
        };
      }),
    []
  );

  if (opacity <= 0.01) {
    return null;
  }

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient id="reflectionFalloff" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {bands.map((band, i) => (
        <rect
          key={i}
          x={x - band.w / 2}
          y={band.y}
          width={band.w}
          height={band.h}
          rx={band.h / 2}
          fill="url(#reflectionFalloff)"
          opacity={band.o * opacity}
        />
      ))}
    </svg>
  );
};

export const SunsetScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const props = buildSceneProps({ frame, fps });
  const { sun, swing, plane, reflection, starsOpacity, clouds } = props;

  const planeX = plane.x * W;
  const planeY = plane.y * H;

  return (
    <div style={{ position: "absolute", inset: 0, background: props.skyGradient }}>
      <Stars
        opacity={starsOpacity}
        width={W}
        height={H}
        horizonY={GEOMETRY.horizonY}
      />

      {/* 云与远山：都在海平线之上 */}
      <Clouds
        frame={frame}
        width={W}
        height={H}
        horizonY={GEOMETRY.horizonY}
        light={clouds.light}
        dark={clouds.dark}
      />
      <Islands
        color={props.sceneryColor}
        width={W}
        height={H}
        horizonY={GEOMETRY.horizonY}
      />
      <Birds
        color={props.birdColor}
        frame={frame}
        width={W}
        height={H}
      />

      {/* 海面 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: HORIZON,
          bottom: 0,
          background: props.seaGradient,
        }}
      />

      <Reflection
        x={reflection.x * W}
        opacity={reflection.opacity}
        color={reflection.color}
      />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <Sun
          cx={sun.x * W}
          cy={sun.y * H}
          rx={sun.radiusX * W}
          ry={sun.radiusY * H}
          armsUp={sun.armsUp}
          frame={frame}
          rayOpacity={props.rayOpacity}
          clipY={HORIZON}
        />
        <Swing
          planeX={planeX}
          planeY={planeY}
          seatX={swing.seatX * W}
          seatY={swing.seatY * H}
          seatWidth={GEOMETRY.seatWidth * W}
          opacity={swing.planeOpacity}
          scale={W}
        />
        <Plane
          x={planeX}
          y={planeY}
          wingspan={GEOMETRY.planeWingspan * W}
          opacity={plane.opacity}
          speed={plane.speed}
        />
      </svg>

      <Title opacity={props.titleOpacity} height={H} />
    </div>
  );
};
