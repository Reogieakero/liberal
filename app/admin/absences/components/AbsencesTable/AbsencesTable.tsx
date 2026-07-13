"use client";

import React from 'react';
import { UserRound, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './AbsencesTable.module.css';
import type { StudentAbsenceSummary } from '../../types';

interface AbsencesTableProps {
  rows: StudentAbsenceSummary[];
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onView: (row: StudentAbsenceSummary) => void;
}

const riskClass = (total: number) => {
  if (total >= 5) return styles.riskHigh;
  if (total >= 3) return styles.riskMedium;
  return styles.riskLow;
};

export default function AbsencesTable({
  rows,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onView,
}: AbsencesTableProps) {
  return (
    <div className={styles.container}>
      {rows.length === 0 ? (
        <div className={styles.emptyView}>No matching students found.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Student No.</th>
                <th>Name</th>
                <th>Program</th>
                <th className={styles.centerAlignColumnHeader}>Total Absences</th>
                <th className={styles.centerAlignColumnHeader}>Excused / Unexcused</th>
                <th>Last Absence</th>
                <th className={styles.centerAlignColumnHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.studentId}>
                  <td className={styles.idCell}>{row.studentNumber}</td>
                  <td>
                    <div className={styles.nameCell}>
                      <UserRound size={14} className={styles.nameIcon} />
                      <div>
                        <span className={styles.nameText}>{row.fullName}</span>
                        <span className={styles.subText}>
                          {row.yearLevel ?? ''} {row.section ? `- ${row.section}` : ''}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td><span className={styles.programText}>{row.program}</span></td>
                  <td className={styles.centerAlignColumn}>
                    <span className={`${styles.totalBadge} ${riskClass(row.totalAbsences)}`}>
                      {row.totalAbsences}
                    </span>
                  </td>
                  <td className={styles.centerAlignColumn}>
                    <span className={styles.excusedText}>{row.excusedCount}</span>
                    {' / '}
                    <span className={styles.unexcusedText}>{row.unexcusedCount}</span>
                  </td>
                  <td>{row.lastAbsenceDate ?? '—'}</td>
                  <td className={styles.centerAlignColumn}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      aria-label="View absence events"
                      onClick={() => onView(row)}
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.paginationRow}>
        <span className={styles.paginationInfo}>
          Page {page} of {totalPages} · {totalCount} student{totalCount === 1 ? '' : 's'}
        </span>
        <div className={styles.paginationControls}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
