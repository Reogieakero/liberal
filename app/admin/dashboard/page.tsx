"use client";

import React from 'react';
import { Shield } from 'lucide-react';
import styles from './page.module.css';
import AdminNavbar from '../components/Navbar';
import AdminSidebar from '../components/Sidebar';

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <AdminNavbar />
      
      <div className={styles.workspaceWrapper}>
        <AdminSidebar />
        
        <main className={styles.main}>
          <div className={styles.welcomeCard}>
            <div className={styles.badge}>
              <Shield size={12} /> Secure Connection Active
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>
              You are successfully signed into your administrator account. Select a panel from the sidebar menu to safely manage your institution.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}