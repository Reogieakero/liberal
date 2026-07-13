"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, X, FileWarning } from 'lucide-react';
import styles from './DocumentPreviewModal.module.css';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  name: string;
  description?: string;
  meta?: string;
}

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

const getExtension = (url: string) => {
  const clean = url.split('?')[0].split('#')[0];
  const parts = clean.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

export default function DocumentPreviewModal({ isOpen, onClose, fileUrl, name, description, meta }: DocumentPreviewModalProps) {
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setHasError(false);

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

  const extension = getExtension(fileUrl);
  const isImage = IMAGE_EXTENSIONS.includes(extension);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modalContent = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <FileText size={16} className={styles.fileIcon} />
            <div>
              <p className={styles.titleText}>{name}</p>
              {meta && <p className={styles.metaText}>{meta}</p>}
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} title="Close preview">
            <X size={16} />
          </button>
        </div>

        {description && (
          <div className={styles.descriptionBar}>
            <p className={styles.descriptionText}>{description}</p>
          </div>
        )}

        <div className={hasError || isImage ? styles.bodyCentered : styles.body}>
          {hasError ? (
            <div className={styles.fallback}>
              <FileWarning size={28} />
              <span>Couldn&apos;t preview this file.</span>
            </div>
          ) : isImage ? (
            <img
              src={fileUrl}
              alt={name}
              className={styles.imagePreview}
              onError={() => setHasError(true)}
            />
          ) : (
            <iframe
              src={fileUrl}
              title={name}
              className={styles.docFrame}
              onError={() => setHasError(true)}
            />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}