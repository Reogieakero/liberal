"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShieldAlert, X } from 'lucide-react';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';
import ConfirmDialog from './components/ConfirmDialog';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface Sanction {
  id: string;
  absence_count: number;
  sanction_name: string;
  description: string;
}

export default function SanctionsPage() {
  const [sanctions, setSanctions] = useState<Sanction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSanction, setEditingSanction] = useState<Sanction | null>(null);
  
  const [absenceCount, setAbsenceCount] = useState<number>(1);
  const [sanctionName, setSanctionName] = useState('');
  const [description, setDescription] = useState('');

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'default' | 'danger';
    actionType: 'save' | 'delete';
    targetId?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    variant: 'default',
    actionType: 'save'
  });

  useEffect(() => {
    fetchSanctions();
  }, []);

  const fetchSanctions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('sanctions')
      .select('*')
      .order('absence_count', { ascending: true });

    if (error) {
      setErrorMessage("Could not load rules list. Please try reloading the page.");
    } else {
      setSanctions(data || []);
    }
    setIsLoading(false);
  };

  const openAddModal = () => {
    setEditingSanction(null);
    setAbsenceCount(1);
    setSanctionName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (sanction: Sanction) => {
    setEditingSanction(sanction);
    setAbsenceCount(sanction.absence_count);
    setSanctionName(sanction.sanction_name);
    setDescription(sanction.description);
    setIsModalOpen(true);
  };

  const handlePreSubmitCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmConfig({
      isOpen: true,
      title: editingSanction ? 'Save Changes?' : 'Add This Rule?',
      message: editingSanction 
        ? `Are you sure you want to change the penalty rules for students with ${absenceCount} ${absenceCount === 1 ? 'absence' : 'absences'}?`
        : `This will create a new rule applying "${sanctionName}" when a student hits ${absenceCount} ${absenceCount === 1 ? 'absence' : 'absences'}.`,
      confirmLabel: editingSanction ? 'Yes, Save Changes' : 'Yes, Add Rule',
      variant: 'default',
      actionType: 'save'
    });
  };

  const handlePreDeleteCheck = (rule: Sanction) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Rule?',
      message: `Are you sure you want to completely remove the penalty rule "${rule.sanction_name}" set for ${rule.absence_count} ${rule.absence_count === 1 ? 'absence' : 'absences'}? This cannot be undone.`,
      confirmLabel: 'Yes, Delete Rule',
      variant: 'danger',
      actionType: 'delete',
      targetId: rule.id
    });
  };

  const executeConfirmedAction = async () => {
    setIsActionLoading(true);
    setErrorMessage(null);

    try {
      if (confirmConfig.actionType === 'save') {
        const payload = {
          absence_count: absenceCount,
          sanction_name: sanctionName,
          description: description
        };

        if (editingSanction) {
          const { error } = await supabase
            .from('sanctions')
            .update(payload)
            .eq('id', editingSanction.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('sanctions')
            .insert(payload);
          if (error) throw error;
        }
        setIsModalOpen(false);
      } else if (confirmConfig.actionType === 'delete' && confirmConfig.targetId) {
        const { error } = await supabase
          .from('sanctions')
          .delete()
          .eq('id', confirmConfig.targetId);
        if (error) throw error;
      }

      await fetchSanctions();
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      setErrorMessage("Something went wrong while updates were being saved. Please verify your connection or parameters.");
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    }  {
      setIsActionLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />
      
      <div className={styles.workspaceWrapper}>
        <AdminSidebar />
        
        <main className={styles.main}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.pageTitle}>Absence Penalties Matrix</h1>
              <p className={styles.subtitle}>Set up and manage what penalties happen automatically based on a student&apos;s total absent days.</p>
            </div>
            
            <button type="button" className={styles.actionBtn} onClick={openAddModal}>
              <Plus size={14} /> Add New Penalty Rule
            </button>
          </div>

          {errorMessage && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0', fontWeight: 500 }}>
              Notice: {errorMessage}
            </p>
          )}

          <section className={styles.tablePanel}>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Absence Count Threshold</th>
                    <th>Assigned Penalty Action</th>
                    <th>Description & Guidelines</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>
                        Loading penalty rules chart...
                      </td>
                    </tr>
                  ) : sanctions.length > 0 ? (
                    sanctions.map((rule) => (
                      <tr key={rule.id}>
                        <td>
                          <span className={styles.absenceBadge}>
                            {rule.absence_count} {rule.absence_count === 1 ? 'Absence' : 'Absences'}
                          </span>
                        </td>
                        <td className={styles.sanctionName}>{rule.sanction_name}</td>
                        <td style={{ color: '#475569' }}>{rule.description}</td>
                        <td>
                          <div className={styles.actionButtonsGroup} style={{ justifyContent: 'center' }}>
                            <button 
                              type="button" 
                              className={styles.rowBtn} 
                              onClick={() => openEditModal(rule)}
                              title="Edit Rule Settings"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button 
                              type="button" 
                              className={`${styles.rowBtn} ${styles.deleteBtn}`} 
                              onClick={() => handlePreDeleteCheck(rule)}
                              title="Delete This Rule"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '32px 0', fontStyle: 'italic' }}>
                        No penalty rules have been added yet. Click &quot;Add New Penalty Rule&quot; to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} style={{ color: '#0284c7' }} />
                <h3>{editingSanction ? 'Edit Penalty Settings' : 'Create New Penalty Rule'}</h3>
              </div>
              <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setIsModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePreSubmitCheck} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>Number of Absences Trigger</label>
                <input 
                  type="number" 
                  min={1} 
                  required 
                  className={styles.textInput} 
                  value={absenceCount}
                  onChange={(e) => setAbsenceCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Penalty Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., First Warning Letter, Academic Disqualification Notice" 
                  required 
                  className={styles.textInput}
                  value={sanctionName}
                  onChange={(e) => setSanctionName(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Clear Instructions & Details</label>
                <textarea 
                  rows={3} 
                  placeholder="Describe what happens, who needs to be contacted, or any tasks the student must fulfill..." 
                  required 
                  className={styles.textArea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" style={{ background: 'transparent', border: '1px solid rgba(14, 165, 233, 0.2)', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', borderRadius: '4px', color: '#64748b' }} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', fontSize: '11px', cursor: 'pointer', borderRadius: '4px' }}>
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        variant={confirmConfig.variant}
        isLoading={isActionLoading}
        onConfirm={executeConfirmedAction}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}