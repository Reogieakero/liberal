"use client";

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import styles from './DashboardPanel.module.css';

interface DashboardPanelProps {
  icon?: LucideIcon;
  title: string;
  /** Optional node rendered under the title, e.g. a chart legend */
  legend?: ReactNode;
  /** Shows a "View All" style button in the header when provided */
  actionLabel?: string;
  onAction?: () => void;
  /** Stagger delay (ms) for the fade-in-up entrance animation */
  delay?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Shared card chrome for every dashboard widget: background, border,
 * hover elevation, header (icon + title + optional legend + optional
 * action button), and the fade-in-up entrance animation. Individual
 * widgets only need to supply their own content.
 */
export default function DashboardPanel({
  icon: Icon,
  title,
  legend,
  actionLabel,
  onAction,
  delay = 0,
  className,
  children,
}: DashboardPanelProps) {
  return (
    <div
      className={`${styles.panel} ${styles.fadeIn} ${className ?? ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.panelTitleWrapper}>
            {Icon && <Icon size={16} className={styles.panelIcon} />}
            <h3 className={styles.panelTitle}>{title}</h3>
          </div>
          {legend}
        </div>
        {actionLabel && (
          <button type="button" className={styles.viewAllBtn} onClick={onAction}>
            {actionLabel} <ChevronRight size={14} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
