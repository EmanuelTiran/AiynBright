import styles from "./flow.module.css";

export const primaryAction = "inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3 text-lg font-semibold text-slate-950 shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryAction = "inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60";

export function BlurFrame({ stage = 0, children }) {
  return (
    <main className={`${styles.flow} min-h-[calc(100vh-72px)] bg-stone-50 px-4 py-6 text-base text-slate-950 sm:py-10`}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xl font-bold tracking-tight">Blur <span className="font-normal text-slate-700">/ AyinBright</span></p>
          <p className="text-slate-700">At your own pace</p>
        </div>
        <ol aria-label="Blur test progress" className="mb-7 grid grid-cols-3 gap-3">
          {["Prepare", "Test eyes", "Results"].map((label, index) => (
            <li key={label} aria-current={stage === index ? "step" : undefined} className="space-y-2">
              <div aria-hidden="true" className={`h-1.5 rounded-full ${index <= stage ? "bg-gradient-to-r from-amber-300 to-amber-500" : "bg-slate-200"}`} />
              <span className={stage === index ? "font-bold" : "text-slate-700"}>{index < stage ? "✓" : index + 1} {label}</span>
            </li>
          ))}
        </ol>
        {children}
      </div>
    </main>
  );
}

export function ResultCard({ result }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <h3 className="text-xl font-semibold capitalize">{result.eye} eye</h3>
      <p className="mt-3 text-4xl font-bold">{result.fontSize} <span className="text-xl font-normal">mm</span></p>
      <p className="mt-3 text-slate-700">Recorded character size · 1 metre</p>
    </div>
  );
}
