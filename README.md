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
  Clouds.jsx         drifting cloud bands, tinted by altitude and time of day
  Scenery.jsx        horizon islands + flapping birds
  Sun.jsx            the sun — gradient body, face, arms, legs, light rays
  Swing.jsx          ropes + seat
  Plane.jsx          plane silhouette + contrails
  Title.jsx          the end title card
```

### Beyond the reference

The reference is a deliberately minimal illustration. This build keeps its composition and
palette but adds layers to fill the frame out:

- **Clouds** — six overlapping ellipse lobes each, drifting right on a per-cloud speed and
  tinted from `light` to `dark` by altitude, so low clouds catch the sunset and high ones
  sink into the dusk
- **Horizon islands** — two low silhouettes that give the sea a far shore and pull depth
  into the frame
- **Birds** — six silhouettes with sine-driven wing flaps, drifting slowly across
- **Light rays** — rotating wedges fading outward from the sun, clipped to the sky. Without
  the clip the downward rays sweep across the sea and the effect reads as a hard sunburst
  instead of atmospheric haze
- **Title card** — 「太阳下班」/ THE SUN CLOCKS OFF, fading up as the night comes in

The CJK stack lists Chinese-capable families **first**. Put a Latin-only font at the front
and the browser's fallback can render the glyphs with a wrong-looking background and a much
weaker glow.

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
