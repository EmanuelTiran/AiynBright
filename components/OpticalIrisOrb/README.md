# AyinBright optical iris

`OpticalIrisOrb` is a decorative client enhancement. Its `focused` prop controls
the small optical focus response. An optional stable `interactionRef` lets a
surrounding hero provide pointer coordinates. Without one, the component tracks
its own bounds. The parent controls the canvas size and the scene frames the
eye and floor within those bounds.

The scene is imported only near the viewport. All geometry, iris coloration,
fiber relief, and studio reflections are generated locally. There are no image
textures, external models, environment downloads, or post-processing passes.

- A curved annulus carries a procedural physical iris material.
- Two separately modeled fiber layers and shorter branching filaments provide
  relief and parallax. Their extents are tested against the enclosing lens.
- A capped pupil well is attached to the iris opening; a closed opaque ellipsoid
  backs the entire assembly. The smaller pupil leads the iris during gaze, while
  the shell barely moves. Exposed interior stays dark at the bounded gaze angles.
- One slightly elongated, transmissive glass dome uses IOR 1.46, thickness
  0.13, low roughness, and a prefiltered dark studio with six rounded softboxes.
  Curvature-dependent cool and warm highlights are part of the dome material;
  the iris and fibers remain visible through it.
- A glossy black inner lens sits in the recessed cavity. It has a deliberately
  weak specular response to avoid duplicating the outer glass reflections.
- The floor reflects the internal eye through Three.js's bundled `Reflector`.
  The glass is omitted from that capture so its broad highlight cannot become
  a grey mirrored sphere. Nine blurred samples widen with distance and a separate
  blue/amber caustic shader adds contact light.
  Reflection updates are limited to 12.5 fps desktop / 8 fps mobile, at 512 / 256
  pixels. Reduced-motion and resize renders explicitly refresh the reflection.
- The muted CSS mark is only the loading/WebGL fallback, never the live scene.

The renderer owns its resources and disposes them on unmount, including failed
initialization. Context loss restores the fallback; a restored context resumes
the scene. Offscreen and hidden tabs have no pending animation frame. Reduced
motion renders on demand (initialization, resize, visibility, and CTA state).
Pointer events are passive and touch gestures remain native page scrolling.

Mobile/low-core devices use fewer segments/fibers, DPR <= 1.25, 65%-resolution
transmission, and a 30 fps cap. Desktop DPR is capped at 1.75. Sustained slow draws
lower DPR by up to 0.5. No real-time shadows or bloom are used.

Validation: `node --test tests/optical-iris.test.mjs`, `npm run lint`,
`npm run build`, and the existing project test scripts. Browser review should
cover the full desktop composition, 760px breakpoint, narrow phones, CTA keyboard
focus, reduced motion, unavailable WebGL, context loss/restore, scrolling out of
view, and repeated client navigation away/back.
