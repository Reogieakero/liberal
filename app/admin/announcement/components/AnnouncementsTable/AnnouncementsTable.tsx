"use client";

import React, { useState } from 'react';
import { Megaphone, Pencil, Trash2, Paperclip, Eye, LayoutGrid, List } from 'lucide-react';
import styles from './AnnouncementsTable.module.css';
import type { AnnouncementDisplayRow } from '../../page';

interface AnnouncementsTableProps {
  searchQuery: string;
  announcements: AnnouncementDisplayRow[];
  onEdit: (announcement: AnnouncementDisplayRow) => void;
  onDelete: (id: string) => void;
  onView: (announcement: AnnouncementDisplayRow) => void;
}

const priorityClassMap: Record<string, string> = {
  General: styles.priorityGeneral,
  Urgent: styles.priorityUrgent,
  Event: styles.priorityEvent,
  Reminder: styles.priorityReminder,
};

export default function AnnouncementsTable({
  searchQuery,
  announcements,
  onEdit,
  onDelete,
  onView,
}: AnnouncementsTableProps) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.audience.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className={styles.emptyView}>No matching announcements found.</div>
      ) : viewMode === 'table' ? (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Announcement</th>
                <th>Audience</th>
                <th>Priority</th>
                <th>File Name</th>
                <th>Posted</th>
                <th className={styles.centerAlignColumnHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((announcement) => (
                <tr key={announcement.id}>
                  <td className={styles.idCell}>{announcement.code}</td>
                  <td>
                    <div className={styles.titleCell}>
                      <Megaphone size={14} className={styles.titleIcon} />
                      <div>
                        <span className={styles.titleText}>{announcement.title}</span>
                        <span className={styles.contentPreview}>{announcement.content}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className={styles.audienceText}>{announcement.audience}</span></td>
                  <td>
                    <span className={`${styles.priorityBadge} ${priorityClassMap[announcement.priority] ?? styles.priorityGeneral}`}>
                      {announcement.priority}
                    </span>
                  </td>
                  <td>
                    {announcement.fileUrl ? (
                      <a
                        href={announcement.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.attachmentLink}
                        title={announcement.fileName ?? 'View attachment'}
                      >
                        <Paperclip size={11} /> 
                        <span className={styles.fileNameText}>{announcement.fileName ?? 'Attachment'}</span>
                      </a>
                    ) : (
                      <span className={styles.noFileText}>-</span>
                    )}
                  </td>
                  <td>{announcement.date}</td>
                  <td className={styles.centerAlignColumn}>
                    <div className={styles.actionButtonsGroup}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        data-tooltip="View"
                        aria-label="View announcement"
                        onClick={() => onView(announcement)}
                      >
                        <Eye size={13} />
                      </button>
                      <span className={styles.actionDivider} aria-hidden="true" />
                      <button
                        type="button"
                        className={styles.actionBtn}
                        data-tooltip="Edit"
                        aria-label="Edit announcement"
                        onClick={() => onEdit(announcement)}
                      >
                        <Pencil size={13} />
                      </button>
                      <span className={styles.actionDivider} aria-hidden="true" />
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        data-tooltip="Delete"
                        aria-label="Delete announcement"
                        onClick={() => onDelete(announcement.id)}
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
          {filtered.map((announcement) => (
            <div key={announcement.id} className={styles.announcementCard}>
              <div className={styles.cardHeader}>
                <span className={styles.idCell}>{announcement.code}</span>
                <span className={`${styles.priorityBadge} ${priorityClassMap[announcement.priority] ?? styles.priorityGeneral}`}>
                  {announcement.priority}
                </span>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.titleCell}>
                  <Megaphone size={14} className={styles.titleIcon} />
                  <span className={styles.titleText}>{announcement.title}</span>
                </div>
                <p className={styles.cardContent}>{announcement.content}</p>
                
                {announcement.fileUrl && (
                  <a
                    href={announcement.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.attachmentLink}
                  >
                    <Paperclip size={11} /> 
                    <span className={styles.fileNameText}>{announcement.fileName ?? 'Attachment'}</span>
                  </a>
                )}
                
                <div className={styles.cardMeta}>
                  <span>To: <b className={styles.audienceText}>{announcement.audience}</b></span>
                  <span>{announcement.date}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.actionButtonsGroup}>
                  <button type="button" className={styles.actionBtn} onClick={() => onView(announcement)}>
                    <Eye size={13} />
                  </button>
                  <span className={styles.actionDivider} />
                  <button type="button" className={styles.actionBtn} onClick={() => onEdit(announcement)}>
                    <Pencil size={13} />
                  </button>
                  <span className={styles.actionDivider} />
                  <button type="button" className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(announcement.id)}>
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