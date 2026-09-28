# 太阳下班 / The Sun Clocks Off

A 28-second animated short rebuilt in [Remotion](https://remotion.dev) — recreated from a
reference motion piece.

The sun has finished its shift. A plane descends trailing contrails, lowers a swing, and the
sun — with a face, arms, and dangling legs — climbs aboard and is towed up and away. Night
falls, and the stars come out.

- **1080 × 1440** (3:4 vertical), **30 fps**, **28 s** (840 frames)
- Pure vector: every element is drawn from a deterministic function of the current frame
- No raster assets, no audio, no external data

## Running it

```bash
pnpm install
pnpm dev                 # Remotion Studio — scrub the timeline live
pnpm run render          # → out/sunset-off-work.mp4  (H.264)
pnpm run render:alpha    # → out/sunset-off-work.mov  (ProRes 4444, transparent)
pnpm exec remotion still Sunset30fps out/frame.png --frame=280
```

The composition id is `Sunset30fps`.

## How it is built

```
remotion/
  index.jsx          registerRoot
  Root.jsx           <Composition> registration
  styles.css
motion/sunset/
  config.js          palette, geometry, sky/sea gradient keyframes
  timeline.js        the whole animation: phase table + per-frame state
  Scene.jsx          layer composition, sky/sea gradients, sea reflection
  Stars.jsx          deterministic starfield
  Sun.jsx            the sun — gradient body, face, arms, legs
  Swing.jsx          ropes + seat
  Plane.jsx          plane silhouette + contrails
```

### Everything is `f(frame)`

Remotion renders frames in parallel and out of order, so no state may carry between frames.
There is no accumulation, no `Math.random()`, and no `Date.now()` anywhere in the scene.
Even the starfield is seeded from a hash of the star index, so frame 720 is identical no
matter what order it is rendered in.

### The timeline

`timeline.js` holds a phase table in **seconds**, converted to frames at the composition's
fps, so changing the frame rate changes sampling density without changing the pacing:

| seconds | beat |
| --- | --- |
| 0–2 | empty sunset — the sun half-set on the horizon |
| 2–7 | the plane descends, trailing contrails, lowering the swing |
| 7–10 | the sun climbs onto the seat (with anticipation and a little overshoot) |
| 10–17 | the lift begins |
| 17–24 | the plane accelerates up and to the right, towing the sun off-screen |
| 22–28 | night falls and the stars fade in |

### Colour

The sky and sea are gradient keyframes interpolated over the timeline. The offsets are in
canvas coordinates and were sampled directly from the reference footage — the sunset gradient
matches the original within a few units per channel.

Note that the sea sits in its own element starting at the horizon, so its gradient stops are
remapped from canvas space into that element's space before being written as CSS. Without
that remap the sea gradient is silently stretched.

## Licence / provenance

This is an independent code recreation made for study, built by measuring the reference
video's composition, palette, and timing. It contains no assets from the original — every
shape is drawn from scratch in SVG/CSS.

"太阳下班" as a concept belongs to its original creator.
