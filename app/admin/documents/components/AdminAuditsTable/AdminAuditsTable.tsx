"use client";

import React, { useState } from 'react';
import { FileText, Eye, Download, Pencil } from 'lucide-react';
import DocumentPreviewModal from '../DocumentPreviewModal/DocumentPreviewModal';
import EditAuditModal from '../EditAuditModal/EditAuditModal';
import styles from './AdminAuditsTable.module.css';

interface AuditDoc {
  uuid: string;
  id: string;
  name: string;
  description: string;
  author: string;
  type: string;
  issuer: string;
  date: string;
  scope: string;
  fileUrl: string;
}

interface AdminAuditsTableProps {
  searchQuery: string;
  documentsList: AuditDoc[];
  onEdit: (
    uuid: string,
    updates: { name: string; description: string; type: string; issuer: string; scope: string }
  ) => void | Promise<void>;
}

export default function AdminAuditsTable({ searchQuery, documentsList, onEdit }: AdminAuditsTableProps) {
  const [previewDoc, setPreviewDoc] = useState<AuditDoc | null>(null);
  const [editingDoc, setEditingDoc] = useState<AuditDoc | null>(null);

  const filtered = documentsList.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>File Name</th>
            <th>Author</th>
            <th>Type</th>
            <th>Date</th>
            <th>Scope</th>
            <th className={styles.centerAlignColumn}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((doc) => (
              <tr key={doc.id}>
                <td className={styles.idCell}>{doc.id}</td>
                <td>
                  <div className={styles.fileNameCell}>
                    <FileText size={14} className={styles.fileIcon} />
                    <div>
                      <span className={styles.fileNameText}>{doc.name}</span>
                      {doc.description && (
                        <p className={styles.fileDescText}>{doc.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td>{doc.author}</td>
                <td><span className={styles.categoryBadge}>{doc.type}</span></td>
                <td>{doc.date}</td>
                <td><span className={styles.scopeText}>{doc.scope}</span></td>
                <td>
                  <div className={styles.actionButtonsGroup}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      title="Review Details"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      title="Edit Audit"
                      onClick={() => setEditingDoc(doc)}
                    >
                      <Pencil size={13} />
                    </button>
                    <button type="button" className={styles.actionBtn} title="Download File">
                      <Download size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.emptyRow}>No matching audit logs found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {previewDoc && (
        <DocumentPreviewModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          fileUrl={previewDoc.fileUrl}
          name={previewDoc.name}
          description={previewDoc.description}
          meta={`${previewDoc.id} • ${previewDoc.type} • ${previewDoc.date}`}
        />
      )}

      {editingDoc && (
        <EditAuditModal
          isOpen={!!editingDoc}
          onClose={() => setEditingDoc(null)}
          initialValues={{
            name: editingDoc.name,
            description: editingDoc.description,
            type: editingDoc.type,
            issuer: editingDoc.issuer,
            scope: editingDoc.scope,
          }}
          onSave={(updates) => onEdit(editingDoc.uuid, updates)}
        />
      )}
    </div>
  );
}