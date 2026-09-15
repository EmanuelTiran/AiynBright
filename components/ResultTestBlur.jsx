"use client";

import { ResultCard, primaryAction, secondaryAction } from "./Blur/FlowUI";

export default function ResultTestBlur({ result, headingRef, isSaving, saved, saveError, onRetry, onContinue, continueLabel, onFinish }) {
  return (
    <div className="space-y-6">
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold capitalize">{result.eye} eye test complete</h1>
      <ResultCard result={result} />
      <p className="leading-relaxed text-slate-700">The character size recorded at the end of this exercise. This is not a medical diagnosis.</p>
      <div aria-live="polite">
        {isSaving ? <p role="status">Saving your result…</p> : saved ? <p role="status">✓ Result saved successfully.</p> : (
          <div className="space-y-3">
            <p role="alert" className="text-red-800">{saveError || "This result has not been confirmed as saved. Save it before continuing."}</p>
            <button type="button" onClick={onRetry} className={secondaryAction}>Retry saving</button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onContinue} disabled={isSaving || !saved} className={primaryAction}>{continueLabel}</button>
        <button type="button" onClick={onFinish} disabled={isSaving || !saved} className={secondaryAction}>Finish for now</button>
      </div>
    </div>
  );
}
