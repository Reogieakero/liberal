"use client";

import React from 'react';
import { X, Megaphone, Paperclip, ExternalLink, Calendar, Users, ShieldAlert } from 'lucide-react';
import styles from './AnnouncementPreviewModal.module.css';
import type { AnnouncementDisplayRow } from '../../page';

interface AnnouncementPreviewModalProps {
  isOpen: boolean;
  announcement: AnnouncementDisplayRow | null;
  onClose: () => void;
}

export default function AnnouncementPreviewModal({
  isOpen,
  announcement,
  onClose,
}: AnnouncementPreviewModalProps) {
  if (!isOpen || !announcement) return null;

  const isImage = (fileName: string | null) => {
    if (!fileName) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileName);
  };

  const isPdf = (fileName: string | null) => {
    if (!fileName) return false;
    return /\.pdf$/i.test(fileName);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.previewWindow} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.header}>
          <div className={styles.metaBadgeGroup}>
            <span className={styles.codeBadge}>{announcement.code}</span>
            <span className={styles.priorityBadge}>{announcement.priority} Priority</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.bodyLayout}>
          
          <div className={styles.infoPanel}>
            <div className={styles.titleSection}>
              <Megaphone size={20} className={styles.icon} />
              <h2 className={styles.title}>{announcement.title}</h2>
            </div>

            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <Calendar size={13} />
                <span>Posted on: <strong>{announcement.date}</strong></span>
              </div>
              <div className={styles.metaItem}>
                <Users size={13} />
                <span>Audience: <strong>{announcement.audience}</strong></span>
              </div>
              <div className={styles.metaItem}>
                <ShieldAlert size={13} />
                <span>Author: <strong>{announcement.author}</strong></span>
              </div>
            </div>

            <hr className={styles.divider} />
            
            <div className={styles.contentContainer}>
              <p className={styles.content}>{announcement.content}</p>
            </div>
          </div>

          <div className={styles.mediaPanel}>
            {announcement.fileUrl ? (
              <div className={styles.mediaWrapper}>
                <div className={styles.mediaHeader}>
                  <div className={styles.fileNameInfo}>
                    <Paperclip size={14} />
                    <span>{announcement.fileName || 'Attached Asset'}</span>
                  </div>
                  <a 
                    href={announcement.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.externalLink}
                  >
                    Open in Tab <ExternalLink size={12} />
                  </a>
                </div>

                <div className={styles.mediaContentContainer}>
                  {isImage(announcement.fileName) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={announcement.fileUrl} 
                      alt={announcement.fileName || 'Attached graphic'} 
                      className={styles.previewImage}
                    />
                  ) : isPdf(announcement.fileName) ? (
                    <object
                      data={announcement.fileUrl}
                      type="application/pdf"
                      className={styles.previewDocument}
                    >
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(announcement.fileUrl)}&embedded=true`}
                        className={styles.previewDocument}
                        title="Document Viewer"
                      />
                    </object>
                  ) : (
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(announcement.fileUrl)}&embedded=true`}
                      className={styles.previewDocument}
                      title="Document Viewer"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.noMediaPlaceholder}>
                <Paperclip size={32} style={{ opacity: 0.3 }} />
                <p>No extra files or media assets are attached to this announcement.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}