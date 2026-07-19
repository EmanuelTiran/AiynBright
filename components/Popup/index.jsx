"use client";

import { useEffect, useState } from "react";
import style from "./style.module.css";

const RULE_FILES = {
  blur: "/blurRules.txt",
  field: "/fieldsRules.txt",
};

export default function Popup({
  open,
  setOpen,
  type,
}) {
  const [text, setText] = useState("");
  const [loadError, setLoadError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const controller =
      new AbortController();

    const ruleFile =
      RULE_FILES[type] ?? RULE_FILES.field;

    fetch(ruleFile, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to load the instructions.",
          );
        }

        return response.text();
      })
      .then((content) => {
        setText(content);
        setLoadError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setLoadError(
            error.message ||
              "Failed to load the instructions.",
          );
        }
      });

    return () => controller.abort();
  }, [open, type]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={style.outside}
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className={style.inside}
        onClick={(event) =>
          event.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-label="Test instructions"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mb-3 rounded bg-slate-800 px-3 py-2 text-white"
        >
          Close
        </button>

        <div
          className={style.scrollContent}
        >
          {loadError ? (
            <p
              role="alert"
              className="text-red-700"
            >
              {loadError}
            </p>
          ) : (
            text || "Loading…"
          )}
        </div>
      </div>
    </div>
  );
}