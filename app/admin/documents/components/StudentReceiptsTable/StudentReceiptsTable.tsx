"use client";

import React from 'react';
import { Receipt, Eye, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './StudentReceiptsTable.module.css';

const studentReceiptDocs = [
  { id: 'REC-2026-891', name: 'Tuition_Receipt_Marcus_Vance.png', student: 'Marcus Vance', amount: '$1,250.00', date: 'Jul 10, 2026', status: 'Pending', statusClass: styles.warning, icon: Clock },
  { id: 'REC-2026-890', name: 'Summer_Term_Fee_Park.pdf', student: 'Jin-Woo Park', amount: '$450.00', date: 'Jul 09, 2026', status: 'Approved', statusClass: styles.success, icon: CheckCircle },
  { id: 'REC-2026-889', name: 'Penalty_Clearance_Rostova.jpg', student: 'Elena Rostova', amount: '$75.00', date: 'Jul 05, 2026', status: 'Rejected', statusClass: styles.danger, icon: AlertCircle },
];

export default function StudentReceiptsTable({ searchQuery }: { searchQuery: string }) {
  const filtered = studentReceiptDocs.filter(r => 
    r.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Receipt ID</th>
            <th>Uploaded Receipt / Proof</th>
            <th>Student Account</th>
            <th>Declaring Amount</th>
            <th>Upload Date</th>
            <th>Audit Status</th>
            <th className={styles.centerAlignColumn}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((receipt) => {
              const StatusIcon = receipt.icon;
              return (
                <tr key={receipt.id}>
                  <td className={styles.idCell}>{receipt.id}</td>
                  <td>
                    <div className={styles.fileNameCell}>
                      <Receipt size={14} className={styles.receiptIcon} />
                      <span className={styles.fileNameText}>{receipt.name}</span>
                    </div>
                  </td>
                  <td>{receipt.student}</td>
                  <td className={styles.amountText}>{receipt.amount}</td>
                  <td>{receipt.date}</td>
                  <td>
                    <div className={`${styles.statusWrapper} ${receipt.statusClass}`}>
                      <StatusIcon size={12} />
                      <span>{receipt.status}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionButtonsGroup}>
                      <button type="button" className={styles.actionBtn} title="Verify Payment Profile"><Eye size={13} /></button>
                      <button type="button" className={styles.actionBtn} title="Download Proof Token"><Download size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className={styles.emptyRow}>No matching receipts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}