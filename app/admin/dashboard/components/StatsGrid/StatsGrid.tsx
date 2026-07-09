"use client";

import { Users, Scan, FileText, AlertTriangle } from 'lucide-react';
import StatCard, { type SummaryCardData } from './StatCard';
import styles from './StatsGrid.module.css';

const summaryCards: SummaryCardData[] = [
  { title: 'Total Users', value: 1248, suffix: '', change: '+16%', isPositive: true, icon: Users },
  { title: 'Total Scans', value: 140842, suffix: '', change: '+12.05%', isPositive: true, icon: Scan },
  { title: 'Documents', value: 560056, suffix: '', change: '-8.4%', isPositive: false, icon: FileText },
  { title: 'Sanctions', value: 48.78, suffix: '%', change: '+2%', isPositive: true, icon: AlertTriangle },
];

export default function StatsGrid() {
  return (
    <section className={styles.statsGrid}>
      {summaryCards.map((card, idx) => (
        <StatCard key={card.title} card={card} delay={idx * 60} />
      ))}
    </section>
  );
}
