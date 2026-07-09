"use client";

import DashboardPanel from '../DashboardPanel/DashboardPanel';
import styles from './ScannerActivity.module.css';

interface ProgressRow {
  label: string;
  percent: number;
}

const checkpoints: ProgressRow[] = [
  { label: 'Main Entrance Gate', percent: 64 },
  { label: 'Library Turnstile', percent: 45 },
  { label: 'Science Lab Terminal', percent: 12 },
];

export default function ScannerActivity() {
  return (
    <DashboardPanel title="Scanner Activity" delay={340}>
      <div className={styles.progressList}>
        {checkpoints.map((item) => (
          <div key={item.label} className={styles.progressItem}>
            <div className={styles.progressInfo}>
              <span>{item.label}</span>
              <span>{item.percent}%</span>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
