"use client";

import React from 'react';
import { X, Wallet, ExternalLink, Calendar, User, Hash, ImageOff } from 'lucide-react';
import styles from './PaymentMethodPreviewModal.module.css';
import type { PaymentMethodDisplayRow } from '../../page';

interface PaymentMethodPreviewModalProps {
  isOpen: boolean;
  method: PaymentMethodDisplayRow | null;
  onClose: () => void;
}

export default function PaymentMethodPreviewModal({
  isOpen,
  method,
  onClose,
}: PaymentMethodPreviewModalProps) {
  if (!isOpen || !method) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.previewWindow} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <div className={styles.metaBadgeGroup}>
            <span className={styles.codeBadge}>{method.code}</span>
            <span className={styles.statusBadge} data-active={method.isActive}>
              {method.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.bodyLayout}>

          <div className={styles.infoPanel}>
            <div className={styles.titleSection}>
              <Wallet size={20} className={styles.icon} />
              <h2 className={styles.title}>{method.type}</h2>
            </div>

            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <User size={13} />
                <span>Account Name: <strong>{method.accountName}</strong></span>
              </div>
              <div className={styles.metaItem}>
                <Hash size={13} />
                <span>Account Number: <strong>{method.accountNumber}</strong></span>
              </div>
              <div className={styles.metaItem}>
                <Calendar size={13} />
                <span>Added on: <strong>{method.date}</strong></span>
              </div>
            </div>
          </div>

          <div className={styles.mediaPanel}>
            {method.qrUrl ? (
              <div className={styles.mediaWrapper}>
                <div className={styles.mediaHeader}>
                  <span className={styles.fileNameInfo}>{method.qrName || 'QR Code'}</span>
                  <a
                    href={method.qrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.externalLink}
                  >
                    Open in Tab <ExternalLink size={12} />
                  </a>
                </div>
                <div className={styles.mediaContentContainer}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={method.qrUrl}
                    alt={method.qrName || 'QR code'}
                    className={styles.previewImage}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.noMediaPlaceholder}>
                <ImageOff size={32} style={{ opacity: 0.3 }} />
                <p>No QR code or image has been attached to this payment method.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}