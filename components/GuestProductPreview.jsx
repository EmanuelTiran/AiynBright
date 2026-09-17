import Link from "next/link";
import { AccountAction, GuestAccess } from "./GuestAccess";
import styles from "./GuestPreview.module.css";

const products = {
  blur: {
    title: "Blur Vision", description: "Explore character recognition at different sizes, one eye at a time.",
    instructions: ["Sit 1 metre from the screen at eye level.", "Cover the other eye gently and keep room lighting consistent.", "Use the same glasses or contacts when comparing tests."],
    href: "/blur/diagnosis", rules: "/blurRules.txt", className: styles.blur,
  },
  color: {
    title: "Color Vision", description: "Explore how characters appear against different background and character colors.",
    instructions: ["The exercise lets you adjust the background and character colors.", "Change the character as you work through combinations.", "Record combinations you find difficult in your personal results."],
    href: "/color", className: styles.color,
  },
  field: {
    title: "Field Vision", description: "Explore characters at different positions on either side of the screen.",
    instructions: ["Screen calibration helps position the character during the exercise.", "Choose a side and adjust the character position with the left and right controls.", "Record difficult positions in your personal results."],
    href: "/field", rules: "/fieldsRules.txt", className: styles.field,
  },
};

export default function GuestProductPreview({ product, training = false }) {
  const feature = products[product];
  return (
    <GuestAccess>
      <main className={`${styles.preview} ${feature.className}`}>
        <section className={styles.panel}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>GUEST PREVIEW</p>
            <h1>{feature.title}{training ? " training" : ""}</h1>
            <p>{feature.description}</p>
          </header>
          <div className={styles.content}>
            <div className={styles.sample} aria-label={`${feature.title} illustrative preview`}>
              <span aria-hidden="true" className={product === "color" ? styles.colorCharacter : styles.character}>9</span>
              <p>Example only · Your test has not started</p>
            </div>
            <details className={styles.instructions} open>
              <summary>How it works</summary>
              <ul>{feature.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ul>
              {feature.rules && <a href={feature.rules} target="_blank" rel="noreferrer">Read detailed instructions (new tab)</a>}
            </details>
            <div className={styles.actions}>
              <AccountAction href={feature.href}>{training ? "Begin training" : "Start test"}</AccountAction>
              <AccountAction href="/user" className={styles.secondary}>View personal progress</AccountAction>
            </div>
            <p>Educational exercises, not a medical diagnosis.</p>
            <PreviewNavigation />
          </div>
        </section>
      </main>
    </GuestAccess>
  );
}

export function GuestUserPreview() {
  return (
    <GuestAccess>
      <main className={`${styles.preview} ${styles.user}`}>
        <section className={styles.panel}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>GUEST PREVIEW</p>
            <h1>User Status</h1>
            <p>A place for your saved exercises and progress, all together.</p>
          </header>
          <div className={styles.content}>
            <section className={styles.empty}>
              <h2>Your profile</h2>
              <p>Sign in to see your account details and personal results.</p>
              <AccountAction href="/user">View my profile and history</AccountAction>
            </section>
            {Object.entries(products).map(([key, feature]) => (
              <section key={key} className={styles.empty}>
                <h2>{feature.title} results</h2>
                <p>Your saved results will appear here when you sign in. No personal results are loaded in this preview.</p>
                <div className={styles.actions}>
                  <AccountAction href="/user" className={styles.secondary}>View {feature.title} progress</AccountAction>
                  <Link href={`/${key}`} className={styles.textLink}>Explore {feature.title}</Link>
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </GuestAccess>
  );
}

function PreviewNavigation() {
  return (
    <nav aria-label="Explore AyinBright" className={styles.browse}>
      <Link href="/blur">Blur Vision</Link>
      <Link href="/color">Color Vision</Link>
      <Link href="/field">Field Vision</Link>
      <Link href="/user">User Status</Link>
    </nav>
  );
}
