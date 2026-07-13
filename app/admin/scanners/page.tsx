"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, LogOut, Trash2, Users, CheckCircle2, Clock, ScanLine } from 'lucide-react';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';
import ConfirmDialog from '../sanctions/components/ConfirmDialog';
import CustomDropdown from './components/CustomDropdown';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface EventOption {
  id: string;
  title: string;
  event_date: string;
}

interface ScanLogRow {
  id: string;
  time_in: string | null;
  time_out: string | null;
  students: {
    id: string;
    student_number: string;
    full_name: string;
    program: string;
    year_level: string | null;
    section: string | null;
  } | null;
}

export default function ScannersPage() {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [logs, setLogs] = useState<ScanLogRow[]>([]);

  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'default' | 'danger';
    targetId?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    variant: 'default'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    const { data, error } = await supabase
      .from('events')
      .select('id, title, event_date')
      .order('event_date', { ascending: false });

    if (error) {
      setErrorMessage("Could not load the events list. Please try reloading the page.");
    } else {
      setEvents(data || []);
      if (data && data.length > 0) {
        setSelectedEventId((prev) => prev || data[0].id);
      }
    }
    setIsLoadingEvents(false);
  };

  const fetchLogs = useCallback(async (eventId: string) => {
    if (!eventId) {
      setLogs([]);
      return;
    }
    setIsLoadingLogs(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('scan_logs')
      .select('id, time_in, time_out, students(id, student_number, full_name, program, year_level, section)')
      .eq('event_id', eventId)
      .order('time_in', { ascending: true });

    if (error) {
      setErrorMessage("Could not load scan records for this event.");
    } else {
      setLogs((data as any) || []);
    }
    setIsLoadingLogs(false);
  }, []);

  useEffect(() => {
    fetchLogs(selectedEventId);
  }, [selectedEventId, fetchLogs]);

  const formatTime = (ts: string | null) => {
    if (!ts) return null;
    return new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  const eventOptions = events.map((e) => ({
    value: e.id,
    label: `${e.title} — ${new Date(e.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
  }));

  const filteredLogs = logs.filter((log) => {
    if (!log.students) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      log.students.full_name.toLowerCase().includes(q) ||
      log.students.student_number.toLowerCase().includes(q)
    );
  });

  const totalScanned = logs.length;
  const checkedOutCount = logs.filter((l) => l.time_out).length;
  const stillInCount = totalScanned - checkedOutCount;

  const handleMarkTimeOut = async (logId: string) => {
    setIsActionLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase
        .from('scan_logs')
        .update({ time_out: new Date().toISOString() })
        .eq('id', logId);
      if (error) throw error;
      await fetchLogs(selectedEventId);
    } catch (err: any) {
      setErrorMessage(err?.message || "Could not record time-out.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePreDeleteCheck = (log: ScanLogRow) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete This Scan Record?',
      message: `Are you sure you want to remove the scan record for "${log.students?.full_name ?? 'this student'}"? This cannot be undone.`,
      confirmLabel: 'Yes, Delete Record',
      variant: 'danger',
      targetId: log.id
    });
  };

  const executeConfirmedDelete = async () => {
    if (!confirmConfig.targetId) return;
    setIsActionLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase
        .from('scan_logs')
        .delete()
        .eq('id', confirmConfig.targetId);
      if (error) throw error;
      await fetchLogs(selectedEventId);
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      setErrorMessage(err?.message || "Could not delete this scan record.");
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    } finally {
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
              <h1 className={styles.pageTitle}>Scanner Logs</h1>
              <p className={styles.subtitle}>Review which students have been scanned in and out for each school event.</p>
            </div>

            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => fetchLogs(selectedEventId)}
              disabled={isLoadingLogs || !selectedEventId}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {errorMessage && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0', fontWeight: 500 }}>
              Notice: {errorMessage}
            </p>
          )}

          <section className={styles.controlPanel}>
            <div className={styles.eventSelectField}>
              <CustomDropdown
                label="Select Event"
                options={eventOptions}
                selectedValue={selectedEventId}
                onChange={setSelectedEventId}
              />
            </div>

            <div className={styles.searchField}>
              <label>Search Student</label>
              <div className={styles.searchInputWrapper}>
                <Search size={13} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search by name or student number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={!selectedEventId}
                />
              </div>
            </div>
          </section>

          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{totalScanned}</span>
              <span className={styles.statLabel}>Total Scanned</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stillInCount}</span>
              <span className={styles.statLabel}>Currently Checked-In</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{checkedOutCount}</span>
              <span className={styles.statLabel}>Checked-Out</span>
            </div>
          </section>

          <section className={styles.tablePanel}>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th style={{ width: '110px' }}>Student No.</th>
                    <th>Full Name</th>
                    <th>Program</th>
                    <th style={{ width: '110px' }}>Year &amp; Section</th>
                    <th style={{ width: '100px' }}>Time In</th>
                    <th style={{ width: '100px' }}>Time Out</th>
                    <th style={{ width: '110px' }}>Status</th>
                    <th style={{ textAlign: 'center', width: '90px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!selectedEventId ? (
                    <tr>
                      <td colSpan={8}>
                        <div className={styles.emptyState}>
                          <ScanLine size={32} style={{ opacity: 0.25 }} />
                          <span style={{ fontSize: '11px' }}>{isLoadingEvents ? 'Loading events...' : 'Select an event above to view scanned students.'}</span>
                        </div>
                      </td>
                    </tr>
                  ) : isLoadingLogs ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>
                        Loading scan records...
                      </td>
                    </tr>
                  ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => {
                      const isComplete = !!log.time_out;
                      return (
                        <tr key={log.id}>
                          <td><span className={styles.studentNumber}>{log.students?.student_number}</span></td>
                          <td className={styles.studentName}>{log.students?.full_name}</td>
                          <td style={{ color: '#475569' }}>{log.students?.program}</td>
                          <td>
                            <span className={styles.metaTag}>
                              {[log.students?.year_level, log.students?.section].filter(Boolean).join(' - ') || '—'}
                            </span>
                          </td>
                          <td>
                            {log.time_in ? <span className={styles.timeBadge}>{formatTime(log.time_in)}</span> : <span className={styles.timeBadgeMuted}>—</span>}
                          </td>
                          <td>
                            {log.time_out ? <span className={styles.timeBadge}>{formatTime(log.time_out)}</span> : <span className={styles.timeBadgeMuted}>—</span>}
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${isComplete ? styles.statusComplete : styles.statusPending}`}>
                              {isComplete ? 'Checked-Out' : 'Checked-In'}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionButtonsGroup} style={{ justifyContent: 'center', gap: '4px' }}>
                              {!isComplete && (
                                <button
                                  type="button"
                                  className={styles.rowBtn}
                                  onClick={() => handleMarkTimeOut(log.id)}
                                  disabled={isActionLoading}
                                  title="Record Time-Out Now"
                                >
                                  <LogOut size={13} />
                                </button>
                              )}
                              <button
                                type="button"
                                className={`${styles.rowBtn} ${styles.deleteBtn}`}
                                onClick={() => handlePreDeleteCheck(log)}
                                disabled={isActionLoading}
                                title="Delete This Scan Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <div className={styles.emptyState}>
                          <Users size={32} style={{ opacity: 0.25 }} />
                          <span style={{ fontSize: '11px' }}>
                            {searchQuery ? 'No students match your search.' : 'No students have been scanned for this event yet.'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        variant={confirmConfig.variant}
        isLoading={isActionLoading}
        onConfirm={executeConfirmedDelete}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}