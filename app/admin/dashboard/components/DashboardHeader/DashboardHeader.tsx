"use client";

import styles from './DashboardHeader.module.css';

export default function DashboardHeader() {
  return (
    <div className={styles.headerRow}>
      <div>
        <h1 className={styles.pageTitle}>Overview</h1>
        <p className={styles.pageSubtitle}>Real-time snapshot of scanning &amp; records activity</p>
      </div>
      <div className={styles.liveIndicator}>
        <span className={styles.liveDot} />
        Live
      </div>
    </div>
  );
}
