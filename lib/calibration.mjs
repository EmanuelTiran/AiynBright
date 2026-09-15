export const CALIBRATION_KEY = "ayinbright.screen-calibration.v1";
export const CALIBRATION_EVENT = "ayinbright:calibration";
export const CARD_WIDTH_MM = 85.6;
export const MIN_PIXELS_PER_MM = 0.5;
export const MAX_PIXELS_PER_MM = 20;

function browserStorage() {
  try { return typeof window === "undefined" ? null : window.localStorage; }
  catch { return null; }
}

export function getDisplayMetrics() {
  if (typeof window === "undefined") return null;
  return {
    devicePixelRatio: window.devicePixelRatio || 1,
    viewportScale: window.visualViewport?.scale || 1,
  };
}

export function isCalibrationValid(value, display = null) {
  if (!value || value.version !== 1 ||
    !Number.isFinite(value.pixelsPerMm) || value.pixelsPerMm < MIN_PIXELS_PER_MM || value.pixelsPerMm > MAX_PIXELS_PER_MM ||
    !Number.isFinite(value.devicePixelRatio) || value.devicePixelRatio <= 0 ||
    !Number.isFinite(value.viewportScale) || value.viewportScale <= 0 ||
    !Number.isSafeInteger(value.savedAt) || value.savedAt <= 0) return false;
  return !display || (
    Math.abs(value.devicePixelRatio - display.devicePixelRatio) < 0.000001 &&
    Math.abs(value.viewportScale - display.viewportScale) < 0.000001
  );
}

export function getCalibration({ storage = browserStorage(), display = getDisplayMetrics() } = {}) {
  if (!storage || !display) return null;
  try {
    const value = JSON.parse(storage.getItem(CALIBRATION_KEY));
    return isCalibrationValid(value, display) ? value : null;
  } catch { return null; }
}

export function saveCalibration(pixelsPerMm, { storage = browserStorage(), display = getDisplayMetrics() } = {}) {
  if (!display) return null;
  const calibration = { version: 1, pixelsPerMm, ...display, savedAt: Date.now() };
  if (!isCalibrationValid(calibration, display)) return null;
  let persisted = false;
  try {
    storage?.setItem(CALIBRATION_KEY, JSON.stringify(calibration));
    persisted = Boolean(storage);
  } catch { /* A blocked store can still support the current mounted test. */ }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CALIBRATION_EVENT));
  return { calibration, persisted };
}

export function mmToPx(mm, calibration = getCalibration()) {
  if (!Number.isFinite(mm) || !isCalibrationValid(calibration)) return null;
  const pixels = mm * calibration.pixelsPerMm;
  return Number.isFinite(pixels) ? pixels : null;
}

export function cmToPx(cm, calibration = getCalibration()) {
  return Number.isFinite(cm) ? mmToPx(cm * 10, calibration) : null;
}
