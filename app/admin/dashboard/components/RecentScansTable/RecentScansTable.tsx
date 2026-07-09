"use client";

import DashboardPanel from '../DashboardPanel/DashboardPanel';
import styles from './RecentScansTable.module.css';

interface ScanRow {
  name: string;
  role: string;
  count: string;
  status: string;
  statusClass: string;
}

const recentUsers: ScanRow[] = [
  { name: 'Y-3 QASA', role: 'Student', count: '0 pcs', status: 'Out of Stock', statusClass: styles.danger },
  { name: 'ULTRABOOST LIGHT RUNNING', role: 'Staff', count: '12 pcs', status: 'In Stock', statusClass: styles.success },
  { name: 'BYW SELECT SHOES', role: 'Visitor', count: '36 pcs', status: 'Low quantity', statusClass: styles.warning },
];

export default function RecentScansTable() {
  return (
    <DashboardPanel title="Recent Scans" actionLabel="View All" delay={300}>
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
            {recentUsers.map((item) => (
              <tr key={item.name}>
                <td>
                  <div className={styles.tableNameCell}>
                    <div className={styles.tableAvatar} />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>{item.role}</td>
                <td>{item.count}</td>
                <td>
                  <span className={`${styles.statusBadge} ${item.statusClass}`}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}
