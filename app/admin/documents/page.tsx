"use client";

import React, { useState, useEffect } from 'react';
import { FileUp, UserCheck } from 'lucide-react';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';
import DocumentControls from './components/DocumentControls/DocumentControls';
import AdminAuditsTable from './components/AdminAuditsTable/AdminAuditsTable';
import StudentReceiptsTable from './components/StudentReceiptsTable/StudentReceiptsTable';
import UploadAuditModal from './components/UploadAuditModal/UploadAuditModal';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface AuditRow {
  id: string;
  audit_code: string;
  name: string;
  description: string;
  file_url: string;
  author: string;
  type: string;
  issuer: string;
  scope: string;
  created_at: string;
}

interface AuditDisplayRow {
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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

const toDisplayRow = (row: AuditRow): AuditDisplayRow => ({
  uuid: row.id,
  id: row.audit_code,
  name: row.name,
  description: row.description ?? '',
  author: row.author,
  type: row.type,
  issuer: row.issuer,
  date: formatDate(row.created_at),
  scope: row.scope,
  fileUrl: row.file_url,
});

export default function AdminDocuments() {
  const [activeTab, setActiveTab] = useState<'admin' | 'student'>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditDisplayRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load existing audit rows from Supabase on first render
  useEffect(() => {
    const fetchAudits = async () => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setLoadError(error.message);
      } else {
        setAuditLogs((data as AuditRow[]).map(toDisplayRow));
      }
      setIsLoading(false);
    };

    fetchAudits();
  }, []);

  const handleAddAudit = async (newAudit: {
    name: string;
    description: string;
    type: string;
    issuer: string;
    scope: string;
    fileUrl: string;
    filePath: string;
  }) => {
    const nextIdNumber = auditLogs.length + 1;
    const auditCode = `AUD-2026-${String(nextIdNumber).padStart(3, '0')}`;

    const { data, error } = await supabase
      .from('audits')
      .insert({
        audit_code: auditCode,
        name: newAudit.name,
        description: newAudit.description,
        file_url: newAudit.fileUrl,
        file_path: newAudit.filePath,
        author: 'SuperAdmin',
        type: newAudit.type,
        issuer: newAudit.issuer,
        scope: newAudit.scope,
      })
      .select()
      .single();

    if (error) {
      setLoadError(error.message);
      return;
    }

    setAuditLogs([toDisplayRow(data as AuditRow), ...auditLogs]);
  };

  const handleEditAudit = async (
    uuid: string,
    updates: {
      name: string;
      description: string;
      type: string;
      issuer: string;
      scope: string;
    }
  ) => {
    const { data, error } = await supabase
      .from('audits')
      .update({
        name: updates.name,
        description: updates.description,
        type: updates.type,
        issuer: updates.issuer,
        scope: updates.scope,
      })
      .eq('id', uuid)
      .select()
      .single();

    if (error) {
      setLoadError(error.message);
      return;
    }

    const updatedRow = toDisplayRow(data as AuditRow);
    setAuditLogs((prev) => prev.map((a) => (a.uuid === uuid ? updatedRow : a)));
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />
      
      <div className={styles.workspaceWrapper}>
        <AdminSidebar />
        
        <main className={styles.main}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.pageTitle}>Documents & Verification Hub</h1>
            </div>
            
            {activeTab === 'admin' ? (
              <button 
                type="button" 
                className={styles.uploadBtn}
                onClick={() => setIsModalOpen(true)}
              >
                <FileUp size={14} /> New Audit Log
              </button>
            ) : (
              <button type="button" className={`${styles.uploadBtn} ${styles.verifyBtn}`}>
                <UserCheck size={14} /> Batch Verify
              </button>
            )}
          </div>

          <DocumentControls 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {loadError && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>
              Couldn&apos;t load audits: {loadError}
            </p>
          )}

          <section className={styles.tablePanel}>
            {activeTab === 'admin' ? (
              isLoading ? (
                <p style={{ fontSize: '11px', color: '#64748b' }}>Loading audits...</p>
              ) : (
                <AdminAuditsTable searchQuery={searchQuery} documentsList={auditLogs} onEdit={handleEditAudit} />
              )
            ) : (
              <StudentReceiptsTable searchQuery={searchQuery} />
            )}
          </section>
        </main>
      </div>

      <UploadAuditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddAudit}
      />
    </div>
  );
}