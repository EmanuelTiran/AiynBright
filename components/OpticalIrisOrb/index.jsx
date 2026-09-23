"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

/** Decorative enhancement: the homepage never depends on WebGL or this chunk. */
export default function OpticalIrisOrb({ focused = false, interactionRef }) {
  const host = useRef(null);
  const controller = useRef(null);
  const focus = useRef(focused);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    focus.current = focused;
    controller.current?.setFocus(focused);
  }, [focused]);

  useEffect(() => {
    let cancelled = false;
    let started = false;
    const element = host.current;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      observer.disconnect();
      try {
        const { createOrbScene } = await import("./scene");
        if (cancelled) return;
        controller.current = createOrbScene(element, {
          interactionElement: interactionRef?.current || element,
          onReady: () => { if (!cancelled) setStatus("ready"); },
          onError: () => { if (!cancelled) setStatus("fallback"); },
        });
        controller.current.setFocus(focus.current);
      } catch {
        if (!cancelled) setStatus("fallback");
      }
    }, { rootMargin: "120px" });
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
      controller.current?.dispose();
      controller.current = null;
    };
  }, [interactionRef]);

  return (
    <div ref={host} className={styles.orb} data-state={status} aria-hidden="true">
      <div className={styles.fallback}><div /></div>
    </div>
  );
}
