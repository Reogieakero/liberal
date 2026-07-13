"use client";

import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className={styles.overlay} onClick={isLoading ? undefined : onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className={`${styles.iconWrap} ${isDanger ? styles.iconDanger : styles.iconDefault}`}>
          {isDanger ? <AlertTriangle size={18} /> : <HelpCircle size={18} />}
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`${styles.confirmBtn} ${isDanger ? styles.confirmDanger : styles.confirmDefault}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <span className={styles.spinner} />}
            {isLoading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}