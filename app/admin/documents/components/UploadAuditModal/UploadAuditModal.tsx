"use client";

import React, { useState, useRef } from 'react';
import { X, ShieldAlert, UploadCloud, ChevronDown, Check } from 'lucide-react';
import styles from './UploadAuditModal.module.css';
import { supabase } from '@/lib/supabase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    type: string;
    issuer: string;
    scope: string;
    fileUrl: string;
    filePath: string;
  }) => void;
}

const departmentOptions = [
  "Faculty",
  "BS Development Communication",
  "AB Political Science",
  "BS Psychology"
];

const auditTypes = [
  "System Audit",
  "Payment Audit",
  "Clearance Audit",
  "Sanction Record Audit"
];

export default function UploadAuditModal({ isOpen, onClose, onSave }: ModalProps) {
  const [filename, setFilename] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [classification, setClassification] = useState('System Audit');
  const [issuer, setIssuer] = useState('Faculty');
  const [scope, setScope] = useState('Faculty');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Custom Selector Dropdown Flags
  const [openDropdown, setOpenDropdown] = useState<'type' | 'issuer' | 'scope' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
      setUploadError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename || !selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Give the stored file a unique path so re-uploads of the same
      // filename never collide inside the bucket.
      const filePath = `${Date.now()}-${selectedFile.name}`;

      const { error: uploadErr } = await supabase.storage
        .from('audit-documents')
        .upload(filePath, selectedFile);

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from('audit-documents')
        .getPublicUrl(filePath);

      onSave({
        name: filename,
        type: classification,
        issuer: issuer,
        scope: scope,
        fileUrl: publicUrlData.publicUrl,
        filePath: filePath
      });

      // Reset controls
      setFilename('');
      setSelectedFile(null);
      setClassification('System Audit');
      setIssuer('Faculty');
      setScope('Faculty');
      setOpenDropdown(null);
      onClose();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleDropdown = (field: 'type' | 'issuer' | 'scope') => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  return (
    <div className={styles.modalOverlay} onClick={() => setOpenDropdown(null)}>
      <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <ShieldAlert size={18} className={styles.headerIcon} />
            <h3>Log Institutional Compliance Audit</h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          
          {/* File Attachment Dropzone Area */}
          <div className={styles.inputGroup}>
            <label>Attach Verification Document</label>
            <div 
              className={`${styles.fileDropzone} ${filename ? styles.hasFile : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={24} className={styles.uploadIcon} />
              <div className={styles.dropzoneText}>
                {filename ? (
                  <span className={styles.filenameActive}>{filename}</span>
                ) : (
                  <>
                    <strong>Click to upload attachment</strong>
                    <span>PDF, XLSX, or PNG files up to 10MB</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className={styles.hiddenFileInput} 
                onChange={handleFileChange}
                accept=".pdf,.xlsx,.png,.jpg,.jpeg"
              />
            </div>
          </div>

          <div className={styles.gridFieldsRow}>
            {/* Custom Selector: Audit Classification */}
            <div className={styles.inputGroup}>
              <label>Audit Classification</label>
              <div className={styles.customSelectWrapper}>
                <div className={styles.customSelectHeader} onClick={() => toggleDropdown('type')}>
                  <span>{classification}</span>
                  <ChevronDown size={14} />
                </div>
                {openDropdown === 'type' && (
                  <div className={styles.customOptionsList}>
                    {auditTypes.map((type) => (
                      <div 
                        key={type} 
                        className={`${styles.customOption} ${classification === type ? styles.selectedOption : ''}`}
                        onClick={() => { setClassification(type); setOpenDropdown(null); }}
                      >
                        {type} {classification === type && <Check size={12} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Custom Selector: Origin / Attacher Entity */}
            <div className={styles.inputGroup}>
              <label>Attacher / Issuing Entity</label>
              <div className={styles.customSelectWrapper}>
                <div className={styles.customSelectHeader} onClick={() => toggleDropdown('issuer')}>
                  <span>{issuer}</span>
                  <ChevronDown size={14} />
                </div>
                {openDropdown === 'issuer' && (
                  <div className={styles.customOptionsList}>
                    {departmentOptions.map((dept) => (
                      <div 
                        key={dept} 
                        className={`${styles.customOption} ${issuer === dept ? styles.selectedOption : ''}`}
                        onClick={() => { setIssuer(dept); setOpenDropdown(null); }}
                      >
                        {dept} {issuer === dept && <Check size={12} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom Selector: Target Faculty or Department */}
          <div className={styles.inputGroup}>
            <label>Target Audience / Department Scope</label>
            <div className={styles.customSelectWrapper}>
              <div className={styles.customSelectHeader} onClick={() => toggleDropdown('scope')}>
                <span>{scope}</span>
                <ChevronDown size={14} />
              </div>
              {openDropdown === 'scope' && (
                <div className={styles.customOptionsList}>
                  {departmentOptions.map((dept) => (
                    <div 
                      key={dept} 
                      className={`${styles.customOption} ${scope === dept ? styles.selectedOption : ''}`}
                      onClick={() => { setScope(dept); setOpenDropdown(null); }}
                    >
                      {dept} {scope === dept && <Check size={12} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {uploadError && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>{uploadError}</p>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isUploading}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={!filename || isUploading}>
              {isUploading ? 'Uploading...' : 'Commit Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}