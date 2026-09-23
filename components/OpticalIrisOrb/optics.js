import * as THREE from "three";

/** One clear transmissive dome, shaped by the scene's real studio environment. */
export function createCoatingMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0,
    roughness: .032,
    transmission: 1,
    thickness: .115,
    ior: 1.46,
    attenuationColor: new THREE.Color("#e8f8ff"),
    attenuationDistance: 20,
    specularIntensity: .82,
    specularColor: new THREE.Color("#f4fbff"),
    clearcoat: .62,
    clearcoatRoughness: .032,
    envMapIntensity: .66,
    dispersion: 0,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    side: THREE.FrontSide,
  });

  // Transmission provides the depth and refraction. These directional lobes
  // only reinforce the reference highlights where the alpha canvas would
  // otherwise make the silhouette disappear against the DOM background.
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nfloat glassHighlightAlpha = 0.;")
      .replace("#include <normal_fragment_maps>", /* glsl */ `#include <normal_fragment_maps>
        vec3 shellNormal = normalize(normal);
        float shellFresnel = 1. - max(dot(shellNormal, normalize(vViewPosition)), 0.);
        float broadEdge = smoothstep(.79, .98, shellFresnel);
        float fineEdge = pow(clamp(shellFresnel, 0., 1.), 12.);
        vec2 radial = normalize(shellNormal.xy + vec2(.0001));

        float coolEdge = broadEdge * pow(max(dot(radial, normalize(vec2(-.74, .68))), 0.), 5.2);
        float topEdge = broadEdge * pow(max(dot(radial, normalize(vec2(-.08, .997))), 0.), 4.2);
        float warmEdge = broadEdge * pow(max(dot(radial, normalize(vec2(.96, -.27))), 0.), 7.2);
        float lowerEdge = broadEdge * pow(max(dot(radial, normalize(vec2(-.24, -.97))), 0.), 5.8);

        float coolPane = pow(max(dot(shellNormal, normalize(vec3(-.68, .08, .73))), 0.), 21.);
        float coolCore = pow(max(dot(shellNormal, normalize(vec3(-.76, .29, .58))), 0.), 64.);
        float warmPane = pow(max(dot(shellNormal, normalize(vec3(.84, -.14, .52))), 0.), 38.);
        float warmCrown = pow(max(dot(shellNormal, normalize(vec3(.64, .65, .43))), 0.), 31.);
        float warmLower = pow(max(dot(shellNormal, normalize(vec3(.72, -.62, .32))), 0.), 31.);
        // A reflected strip follows a constant-depth path on the convex dome.
        float topArcY = sqrt(max(.001, .87 - shellNormal.x * shellNormal.x));
        float topCurve = exp(-pow((shellNormal.y - topArcY) * 74., 2.))
          * smoothstep(.10, .46, abs(shellNormal.z))
          * (1. - smoothstep(.72, .94, abs(shellNormal.x)));
        // Reflected cards bend around the shoulder without outlining it evenly.
        float coolCurve = exp(-pow((shellNormal.x + .84 - .11 * shellNormal.y) * 19., 2.))
          * smoothstep(-.66, -.12, shellNormal.y)
          * (1. - smoothstep(.62, .88, shellNormal.y));
        float warmCurve = exp(-pow((shellNormal.x - .83) * 48., 2.))
          * smoothstep(.18, .66, abs(shellNormal.z))
          * (1. - smoothstep(.60, .87, abs(shellNormal.y)));

        totalEmissiveRadiance += vec3(4.02, 5.12, 5.44) * coolEdge;
        totalEmissiveRadiance += vec3(5.20, 5.38, 5.28) * topEdge;
        totalEmissiveRadiance += vec3(6.00, 4.18, 2.48) * warmEdge;
        totalEmissiveRadiance += vec3(1.48, 2.28, 2.68) * lowerEdge;
        totalEmissiveRadiance += vec3(3.20, 3.92, 4.18) * (coolPane * .68 + coolCore * .38);
        totalEmissiveRadiance += vec3(4.10, 5.05, 5.65) * coolCurve * .72;
        totalEmissiveRadiance += vec3(4.10, 4.28, 4.22) * topCurve * .82;
        totalEmissiveRadiance += vec3(4.70, 2.10, .65) * (warmPane * .62 + warmCurve * .94);
        totalEmissiveRadiance += vec3(3.02, 2.38, 1.70) * warmCrown * .56;
        totalEmissiveRadiance += vec3(2.20, .73, .15) * warmLower * .58;
        totalEmissiveRadiance += mix(vec3(.24, .54, .76), vec3(1.0, .43, .10), smoothstep(-.25, .72, radial.x)) * fineEdge * .34;

        glassHighlightAlpha = clamp(
          coolEdge * .88 + topEdge * .82 + warmEdge * .84 + lowerEdge * .42
          + coolPane * .32 + coolCore * .34 + coolCurve * .52 + topCurve * .56
          + warmPane * .36 + warmCrown * .19 + warmCurve * .57 + warmLower * .26,
          0., .92
        );`)
      .replace("#include <opaque_fragment>", /* glsl */ `#include <opaque_fragment>
        // The scene has an alpha background. Transmission has nothing to
        // refract beyond the iris, so suppress that dark sample at the edge.
        // The lit lobes remain on the actual dome and follow its curvature.
        float opticalReturn = dot(gl_FragColor.rgb, vec3(.2126, .7152, .0722));
        float centralGlass = 1. - smoothstep(.35, .70, shellFresnel);
        gl_FragColor.a = clamp(max(glassHighlightAlpha * (.18 + .82 * smoothstep(.14, 1.35, opticalReturn)) + .002,
          centralGlass * .025), 0., .92);`);
  };
  material.customProgramCacheKey = () => "ayin-physical-optical-shell-v19";
  return material;
}

/** Concentrated cool/warm contact light where the hovering glass approaches the floor. */
export function createCausticMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vec2 p = (vUv - .5) * 2.;
        float pool = exp(-p.x * p.x * 4.2 - p.y * p.y * 8.);
        float blue = exp(-pow((p.x + .30) * 4.2, 2.));
        float amber = exp(-pow((p.x - .34) * 5.1, 2.));
        float streak = pow(.5 + .5 * sin(p.x * 25. + p.y * 5.), 5.);
        vec3 spectral = vec3(.06, .34, .88) * blue + vec3(1.0, .39, .055) * amber;
        float contact = exp(-p.x * p.x * 15. - p.y * p.y * 130.);
        vec3 light = spectral * pool * (.72 + streak * .035) + vec3(.38, .70, .84) * contact * .26;
        gl_FragColor = vec4(light, pool * .88);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}
