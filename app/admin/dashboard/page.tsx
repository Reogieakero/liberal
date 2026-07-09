"use client";

import React from 'react';
import { Shield, LogOut } from 'lucide-react';
import styles from './page.module.css';
import { useLogout } from '../../hooks/useLogout';

export default function AdminDashboard() {
  const { logout, isLoggingOut } = useLogout();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoCircle}></div>
          <span className={styles.brandText}>Admin Dashboard</span>
        </div>

        <button
          className={styles.logoutBtn}
          onClick={logout}
          disabled={isLoggingOut}
        >
          <LogOut size={14} />
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <div className={styles.badge}>
            <Shield size={12} /> Authenticated Session
          </div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>
            You&apos;re signed in with an active admin session. Build out the
            rest of this dashboard here.
          </p>
        </div>
      </main>
    </div>
  );
}