"use client";

import React, { useState } from 'react';
import { Wallet, Pencil, Trash2, Eye, LayoutGrid, List, ImageOff } from 'lucide-react';
import styles from './PaymentMethodsTable.module.css';
import type { PaymentMethodDisplayRow } from '../../page';

interface PaymentMethodsTableProps {
  searchQuery: string;
  paymentMethods: PaymentMethodDisplayRow[];
  onEdit: (method: PaymentMethodDisplayRow) => void;
  onDelete: (id: string) => void;
  onView: (method: PaymentMethodDisplayRow) => void;
}

const typeClassMap: Record<string, string> = {
  GCash: styles.typeGcash,
  PayMaya: styles.typePaymaya,
  'Bank Transfer': styles.typeBank,
  Other: styles.typeOther,
};

export default function PaymentMethodsTable({
  searchQuery,
  paymentMethods,
  onEdit,
  onDelete,
  onView,
}: PaymentMethodsTableProps) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const filtered = paymentMethods.filter(
    (p) =>
      p.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.toggleContainer}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.activeToggle : ''}`}
          onClick={() => setViewMode('table')}
        >
          <List size={14} /> Table View
        </button>
        <button
          type="button"
          className={`${styles.toggleBtn} ${viewMode === 'card' ? styles.activeToggle : ''}`}
          onClick={() => setViewMode('card')}
        >
          <LayoutGrid size={14} /> Card View
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyView}>No matching payment methods found.</div>
      ) : viewMode === 'table' ? (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>QR</th>
                <th>Type</th>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Status</th>
                <th>Added</th>
                <th className={styles.centerAlignColumnHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((method) => (
                <tr key={method.id}>
                  <td className={styles.idCell}>{method.code}</td>
                  <td>
                    {method.qrUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={method.qrUrl} alt={method.qrName ?? 'QR code'} className={styles.qrThumbSmall} />
                    ) : (
                      <span className={styles.noQrIcon}><ImageOff size={14} /></span>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.typeBadge} ${typeClassMap[method.type] ?? styles.typeOther}`}>
                      <Wallet size={10} /> {method.type}
                    </span>
                  </td>
                  <td><span className={styles.accountNameText}>{method.accountName}</span></td>
                  <td><span className={styles.accountNumberText}>{method.accountNumber}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${method.isActive ? styles.statusActive : styles.statusInactive}`}>
                      {method.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{method.date}</td>
                  <td className={styles.centerAlignColumn}>
                    <div className={styles.actionButtonsGroup}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        data-tooltip="View"
                        aria-label="View payment method"
                        onClick={() => onView(method)}
                      >
                        <Eye size={13} />
                      </button>
                      <span className={styles.actionDivider} aria-hidden="true" />
                      <button
                        type="button"
                        className={styles.actionBtn}
                        data-tooltip="Edit"
                        aria-label="Edit payment method"
                        onClick={() => onEdit(method)}
                      >
                        <Pencil size={13} />
                      </button>
                      <span className={styles.actionDivider} aria-hidden="true" />
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        data-tooltip="Delete"
                        aria-label="Delete payment method"
                        onClick={() => onDelete(method.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {filtered.map((method) => (
            <div key={method.id} className={styles.methodCard}>
              <div className={styles.cardHeader}>
                <span className={styles.idCell}>{method.code}</span>
                <span className={`${styles.statusBadge} ${method.isActive ? styles.statusActive : styles.statusInactive}`}>
                  {method.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className={styles.cardQrWrap}>
                {method.qrUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={method.qrUrl} alt={method.qrName ?? 'QR code'} className={styles.qrThumbCard} />
                ) : (
                  <div className={styles.noQrCard}><ImageOff size={22} /></div>
                )}
              </div>

              <div className={styles.cardBody}>
                <span className={`${styles.typeBadge} ${typeClassMap[method.type] ?? styles.typeOther}`}>
                  <Wallet size={10} /> {method.type}
                </span>
                <span className={styles.accountNameText}>{method.accountName}</span>
                <span className={styles.accountNumberText}>{method.accountNumber}</span>

                <div className={styles.cardMeta}>
                  <span>Added: {method.date}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.actionButtonsGroup}>
                  <button type="button" className={styles.actionBtn} onClick={() => onView(method)}>
                    <Eye size={13} />
                  </button>
                  <span className={styles.actionDivider} />
                  <button type="button" className={styles.actionBtn} onClick={() => onEdit(method)}>
                    <Pencil size={13} />
                  </button>
                  <span className={styles.actionDivider} />
                  <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(method.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}