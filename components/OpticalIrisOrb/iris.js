import * as THREE from "three";

export const IRIS_INNER_RADIUS = .445;
export const IRIS_OUTER_RADIUS = 1.43;

// A continuous spectrum in the same orientation as the AyinBright mark:
// amber upper-right, green at the crown, cyan left, violet below, red right.
export const spectralGLSL = /* glsl */ `
  vec3 spectrum(float a) {
    float h = fract(a / 6.2831853 + 0.045);
    vec3 c = clamp(abs(fract(h + vec3(0., .666667, .333333)) * 6. - 3.) - 1., 0., 1.);
    c = c * c * (3. - 2. * c);
    return mix(vec3(.015, .032, .06), c, .93);
  }
  float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  float noise1(float n) {
    float i = floor(n), f = fract(n);
    return mix(hash(i), hash(i + 1.), f * f * (3. - 2. * f));
  }
  float noise2(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3. - 2. * f);
    float n = dot(i, vec2(127.1, 311.7));
    return mix(mix(hash(n), hash(n + 127.1), f.x),
               mix(hash(n + 311.7), hash(n + 438.8), f.x), f.y);
  }
`;

export function irisDepth(t) {
  return .42 + .38 * Math.sin(Math.PI * t) - .12 * t;
}

/** A bowl-shaped annulus, with the opening sunk below the middle of the iris. */
export function createIrisGeometry(segments, rings = 36) {
  const positions = [], uvs = [], indices = [];
  for (let j = 0; j <= rings; j++) {
    const t = j / rings, r = IRIS_INNER_RADIUS + (IRIS_OUTER_RADIUS - IRIS_INNER_RADIUS) * t;
    for (let i = 0; i <= segments; i++) {
      const a = i / segments * Math.PI * 2;
      const relief = .017 * (Math.sin(a * 71 + t * 9) + .4 * Math.sin(a * 113 - t * 18)) * Math.sin(Math.PI * t);
      positions.push(r * Math.cos(a), r * Math.sin(a), irisDepth(t) + relief);
      uvs.push(i / segments, t);
      if (i < segments && j < rings) {
        const k = j * (segments + 1) + i;
        indices.push(k, k + 1, k + segments + 1, k + 1, k + segments + 2, k + segments + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createIrisMaterial(uniforms) {
  const material = new THREE.MeshPhysicalMaterial({
    color: "#ffffff", metalness: .10, roughness: .36,
    clearcoat: .44, clearcoatRoughness: .20, envMapIntensity: .32,
    // Keep the iris in the opaque prepass so the front glass refracts its
    // color and depth; the shader below supplies its internal light.
    transmission: 0,
    side: THREE.DoubleSide,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.time;
    shader.uniforms.uFocus = uniforms.focus;
    shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vIrisUv;")
      .replace("#include <uv_vertex>", "#include <uv_vertex>\nvIrisUv = uv;");
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `#include <common>
      varying vec2 vIrisUv;
      uniform float uTime;
      uniform float uFocus;
      ${spectralGLSL}
    `).replace("#include <color_fragment>", /* glsl */ `
      #include <color_fragment>
      float a = vIrisUv.x * 6.2831853;
      float r = vIrisUv.y;
      // Nonuniform bundles, finer branching strands, and broken radial lengths.
      // Integer angular frequencies keep the seam continuous.
      // Cylindrical noise keeps the seam closed and disrupts clean rainbow wedges.
      vec2 domain = vec2(cos(a), sin(a)) * (3. + r * 1.7);
      float cloud = noise2(domain * 1.6) * .65 + noise2(domain * 4.7 + r * 3.) * .35;
      float mottling = noise2(domain * 9. + vec2(r * 7., -r * 13.));
      float bend = sin(r * 17. + sin(a * 13.) * 2.) * .85 + sin(r * 39. - a * 7.) * .18 + cloud * 2.6;
      float bundle = sin(a * 293. + bend * 2. + sin(a * 43.) * 3.);
      float fine = pow(.5 + .5 * sin(a * 757. + bend * 3. + sin(r * 31. + a * 29.)), 19.);
      float needles = pow(.5 + .5 * sin(a * 1217. + bend * 4.2 + sin(r * 57. - a * 19.)), 29.);
      float grain = noise1(r * 137. + sin(a * 97.) * 24.);
      float broken = noise1(r * 38. + sin(a * 51.) * 18.);
      float channels = smoothstep(.54, .88, noise1(sin(a * 67.) * 21. + r * 2.));
      float darkRays = smoothstep(.68, .93, noise1(sin(a * 113.) * 29. + r * 5.));
      float fibers = max(.068, .118 + .09 * bundle + .43 * fine * (.2 + broken) + .20 * needles * (.32 + grain) + .12 * grain);
      fibers *= (1. - channels * .56) * (1. - darkRays * (.28 + .16 * r));
      float crypt = smoothstep(.005, .14, r + .025 * sin(a * 53.));
      float outer = 1. - .82 * smoothstep(.80, 1., r);
      float collarette = exp(-pow((r - .17 - .025 * sin(a * 29.) - .012 * sin(a * 71.)) * 38., 2.));
      // The geography follows the brand/reference but its boundaries wander
      // through the fiber bundles instead of forming equal color wedges.
      float geographyWarp = .16 * sin(a - .55) + .055 * sin(a * 2. + 1.1);
      vec3 spectral = spectrum(a + geographyWarp + .27 * (cloud - .5) + .10 * sin(r * 7. + a * 3.));
      spectral = mix(spectral, spectrum(a + .32), mottling * .18);
      spectral = mix(vec3(dot(spectral, vec3(.2126, .7152, .0722))), spectral, .84 + .16 * cloud);
      spectral *= .82 + .18 * smoothstep(-.9, .7, sin(a));
      float pupilShadow = mix(.28, 1., smoothstep(.025, .21, r));
      vec3 iris = spectral * fibers * outer * mix(.055, 1., crypt) * pupilShadow * (.68 + cloud * .68);
      iris += spectrum(a + .18) * collarette * (.08 + .12 * grain);
      float caustic = pow(.5 + .5 * sin(a * 3. + r * 12. - uTime * .08), 18.) * .12;
      float irisRelief = .00064 * grain + .00030 * fine + .00055 * cloud;
      diffuseColor.rgb = iris * (1.23 + uFocus * .08);
      // Light lives inside the fibers. Keep the pupil shadow and dark channels
      // while giving the lower spectrum enough energy to appear in the floor.
      float transmittedLight = .105 + fine * .36 * broken + needles * .22 + caustic * 1.20;
      totalEmissiveRadiance += spectral * transmittedLight * (1. - channels * .62) * outer * crypt * pupilShadow;
    `).replace("#include <normal_fragment_maps>", /* glsl */ `
      #include <normal_fragment_maps>
      vec3 irisDx = dFdx(-vViewPosition), irisDy = dFdy(-vViewPosition);
      vec3 irisRx = cross(irisDy, normal), irisRy = cross(normal, irisDx);
      float irisDet = dot(irisDx, irisRx);
      normal = normalize(max(abs(irisDet), 1e-10) * normal - sign(irisDet) *
        (dFdx(irisRelief) * irisRx + dFdy(irisRelief) * irisRy));
    `);
  };
  material.customProgramCacheKey = () => "ayin-optical-iris-v7";
  return material;
}

/** Hundreds of individually lifted ribbons, merged into one draw call per layer. */
export function createFibers(count, front = true) {
  const positions = [], colors = [], indices = [];
  const color = new THREE.Color();
  const steps = 22;
  let seed = front ? 719 : 283;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < count; i++) {
    const angle = (i + random() * .7) / count * Math.PI * 2;
    const start = .015 + random() * .23, end = .67 + random() * .32;
    const phase = random() * 6.28, width = .00013 + random() * .00064;
    const intensity = .35 + random() * .85;
    for (let j = 0; j <= steps; j++) {
      const s = j / steps, t = start + (end - start) * s;
      const radius = IRIS_INNER_RADIUS + (IRIS_OUTER_RADIUS - IRIS_INNER_RADIUS) * t;
      const a = angle + (.020 * Math.sin(t * 15 + phase) + .006 * Math.sin(t * 42 + phase)) * Math.sin(s * Math.PI);
      const z = irisDepth(t) + (front ? .055 + .11 * Math.sin(s * Math.PI) : .029);
      color.setHSL(((a / (Math.PI * 2) + .045 + .025 * Math.sin(t * 9 + phase)) % 1 + 1) % 1,
        .68 + .20 * Math.sin(phase) ** 2, .44 + .10 * Math.sin(t * 11 + phase) ** 2);
      color.multiplyScalar(intensity * (.32 + .68 * Math.sin(s * Math.PI)) * (.7 + .3 * Math.sin(a)));
      for (const sign of [-1, 1]) {
        const side = a + sign * width * Math.sin(Math.PI * s);
        positions.push(radius * Math.cos(side), radius * Math.sin(side), z);
        colors.push(color.r, color.g, color.b);
      }
      if (j < steps) {
        const k = (i * (steps + 1) + j) * 2;
        indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Short branching filaments break up the long radial bundles at a third depth. */
export function createFilaments(count) {
  const positions = [], colors = [], indices = [];
  const color = new THREE.Color();
  let seed = 4281;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const steps = 12;
  for (let i = 0; i < count; i++) {
    const a0 = random() * Math.PI * 2, start = .1 + random() * .62;
    const length = .08 + random() * .18, direction = random() > .5 ? 1 : -1;
    const phase = random() * Math.PI * 2;
    color.setHSL((a0 / (Math.PI * 2) + .045) % 1, .66, .62);
    color.multiplyScalar(.42 + .32 * random());
    for (let j = 0; j <= steps; j++) {
      const s = j / steps, t = start + length * s, r = IRIS_INNER_RADIUS + (IRIS_OUTER_RADIUS - IRIS_INNER_RADIUS) * t;
      const a = a0 + direction * .065 * Math.sin(s * 1.8) + .009 * Math.sin(s * 13 + phase);
      const z = irisDepth(t) + .09 + .075 * Math.sin(Math.PI * s);
      const width = .00027 * Math.sin(Math.PI * s);
      for (const sign of [-1, 1]) {
        positions.push(r * Math.cos(a + sign * width), r * Math.sin(a + sign * width), z);
        colors.push(color.r, color.g, color.b);
      }
      if (j < steps) {
        const k = (i * (steps + 1) + j) * 2;
        indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  return geometry;
}
