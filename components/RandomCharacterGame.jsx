"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ScreenCalibration, { useCalibration } from "./ScreenCalibration";
import Popup from "./Popup";
import ResultTestBlur from "./ResultTestBlur";
import { BlurFrame, ResultCard, primaryAction, secondaryAction } from "./Blur/FlowUI";
import { mmToPx } from "@/lib/calibration.mjs";
import { answerTrial, createRound, createTrial, freshFlow, restoreFlow, sameResult } from "@/lib/blur-flow.mjs";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export default function RandomCharacterGame({ user }) {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  return ready ? <BlurFlow key={user.id} user={user} /> : <BlurFrame><p role="status">Preparing your test…</p></BlurFrame>;
}

function BlurFlow({ user }) {
  const router = useRouter();
  const storageKey = `ayinbright.blur-flow.v1:${user.id}`;
  const [flow, setFlow] = useState(() => {
    try {
      const restored = restoreFlow(window.sessionStorage.getItem(storageKey));
      // Reconcile a response lost during refresh with the authenticated server data.
      for (const result of Object.values(restored.results)) {
        restored.saved[result.eye] = user.sizeWeaknesses.some((item) => sameResult(item, result));
      }
      return restored;
    } catch { return freshFlow(); }
  });
  const current = useRef(flow);
  const history = useRef([...user.sizeWeaknesses]);
  const saving = useRef(false);
  const answerLocked = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [storageError, setStorageError] = useState(false);
  const [paused, setPaused] = useState(false);
  const heading = useRef(null);
  const remainingEye = flow.eye === "right" ? "left" : "right";

  function commit(next) {
    current.current = next;
    try { window.sessionStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setStorageError(true); }
    setFlow(next);
  }

  useEffect(() => {
    function warnBeforeLeaving(event) {
      if (current.current.step === "test" || saving.current ||
        Object.keys(current.current.results).some((eye) => !current.current.saved[eye])) {
        event.preventDefault();
        event.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, []);

  function startEye(eye) {
    answerLocked.current = false;
    setPaused(false);
    setSaveError("");
    commit({ ...current.current, eye, step: "test", trial: createTrial() });
  }

  async function saveResult(result) {
    if (saving.current) return;
    saving.current = true;
    setIsSaving(true);
    setSaveError("");
    // Retrying sends the same dated result and collection, so it does not append twice.
    const updated = history.current.some((item) => sameResult(item, result))
      ? history.current : [...history.current, result];
    try {
      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateData: { sizeWeaknesses: updated } }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Could not save your result. Please try again.");
      }
      history.current = updated;
      const next = { ...current.current, saved: { ...current.current.saved, [result.eye]: true } };
      if (next.results.right && next.results.left) next.step = "summary";
      commit(next);
      router.refresh();
    } catch (error) {
      setSaveError(error.message || "Could not save your result. Please try again.");
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  }

  function answer(character) {
    if (answerLocked.current || current.current.step !== "test") return;
    answerLocked.current = true;
    const { trial, finished } = answerTrial(current.current.trial, character);
    if (finished) {
      const result = { fontSize: trial.size, distance: 1, eye: current.current.eye, date: new Date().toISOString() };
      commit({ ...current.current, step: "result", trial, results: { ...current.current.results, [result.eye]: result }, saved: { ...current.current.saved, [result.eye]: false } });
      void saveResult(result);
    } else {
      commit({ ...current.current, trial: { ...trial, ...createRound() } });
    }
  }

  // A short, neutral response lock prevents a double-click answering two trials.
  useEffect(() => {
    if (flow.step !== "test") return;
    const timer = window.setTimeout(() => { answerLocked.current = false; }, 300);
    return () => window.clearTimeout(timer);
  }, [flow.trial, flow.step]);

  const stage = flow.step === "summary" ? 2 : ["test", "result"].includes(flow.step) ? 1 : 0;
  const completed = Object.values(flow.results);
  const allSaved = completed.every((result) => flow.saved[result.eye]);

  return (
    <BlurFrame stage={stage}>
      {storageError && <p role="status" className="mb-4 rounded-xl bg-amber-100 p-4">Browser storage is unavailable. Keep this page open to retain your place.</p>}
      <ScreenCalibration>
        <section className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <FocusStep heading={heading} step={flow.step} paused={paused} />
          <Popup type="blur" />
          {["instructions", "choose"].includes(flow.step) && (
            <div className="space-y-6">
              <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold">Which eye would you like to test?</h1>
              <p className="text-lg text-slate-700">Choose either eye to begin.</p>
              <div className="grid gap-4 sm:grid-cols-2" role="group" aria-label="Eye to test">
                {["right", "left"].map((eye) => (
                  <button type="button" key={eye} aria-pressed={flow.eye === eye} onClick={() => commit({ ...flow, eye })}
                    className={`min-h-36 rounded-2xl border-2 p-6 text-left ${flow.eye === eye ? "border-amber-700 bg-amber-100" : "border-slate-300 bg-white hover:bg-stone-50"}`}>
                    <span className="block text-2xl font-semibold capitalize">{eye} eye</span>
                    <span className="mt-3 block">{flow.eye === eye ? "✓ Selected" : "Select this eye"}</span>
                  </button>
                ))}
              </div>
              <p className="rounded-xl bg-stone-50 p-4">Cover your <strong className="font-semibold">{remainingEye} eye</strong>. Keep your {flow.eye} eye open.</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" className={primaryAction} onClick={() => startEye(flow.eye)}>Start test</button>
              </div>
            </div>
          )}
          {flow.step === "test" && (paused ? (
            <div className="space-y-6">
              <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold">Test paused</h1>
              <p className="text-lg">{storageError ? "Keep this page open to retain your place." : "Your place is kept in this tab."} Cover your {remainingEye} eye when you’re ready to continue.</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" className={primaryAction} onClick={() => setPaused(false)}>Resume {flow.eye} eye test</button>
                <Link href="/blur" className={secondaryAction}>Return to Blur</Link>
              </div>
            </div>
          ) : (
            <DiagnosisTrial flow={flow} heading={heading} onAnswer={answer} onPause={() => setPaused(true)} />
          ))}
          {flow.step === "result" && (
            <ResultTestBlur result={flow.results[flow.eye]} headingRef={heading} isSaving={isSaving}
              saved={flow.saved[flow.eye]} saveError={saveError}
              onRetry={() => saveResult(flow.results[flow.eye])}
              onContinue={() => flow.results[remainingEye] ? commit({ ...flow, step: "summary" }) : startEye(remainingEye)}
              continueLabel={flow.results[remainingEye] ? "View summary" : `Test ${remainingEye} eye`}
              onFinish={() => commit({ ...flow, step: "summary" })} />
          )}
          {flow.step === "summary" && (
            <div className="space-y-6">
              <div><p className="mb-2 font-semibold text-slate-700">{completed.length} OF 2 EYES COMPLETED</p><h1 ref={heading} tabIndex={-1} className="text-3xl font-bold">{completed.length === 2 ? "Blur test complete" : "Your Blur result"}</h1></div>
              <div className="grid gap-4 sm:grid-cols-2">
                {["right", "left"].map((eye) => flow.results[eye] ? <ResultCard key={eye} result={flow.results[eye]} /> : (
                  <div key={eye} className="rounded-2xl border border-dashed border-slate-300 p-6"><h3 className="text-xl font-semibold capitalize">{eye} eye</h3><p className="mt-3 text-slate-700">Not tested this time</p><button type="button" disabled={!allSaved} className={secondaryAction + " mt-4"} onClick={() => startEye(eye)}>Test {eye} eye</button></div>
                ))}
              </div>
              {allSaved ? <p role="status">✓ {completed.length === 2 ? "Both results saved successfully." : "Result saved successfully."}</p> : <div role="alert"><p>One result still needs saving.</p><button type="button" className={secondaryAction} onClick={() => commit({ ...flow, step: "result", eye: completed.find((result) => !flow.saved[result.eye]).eye })}>Review unsaved result</button></div>}
              <p className="leading-relaxed text-slate-700">These are the character sizes recorded at the end of this exercise, not a measure of visual acuity or a medical diagnosis.</p>
              <div className="border-t border-slate-200 pt-6">
                <h2 className="mb-4 text-xl font-semibold">What would you like to do next?</h2>
                <div className="flex flex-col gap-3">
                  {completed.filter((result) => flow.saved[result.eye]).map((result) => <Link key={result.eye} href={`/blur/improve/${result.fontSize}_1_${result.eye}`} className={primaryAction}>Start {result.eye} eye training</Link>)}
                  <Link href="/user" className={secondaryAction}>View my progress and results</Link>
                  <Link href="/" className={secondaryAction}>Return to main page</Link>
                  <button type="button" className={secondaryAction} disabled={!allSaved} onClick={() => commit(freshFlow())}>Start a new test</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </ScreenCalibration>
    </BlurFrame>
  );
}

function FocusStep({ heading, step, paused }) {
  // Inside the calibration Activity: focus is restored when calibration resumes.
  useEffect(() => { heading.current?.focus(); }, [heading, step, paused]);
  return null;
}

function DiagnosisTrial({ flow, heading, onAnswer, onPause }) {
  const calibration = useCalibration();
  const otherEye = flow.eye === "right" ? "left" : "right";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h1 ref={heading} tabIndex={-1} className="text-2xl font-bold capitalize">{flow.eye} eye test</h1><p className="mt-2 text-slate-700">Cover your {otherEye} eye · Stay 1 metre away</p></div>
        <p role="status" className="rounded-full bg-stone-100 px-4 py-2">Trial {flow.trial.number}</p>
      </div>
      <p id="blur-answer-prompt" className="text-center text-lg font-semibold">Which character do you see?</p>
      <div className="flex min-h-48 items-center justify-center py-6 sm:min-h-56">
        <span aria-hidden="true" className="block text-center leading-none text-black" style={{ fontSize: mmToPx(flow.trial.size, calibration) }}>{flow.trial.character}</span>
      </div>
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4" role="group" aria-labelledby="blur-answer-prompt">
        {flow.trial.buttons.map((character, index) => <button key={index} type="button" className="min-h-20 rounded-2xl border-2 border-slate-300 bg-white px-6 py-3 text-5xl hover:border-amber-700 hover:bg-amber-50 active:bg-amber-100" onClick={() => onAnswer(character)}>{character}</button>)}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" className={secondaryAction} onClick={() => onAnswer(null)}>Not sure</button>
        <button type="button" className={secondaryAction} onClick={onPause}>Pause test</button>
      </div>
    </div>
  );
}
