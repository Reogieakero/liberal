"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, CalendarX2, ChevronDown, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './AddAbsenceModal.module.css';
import type { StudentOption } from '../../types';

interface AddAbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}

const eventTypeOptions = ['Class', 'Event', 'Exam', 'Seminar', 'Other'];
const statusOptions = ['Unexcused', 'Excused', 'Pending'];

export default function AddAbsenceModal({ isOpen, onClose, onSaved, onError }: AddAbsenceModalProps) {
  const [studentQuery, setStudentQuery] = useState('');
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);
  const [showStudentList, setShowStudentList] = useState(false);

  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('Class');
  const [absenceDate, setAbsenceDate] = useState('');
  const [status, setStatus] = useState('Unexcused');
  const [reason, setReason] = useState('');

  const [openDropdown, setOpenDropdown] = useState<'eventType' | 'status' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStudentQuery('');
      setStudentOptions([]);
      setSelectedStudent(null);
      setEventName('');
      setEventType('Class');
      setAbsenceDate('');
      setStatus('Unexcused');
      setReason('');
      setFormError(null);
      setOpenDropdown(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!studentQuery.trim()) {
      setStudentOptions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('students')
        .select('id, student_number, full_name, program')
        .or(`full_name.ilike.%${studentQuery.trim()}%,student_number.ilike.%${studentQuery.trim()}%`)
        .limit(10);

      setStudentOptions(
        (data || []).map((s: any) => ({
          id: s.id,
          studentNumber: s.student_number,
          fullName: s.full_name,
          program: s.program,
        }))
      );
    }, 300);
  }, [studentQuery]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) { setFormError('Please select a student.'); return; }
    if (!eventName.trim()) { setFormError('Please enter the event or class name.'); return; }
    if (!absenceDate) { setFormError('Please pick a date.'); return; }

    setFormError(null);
    setIsSaving(true);
    try {
      const { error } = await supabase.from('absences').insert([
        {
          student_id: selectedStudent.id,
          event_name: eventName.trim(),
          event_type: eventType,
          absence_date: absenceDate,
          status,
          reason: reason.trim() || null,
        },
      ]);
      if (error) throw error;
      onSaved();
    } catch (err: any) {
      onError(err.message || 'Failed to save absence record.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={() => setOpenDropdown(null)}>
      <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <CalendarX2 size={18} className={styles.headerIcon} />
            <h3>Log Absence</h3>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.inputGroup}>
            <label>Student</label>
            {selectedStudent ? (
              <div className={styles.selectedStudentChip}>
                <span>{selectedStudent.fullName} · {selectedStudent.studentNumber}</span>
                <button type="button" onClick={() => { setSelectedStudent(null); setStudentQuery(''); }}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className={styles.studentSearchWrapper}>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="Search by name or student number..."
                  value={studentQuery}
                  onChange={(e) => { setStudentQuery(e.target.value); setShowStudentList(true); }}
                  onFocus={() => setShowStudentList(true)}
                />
                {showStudentList && studentOptions.length > 0 && (
                  <div className={styles.studentDropdown}>
                    {studentOptions.map((s) => (
                      <div
                        key={s.id}
                        className={styles.studentOption}
                        onClick={() => { setSelectedStudent(s); setShowStudentList(false); }}
                      >
                        <strong>{s.fullName}</strong>
                        <span>{s.studentNumber} · {s.program}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Event / Class Name</label>
            <input
              type="text"
              className={styles.textInput}
              placeholder="e.g. CS101 - Jan 14 session, Flag Ceremony"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className={styles.gridFieldsRow}>
            <div className={styles.inputGroup}>
              <label>Date</label>
              <input
                type="date"
                className={styles.textInput}
                value={absenceDate}
                onChange={(e) => setAbsenceDate(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Event Type</label>
              <div className={styles.customSelectWrapper}>
                <div
                  className={styles.customSelectHeader}
                  onClick={() => setOpenDropdown(openDropdown === 'eventType' ? null : 'eventType')}
                >
                  <span>{eventType}</span>
                  <ChevronDown size={14} />
                </div>
                {openDropdown === 'eventType' && (
                  <div className={styles.customOptionsList}>
                    {eventTypeOptions.map((opt) => (
                      <div
                        key={opt}
                        className={`${styles.customOption} ${eventType === opt ? styles.selectedOption : ''}`}
                        onClick={() => { setEventType(opt); setOpenDropdown(null); }}
                      >
                        {opt} {eventType === opt && <Check size={12} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Status</label>
            <div className={styles.customSelectWrapper}>
              <div
                className={styles.customSelectHeader}
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              >
                <span>{status}</span>
                <ChevronDown size={14} />
              </div>
              {openDropdown === 'status' && (
                <div className={styles.customOptionsList}>
                  {statusOptions.map((opt) => (
                    <div
                      key={opt}
                      className={`${styles.customOption} ${status === opt ? styles.selectedOption : ''}`}
                      onClick={() => { setStatus(opt); setOpenDropdown(null); }}
                    >
                      {opt} {status === opt && <Check size={12} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Reason (optional)</label>
            <textarea
              className={styles.textareaInput}
              placeholder="e.g. Medical certificate submitted"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {formError && <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>{formError}</p>}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
