"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Wallet, ChevronDown, Check, UploadCloud, XCircle } from 'lucide-react';
import styles from './PaymentMethodModal.module.css';
import type { PaymentMethodDisplayRow, PaymentMethodFormData } from '../../page';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

interface PaymentMethodModalProps {
  isOpen: boolean;
  initialData: PaymentMethodDisplayRow | null;
  onClose: () => void;
  onCreate: (data: PaymentMethodFormData) => void;
  onUpdate: (id: string, data: PaymentMethodFormData) => void;
}

const typeOptions = ["GCash", "PayMaya", "Bank Transfer", "Other"];

export default function PaymentMethodModal({
  isOpen,
  initialData,
  onClose,
  onCreate,
  onUpdate,
}: PaymentMethodModalProps) {
  const isEditMode = Boolean(initialData);

  const [type, setType] = useState('GCash');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<{ url: string; path: string; name: string } | null>(null);
  const [removeExisting, setRemoveExisting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(initialData?.type ?? 'GCash');
      setAccountName(initialData?.accountName ?? '');
      setAccountNumber(initialData?.accountNumber ?? '');
      setIsActive(initialData?.isActive ?? true);
      setFormError(null);
      setOpenDropdown(false);
      setSelectedFile(null);
      setRemoveExisting(false);
      setShowConfirm(false);
      setExistingFile(
        initialData?.qrUrl && initialData?.qrPath
          ? { url: initialData.qrUrl, path: initialData.qrPath, name: initialData.qrName ?? 'QR Code' }
          : null
      );
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setRemoveExisting(false);
      setFormError(null);
    }
  };

  const handleRemoveAttachment = () => {
    setSelectedFile(null);
    setRemoveExisting(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const previewSrc = selectedFile
    ? URL.createObjectURL(selectedFile)
    : existingFile
      ? existingFile.url
      : null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim() || !accountNumber.trim()) {
      setFormError('Please fill in both the account name and account number.');
      return;
    }
    setFormError(null);
    setShowConfirm(true);
  };

  const performSave = async () => {
    setIsSaving(true);
    setFormError(null);

    try {
      let qrUrl: string | null = existingFile?.url ?? null;
      let qrPath: string | null = existingFile?.path ?? null;
      let qrName: string | null = existingFile?.name ?? null;

      if (selectedFile) {
        // Uploads the new file server-side (service role key never touches
        // the browser) and, if replacing an existing one, cleans up the old
        // file in the same request.
        const uploadForm = new FormData();
        uploadForm.append('file', selectedFile);
        if (existingFile?.path) uploadForm.append('oldPath', existingFile.path);

        const uploadRes = await fetch('/api/payment-methods/upload', {
          method: 'POST',
          body: uploadForm,
        });

        if (!uploadRes.ok) {
          const body = await uploadRes.json().catch(() => null);
          throw new Error(body?.error || 'Upload failed. Please try again.');
        }

        const uploaded = await uploadRes.json();
        qrUrl = uploaded.url;
        qrPath = uploaded.path;
        qrName = uploaded.name;
      } else if (removeExisting && existingFile?.path) {
        await fetch('/api/payment-methods/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: existingFile.path }),
        });
        qrUrl = null;
        qrPath = null;
        qrName = null;
      }

      const payload: PaymentMethodFormData = {
        type,
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        isActive,
        qrUrl,
        qrPath,
        qrName,
      };

      if (isEditMode && initialData) {
        await onUpdate(initialData.id, payload);
      } else {
        await onCreate(payload);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsSaving(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={() => setOpenDropdown(false)}>
      <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <Wallet size={18} className={styles.headerIcon} />
            <h3>{isEditMode ? 'Edit Payment Method' : 'New Payment Method'}</h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className={styles.modalForm}>

          <div className={styles.inputGroup}>
            <label>QR Code / Logo Image (optional)</label>
            {previewSrc ? (
              <div className={`${styles.fileDropzone} ${styles.hasFile}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="QR preview" className={styles.qrThumb} />
                <div className={styles.dropzoneText}>
                  <span className={styles.filenameActive}>
                    {selectedFile ? selectedFile.name : existingFile?.name}
                  </span>
                  <span>{selectedFile ? 'New image selected' : 'Currently attached'}</span>
                </div>
                <button
                  type="button"
                  className={styles.removeFileBtn}
                  onClick={handleRemoveAttachment}
                  title="Remove image"
                >
                  <XCircle size={14} /> Remove
                </button>
              </div>
            ) : (
              <div className={styles.fileDropzone} onClick={() => fileInputRef.current?.click()}>
                <UploadCloud size={24} className={styles.uploadIcon} />
                <div className={styles.dropzoneText}>
                  <strong>Click to upload QR code</strong>
                  <span>PNG or JPG up to 10MB</span>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className={styles.hiddenFileInput}
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.webp"
            />
          </div>

          <div className={styles.gridFieldsRow}>
            <div className={styles.inputGroup}>
              <label>Method Type</label>
              <div className={styles.customSelectWrapper}>
                <div
                  className={styles.customSelectHeader}
                  onClick={(e) => { e.stopPropagation(); setOpenDropdown(!openDropdown); }}
                >
                  <span>{type}</span>
                  <ChevronDown size={14} />
                </div>
                {openDropdown && (
                  <div className={styles.customOptionsList}>
                    {typeOptions.map((option) => (
                      <div
                        key={option}
                        className={`${styles.customOption} ${type === option ? styles.selectedOption : ''}`}
                        onClick={() => { setType(option); setOpenDropdown(false); }}
                      >
                        {option} {type === option && <Check size={12} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Status</label>
              <div className={styles.toggleRow} onClick={() => setIsActive(!isActive)}>
                <span className={`${styles.switchTrack} ${isActive ? styles.switchOn : ''}`}>
                  <span className={styles.switchThumb} />
                </span>
                <span className={styles.toggleLabel}>{isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Account / Wallet Name</label>
            <input
              type="text"
              className={styles.textInput}
              placeholder="e.g. Juan Dela Cruz"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Account / Mobile Number</label>
            <input
              type="text"
              className={styles.textInput}
              placeholder="e.g. 0917 123 4567"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          {formError && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>{formError}</p>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Payment Method'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        variant="default"
        title={isEditMode ? 'Save these changes?' : 'Add this payment method?'}
        message={
          isEditMode
            ? `This will update "${accountName.trim()}" (${type}).`
            : `This will add "${accountName.trim() || 'this account'}" as a ${type} payment method.`
        }
        confirmLabel={isEditMode ? 'Save Changes' : 'Add'}
        cancelLabel="Cancel"
        isLoading={isSaving}
        onConfirm={performSave}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}