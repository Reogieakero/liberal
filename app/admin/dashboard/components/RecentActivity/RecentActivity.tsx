"use client";

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Activity, ScanLine, UserPlus, FileText, ShieldAlert } from 'lucide-react';
import DashboardPanel from '../DashboardPanel/DashboardPanel';
import styles from './RecentActivity.module.css';

interface ActivityRow {
  icon: LucideIcon;
  text: ReactNode;
  time: string;
}

const activityFeed: ActivityRow[] = [
  { icon: ScanLine, text: <><b>Maria Santos</b> scanned in at Main Entrance Gate</>, time: '2m ago' },
  { icon: UserPlus, text: <><b>New visitor</b> registered — badge #V-2291</>, time: '11m ago' },
  { icon: FileText, text: <><b>Document batch</b> uploaded to Records (24 files)</>, time: '28m ago' },
  { icon: ShieldAlert, text: <><b>Sanction flag</b> raised for badge #S-0417</>, time: '46m ago' },
  { icon: ScanLine, text: <><b>128 scans</b> processed at Library Turnstile</>, time: '1h ago' },
];

export default function RecentActivity() {
  return (
    <DashboardPanel icon={Activity} title="Recent Activity" actionLabel="View All" delay={380}>
      <div className={styles.activityList}>
        {activityFeed.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={styles.activityItem}>
              <div className={styles.activityIconWrap}>
                <Icon size={14} />
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityText}>{item.text}</span>
              </div>
              <span className={styles.activityTime}>{item.time}</span>
            </div>
          );
        })}
      </div>
    </DashboardPanel>
  );
}
