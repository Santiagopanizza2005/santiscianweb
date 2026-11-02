import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Santi Scian",
  description: "",
};

export default function Page() {
  return (
    <main className={styles.page}>
      <h1 className={styles.greeting}>
        <span className={styles.label}>Hi,</span>{" "}
        <span className={styles.label}>my</span>{" "}
        <span className={styles.label}>name</span>{" "}
        <span className={styles.label}>is</span>{" "}
        <span className={styles.label}>Santi</span>
      </h1>
      <p className={styles.subtitle}>
        <svg className={styles.markerCircle} viewBox="0 0 340 80" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M322 50C343 19 291 7 199 9C109 5 25 11 14 36C3 61 61 73 151 71C239 77 319 68 326 43" />
          <path d="M319 29C299 12 245 9 197 12" />
        </svg>
        These are my apps
      </p>
      <div className={styles.notes}>
        <a className={`${styles.note} ${styles.noteLink}`} href="https://apps.apple.com/us/app/unseg-bloqueo-de-apps/id6795560284" target="_blank" rel="noopener noreferrer" aria-label="OneSec — Download on the App Store">
          <div className={styles.paper} aria-hidden="true" />
          <span className={styles.pin} aria-hidden="true" />
          <div className={`${styles.noteContent} ${styles.appContent}`}>
            <Image className={styles.appIcon} src="/ChatGPT Image Jul 28, 2026, 10_26_25 AM 1 (1).png" alt="" width={104} height={104} unoptimized />
            <h2 className={styles.appName}>OneSec</h2>
            <p className={styles.appDescription}>Blocks selected apps for a time you choose after you dismiss your alarm.</p>
            <Image className={styles.storeBadge} src="/app-store-badge.svg" alt="Download on the App Store" width={120} height={40} unoptimized />
          </div>
        </a>
        <a className={`${styles.note} ${styles.noteLink}`} href="https://apps.apple.com/us/app/cocorico-despertador-con-reto/id6792940399" target="_blank" rel="noopener noreferrer" aria-label="Cocoricó — Download on the App Store">
          <div className={styles.paper} aria-hidden="true" />
          <span className={styles.pin} aria-hidden="true" />
          <div className={`${styles.noteContent} ${styles.appContent}`}>
            <Image className={styles.appIcon} src="/coco-icon.png" alt="" width={104} height={104} unoptimized />
            <h2 className={styles.appName}>Cocoricó</h2>
            <p className={styles.appDescription}>An alarm that won’t stop until you complete a challenge, like doing push-ups.</p>
            <Image className={styles.storeBadge} src="/app-store-badge.svg" alt="Download on the App Store" width={120} height={40} unoptimized />
          </div>
        </a>
      </div>
    </main>
  );
}
