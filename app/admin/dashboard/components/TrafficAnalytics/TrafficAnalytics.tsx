"use client";

import React, { useState } from 'react';
import { AreaChart as AreaChartIcon } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardPanel from '../DashboardPanel/DashboardPanel';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import styles from './TrafficAnalytics.module.css';

// Separate dataset arrays depending on active selector target
const attendanceTimeline = [
  { day: 'Apr 8', count: 1420 },
  { day: 'Apr 9', count: 1650 },
  { day: 'Apr 10', count: 1720 },
  { day: 'Apr 11', count: 1580 },
  { day: 'Apr 12', count: 1980 },
  { day: 'Apr 13', count: 1900 },
  { day: 'Apr 14', count: 2150 },
];

const paymentTimeline = [
  { day: 'Apr 8', count: 3200 },
  { day: 'Apr 9', count: 3800 },
  { day: 'Apr 10', count: 4100 },
  { day: 'Apr 11', count: 3600 },
  { day: 'Apr 12', count: 4600 },
  { day: 'Apr 13', count: 4300 },
  { day: 'Apr 14', count: 5100 },
];

export default function TrafficAnalytics() {
  const [activeMetric, setActiveMetric] = useState<'attendance' | 'payments'>('attendance');

  const currentData = activeMetric === 'attendance' ? attendanceTimeline : paymentTimeline;
  const areaStrokeColor = activeMetric === 'attendance' ? '#16a34a' : '#0284c7';
  const areaGradientId = activeMetric === 'attendance' ? 'attendanceGradient' : 'paymentsGradient';

  return (
    <DashboardPanel
      icon={AreaChartIcon}
      title="Traffic Analytics"
      actionLabel="View All"
      delay={120}
      legend={
        <div className={styles.chartLegend}>
          <span className={activeMetric === 'attendance' ? styles.legendGreen : styles.legendBlue}>
            <span className={styles.dot} /> {activeMetric === 'attendance' ? 'Total Attendances' : 'Processed Payments'}
          </span>
        </div>
      }
    >
      <div className={styles.panelContentContainer}>
        {/* Glassmorphic Tab Segment Selector */}
        <div className={styles.uiSelectorContainer}>
          <button
            type="button"
            className={`${styles.selectorTab} ${activeMetric === 'attendance' ? styles.activeTab : ''}`}
            onClick={() => setActiveMetric('attendance')}
          >
            Attendance
          </button>
          <button
            type="button"
            className={`${styles.selectorTab} ${activeMetric === 'payments' ? styles.activeTab : ''}`}
            onClick={() => setActiveMetric('payments')}
          >
            Payments
          </button>
        </div>

        {/* Dynamic Chart Layer */}
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="paymentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.12)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                name={activeMetric === 'attendance' ? 'Attendances' : 'Payments'}
                stroke={areaStrokeColor}
                strokeWidth={2}
                fill={`url(#${areaGradientId})`}
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardPanel>
  );
}