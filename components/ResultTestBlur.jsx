"use client";

export default function ResultTestBlur({
  size,
  isLeftEye,
  isSaving,
  saveError,
  canRetry,
  onRetry,
  onContinue,
}) {
  const cannotContinue =
    isSaving || Boolean(saveError);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blur-result-title"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-8 transition-all duration-500 ease-in-out hover:scale-105">
        <h2
          id="blur-result-title"
          className="mb-4 text-center text-3xl font-bold text-yellow-500"
        >
          The result of the{" "}
          {isLeftEye ? "left" : "right"}{" "}
          eye test
        </h2>

        <p className="mb-6 text-center text-xl">
          הגודל המינימלי שבו הצלחת לראות
          הוא:

          <span className="mt-2 block animate-pulse text-2xl font-bold text-yellow-500">
            {size}mm
          </span>
        </p>

        {isSaving && (
          <p
            role="status"
            className="mb-4 text-center text-slate-700"
          >
            Saving the result…
          </p>
        )}

        {saveError && (
          <p
            role="alert"
            className="mb-4 text-center text-red-700"
          >
            {saveError}
          </p>
        )}

        <div className="flex flex-col items-center gap-3 text-center">
          {saveError && canRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isSaving}
              className="rounded-full bg-red-600 px-6 py-2 text-white hover:bg-red-700 disabled:opacity-60"
            >
              Retry saving
            </button>
          )}

          <button
            type="button"
            onClick={onContinue}
            disabled={cannotContinue}
            className="rounded-full bg-yellow-500 px-6 py-2 text-white transition-colors duration-300 hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {!isLeftEye
              ? "Try left eye"
              : "Go to improve vision"}
          </button>
        </div>
      </div>
    </div>
  );
}