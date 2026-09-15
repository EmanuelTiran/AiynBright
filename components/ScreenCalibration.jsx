"use client";

import { Activity, createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  CALIBRATION_EVENT, CARD_WIDTH_MM, MAX_PIXELS_PER_MM, MIN_PIXELS_PER_MM,
  getCalibration, getDisplayMetrics, isCalibrationValid, saveCalibration,
} from "@/lib/calibration.mjs";

const CalibrationContext = createContext(null);
export const useCalibration = () => useContext(CalibrationContext);

function subscribe(onChange) {
  const events = ["storage", "resize", "focus", CALIBRATION_EVENT];
  events.forEach((event) => window.addEventListener(event, onChange));
  window.visualViewport?.addEventListener("resize", onChange);
  let resolution;
  function watchResolution() {
    resolution?.removeEventListener("change", watchResolution);
    resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    resolution.addEventListener("change", watchResolution);
    onChange();
  }
  watchResolution();
  return () => {
    events.forEach((event) => window.removeEventListener(event, onChange));
    window.visualViewport?.removeEventListener("resize", onChange);
    resolution?.removeEventListener("change", watchResolution);
  };
}

const getSnapshot = () => JSON.stringify({ calibration: getCalibration(), display: getDisplayMetrics() });
const getServerSnapshot = () => "null";

function CalibrationForm({ onSave, onCancel }) {
  const rectangle = useRef(null);
  const availableSpace = useRef(null);
  const [width, setWidth] = useState(300);
  const [availableWidth, setAvailableWidth] = useState(300);
  const [error, setError] = useState("");
  const minWidth = CARD_WIDTH_MM * MIN_PIXELS_PER_MM;
  const maxWidth = Math.max(minWidth, Math.min(availableWidth, CARD_WIDTH_MM * MAX_PIXELS_PER_MM));
  const displayedWidth = Math.max(minWidth, Math.min(width, maxWidth));

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setAvailableWidth(Math.floor(entry.contentRect.width)));
    observer.observe(availableSpace.current);
    return () => observer.disconnect();
  }, []);

  function confirm(event) {
    event.preventDefault();
    const measuredWidth = rectangle.current?.getBoundingClientRect().width;
    if (!Number.isFinite(measuredWidth) || measuredWidth > availableWidth + 1 || !onSave(measuredWidth / CARD_WIDTH_MM)) {
      setError("The rectangle must fit on screen. Try landscape orientation or a larger screen, then match the card again.");
    }
  }

  return (
    <form onSubmit={confirm} className="mx-auto my-6 w-full max-w-3xl space-y-4 rounded-lg border-2 border-amber-300 bg-amber-50 p-4 text-slate-800">
      <h2 className="text-xl font-bold">Calibrate your screen</h2>
      <p>Hold a standard credit or debit card against the screen. Adjust the rectangle until its outside left and right edges match the card’s width (85.60 mm).</p>
      <p className="text-sm">Match the long edge only. Keep the same screen and zoom level during the test. If the card cannot fit, use landscape orientation or a larger screen.</p>
      <div ref={availableSpace} className="flex w-full justify-center overflow-hidden py-2">
        <div ref={rectangle} aria-label="Card width reference" className="box-border h-28 shrink-0 rounded-lg border-2 border-slate-800 bg-white" style={{ width: displayedWidth }} />
      </div>
      <label htmlFor="calibration-width" className="block font-semibold">Match the card width</label>
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Make rectangle narrower" onClick={() => setWidth(Math.max(minWidth, displayedWidth - 1))} className="rounded bg-slate-800 px-3 py-2 text-white">−</button>
        <input id="calibration-width" type="range" min={minWidth} max={maxWidth} step="0.1" value={displayedWidth} onChange={(event) => setWidth(Number(event.target.value))} className="w-full accent-amber-600" />
        <button type="button" aria-label="Make rectangle wider" onClick={() => setWidth(Math.min(maxWidth, displayedWidth + 1))} className="rounded bg-slate-800 px-3 py-2 text-white">+</button>
      </div>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={availableWidth < minWidth} className="rounded bg-amber-400 px-4 py-2 font-bold disabled:opacity-50">The width matches — continue</button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded border border-slate-400 px-4 py-2">Cancel</button>}
      </div>
    </form>
  );
}

export default function ScreenCalibration({ children }) {
  const snapshot = JSON.parse(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot));
  const [temporaryCalibration, setTemporaryCalibration] = useState(null);
  const [editing, setEditing] = useState(false);
  const calibration = (snapshot?.display && isCalibrationValid(temporaryCalibration, snapshot.display) ? temporaryCalibration : null)
    || snapshot?.calibration;
  const active = Boolean(calibration) && !editing;

  function accept(pixelsPerMm) {
    const result = saveCalibration(pixelsPerMm);
    if (!result) return false;
    setTemporaryCalibration(result.persisted ? null : result.calibration);
    setEditing(false);
    return true;
  }

  return (
    <div className="flex w-full flex-col items-center">
      {!snapshot ? <p role="status" className="p-4">Checking screen calibration…</p> : !active ? (
        <CalibrationForm onSave={accept} onCancel={calibration ? () => setEditing(false) : null} />
      ) : (
        <div className="flex w-full flex-wrap items-center justify-center gap-3 p-2 text-sm text-slate-700">
          <span>Screen calibrated. Use the same screen and zoom.</span>
          <button type="button" className="rounded border border-amber-500 px-3 py-1 font-semibold" onClick={() => setEditing(true)}>Recalibrate screen</button>
          {temporaryCalibration && <p role="status">Browser storage is unavailable. This calibration lasts only while this test is open.</p>}
        </div>
      )}
      <CalibrationContext.Provider value={calibration}>
        {/* Hidden tests retain their result state while effects and interaction pause. */}
        <Activity mode={active ? "visible" : "hidden"}>{children}</Activity>
      </CalibrationContext.Provider>
    </div>
  );
}
