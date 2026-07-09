"use client";

import React from 'react';
import { Search } from 'lucide-react';
import styles from './DocumentControls.module.css';

interface DocumentControlsProps {
  activeTab: 'admin' | 'student';
  setActiveTab: (tab: 'admin' | 'student') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function DocumentControls({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}: DocumentControlsProps) {
  return (
    <section className={styles.controlsRow}>
      <div className={styles.searchWrapper}>
        <Search size={14} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder={activeTab === 'admin' ? "Search audits, scopes, or files..." : "Search students, reference IDs..."}
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.uiSelectorContainer}>
        <button 
          type="button"
          className={`${styles.selectorTab} ${activeTab === 'admin' ? styles.activeTab : ''}`}
          onClick={() => { setActiveTab('admin'); setSearchQuery(''); }}
        >
          Admin Attachments & Audits
        </button>
        <button 
          type="button"
          className={`${styles.selectorTab} ${activeTab === 'student' ? styles.activeTab : ''}`}
          onClick={() => { setActiveTab('student'); setSearchQuery(''); }}
        >
          Student Payment Receipts
        </button>
      </div>
    </section>
  );
}