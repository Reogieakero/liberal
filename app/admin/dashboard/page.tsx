"use client";

import React from 'react';
import { Shield } from 'lucide-react';
import styles from './page.module.css';
import AdminNavbar from '../components/Navbar';

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      {/* Replaced the old inline header with the Supabase-style custom navbar */}
      <AdminNavbar />

      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <div className={styles.badge}>
            <Shield size={12} /> Secure Connection Active
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            You are successfully signed into your administrator account. You can safely manage your institution from this panel.
          </p>
        </div>
      </main>
    </div>
  );
}