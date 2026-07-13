"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import styles from './EditAuditModal.module.css';

interface EditAuditModalValues {
  name: string;
  description: string;
  type: string;
  issuer: string;
  scope: string;
}

interface EditAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: EditAuditModalValues) => void | Promise<void>;
  initialValues: EditAuditModalValues;
}

export default function EditAuditModal({ isOpen, onClose, onSave, initialValues }: EditAuditModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [type, setType] = useState(initialValues.type);
  const [issuer, setIssuer] = useState(initialValues.issuer);
  const [scope, setScope] = useState(initialValues.scope);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setName(initialValues.name);
    setDescription(initialValues.description);
    setType(initialValues.type);
    setIssuer(initialValues.issuer);
    setScope(initialValues.scope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        type: type.trim(),
        issuer: issuer.trim(),
        scope: scope.trim(),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const modalContent = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.titleText}>Edit Audit Log</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Title</span>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q3 Financial Audit"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Description</span>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this document covers..."
              rows={4}
            />
          </label>

          <div className={styles.fieldRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Type</span>
              <input
                type="text"
                className={styles.input}
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. Payment Audit"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Issuer</span>
              <input
                type="text"
                className={styles.input}
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Finance Office"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Scope</span>
            <input
              type="text"
              className={styles.input}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. All Departments"
            />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              <Save size={13} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}