"use client";

import React, { useState } from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardPanel from '../DashboardPanel/DashboardPanel';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import styles from './TopYearLevel.module.css';

// Year level data structures mapped by operational state
const attendanceData = [
  { name: '1st Year', value: 42, color: '#0284c7' },
  { name: '2nd Year', value: 28, color: '#0ea5e9' },
  { name: '3rd Year', value: 18, color: '#16a34a' },
  { name: '4th Year', value: 12, color: '#eab308' },
];

const paymentData = [
  { name: '4th Year', value: 38, color: '#eab308' },
  { name: '3rd Year', value: 27, color: '#16a34a' },
  { name: '1st Year', value: 20, color: '#0284c7' },
  { name: '2nd Year', value: 15, color: '#0ea5e9' },
];

export default function TopCategories() {
  // Custom State handling metric selection toggles
  const [viewMetric, setViewMetric] = useState<'attendance' | 'payments'>('attendance');

  const currentData = viewMetric === 'attendance' ? attendanceData : paymentData;
  const primaryLabel = currentData[0].name;
  const primaryValue = currentData[0].value;

  return (
    <DashboardPanel icon={PieChartIcon} title="Top Year Levels" delay={180}>
      <div className={styles.panelContentWrapper}>
        
        {/* Custom UI Metric Tab Selector */}
        <div className={styles.uiSelectorContainer}>
          <button 
            type="button"
            className={`${styles.selectorTab} ${viewMetric === 'attendance' ? styles.activeTab : ''}`}
            onClick={() => setViewMetric('attendance')}
          >
            Attendances
          </button>
          <button 
            type="button"
            className={`${styles.selectorTab} ${viewMetric === 'payments' ? styles.activeTab : ''}`}
            onClick={() => setViewMetric('payments')}
          >
            Payments
          </button>
        </div>

        {/* Ring Analytics Rendering Layer */}
        <div className={styles.ringChartWrapper}>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="72%"
                  outerRadius="95%"
                  paddingAngle={3}
                  animationDuration={600}
                >
                  {currentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className={styles.ringCenterLabel}>
              <div className={styles.ringValue}>{primaryValue}%</div>
              <div className={styles.ringCaption}>{primaryLabel}</div>
            </div>
          </div>

          {/* Dynamic Interactive Legend Block */}
          <div className={styles.ringLegend}>
            {currentData.map((item) => (
              <div key={item.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
                <span className={styles.legendText}>{item.name}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </DashboardPanel>
  );
}