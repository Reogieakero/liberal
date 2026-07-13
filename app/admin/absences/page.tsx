"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarX2, Search, ChevronDown, Check } from 'lucide-react';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';
import AbsencesTable from './components/AbsencesTable/AbsencesTable';
import AddAbsenceModal from './components/AddAbsenceModal/AddAbsenceModal';
import StudentEventsModal from './components/StudentEventsModal/StudentEventsModal';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';
import type { StudentAbsenceSummary } from './types';

const PAGE_SIZE = 10;

export default function AdminAbsences() {
  const [rows, setRows] = useState<StudentAbsenceSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'most' | 'name'>('most');
  const [programOptions, setProgramOptions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<StudentAbsenceSummary | null>(null);

  // Custom Dropdown States
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Refs to handle clicking outside to close dropdowns
  const programRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPrograms = async () => {
    const { data } = await supabase.from('students').select('program');
    if (data) {
      const unique = Array.from(new Set(data.map((d) => d.program))).sort();
      setProgramOptions(unique);
    }
  };

  const fetchRows = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      let query = supabase
        .from('student_absence_summary')
        .select('*', { count: 'exact' });

      if (searchQuery.trim()) {
        query = query.or(
          `full_name.ilike.%${searchQuery.trim()}%,student_number.ilike.%${searchQuery.trim()}%`
        );
      }
      if (programFilter !== 'All') {
        query = query.eq('program', programFilter);
      }

      query = sortBy === 'most'
        ? query.order('total_absences', { ascending: false })
        : query.order('full_name', { ascending: true });

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const formatted: StudentAbsenceSummary[] = (data || []).map((r: any) => ({
        studentId: r.student_id,
        studentNumber: r.student_number,
        fullName: r.full_name,
        program: r.program,
        yearLevel: r.year_level,
        section: r.section,
        totalAbsences: r.total_absences,
        excusedCount: r.excused_count,
        unexcusedCount: r.unexcused_count,
        lastAbsenceDate: r.last_absence_date,
      }));

      setRows(formatted);
      setTotalCount(count ?? 0);
    } catch (err: any) {
      setLoadError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, programFilter, sortBy, page]);

  useEffect(() => { fetchPrograms(); }, []);
  useEffect(() => { fetchRows(); }, [fetchRows]);
  useEffect(() => { setPage(1); }, [searchQuery, programFilter, sortBy]);

  // Handle clicking outside to close custom select panels
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (programRef.current && !programRef.current.contains(event.target as Node)) {
        setIsProgramOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

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
              <h1 className={styles.pageTitle}>Student Absences</h1>
            </div>
            <button type="button" className={styles.newBtn} onClick={() => setIsAddModalOpen(true)}>
              <CalendarX2 size={12} /> Log Absence
            </button>
          </div>

          <section className={styles.controlsRow}>
            <div className={styles.searchWrapper}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name or student no..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.filtersGroup}>
              {/* Custom Program Dropdown */}
              <div className={styles.customSelectWrapper} ref={programRef}>
                <button 
                  type="button" 
                  className={styles.filterSelectTrigger} 
                  onClick={() => setIsProgramOpen(!isProgramOpen)}
                >
                  <span>{programFilter === 'All' ? 'All Programs' : programFilter}</span>
                  <ChevronDown size={12} className={`${styles.chevron} ${isProgramOpen ? styles.chevronOpen : ''}`} />
                </button>
                {isProgramOpen && (
                  <div className={styles.dropdownContent}>
                    <div 
                      className={`${styles.dropdownItem} ${programFilter === 'All' ? styles.dropdownItemActive : ''}`} 
                      onClick={() => { setProgramFilter('All'); setIsProgramOpen(false); }}
                    >
                      {programFilter === 'All' && <Check size={10} className={styles.checkIcon} />}
                      <span>All Programs</span>
                    </div>
                    {programOptions.map((p) => (
                      <div 
                        key={p} 
                        className={`${styles.dropdownItem} ${programFilter === p ? styles.dropdownItemActive : ''}`} 
                        onClick={() => { setProgramFilter(p); setIsProgramOpen(false); }}
                      >
                        {programFilter === p && <Check size={10} className={styles.checkIcon} />}
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Sort Dropdown */}
              <div className={styles.customSelectWrapper} ref={sortRef}>
                <button 
                  type="button" 
                  className={styles.filterSelectTrigger} 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  <span>{sortBy === 'most' ? 'Most Absences' : 'Name (A–Z)'}</span>
                  <ChevronDown size={12} className={`${styles.chevron} ${isSortOpen ? styles.chevronOpen : ''}`} />
                </button>
                {isSortOpen && (
                  <div className={styles.dropdownContent}>
                    <div 
                      className={`${styles.dropdownItem} ${sortBy === 'most' ? styles.dropdownItemActive : ''}`} 
                      onClick={() => { setSortBy('most'); setIsSortOpen(false); }}
                    >
                      {sortBy === 'most' && <Check size={10} className={styles.checkIcon} />}
                      <span>Most Absences</span>
                    </div>
                    <div 
                      className={`${styles.dropdownItem} ${sortBy === 'name' ? styles.dropdownItemActive : ''}`} 
                      onClick={() => { setSortBy('name'); setIsSortOpen(false); }}
                    >
                      {sortBy === 'name' && <Check size={10} className={styles.checkIcon} />}
                      <span>Name (A–Z)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {loadError && (
            <p style={{ color: '#ef4444', fontSize: '11px', margin: 0 }}>
              Couldn&apos;t load absences: {loadError}
            </p>
          )}

          <section className={styles.tablePanel}>
            {isLoading ? (
              <p style={{ fontSize: '11px', color: '#64748b' }}>Loading absences...</p>
            ) : (
              <AbsencesTable
                rows={rows}
                page={page}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={setPage}
                onView={(row) => setViewingStudent(row)}
              />
            )}
          </section>
        </main>
      </div>

      <AddAbsenceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={() => {
          setIsAddModalOpen(false);
          fetchRows();
          showToast('Absence record saved.', 'success');
        }}
        onError={(msg) => showToast(msg, 'error')}
      />

      <StudentEventsModal
        isOpen={viewingStudent !== null}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onChanged={() => {
          fetchRows();
        }}
        onError={(msg) => showToast(msg, 'error')}
        onSuccess={(msg) => showToast(msg, 'success')}
      />
    </div>
  );
}