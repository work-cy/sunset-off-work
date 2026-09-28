import React from "react";
import { Composition } from "remotion";
import { SunsetScene } from "../motion/sunset/Scene.jsx";
import { VIDEO } from "../motion/sunset/config.js";

export const Root = () => (
  <Composition
    id="Sunset30fps"
    component={SunsetScene}
    durationInFrames={VIDEO.durationInSeconds * VIDEO.fps}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
