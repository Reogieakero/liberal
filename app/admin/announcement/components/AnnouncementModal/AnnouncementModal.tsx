"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Megaphone, ChevronDown, Check, UploadCloud, Paperclip, XCircle } from 'lucide-react';
import styles from './AnnouncementModal.module.css';
import type { AnnouncementDisplayRow } from '../../page';
import { supabase } from '@/lib/supabase';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

interface AnnouncementFormData {
  title: string;
  content: string;
  priority: string;
  audience: string;
  fileUrl: string | null;
  filePath: string | null;
  fileName: string | null;
}

interface AnnouncementModalProps {
  isOpen: boolean;
  initialData: AnnouncementDisplayRow | null;
  onClose: () => void;
  onCreate: (data: AnnouncementFormData) => void;
  onUpdate: (id: string, data: AnnouncementFormData) => void;
}

const audienceOptions = [
  "Faculty",
  "BS Development Communication",
  "AB Political Science",
  "BS Psychology",
  "All Students",
];

const priorityOptions = ["General", "Urgent", "Event", "Reminder"];

export default function AnnouncementModal({
  isOpen,
  initialData,
  onClose,
  onCreate,
  onUpdate,
}: AnnouncementModalProps) {
  const isEditMode = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('General');
  const [audience, setAudience] = useState('All Students');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState<'priority' | 'audience' | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<{ url: string; path: string; name: string } | null>(null);
  const [removeExisting, setRemoveExisting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title ?? '');
      setContent(initialData?.content ?? '');
      setPriority(initialData?.priority ?? 'General');
      setAudience(initialData?.audience ?? 'All Students');
      setFormError(null);
      setOpenDropdown(null);
      setSelectedFile(null);
      setRemoveExisting(false);
      setShowConfirm(false);
      setExistingFile(
        initialData?.fileUrl && initialData?.filePath
          ? { url: initialData.fileUrl, path: initialData.filePath, name: initialData.fileName ?? 'Attachment' }
          : null
      );
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const toggleDropdown = (field: 'priority' | 'audience') => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError('Please fill in both a title and content.');
      return;
    }
    setFormError(null);
    setShowConfirm(true);
  };

  const performSave = async () => {
    setIsSaving(true);
    setFormError(null);

    try {
      let fileUrl: string | null = existingFile?.url ?? null;
      let filePath: string | null = existingFile?.path ?? null;
      let fileName: string | null = existingFile?.name ?? null;

      if (selectedFile) {
        const newPath = `${Date.now()}-${selectedFile.name}`;
        const { error: uploadErr } = await supabase.storage
          .from('announcement-attachments')
          .upload(newPath, selectedFile);

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage
          .from('announcement-attachments')
          .getPublicUrl(newPath);

        if (existingFile?.path) {
          await supabase.storage.from('announcement-attachments').remove([existingFile.path]);
        }

        fileUrl = publicUrlData.publicUrl;
        filePath = newPath;
        fileName = selectedFile.name;
      } else if (removeExisting) {
        if (existingFile?.path) {
          await supabase.storage.from('announcement-attachments').remove([existingFile.path]);
        }
        fileUrl = null;
        filePath = null;
        fileName = null;
      }

      const payload = { title: title.trim(), content: content.trim(), priority, audience, fileUrl, filePath, fileName };

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
    <div className={styles.modalOverlay} onClick={() => setOpenDropdown(null)}>
      <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>

        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <Megaphone size={18} className={styles.headerIcon} />
            <h3>{isEditMode ? 'Edit Announcement' : 'New Announcement'}</h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className={styles.modalForm}>

          <div className={styles.inputGroup}>
            <label>Attach Image or File (optional)</label>
            {selectedFile || existingFile ? (
              <div className={`${styles.fileDropzone} ${styles.hasFile}`}>
                <Paperclip size={20} className={styles.uploadIcon} />
                <div className={styles.dropzoneText}>
                  <span className={styles.filenameActive}>
                    {selectedFile ? selectedFile.name : existingFile?.name}
                  </span>
                  <span>{selectedFile ? 'New file selected' : 'Currently attached'}</span>
                </div>
                <button
                  type="button"
                  className={styles.removeFileBtn}
                  onClick={handleRemoveAttachment}
                  title="Remove attachment"
                >
                  <XCircle size={14} /> Remove
                </button>
              </div>
            ) : (
              <div className={styles.fileDropzone} onClick={() => fileInputRef.current?.click()}>
                <UploadCloud size={24} className={styles.uploadIcon} />
                <div className={styles.dropzoneText}>
                  <strong>Click to upload attachment</strong>
                  <span>PDF, image, or document up to 10MB</span>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className={styles.hiddenFileInput}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Title</label>
            <input
              type="text"
              className={styles.textInput}
              placeholder="e.g. Enrollment period extended"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Content</label>
            <textarea
              className={styles.textareaInput}
              placeholder="Write the announcement details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className={styles.gridFieldsRow}>
            <div className={styles.inputGroup}>
              <label>Priority</label>
              <div className={styles.customSelectWrapper}>
                <div className={styles.customSelectHeader} onClick={() => toggleDropdown('priority')}>
                  <span>{priority}</span>
                  <ChevronDown size={14} />
                </div>
                {openDropdown === 'priority' && (
                  <div className={styles.customOptionsList}>
                    {priorityOptions.map((option) => (
                      <div
                        key={option}
                        className={`${styles.customOption} ${priority === option ? styles.selectedOption : ''}`}
                        onClick={() => { setPriority(option); setOpenDropdown(null); }}
                      >
                        {option} {priority === option && <Check size={12} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Audience</label>
              <div className={styles.customSelectWrapper}>
                <div className={styles.customSelectHeader} onClick={() => toggleDropdown('audience')}>
                  <span>{audience}</span>
                  <ChevronDown size={14} />
                </div>
                {openDropdown === 'audience' && (
                  <div className={styles.customOptionsList}>
                    {audienceOptions.map((option) => (
                      <div
                        key={option}
                        className={`${styles.customOption} ${audience === option ? styles.selectedOption : ''}`}
                        onClick={() => { setAudience(option); setOpenDropdown(null); }}
                      >
                        {option} {audience === option && <Check size={12} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {formError && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>{formError}</p>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              {isSaving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        variant="default"
        title={isEditMode ? 'Save these changes?' : 'Post this announcement?'}
        message={
          isEditMode
            ? `This will update "${title.trim()}" for ${audience}.`
            : `This will publish "${title.trim()}" to ${audience}.`
        }
        confirmLabel={isEditMode ? 'Save Changes' : 'Post'}
        cancelLabel="Cancel"
        isLoading={isSaving}
        onConfirm={performSave}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}