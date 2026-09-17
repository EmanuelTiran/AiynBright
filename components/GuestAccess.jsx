"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import styles from "./GuestPreview.module.css";

const GuestAccessContext = createContext(null);

export function GuestAccess({ children }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (trigger.current?.isConnected) trigger.current.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!closing) return;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 160;
    const timer = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [closing]);

  function requestSignIn(event) {
    trigger.current = event.currentTarget;
    setClosing(false);
    setOpen(true);
  }

  return (
    <GuestAccessContext.Provider value={requestSignIn}>
      {children}
      <dialog
        ref={dialog}
        className={styles.dialog}
        data-closing={closing || undefined}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => { event.preventDefault(); setClosing(true); }}
        onClick={(event) => { if (event.target === event.currentTarget) setClosing(true); }}
      >
        <div className={styles.dialogContent}>
          <h2 id={titleId}>Sign in to continue</h2>
          <p id={descriptionId}>Create or sign in to your AyinBright account to start tests, save results and track your progress.</p>
          <Link href="/login" className={styles.primary}>Sign In</Link>
          <button type="button" className={styles.secondary} onClick={() => setClosing(true)}>Continue browsing</button>
        </div>
      </dialog>
    </GuestAccessContext.Provider>
  );
}

export function AccountAction({ authenticated = false, href, className = styles.primary, children }) {
  const requestSignIn = useContext(GuestAccessContext);
  return authenticated ? (
    <Link href={href} className={className}>{children}</Link>
  ) : (
    <button type="button" className={className} onClick={requestSignIn} aria-haspopup="dialog">{children}</button>
  );
}
