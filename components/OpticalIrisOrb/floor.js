import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";

/** A real mirrored scene, softened on the receiver rather than a second orb model. */
export function createOpticalFloor({ compact, height = -1.80, hideDuringReflection = [] }) {
  const resolution = compact ? 256 : 512;
  const geometry = new THREE.PlaneGeometry(12, 12);
  const floor = new Reflector(geometry, {
    color: 0x101c28,
    textureWidth: resolution, textureHeight: resolution, multisample: 0,
    clipBias: .003,
    shader: {
      name: "AyinRoughOpticalFloor",
      uniforms: {
        color: { value: new THREE.Color("#101c28") },
        tDiffuse: { value: null }, textureMatrix: { value: new THREE.Matrix4() },
        texel: { value: 1 / resolution },
      },
      vertexShader: /* glsl */ `
        uniform mat4 textureMatrix;
        varying vec4 vReflection;
        varying vec2 vFloor;
        void main() {
          vFloor = position.xy;
          vReflection = textureMatrix * vec4(position, 1.);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform vec3 color;
        uniform float texel;
        varying vec4 vReflection;
        varying vec2 vFloor;
        void main() {
          // Local -Y points toward the viewer after the floor's rotation.
          float distanceFromOrb = max(-vFloor.y, 0.);
          // Tighten all light layers together, keeping their shared contact center.
          float floorX = vFloor.x * 1.12;
          vec2 uv = vReflection.xy / vReflection.w;
          float radius = texel * (1.8 + min(distanceFromOrb, 5.) * 4.5);
          vec2 blur = vec2(radius * 1.45, radius * 2.0);
          // Mip-filtered taps spread the HDR highlights smoothly instead of
          // showing nine separate copies as the reflection gets rougher.
          float mipBias = min(.75 + distanceFromOrb * 1.25, 5.4);
          vec4 reflection = texture2D(tDiffuse, uv, mipBias) * .20;
          reflection += texture2D(tDiffuse, uv + vec2(blur.x, 0.), mipBias) * .12;
          reflection += texture2D(tDiffuse, uv - vec2(blur.x, 0.), mipBias) * .12;
          reflection += texture2D(tDiffuse, uv + vec2(0., blur.y), mipBias) * .12;
          reflection += texture2D(tDiffuse, uv - vec2(0., blur.y), mipBias) * .12;
          reflection += texture2D(tDiffuse, uv + blur, mipBias) * .08;
          reflection += texture2D(tDiffuse, uv - blur, mipBias) * .08;
          reflection += texture2D(tDiffuse, uv + vec2(blur.x, -blur.y), mipBias) * .08;
          reflection += texture2D(tDiffuse, uv + vec2(-blur.x, blur.y), mipBias) * .08;
          float footprint = exp(-floorX * floorX * .20 - vFloor.y * vFloor.y * .008);
          float fade = exp(-distanceFromOrb * .10) * footprint;
          float grain = fract(sin(dot(floor(vFloor * 650.), vec2(12.9898, 78.233))) * 43758.5453);
          // Compress the rough reflected scene into colored light; guard the
          // transparent edges so tiny alpha values cannot create hot squares.
          float coverage = clamp(reflection.a, 0., 1.);
          vec3 reflected = min(reflection.rgb / max(reflection.a, .03), vec3(2.4));
          reflected = pow(max(reflected, vec3(0.)), vec3(.86)) * 1.25;
          vec3 surface = color * (.85 + .15 * grain);
          float reflectedEnergy = dot(reflected, vec3(.2126, .7152, .0722))
            * smoothstep(.012, .18, coverage);
          float spectralSplit = smoothstep(-.16, .16, floorX);
          float centerMask = exp(-pow(floorX * 4.5, 2.));
          vec3 bounceTint = mix(vec3(.04, .48, 1.28), vec3(1.38, .46, .045), spectralSplit);
          bounceTint = mix(bounceTint, vec3(.15, .09, .48), centerMask * .78);
          reflected = mix(reflected, bounceTint * reflectedEnergy * 1.3, .72);
          vec3 spectralReflection = bounceTint * (.15 + min(reflectedEnergy, .9) * 1.52);
          vec3 light = surface * .35 + reflected * .025 + spectralReflection * .36;
          light += bounceTint * min(reflectedEnergy, .8) * .46;
          float spectralReach = exp(-floorX * floorX * .28 - distanceFromOrb * .23);
          light += bounceTint * spectralReach * .15;
          // Rough spectral columns preserve the blue-left / gold-right split,
          // with a softer fade away from the concentrated contact light.
          float coolColumn = exp(-pow((floorX + .72) * 2.55, 2.))
            * (1. - spectralSplit) * exp(-distanceFromOrb * .12);
          float warmColumn = exp(-pow((floorX - .55) * 2.10, 2.))
            * spectralSplit * exp(-distanceFromOrb * .27);
          float whiteColumn = exp(-floorX * floorX * 6.4) * exp(-distanceFromOrb * .90);
          float verticalVariation = .86 + .14 * sin(vFloor.y * 13. + floorX * 4.);
          vec3 columnLight = vec3(.04, 1.42, 4.2) * coolColumn
            + vec3(3.8, .27, .015) * warmColumn
            + vec3(.36, .40, .44) * whiteColumn;
          light += columnLight * verticalVariation * 1.34;
          float contact = exp(-floorX * floorX * 5. - vFloor.y * vFloor.y * 12.);
          light *= 1. - contact * .35;
          float horizon = exp(-floorX * floorX * .48 - vFloor.y * vFloor.y * 8.);
          vec3 horizonTint = mix(vec3(.26, .76, 1.35), vec3(1.35, .66, .20), smoothstep(-1.2, 1.2, floorX));
          light += horizonTint * horizon * (1. - contact * .82) * .38;
          float centerHorizon = exp(-floorX * floorX * 2.5 - vFloor.y * vFloor.y * 38.);
          light += vec3(.84, .97, 1.08) * centerHorizon * (1. - contact * .76) * .08;
          // Preserve the black core but fade empty receiver pixels into the hero;
          // a large rectangular canvas must never become a visible floor patch.
          float reflectionField = exp(-floorX * floorX * .52 - distanceFromOrb * .30);
          float columnMask = clamp((coolColumn + warmColumn) * .42 + whiteColumn * .26, 0., 1.);
          // Keep the blue and amber streaks separate after the rough reflected
          // scene is mixed in; otherwise they become a neutral grey plume.
          float coolDominance = smoothstep(.05, .55, coolColumn - warmColumn);
          float warmDominance = smoothstep(.05, .55, warmColumn - coolColumn);
          light *= mix(vec3(1.), vec3(.18, 1.00, 2.0), coolDominance * .80);
          light *= mix(vec3(1.), vec3(1.70, .72, .30), warmDominance * .80);
          float columnOpacity = mix(1.15, 2.20, smoothstep(.35, 2.5, distanceFromOrb));
          float nearCool = exp(-pow((distanceFromOrb - .85) * 2.5, 2.));
          columnOpacity *= 1. + coolDominance * nearCool * .35;
          gl_FragColor = vec4(light, clamp(fade * (.012 + .07 * coverage + .08 * reflectionField + columnOpacity * columnMask), 0., .93));
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          // Grade the rough reflected light after tone mapping: HDR averaging
          // otherwise turns the long blue and amber reflection into grey.
          float lowerCool = smoothstep(.65, 1.65, distanceFromOrb);
          float lowerWarm = smoothstep(1.5, 2.6, distanceFromOrb);
          gl_FragColor.rgb *= mix(vec3(1.), vec3(.46, .68, 1.), coolDominance * lowerCool);
          gl_FragColor.rgb += vec3(0., .16, .32) * coolDominance * (1. - lowerCool);
          gl_FragColor.rgb *= mix(vec3(1.), vec3(1.18, .82, .80), warmDominance * lowerWarm);
          float warmMiddle = warmDominance * exp(-pow((distanceFromOrb - 1.6) * 2.2, 2.));
          gl_FragColor.rgb *= mix(vec3(1.), vec3(1., .72, .78), warmMiddle);
        }
      `,
    },
  });
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = height;
  const reflectionTexture = floor.getRenderTarget().texture;
  reflectionTexture.generateMipmaps = true;
  reflectionTexture.minFilter = THREE.LinearMipmapLinearFilter;
  floor.material.transparent = true;
  floor.material.depthWrite = false;
  floor.renderOrder = 3;
  const reflect = floor.onBeforeRender;
  let lastReflection = -Infinity, dirty = true;
  floor.onBeforeRender = function (renderer, scene, camera) {
    const now = performance.now();
    if (!dirty && now - lastReflection < (compact ? 125 : 80)) return;
    dirty = false;
    lastReflection = now;
    const visibility = hideDuringReflection.map((object) => object.visible);
    hideDuringReflection.forEach((object) => { object.visible = false; });
    try {
      reflect.call(this, renderer, scene, camera);
    } finally {
      hideDuringReflection.forEach((object, index) => { object.visible = visibility[index]; });
    }
  };
  return {
    mesh: floor,
    invalidate() { dirty = true; },
    dispose() { floor.dispose(); geometry.dispose(); },
  };
}
