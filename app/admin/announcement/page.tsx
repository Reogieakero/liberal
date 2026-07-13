"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, Search } from 'lucide-react';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';
import AnnouncementsTable from './components/AnnouncementsTable/AnnouncementsTable';
import AnnouncementModal from './components/AnnouncementModal/AnnouncementModal';
import AnnouncementPreviewModal from './components/AnnouncementPreviewModal/AnnouncementPreviewModal';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface AnnouncementRow {
  id: string;
  announcement_code: string;
  title: string;
  content: string;
  priority: string;
  audience: string;
  author: string;
  created_at: string;
  file_url: string | null;
  file_path: string | null;
  file_name: string | null;
}

export interface AnnouncementDisplayRow {
  id: string;
  code: string;
  title: string;
  content: string;
  priority: string;
  audience: string;
  author: string;
  date: string;
  fileUrl: string | null;
  filePath: string | null;
  fileName: string | null;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

interface AnnouncementFormData {
  title: string;
  content: string;
  priority: string;
  audience: string;
  fileUrl: string | null;
  filePath: string | null;
  fileName: string | null;
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<AnnouncementDisplayRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementDisplayRow | null>(null);

  const [viewingAnnouncement, setViewingAnnouncement] = useState<AnnouncementDisplayRow | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted: AnnouncementDisplayRow[] = (data as AnnouncementRow[]).map((row) => ({
        id: row.id,
        code: row.announcement_code,
        title: row.title,
        content: row.content,
        priority: row.priority,
        audience: row.audience,
        author: row.author,
        date: formatDate(row.created_at),
        fileUrl: row.file_url,
        filePath: row.file_path,
        fileName: row.file_name,
      }));

      setAnnouncements(formatted);
    } catch (err: any) {
      setLoadError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (formData: AnnouncementFormData) => {
    try {
      const uniqueNum = Math.floor(1000 + Math.random() * 9000);
      const code = `ANN-${uniqueNum}`;

      const { data, error } = await supabase
        .from('announcements')
        .insert([
          {
            announcement_code: code,
            title: formData.title,
            content: formData.content,
            priority: formData.priority,
            audience: formData.audience,
            author: 'Admin User',
            file_url: formData.fileUrl,
            file_path: formData.filePath,
            file_name: formData.fileName,
          },
        ])
        .select();

      if (error) throw error;
      await fetchAnnouncements();
      setIsModalOpen(false);
      showToast('Announcement successfully posted!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to create announcement.', 'error');
    }
  };

  const handleUpdate = async (id: string, formData: AnnouncementFormData) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          title: formData.title,
          content: formData.content,
          priority: formData.priority,
          audience: formData.audience,
          file_url: formData.fileUrl,
          file_path: formData.filePath,
          file_name: formData.fileName,
        })
        .eq('id', id);

      if (error) throw error;
      await fetchAnnouncements();
      setIsModalOpen(false);
      setEditingAnnouncement(null);
      showToast('Announcement updates saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update announcement.', 'error');
    }
  };

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      const target = announcements.find((a) => a.id === pendingDeleteId);
      if (target?.filePath) {
        await supabase.storage.from('announcement-attachments').remove([target.filePath]);
      }

      const { error } = await supabase.from('announcements').delete().eq('id', pendingDeleteId);
      if (error) throw error;

      setAnnouncements((prev) => prev.filter((a) => a.id !== pendingDeleteId));
      showToast('Announcement was permanently deleted.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete announcement.', 'error');
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const openEditModal = (announcement: AnnouncementDisplayRow) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const openViewModal = (announcement: AnnouncementDisplayRow) => {
    setViewingAnnouncement(announcement);
    setIsPreviewOpen(true);
  };

  const announcementPendingDelete = announcements.find((a) => a.id === pendingDeleteId) ?? null;

  return (
    <div className={styles.container}>
      {toast && (
        <div className={`${styles.toastNotification} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <AdminNavbar />
      <div className={styles.workspaceWrapper}>
        <AdminSidebar />
        <main className={styles.main}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.pageTitle}>Announcements Panel</h1>
            </div>
            <button type="button" className={styles.newBtn} onClick={openCreateModal}>
              <Megaphone size={12} /> New Announcement
            </button>
          </div>

          <section className={styles.controlsRow}>
            <div className={styles.searchWrapper}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search announcements..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </section>

          {loadError && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>
              Couldn&apos;t load announcements: {loadError}
            </p>
          )}

          <section className={styles.tablePanel}>
            {isLoading ? (
              <p style={{ fontSize: '11px', color: '#64748b' }}>Loading announcements...</p>
            ) : (
              <AnnouncementsTable
                searchQuery={searchQuery}
                announcements={announcements}
                onEdit={openEditModal}
                onDelete={requestDelete}
                onView={openViewModal}
              />
            )}
          </section>
        </main>
      </div>

      <AnnouncementModal
        isOpen={isModalOpen}
        initialData={editingAnnouncement}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAnnouncement(null);
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <AnnouncementPreviewModal
        isOpen={isPreviewOpen}
        announcement={viewingAnnouncement}
        onClose={() => {
          setIsPreviewOpen(false);
          setViewingAnnouncement(null);
        }}
      />

      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        variant="danger"
        title="Delete this announcement?"
        message={
          announcementPendingDelete
            ? `"${announcementPendingDelete.title}" will be permanently deleted, along with any attached file. This can't be undone.`
            : "This announcement will be permanently deleted. This can't be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}