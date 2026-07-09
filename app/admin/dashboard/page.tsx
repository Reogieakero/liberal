"use client";

import React, { useEffect, useState } from 'react';
import {
  Users,
  Scan,
  FileText,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  AreaChart as AreaChartIcon,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  ScanLine,
  UserPlus,
  ShieldAlert,
  ServerCog,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './page.module.css';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';

const trafficData = [
  { day: 'Apr 8', scans: 3200, documents: 1400 },
  { day: 'Apr 9', scans: 3800, documents: 1650 },
  { day: 'Apr 10', scans: 4100, documents: 1720 },
  { day: 'Apr 11', scans: 3600, documents: 1580 },
  { day: 'Apr 12', scans: 4600, documents: 1980 },
  { day: 'Apr 13', scans: 4300, documents: 1900 },
  { day: 'Apr 14', scans: 5100, documents: 2150 },
];

const categoryData = [
  { name: 'Students', value: 65, color: '#0284c7' },
  { name: 'Staff', value: 20, color: '#16a34a' },
  { name: 'Visitors', value: 15, color: '#eab308' },
];

const checkpointData = [
  { name: 'Main Gate', scans: 1840 },
  { name: 'Library', scans: 1120 },
  { name: 'Science Lab', scans: 640 },
  { name: 'Cafeteria', scans: 980 },
  { name: 'Gymnasium', scans: 410 },
];

const recentUsers = [
  { name: 'Y-3 QASA', role: 'Student', count: '0 pcs', status: 'Out of Stock', statusClass: styles.danger },
  { name: 'ULTRABOOST LIGHT RUNNING', role: 'Staff', count: '12 pcs', status: 'In Stock', statusClass: styles.success },
  { name: 'BYW SELECT SHOES', role: 'Visitor', count: '36 pcs', status: 'Low quantity', statusClass: styles.warning },
];

const activityFeed = [
  { icon: ScanLine, text: <><b>Maria Santos</b> scanned in at Main Entrance Gate</>, time: '2m ago' },
  { icon: UserPlus, text: <><b>New visitor</b> registered — badge #V-2291</>, time: '11m ago' },
  { icon: FileText, text: <><b>Document batch</b> uploaded to Records (24 files)</>, time: '28m ago' },
  { icon: ShieldAlert, text: <><b>Sanction flag</b> raised for badge #S-0417</>, time: '46m ago' },
  { icon: ScanLine, text: <><b>128 scans</b> processed at Library Turnstile</>, time: '1h ago' },
];

const systemStatus = [
  { label: 'Scanner Network', value: 'Operational', dot: styles.statusDotGreen },
  { label: 'Sync with Records DB', value: 'Operational', dot: styles.statusDotGreen },
  { label: 'Sanctions API', value: 'Degraded — 320ms', dot: styles.statusDotYellow },
  { label: 'Backup Job (Nightly)', value: 'Completed 03:00', dot: styles.statusDotGreen },
];

interface TooltipEntry {
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

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={styles.customTooltip}>
      <div className={styles.tooltipDate}>{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className={styles.tooltipRow} style={{ color: entry.color }}>
          <span className={styles.dot} style={{ background: entry.color }}></span>
          {entry.name}: {entry.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

type SummaryCard = {
  title: string;
  value: number;
  suffix: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
};

function StatCard({ card, delay }: { card: SummaryCard; delay: number }) {
  const Icon = card.icon;
  const animated = useCountUp(card.value);
  const display =
    card.suffix === '%' ? animated.toFixed(2) + '%' : Math.round(animated).toLocaleString();

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
        <span>{card.change} <span className={styles.trendPeriod}>this week</span></span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const summaryCards: SummaryCard[] = [
    { title: 'Total Users', value: 1248, suffix: '', change: '+16%', isPositive: true, icon: Users },
    { title: 'Total Scans', value: 140842, suffix: '', change: '+12.05%', isPositive: true, icon: Scan },
    { title: 'Documents', value: 560056, suffix: '', change: '-8.4%', isPositive: false, icon: FileText },
    { title: 'Sanctions', value: 48.78, suffix: '%', change: '+2%', isPositive: true, icon: AlertTriangle },
  ];

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.workspaceWrapper}>
        <AdminSidebar />

        <main className={styles.main}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.pageTitle}>Overview</h1>
              <p className={styles.pageSubtitle}>Real-time snapshot of scanning &amp; records activity</p>
            </div>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot}></span>
              Live
            </div>
          </div>

          {/* Metric Cards Grid */}
          <section className={styles.statsGrid}>
            {summaryCards.map((card, idx) => (
              <StatCard key={card.title} card={card} delay={idx * 60} />
            ))}
          </section>

          {/* Analytics Modules Grid */}
          <section className={styles.chartLayoutGrid}>
            {/* Left Block: Traffic Trend Module — Recharts Area Chart */}
            <div className={`${styles.dashboardPanel} ${styles.fadeIn}`} style={{ animationDelay: '120ms' }}>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitleWrapper}>
                    <AreaChartIcon size={16} className={styles.chartIconHeader} />
                    <h3 className={styles.panelTitle}>Traffic Analytics</h3>
                  </div>
                  <div className={styles.chartLegend}>
                    <span className={styles.legendBlue}><span className={styles.dot}></span> Scans</span>
                    <span className={styles.legendGreen}><span className={styles.dot}></span> Documents</span>
                  </div>
                </div>
                <button className={styles.viewAllBtn}>View All <ChevronRight size={14} /></button>
              </div>

              <div className={styles.rechartsWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="docsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.12)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      name="Scans"
                      stroke="#0284c7"
                      strokeWidth={2}
                      fill="url(#scansGradient)"
                      animationDuration={1100}
                    />
                    <Area
                      type="monotone"
                      dataKey="documents"
                      name="Documents"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fill="url(#docsGradient)"
                      animationDuration={1100}
                      animationBegin={150}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Block: Breakdown Category Module — Recharts Donut */}
            <div className={`${styles.dashboardPanel} ${styles.fadeIn}`} style={{ animationDelay: '180ms' }}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleWrapper}>
                  <PieChartIcon size={16} className={styles.chartIconHeader} />
                  <h3 className={styles.panelTitle}>Top Categories</h3>
                </div>
              </div>
              <div className={styles.ringChartWrapper}>
                <div className={styles.rechartsWrapperSmall} style={{ width: 160, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="70%"
                        outerRadius="95%"
                        paddingAngle={3}
                        animationDuration={900}
                      >
                        {categoryData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className={styles.ringCenterLabel}>
                    <div className={styles.ringValue}>{categoryData[0].value}%</div>
                    <div className={styles.ringCaption}>Students</div>
                  </div>
                </div>
                <div className={styles.ringLegend}>
                  <div><span className={styles.dotBlue}></span> Students</div>
                  <div><span className={styles.dotGreen}></span> Staff</div>
                  <div><span className={styles.dotYellow}></span> Visitors</div>
                </div>
              </div>
            </div>
          </section>

          {/* Checkpoint Comparison + System Status */}
          <section className={styles.chartLayoutGrid}>
            <div className={`${styles.dashboardPanel} ${styles.fadeIn}`} style={{ animationDelay: '220ms' }}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleWrapper}>
                  <BarChart3 size={16} className={styles.chartIconHeader} />
                  <h3 className={styles.panelTitle}>Scans by Checkpoint</h3>
                </div>
                <button className={styles.viewAllBtn}>View All <ChevronRight size={14} /></button>
              </div>
              <div className={styles.rechartsWrapper}>
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
            </div>

            <div className={`${styles.dashboardPanel} ${styles.fadeIn}`} style={{ animationDelay: '260ms' }}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleWrapper}>
                  <ServerCog size={16} className={styles.chartIconHeader} />
                  <h3 className={styles.panelTitle}>System Status</h3>
                </div>
              </div>
              <div className={styles.statusPanelList}>
                {systemStatus.map((s) => (
                  <div key={s.label} className={styles.statusRow}>
                    <div className={styles.statusRowLeft}>
                      <span className={`${styles.statusDot} ${s.dot}`}></span>
                      {s.label}
                    </div>
                    <span className={styles.statusValue}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Lower Tables and Lists */}
          <section className={styles.chartLayoutGrid}>
            <div className={`${styles.dashboardPanel} ${styles.fadeIn}`} style={{ animationDelay: '300ms' }}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>Recent Scans</h3>
                <button className={styles.viewAllBtn}>View All <ChevronRight size={14} /></button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>User Info</th>
                      <th>Role</th>
                      <th>Activity Count</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className={styles.tableNameCell}>
                            <div className={styles.tableAvatar}></div>
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td>{item.role}</td>
                        <td>{item.count}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${item.statusClass}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`${styles.dashboardPanel} ${styles.fadeIn}`} style={{ animationDelay: '340ms' }}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>Scanner Activity</h3>
              </div>
              <div className={styles.progressList}>
                <div className={styles.progressItem}>
                  <div className={styles.progressInfo}><span>Main Entrance Gate</span><span>64%</span></div>
                  <div className={styles.progressBarBg}><div className={styles.progressBarFill} style={{ width: '64%' }}></div></div>
                </div>
                <div className={styles.progressItem}>
                  <div className={styles.progressInfo}><span>Library Turnstile</span><span>45%</span></div>
                  <div className={styles.progressBarBg}><div className={styles.progressBarFill} style={{ width: '45%' }}></div></div>
                </div>
                <div className={styles.progressItem}>
                  <div className={styles.progressInfo}><span>Science Lab Terminal</span><span>12%</span></div>
                  <div className={styles.progressBarBg}><div className={styles.progressBarFill} style={{ width: '12%' }}></div></div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity Feed — full width */}
          <section className={`${styles.dashboardPanel} ${styles.fadeIn}`} style={{ animationDelay: '380ms' }}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleWrapper}>
                <Activity size={16} className={styles.chartIconHeader} />
                <h3 className={styles.panelTitle}>Recent Activity</h3>
              </div>
              <button className={styles.viewAllBtn}>View All <ChevronRight size={14} /></button>
            </div>
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
          </section>
        </main>
      </div>
    </div>
  );
}