"use client";

import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardPanel from '../DashboardPanel/DashboardPanel';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import styles from './CheckpointChart.module.css';

const checkpointData = [
  { name: 'Main Gate', scans: 1840 },
  { name: 'Library', scans: 1120 },
  { name: 'Science Lab', scans: 640 },
  { name: 'Cafeteria', scans: 980 },
  { name: 'Gymnasium', scans: 410 },
];

export default function CheckpointChart() {
  return (
    <DashboardPanel icon={BarChart3} title="Scans by Checkpoint" actionLabel="View All" delay={220}>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={checkpointData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.12)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.06)' }} />
            <Bar dataKey="scans" name="Scans" fill="#0284c7" radius={[6, 6, 0, 0]} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardPanel>
  );
}
