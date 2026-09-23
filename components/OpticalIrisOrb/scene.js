import * as THREE from "three";
import { createFibers, createFilaments, createIrisGeometry, createIrisMaterial } from "./iris";
import { createCausticMaterial, createCoatingMaterial } from "./optics";
import { createOpticalFloor } from "./floor";

/** Self-contained scene. No assets, network requests, controls, or global loop. */
export function createOrbScene(host, { interactionElement, onReady, onError }) {
  const resources = new Set();
  const cleanups = [];
  const own = (resource) => { resources.add(resource); return resource; };
  let renderer, frame = 0, disposed = false, failed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    cleanups.forEach((cleanup) => cleanup());
    resources.forEach((resource) => resource.dispose());
    renderer?.dispose();
    renderer?.forceContextLoss();
    renderer?.domElement.remove();
  };

  try {
    const compact = window.matchMedia("(max-width: 760px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const constrained = compact.matches || (navigator.hardwareConcurrency || 8) <= 4;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !constrained, powerPreference: "low-power" });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;
    renderer.transmissionResolutionScale = constrained ? .65 : .85;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const shellRadius = 1.66;
    const floorHeight = -1.88;
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 30);
    const orb = new THREE.Group();
    scene.add(orb);
    const addMesh = (geometry, material, parent = orb) => {
      const mesh = new THREE.Mesh(own(geometry), own(material));
      parent.add(mesh);
      return mesh;
    };

    // A small procedural photographic studio becomes a prefiltered environment.
    // These softboxes are reflected by physical surfaces, never placed over the image.
    const studio = new THREE.Scene();
    studio.background = new THREE.Color("#080f1c");
    const softbox = (color, intensity, width, height, position) => {
      const material = own(new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
      const shape = new THREE.Shape();
      const x = -width / 2, y = -height / 2, r = Math.min(width, height) * .42;
      shape.moveTo(x + r, y);
      shape.lineTo(x + width - r, y);
      shape.quadraticCurveTo(x + width, y, x + width, y + r);
      shape.lineTo(x + width, y + height - r);
      shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      shape.lineTo(x + r, y + height);
      shape.quadraticCurveTo(x, y + height, x, y + height - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      const panel = new THREE.Mesh(own(new THREE.ShapeGeometry(shape)), material);
      panel.position.set(...position);
      panel.lookAt(0, 0, 0);
      studio.add(panel);
    };
    // Leave dark gaps between the studio cards. The former all-around HDR wash
    // made the clear shoulder read as a solid white bezel.
    softbox("#e3f4ff", 6.2, 1.72, 2.9, [-4.5, 3.3, 2]);
    softbox("#ffcf87", 6.1, .84, 2.8, [4, .6, -.5]);
    softbox("#edf8ff", 3.8, 2.8, .22, [.3, 5, -2]);
    softbox("#68bbff", 2.4, .46, 2.4, [-4, -.6, .5]);
    softbox("#a1d9ff", 2.2, 1.6, .26, [-1.8, -4, 2]);
    softbox("#ffab56", 3.0, .9, .42, [2.5, -3, 1]);
    const pmrem = own(new THREE.PMREMGenerator(renderer));
    const environment = own(pmrem.fromScene(studio, .035, .1, 30));
    scene.environment = environment.texture;
    studio.traverse((object) => {
      if (object.geometry) { object.geometry.dispose(); resources.delete(object.geometry); }
      if (object.material) { object.material.dispose(); resources.delete(object.material); }
    });
    const key = new THREE.DirectionalLight(0xe1f4ff, 3.2);
    key.position.set(-3, 4, 5); scene.add(key);
    const fill = new THREE.DirectionalLight(0xffc783, 1.5);
    fill.position.set(4, 1, 3); scene.add(fill);
    const rimLight = new THREE.DirectionalLight(0x64c5ef, 3.2);
    rimLight.position.set(-3, -1, -2); scene.add(rimLight);
    scene.add(new THREE.HemisphereLight(0x96c8ef, 0x0a1025, .5));
    const warmRim = new THREE.DirectionalLight(0xffad56, 3.4);
    warmRim.position.set(4, -.3, -2); scene.add(warmRim);
    // These illuminate actual lower surfaces, so the same colors reach the mirror.
    const bounce = new THREE.PointLight(0x409dff, 5.5, 5, 2);
    bounce.position.set(-1.6, -1.35, 1.4); scene.add(bounce);
    const warmBounce = new THREE.PointLight(0xff822e, 4.5, 5, 2);
    warmBounce.position.set(1.65, -1.15, 1.2); scene.add(warmBounce);

    const segments = constrained ? 112 : 192;
    const uniforms = { time: { value: 0 }, focus: { value: 0 } };
    const iris = new THREE.Group();
    orb.add(iris);
    addMesh(createIrisGeometry(segments, constrained ? 24 : 40), createIrisMaterial(uniforms), iris);
    const fibers = addMesh(createFibers(constrained ? 540 : 1240), new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff").multiplyScalar(.68),
      vertexColors: true, metalness: .06, roughness: .39, clearcoat: .26,
      envMapIntensity: .31, side: THREE.DoubleSide,
    }), iris);
    addMesh(createFibers(constrained ? 350 : 760, false), new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffffff").multiplyScalar(.42),
      vertexColors: true, side: THREE.DoubleSide,
    }), iris);
    addMesh(createFilaments(constrained ? 280 : 600), new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffffff").multiplyScalar(.58),
      vertexColors: true, side: THREE.DoubleSide,
    }), iris);

    // The well follows the opening exactly; the smaller pupil can lead inside it.
    // Thus parallax exposes black interior, never the page behind the eye.
    const cavity = new THREE.Group();
    iris.add(cavity);
    const profile = [[0, -.27], [.16, -.23], [.31, -.10], [.40, .12], [.44, .34], [.452, .405]]
      .map(([r, z]) => new THREE.Vector2(r, z));
    const core = addMesh(new THREE.LatheGeometry(profile, constrained ? 80 : 128), new THREE.MeshPhysicalMaterial({
      color: "#010208", metalness: 0, roughness: .28, clearcoat: .3,
      envMapIntensity: .12, side: THREE.DoubleSide,
    }), cavity);
    core.rotation.x = Math.PI / 2;
    // Lathe's axial Y becomes positive Z.
    const pupil = new THREE.Group();
    orb.add(pupil);
    const pupilMaterial = new THREE.MeshPhysicalMaterial({
      color: "#000103", roughness: .15, metalness: 0, clearcoat: .06,
      clearcoatRoughness: .15, envMapIntensity: .015, specularIntensity: .035,
    });
    // The pupil uses one controlled softbox and one pin reflection. Suppressing
    // the studio's remaining speculars keeps it deep black instead of jeweled.
    pupilMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        vec3 pupilNormal = normalize(normal);
        float pupilKeyA = pow(max(dot(pupilNormal, normalize(vec3(-.38, .48, .82))), 0.), 60.);
        float pupilKeyB = pow(max(dot(pupilNormal, normalize(vec3(-.48, .39, .79))), 0.), 210.);
        float pupilPin = pow(max(dot(pupilNormal, normalize(vec3(-.07, .52, .85))), 0.), 420.);
        totalEmissiveRadiance += vec3(1.72, 1.82, 1.88) * (pupilKeyA * .92 + pupilKeyB * .25);
        totalEmissiveRadiance += vec3(1.8) * pupilPin * .48;`,
      );
    };
    pupilMaterial.customProgramCacheKey = () => "ayin-controlled-pupil-highlights-v3";
    const blackLens = addMesh(new THREE.SphereGeometry(.47, constrained ? 56 : 80, 40), pupilMaterial, pupil);
    blackLens.scale.z = .62;
    blackLens.position.z = .31;

    // Closed opaque volume overscans every allowed iris pose. Unlike the former
    // open lathe, neither its sides nor the pupil opening can reveal background.
    const backing = addMesh(new THREE.SphereGeometry(1.50, constrained ? 80 : 112, 48), new THREE.MeshPhysicalMaterial({
      color: "#02070d", metalness: 0, roughness: .62, clearcoat: 0,
      envMapIntensity: .08,
    }), iris);
    backing.scale.z = .46;
    backing.position.z = -.36;

    // A recessed edge of the optical assembly, not a bright outline at the silhouette.
    const innerRim = addMesh(new THREE.TorusGeometry(1.50, .007, 10, segments), new THREE.MeshPhysicalMaterial({
      color: "#162b35", metalness: .06, roughness: .38, envMapIntensity: .18,
    }), iris);
    innerRim.position.z = .06;

    // One transmissive glass dome; the iris and fibers render beneath it.
    const glass = addMesh(
      new THREE.SphereGeometry(shellRadius, constrained ? 64 : 96, 48),
      createCoatingMaterial(),
    );
    glass.scale.z = 1.03;
    glass.renderOrder = 2;
    const floor = own(createOpticalFloor({ compact: constrained, height: floorHeight, hideDuringReflection: [glass] }));
    scene.add(floor.mesh);
    const ground = addMesh(new THREE.PlaneGeometry(6.6, 5.5), createCausticMaterial(), scene);
    ground.position.set(0, floorHeight + .007, 0);
    ground.rotation.x = -Math.PI / 2;
    ground.renderOrder = 4;

    let visible = false, last = 0, elapsed = 0, focusTarget = 0, focusValue = 0;
    let pointerX = 0, pointerY = 0;
    // Pitch faces the iris toward the elevated camera; neutral yaw stays at zero
    // so the glass, iris, well, and pupil share a true resting center.
    const neutralPitch = -.082;
    let rotationX = neutralPitch, rotationY = 0;
    let gazeX = 0, gazeY = 0;
    let width = 1, height = 1, framedDiameter = 1, qualityPenalty = 0, slowFrames = 0;
    const gazeOrigin = new THREE.Vector3();
    let ready = false;
    const listen = (target, name, handler, options) => {
      target.addEventListener(name, handler, options);
      cleanups.push(() => target.removeEventListener(name, handler, options));
    };
    const canRender = () => visible && !document.hidden && !disposed && !failed;
    const requestFrame = () => { if (!frame && canRender()) frame = requestAnimationFrame(render); };
    const fail = () => {
      failed = true;
      cancelAnimationFrame(frame); frame = 0;
      onError();
    };
    // Shader failures are otherwise logged by WebGL without throwing.
    renderer.debug.onShaderError = fail;
    const setSize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
      // The hero now spans the viewport: cap total pixels as well as device DPR.
      const pixelBudget = constrained ? 1000000 : 2200000;
      const pixelRatio = Math.min(window.devicePixelRatio || 1,
        (compact.matches || constrained ? 1.25 : 1.75) - qualityPenalty,
        Math.sqrt(pixelBudget / (width * height)));
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      renderer.transmissionResolutionScale = compact.matches || constrained ? .65 : .85;
      camera.aspect = width / height;
      // Size from the silhouette, reserving the lower third for the physical floor.
      // This adapts to a tall reference frame and a wide desktop without cropping.
      framedDiameter = Math.min(width * .78, height * (compact.matches ? .70 : .628));
      const halfFov = THREE.MathUtils.degToRad(camera.fov * .5);
      const distance = shellRadius * Math.sqrt(1 + (height / framedDiameter / Math.tan(halfFov)) ** 2);
      camera.position.set(0, .68, distance);
      camera.lookAt(0, -.925, 0);
      camera.updateProjectionMatrix();
      floor.invalidate();
      requestFrame();
    };
    function render(now) {
      frame = 0;
      if (!canRender()) return;
      const budget = compact.matches || constrained ? 1000 / 30 : 1000 / 60;
      if (!reduced.matches && last && now - last < budget - 1) { requestFrame(); return; }
      const delta = last ? Math.min((now - last) / 1000, .08) : 1 / 60;
      last = now;
      if (!reduced.matches) elapsed += delta;
      const damping = 1 - Math.exp(-delta * 4);
      const gazeDamping = 1 - Math.exp(-delta * 6);
      focusValue = reduced.matches ? focusTarget : THREE.MathUtils.lerp(focusValue, focusTarget, damping);

      // Keep the optical shell relatively stable. The internal layers do most of the looking.
      const targetX = neutralPitch + pointerY * .008;
      const targetY = pointerX * .010;
      rotationX = reduced.matches ? neutralPitch : THREE.MathUtils.lerp(rotationX, targetX, damping);
      rotationY = reduced.matches ? 0 : THREE.MathUtils.lerp(rotationY, targetY, damping);

      // Stronger but still restrained internal gaze, with smooth damping.
      gazeX = reduced.matches ? 0 : THREE.MathUtils.lerp(gazeX, pointerX, gazeDamping);
      gazeY = reduced.matches ? 0 : THREE.MathUtils.lerp(gazeY, pointerY, gazeDamping);
      const entrance = reduced.matches ? 1 : Math.min(1, elapsed / 2.2);
      const settle = 1 - Math.pow(1 - entrance, 3);
      orb.rotation.set(rotationX + (reduced.matches ? 0 : Math.sin(elapsed * .33) * .0044), rotationY + (1 - settle) * .055, 0);
      orb.position.y = reduced.matches ? .025 : .025 + Math.sin(elapsed * .65) * .018 - (1 - settle) * .08;
      orb.scale.setScalar(.96 + .04 * settle + focusValue * .006);

      // Internal gaze/parallax: the pupil leads, the iris follows, the outer glass barely moves.
      const irisShiftX = gazeX * .052;
      const irisShiftY = -gazeY * .039;
      const pupilShiftX = gazeX * .112;
      const pupilShiftY = -gazeY * .082;

      iris.position.x = irisShiftX;
      iris.position.y = irisShiftY;
      iris.position.z = -.18;
      pupil.position.x = pupilShiftX;
      pupil.position.y = pupilShiftY;
      pupil.position.z = -.10;

      iris.rotation.x = -gazeY * .065;
      iris.rotation.y = gazeX * .080;
      pupil.rotation.x = -gazeY * .085;
      pupil.rotation.y = gazeX * .11;
      // The well shares the iris transform; pupil contraction cannot open a gap.
      const pupilScale = 1.43 * (1 - focusValue * .045);
      pupil.scale.set(pupilScale, pupilScale, 1);
      const irisScale = 1.015 - focusValue * .014;
      iris.scale.set(irisScale, irisScale, 1);
      fibers.rotation.z = reduced.matches ? 0 : Math.sin(elapsed * .19) * .002;
      uniforms.time.value = elapsed;
      uniforms.focus.value = focusValue;
      if (reduced.matches) floor.invalidate();
      const start = performance.now();
      try { renderer.render(scene, camera); } catch { fail(); return; }
      if (failed) return;
      if (!ready) { ready = true; onReady(); }
      // Only reduce resolution after sustained slow actual draws, not idle time.
      if (performance.now() - start > 25) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > 25 && qualityPenalty < .5) { qualityPenalty += .25; slowFrames = 0; setSize(); }
      if (!reduced.matches) requestFrame();
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { last = 0; requestFrame(); } else { cancelAnimationFrame(frame); frame = 0; }
    });
    intersection.observe(host); cleanups.push(() => intersection.disconnect());
    const resize = new ResizeObserver(setSize);
    resize.observe(host); cleanups.push(() => resize.disconnect());
    listen(document, "visibilitychange", () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else { last = 0; requestFrame(); }
    });
    listen(reduced, "change", () => { pointerX = 0; pointerY = 0; last = 0; requestFrame(); });
    listen(compact, "change", setSize);
    listen(interactionElement, "pointermove", (event) => {
      if (reduced.matches || !finePointer.matches || event.pointerType === "touch") return;
      // The lens sits above the canvas center now that the floor has more space.
      // Track its projected center, retaining the existing damped layer amplitudes.
      const bounds = host.getBoundingClientRect();
      gazeOrigin.setFromMatrixPosition(orb.matrixWorld).project(camera);
      const centerX = bounds.left + (gazeOrigin.x * .5 + .5) * bounds.width;
      const centerY = bounds.top + (.5 - gazeOrigin.y * .5) * bounds.height;
      pointerX = THREE.MathUtils.clamp((event.clientX - centerX) / (framedDiameter * .65), -1, 1);
      pointerY = THREE.MathUtils.clamp((event.clientY - centerY) / (framedDiameter * .65), -1, 1);
    }, { passive: true });
    listen(interactionElement, "pointerleave", () => { pointerX = 0; pointerY = 0; });
    listen(renderer.domElement, "webglcontextlost", (event) => { event.preventDefault(); fail(); });
    listen(renderer.domElement, "webglcontextrestored", () => { failed = false; ready = false; last = 0; floor.invalidate(); setSize(); requestFrame(); });
    setSize();

    return { setFocus(value) { focusTarget = value ? 1 : 0; requestFrame(); }, dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}
