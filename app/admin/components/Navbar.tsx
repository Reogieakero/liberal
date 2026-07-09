"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Search, User } from 'lucide-react';
import { useLogout } from '../../hooks/useLogout';
import styles from './Navbar.module.css';

export default function AdminNavbar() {
  const { logout, isLoggingOut } = useLogout();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown automatically if clicking outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.logoCircle}></div>
        <span className={styles.brandText}>Admin Dashboard</span>
      </div>

      <div className={styles.rightSection}>
        {/* Supabase-style Search Input situated right next to the Profile Section */}
        <div className={styles.searchContainer}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Profile Avatar Trigger and Floating Dropdown Menu */}
        <div className={styles.profileMenuContainer} ref={dropdownRef}>
          <button
            type="button"
            className={styles.avatarButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Toggle profile settings menu"
            aria-expanded={isDropdownOpen}
          >
            <User size={16} className={styles.avatarIcon} />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <p className={styles.userRole}>Administrator</p>
                <p className={styles.userAccount}>admin@institution.org</p>
              </div>
              <div className={styles.dropdownDivider}></div>
              <button
                onClick={logout}
                disabled={isLoggingOut}
                className={styles.signOutBtn}
                type="button"
              >
                <LogOut size={13} />
                {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}