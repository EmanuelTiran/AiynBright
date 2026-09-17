"use client";

import { useEffect, useId, useRef, useState } from "react";
import { instructions } from "./instructions";
import style from "./style.module.css";

const stages = ["הכנה", "מה עומד לקרות", "איך מבצעים נכון"];

export default function Popup({ type, training = false }) {
  const content = instructions[`${type}-${training ? "training" : "test"}`];
  const dialog = useRef(null);
  const trigger = useRef(null);
  const stepHeading = useRef(null);
  const previousOverflow = useRef(null);
  const [step, setStep] = useState(0);
  const id = useId();

  function open() {
    setStep(0);
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.showModal();
  }

  function dismiss() {
    dialog.current.close();
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
    trigger.current?.focus();
  }

  useEffect(() => {
    const element = dialog.current;
    return () => {
      element.close();
      if (previousOverflow.current !== null) {
        document.body.style.overflow = previousOverflow.current;
        previousOverflow.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (dialog.current.open) stepHeading.current?.focus();
  }, [step]);

  return (
    <div className={`${style.root} ${style[type]}`} dir="rtl" lang="he">
      <button ref={trigger} type="button" className={style.help} aria-haspopup="dialog" onClick={open}>
        <span aria-hidden="true" className={style.question}>?</span> איך זה עובד
      </button>
      <dialog ref={dialog} className={style.dialog} dir="rtl" lang="he" aria-labelledby={`${id}-title`}
        onCancel={(event) => { event.preventDefault(); dismiss(); }}>
        <div className={style.surface}>
          <header className={style.header}>
            <div><p className={style.eyebrow}>AyinBright · {content.label}</p><h2 id={`${id}-title`}>{training ? "איך עובד התרגול?" : "איך מבצעים את הבדיקה?"}</h2></div>
            <button type="button" className={style.close} aria-label="סגירת ההוראות" onClick={dismiss}>×</button>
          </header>
          <nav aria-label="שלבי ההכנה">
            <ol className={style.progress}>
              {stages.map((label, index) => <li key={label} aria-current={index === step ? "step" : undefined} data-complete={index <= step}>
                <span className={style.bar} aria-hidden="true" /><span>{label}</span>
              </li>)}
            </ol>
          </nav>
          <div className={style.content} key={step}>
            <div className={style.visual} aria-hidden="true">
              {step === 0 ? <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="8" width="34" height="24" rx="4" /><path d="M24 32v8M15 40h18M17 20l5 5 10-10" /></svg>
                : step === 2 ? <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="24" cy="24" r="17" /><path d="m15 24 6 6 13-13" /></svg>
                : <span className={type === "color" ? style.colorCue : type === "field" ? style.fieldCue : style.blurCue}>{type === "field" ? "•   A" : "A"}</span>}
            </div>
            <p className={style.counter}>{step + 1} מתוך 3</p>
            <h3 ref={stepHeading} tabIndex={-1} aria-describedby={`${id}-copy`}>{content.steps[step][0]}</h3>
            <p id={`${id}-copy`} className={style.copy}>{content.steps[step][1]}</p>
          </div>
          <footer className={style.footer}>
            <button type="button" className={style.primary} onClick={() => step === 2 ? dismiss() : setStep(step + 1)}>
              {step === 2 ? training ? "מתחילים לתרגל" : "אני מוכן, מתחילים" : "המשך"}
            </button>
            {step > 0 && <button type="button" className={style.back} onClick={() => setStep(step - 1)}>חזרה</button>}
          </footer>
          <p className={style.note}>אפשר לחזור להוראות בכל רגע דרך ״איך זה עובד״.</p>
        </div>
      </dialog>
    </div>
  );
}
