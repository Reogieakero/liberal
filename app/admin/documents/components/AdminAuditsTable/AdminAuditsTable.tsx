"use client";

import React from 'react';
import { FileText, Eye, Download } from 'lucide-react';
import styles from './AdminAuditsTable.module.css';

interface AdminAuditsTableProps {
  searchQuery: string;
  documentsList: Array<{ id: string; name: string; author: string; type: string; date: string; scope: string }>;
}

export default function AdminAuditsTable({ searchQuery, documentsList }: AdminAuditsTableProps) {
  const filtered = documentsList.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        {/* ... thread architecture stays entirely structural same ... */}
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((doc) => (
              <tr key={doc.id}>
                <td className={styles.idCell}>{doc.id}</td>
                <td>
                  <div className={styles.fileNameCell}>
                    <FileText size={14} className={styles.fileIcon} />
                    <span className={styles.fileNameText}>{doc.name}</span>
                  </div>
                </td>
                <td>{doc.author}</td>
                <td><span className={styles.categoryBadge}>{doc.type}</span></td>
                <td>{doc.date}</td>
                <td><span className={styles.scopeText}>{doc.scope}</span></td>
                <td>
                  <div className={styles.actionButtonsGroup}>
                    <button type="button" className={styles.actionBtn} title="Review Details"><Eye size={13} /></button>
                    <button type="button" className={styles.actionBtn} title="Download File"><Download size={13} /></button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.emptyRow}>No matching audit logs found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}