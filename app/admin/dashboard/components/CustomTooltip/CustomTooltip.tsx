"use client";

import styles from './CustomTooltip.module.css';

export interface TooltipEntry {
  dataKey: string;
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

/**
 * Shared Recharts tooltip used by every chart in the dashboard
 * (TrafficAnalytics, TopCategories, CheckpointChart) so tooltip
 * styling only has to be maintained in one place.
 */
export default function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className={styles.customTooltip}>
      {label && <div className={styles.tooltipDate}>{label}</div>}
      {payload.map((entry) => (
        <div key={entry.dataKey} className={styles.tooltipRow} style={{ color: entry.color }}>
          <span className={styles.dot} style={{ background: entry.color }} />
          {entry.name}: {entry.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}
