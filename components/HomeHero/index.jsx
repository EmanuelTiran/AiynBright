"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FiEye, FiMonitor, FiShield, FiZap } from "react-icons/fi";
import OpticalIrisOrb from "@/components/OpticalIrisOrb";
import styles from "./style.module.css";

const benefits = [
  { href: "/blur", label: "Accurate Results", Icon: FiEye },
  { href: "/color", label: "Quick Tests", Icon: FiZap },
  { href: "/field", label: "Works on Any Device", Icon: FiMonitor },
  { href: "/about", label: "Your Privacy Matters", Icon: FiShield },
];

export default function HomeHero() {
  const hero = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <section ref={hero} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Better vision. A brighter life.</p>
          <h1 id="hero-title">See More<br />Live <span>Brighter</span></h1>
          <p className={styles.description}>
            Quick, accurate and easy-to-use vision tests — powered by modern technology.
          </p>
        </div>

        <figure className={styles.visual}>
          <OpticalIrisOrb focused={hovered || focused} interactionRef={hero} />
          <svg className={styles.opticalMarks} viewBox="0 0 600 600" fill="none" aria-hidden="true" focusable="false">
            <g stroke="currentColor" strokeWidth=".65">
              <path d="M 60 267 A 237 237 0 0 1 170 67 M 525 203 A 240 240 0 0 1 486 401" />
              <path d="M 169 67 L 187 57 M 486 401 L 475 417 M 541 151 L 541 172 L 551 185" />
            </g>
            <g fill="currentColor"><circle cx="170" cy="67" r="1.5" /><circle cx="60" cy="267" r="1" /><circle cx="486" cy="401" r="1.5" /><circle cx="541" cy="151" r="1.5" /></g>
          </svg>
          <p className={styles.focusLabel}>Focus<br />Clarity<br />Health<br />Life</p>
          <figcaption>A sharper<br />tomorrow</figcaption>
        </figure>

        <div className={styles.actions}>
          <div className={styles.ctas}>
            <Link href="/blur" className={styles.primary}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(true); }}
              onPointerLeave={() => setHovered(false)}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
              Start Vision Test <span aria-hidden="true">→</span>
            </Link>
            <Link href="/about" className={styles.secondary}>Learn More</Link>
          </div>
        </div>

        <nav className={styles.benefits} aria-label="AyinBright benefits">
          {benefits.map(({ href, label, Icon }) => (
            <Link href={href} key={label}>
              <Icon aria-hidden="true" focusable="false" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <p className={styles.scrollCue}><span />Scroll to explore</p>
        <p className={styles.visionTag}>Vision<br />for a brighter you<span /></p>
      </div>
    </section>
  );
}
