import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createFibers, createFilaments, createIrisGeometry, irisDepth, IRIS_INNER_RADIUS, IRIS_OUTER_RADIUS } from "../components/OpticalIrisOrb/iris.js";

test("the iris has an open pupil, curved depth, and a closed angular seam at both quality levels", () => {
  for (const [segments, rings] of [[112, 24], [192, 40]]) {
    const geometry = createIrisGeometry(segments, rings);
    const positions = geometry.getAttribute("position");
    let minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      assert.ok(Number.isFinite(x + y + z));
      assert.ok(Math.hypot(x, y) >= IRIS_INNER_RADIUS - .0001, "no iris surface should cover the pupil");
      minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
    }
    assert.ok(maxZ - minZ > .27, "iris is a curved physical surface, not a disk");
    for (let j = 0; j <= rings; j++) {
      const first = j * (segments + 1), last = first + segments;
      for (let axis = 0; axis < 3; axis++) {
        assert.ok(Math.abs(positions.array[first * 3 + axis] - positions.array[last * 3 + axis]) < .00001);
      }
    }
    assert.equal(geometry.index.count, segments * rings * 6);
    geometry.dispose();
  }
});

test("iris layers remain inside the glass at rest and at the bounded gaze positions", () => {
  // Match the scene's desktop geometry and its internal gaze transforms. The
  // whole orb's drift does not change clearance because the shell shares it.
  const layers = [createIrisGeometry(192, 40), createFibers(1240), createFibers(760, false), createFilaments(600)];
  const point = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const gazes = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]];
  for (const geometry of layers) {
    const positions = geometry.getAttribute("position");
    for (const [gazeX, gazeY] of gazes) {
      rotation.set(-gazeY * .065, gazeX * .080, 0);
      for (let i = 0; i < positions.count; i++) {
        point.set(positions.getX(i) * 1.015, positions.getY(i) * 1.015, positions.getZ(i));
        point.applyEuler(rotation);
        point.x += gazeX * .052;
        point.y -= gazeY * .039;
        point.z -= .18;
        const shellDistance = (point.x / 1.66) ** 2 + (point.y / 1.66) ** 2 + (point.z / (1.66 * 1.03)) ** 2;
        assert.ok(shellDistance < 1, "an internal layer must not intersect the curved glass");
      }
    }
    geometry.dispose();
  }
});

test("the fiber layer is deterministic, lifted off the iris and cheaper at mobile quality", () => {
  const mobile = createFibers(540), desktop = createFibers(1240), repeat = createFibers(540);
  assert.deepEqual(mobile.attributes.position.array, repeat.attributes.position.array);
  assert.ok(desktop.attributes.position.count > mobile.attributes.position.count * 2);
  const positions = mobile.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const r = Math.hypot(positions.getX(i), positions.getY(i));
    const t = (r - IRIS_INNER_RADIUS) / (IRIS_OUTER_RADIUS - IRIS_INNER_RADIUS);
    assert.ok(positions.getZ(i) - irisDepth(t) > .03, "fibers have real separation from the iris");
  }
  [mobile, desktop, repeat].forEach((geometry) => geometry.dispose());
});
