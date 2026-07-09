"use client";

import type { LucideIcon } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { useCountUp } from '../../../../hooks/useCountUp';
import styles from './StatCard.module.css';

export interface SummaryCardData {
  title: string;
  value: number;
  suffix: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

interface StatCardProps {
  card: SummaryCardData;
  delay?: number;
}

export default function StatCard({ card, delay = 0 }: StatCardProps) {
  const Icon = card.icon;
  const animated = useCountUp(card.value);
  const display =
    card.suffix === '%' ? `${animated.toFixed(2)}%` : Math.round(animated).toLocaleString();

  return (
    <div className={`${styles.statCard} ${styles.fadeIn}`} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.cardHeader}>
        <div className={styles.iconContainer}>
          <Icon size={14} />
        </div>
        <span className={styles.cardTitle}>{card.title}</span>
      </div>
      <div className={styles.cardValue}>{display}</div>
      <div className={`${styles.cardTrend} ${card.isPositive ? styles.up : styles.down}`}>
        <TrendingUp size={12} className={card.isPositive ? '' : styles.rotateIcon} />
        <span>
          {card.change} <span className={styles.trendPeriod}>this week</span>
        </span>
      </div>
    </div>
  );
}
