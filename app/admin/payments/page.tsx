"use client";

import React, { useState, useEffect } from 'react';
import { Wallet, Search } from 'lucide-react';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';
import PaymentMethodsTable from './components/PaymentMethodsTable/PaymentMethodsTable';
import PaymentMethodModal from './components/PaymentMethodModal/PaymentMethodModal';
import PaymentMethodPreviewModal from './components/PaymentMethodPreviewModal/PaymentMethodPreviewModal';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog';
import styles from './page.module.css';

interface PaymentMethodRow {
  id: string;
  method_code: string;
  method_type: string;
  account_name: string;
  account_number: string;
  is_active: boolean;
  created_at: string;
  qr_image_url: string | null;
  qr_image_path: string | null;
  qr_image_name: string | null;
}

export interface PaymentMethodDisplayRow {
  id: string;
  code: string;
  type: string;
  accountName: string;
  accountNumber: string;
  isActive: boolean;
  date: string;
  qrUrl: string | null;
  qrPath: string | null;
  qrName: string | null;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export interface PaymentMethodFormData {
  type: string;
  accountName: string;
  accountNumber: string;
  isActive: boolean;
  qrUrl: string | null;
  qrPath: string | null;
  qrName: string | null;
}

const mapRow = (row: PaymentMethodRow): PaymentMethodDisplayRow => ({
  id: row.id,
  code: row.method_code,
  type: row.method_type,
  accountName: row.account_name,
  accountNumber: row.account_number,
  isActive: row.is_active,
  date: formatDate(row.created_at),
  qrUrl: row.qr_image_url,
  qrPath: row.qr_image_path,
  qrName: row.qr_image_name,
});

const extractError = async (res: Response, fallback: string) => {
  try {
    const body = await res.json();
    return body?.error || fallback;
  } catch {
    return fallback;
  }
};

export default function AdminPayments() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDisplayRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethodDisplayRow | null>(null);

  const [viewingMethod, setViewingMethod] = useState<PaymentMethodDisplayRow | null>(null);
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

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch('/api/payment-methods');
      if (!res.ok) throw new Error(await extractError(res, 'Failed to load payment methods'));
      const { data } = await res.json();
      setPaymentMethods((data as PaymentMethodRow[]).map(mapRow));
    } catch (err: any) {
      setLoadError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleCreate = async (formData: PaymentMethodFormData) => {
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(await extractError(res, 'Failed to add payment method.'));
      await fetchPaymentMethods();
      setIsModalOpen(false);
      showToast('Payment method successfully added!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add payment method.', 'error');
    }
  };

  const handleUpdate = async (id: string, formData: PaymentMethodFormData) => {
    try {
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(await extractError(res, 'Failed to update payment method.'));
      await fetchPaymentMethods();
      setIsModalOpen(false);
      setEditingMethod(null);
      showToast('Payment method updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update payment method.', 'error');
    }
  };

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/payment-methods/${pendingDeleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await extractError(res, 'Failed to delete payment method.'));

      setPaymentMethods((prev) => prev.filter((p) => p.id !== pendingDeleteId));
      showToast('Payment method was permanently deleted.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete payment method.', 'error');
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const openCreateModal = () => {
    setEditingMethod(null);
    setIsModalOpen(true);
  };

  const openEditModal = (method: PaymentMethodDisplayRow) => {
    setEditingMethod(method);
    setIsModalOpen(true);
  };

  const openViewModal = (method: PaymentMethodDisplayRow) => {
    setViewingMethod(method);
    setIsPreviewOpen(true);
  };

  const methodPendingDelete = paymentMethods.find((p) => p.id === pendingDeleteId) ?? null;

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
              <h1 className={styles.pageTitle}>Payment Methods</h1>
            </div>
            <button type="button" className={styles.newBtn} onClick={openCreateModal}>
              <Wallet size={12} /> New Payment Method
            </button>
          </div>

          <section className={styles.controlsRow}>
            <div className={styles.searchWrapper}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search payment methods..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </section>

          {loadError && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>
              Couldn&apos;t load payment methods: {loadError}
            </p>
          )}

          <section className={styles.tablePanel}>
            {isLoading ? (
              <p style={{ fontSize: '11px', color: '#64748b' }}>Loading payment methods...</p>
            ) : (
              <PaymentMethodsTable
                searchQuery={searchQuery}
                paymentMethods={paymentMethods}
                onEdit={openEditModal}
                onDelete={requestDelete}
                onView={openViewModal}
              />
            )}
          </section>
        </main>
      </div>

      <PaymentMethodModal
        isOpen={isModalOpen}
        initialData={editingMethod}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMethod(null);
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <PaymentMethodPreviewModal
        isOpen={isPreviewOpen}
        method={viewingMethod}
        onClose={() => {
          setIsPreviewOpen(false);
          setViewingMethod(null);
        }}
      />

      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        variant="danger"
        title="Delete this payment method?"
        message={
          methodPendingDelete
            ? `"${methodPendingDelete.accountName}" (${methodPendingDelete.type}) will be permanently deleted, along with its QR code. This can't be undone.`
            : "This payment method will be permanently deleted. This can't be undone."
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