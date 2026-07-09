"use client";

import styles from './page.module.css';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
import StatsGrid from './components/StatsGrid/StatsGrid';
import TrafficAnalytics from './components/TrafficAnalytics/TrafficAnalytics';
import TopCategories from './components/TopYearLevel/TopYearLevel';
import CheckpointChart from './components/CheckpointChart/CheckpointChart';
import SystemStatus from './components/TopScantion/TopScantion';
import RecentScansTable from './components/RecentScansTable/RecentScansTable';
import ScannerActivity from './components/ScannerActivity/ScannerActivity';
import RecentActivity from './components/RecentActivity/RecentActivity';

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      {/* position: sticky keeps this pinned to the top of the viewport
          whether the page is scrolled or not */}
      <header className={styles.stickyNav}>
        <AdminNavbar />
      </header>

      <div className={styles.workspaceWrapper}>
        <AdminSidebar />

        <main className={styles.main}>
          <DashboardHeader />

          <StatsGrid />

          <section className={styles.chartLayoutGrid}>
            <TrafficAnalytics />
            <TopCategories />
          </section>

          <section className={styles.chartLayoutGrid}>
            <CheckpointChart />
            <SystemStatus />
          </section>

          <section className={styles.chartLayoutGrid}>
            <RecentScansTable />
            <ScannerActivity />
          </section>

          <RecentActivity />
        </main>
      </div>
    </div>
  );
}