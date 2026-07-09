"use client";

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import DashboardPanel from '../DashboardPanel/DashboardPanel';
import styles from './TopScantion.module.css';

const sanctionData = [
  { name: 'Marcus Vance', role: '3rd Year', value: '5 Offenses', dot: styles.statusDotRed },
  { name: 'Elena Rostova', role: '1st Year', value: '3 Offenses', dot: styles.statusDotRed },
  { name: 'Jin-Woo Park', role: '4th Year', value: '2 Offenses', dot: styles.statusDotYellow },
  { name: 'Amara Diallo', role: '2nd Year', value: '1 Offense', dot: styles.statusDotGreen },
];

export default function TopSanctions() {
  return (
    <DashboardPanel icon={ShieldAlert} title="Top Student Sanctions" delay={260}>
      <div className={styles.statusList}>
        {sanctionData.map((s) => (
          <div key={s.name} className={styles.statusRow}>
            <div className={styles.statusRowLeft}>
              <span className={`${styles.statusDot} ${s.dot}`} />
              <div className={styles.metaTextWrapper}>
                <span className={styles.studentName}>{s.name}</span>
                <span className={styles.studentRole}>{s.role}</span>
              </div>
            </div>
            <span className={styles.statusValue}>{s.value}</span>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}