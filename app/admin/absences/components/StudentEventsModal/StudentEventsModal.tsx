"use client";

import React, { useState, useEffect } from 'react';
import { X, CalendarX2, Trash2, Paperclip } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './StudentEventsModal.module.css';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import type { StudentAbsenceSummary, AbsenceRecord } from '../../types';

interface StudentEventsModalProps {
  isOpen: boolean;
  student: StudentAbsenceSummary | null;
  onClose: () => void;
  onChanged: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const statusClassMap: Record<string, string> = {
  Excused: 'statusExcused',
  Unexcused: 'statusUnexcused',
  Pending: 'statusPending',
};

export default function StudentEventsModal({
  isOpen,
  student,
  onClose,
  onChanged,
  onSuccess,
  onError,
}: StudentEventsModalProps) {
  const [events, setEvents] = useState<AbsenceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      fetchEvents(student.studentId);
    }
  }, [isOpen, student]);

  const fetchEvents = async (studentId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('absences')
        .select('*')
        .eq('student_id', studentId)
        .order('absence_date', { ascending: false });

      if (error) throw error;

      setEvents(
        (data || []).map((r: any) => ({
          id: r.id,
          studentId: r.student_id,
          eventName: r.event_name,
          eventType: r.event_type,
          absenceDate: r.absence_date,
          status: r.status,
          reason: r.reason,
          recordedBy: r.recorded_by,
        }))
      );
    } catch (err: any) {
      onError(err.message || 'Failed to load absence events.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('absences').delete().eq('id', pendingDeleteId);
      if (error) throw error;
      setEvents((prev) => prev.filter((e) => e.id !== pendingDeleteId));
      onChanged();
      onSuccess('Absence record removed.');
    } catch (err: any) {
      onError(err.message || 'Failed to delete record.');
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.window} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <CalendarX2 size={18} className={styles.headerIcon} />
            <div>
              <h3>{student.fullName}</h3>
              <span className={styles.subtitle}>{student.studentNumber} · {student.program}</span>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {isLoading ? (
            <p className={styles.loadingText}>Loading events...</p>
          ) : events.length === 0 ? (
            <div className={styles.emptyView}>
              <Paperclip size={28} style={{ opacity: 0.3 }} />
              <p>No absence events recorded for this student.</p>
            </div>
          ) : (
            <ul className={styles.eventList}>
              {events.map((ev) => (
                <li key={ev.id} className={styles.eventItem}>
                  <div className={styles.eventMain}>
                    <span className={styles.eventName}>{ev.eventName}</span>
                    <span className={styles.eventMeta}>
                      {ev.eventType} · {ev.absenceDate}
                    </span>
                    {ev.reason && <span className={styles.eventReason}>{ev.reason}</span>}
                  </div>
                  <div className={styles.eventActions}>
                    <span className={`${styles.statusBadge} ${styles[statusClassMap[ev.status]]}`}>
                      {ev.status}
                    </span>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      aria-label="Delete record"
                      onClick={() => setPendingDeleteId(ev.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        variant="danger"
        title="Delete this absence record?"
        message="This record will be permanently removed. This can't be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
