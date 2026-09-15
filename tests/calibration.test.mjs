import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CALIBRATION_KEY, CARD_WIDTH_MM, cmToPx, getCalibration, getDisplayMetrics,
  isCalibrationValid, mmToPx, saveCalibration,
} from "../lib/calibration.mjs";

const display = { devicePixelRatio: 2, viewportScale: 1 };
const calibration = { version: 1, pixelsPerMm: 4, ...display, savedAt: 1 };
function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("millimetres convert to CSS pixels without multiplying by devicePixelRatio", () => {
  assert.equal(mmToPx(10, calibration), 40);
  assert.equal(mmToPx(14.6, calibration), 58.4);
  assert.equal(mmToPx(0, calibration), 0);
  assert.equal(mmToPx(CARD_WIDTH_MM, calibration), 342.4);
});

test("centimetres preserve positive, negative and zero Field offsets", () => {
  assert.equal(cmToPx(2, calibration), 80);
  assert.equal(cmToPx(-24, calibration), -960);
  assert.equal(cmToPx(0, calibration), 0);
});

test("missing calibration and server-side calls fail safely without a physical-unit fallback", () => {
  assert.equal(getDisplayMetrics(), null);
  assert.equal(getCalibration(), null);
  assert.equal(getCalibration({ storage: memoryStorage(), display }), null);
  assert.equal(mmToPx(10), null);
  assert.equal(cmToPx(10, null), null);
  assert.equal(saveCalibration(4), null);
});

test("invalid records, numbers, versions and overflowing conversions are rejected", () => {
  for (const invalid of [null, {}, [], { ...calibration, version: 2 }, { ...calibration, savedAt: "yesterday" }, { ...calibration, devicePixelRatio: 0 }, { ...calibration, viewportScale: 0 }]) {
    assert.equal(isCalibrationValid(invalid), false);
    assert.equal(mmToPx(1, invalid), null);
  }
  for (const pixelsPerMm of [undefined, null, "4", 0, -1, 0.49, 21, NaN, Infinity]) {
    assert.equal(saveCalibration(pixelsPerMm, { storage: memoryStorage(), display }), null);
  }
  for (const invalid of ["10", null, NaN, Infinity, Number.MAX_VALUE]) {
    assert.equal(mmToPx(invalid, calibration), null);
    assert.equal(cmToPx(invalid, calibration), null);
  }
});

test("calibration persists, reads back and can be replaced without modifying domain units", () => {
  const storage = memoryStorage();
  const saved = saveCalibration(342.4 / CARD_WIDTH_MM, { storage, display });
  assert.equal(saved.persisted, true);
  assert.deepEqual(getCalibration({ storage, display }), saved.calibration);
  assert.equal(mmToPx(10, getCalibration({ storage, display })), 40);
  saveCalibration(5, { storage, display });
  assert.equal(getCalibration({ storage, display }).pixelsPerMm, 5);
});

test("malformed or corrupted localStorage records do not unlock tests", () => {
  const storage = memoryStorage();
  for (const raw of ["not json", "null", "[]", '{"pixelsPerMm":4}', JSON.stringify({ ...calibration, pixelsPerMm: -4 })]) {
    storage.setItem(CALIBRATION_KEY, raw);
    assert.equal(getCalibration({ storage, display }), null);
  }
});

test("unavailable storage allows a clearly reported temporary calibration", () => {
  const storage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("quota"); } };
  assert.equal(getCalibration({ storage, display }), null);
  const saved = saveCalibration(4, { storage, display });
  assert.equal(saved.persisted, false);
  assert.equal(mmToPx(10, saved.calibration), 40);
  assert.equal(saveCalibration(4, { storage: null, display }).persisted, false);
});

test("browser zoom, display scale and pinch zoom changes require recalibration", () => {
  const storage = memoryStorage();
  saveCalibration(4, { storage, display });
  assert.equal(getCalibration({ storage, display: { ...display, devicePixelRatio: 2.5 } }), null);
  assert.equal(getCalibration({ storage, display: { ...display, viewportScale: 1.5 } }), null);
  assert.ok(getCalibration({ storage, display }));
});
