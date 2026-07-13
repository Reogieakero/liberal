'use client';

import React from 'react';
import { LayoutDashboard, CalendarCheck, Megaphone, Receipt, LogOut } from 'lucide-react';
import styles from './page.module.css';
import CompleteProfileModal from './CompleteProfileModal';
import { createClient } from '@/lib/supabase/client';

type Student = {
  id: string;
  student_number: string;
  full_name: string;
  program: string;
  year_level: string | null;
  section: string | null;
  email: string | null;
} | null;

type Props = {
  user: { id: string; email: string; name: string };
  student: Student;
  needsProfile: boolean;
};

export default function DashboardShell({ user, student, needsProfile }: Props) {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/student-login';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoCircle}></div>
          <span>Student Portal</span>
        </div>
        <button className={styles.signOutBtn} onClick={handleSignOut}>
          <LogOut size={13} /> Sign out
        </button>
      </header>

      {/* Real dashboard content — visually present but inert/blurred while profile is incomplete */}
      <main className={styles.main} aria-hidden={needsProfile}>
        <div className={needsProfile ? styles.blockedContent : undefined}>
          <h1 className={styles.welcome}>
            Welcome{student?.full_name ? `, ${student.full_name.split(' ')[0]}` : ''}
          </h1>

          <div className={styles.grid}>
            <div className={styles.card}>
              <LayoutDashboard size={16} />
              <h3>Overview</h3>
              <p>Your enrolled courses and current standing.</p>
            </div>
            <div className={styles.card}>
              <CalendarCheck size={16} />
              <h3>Attendance</h3>
              <p>Track your attendance record per subject.</p>
            </div>
            <div className={styles.card}>
              <Megaphone size={16} />
              <h3>Announcements</h3>
              <p>Updates from your program and instructors.</p>
            </div>
            <div className={styles.card}>
              <Receipt size={16} />
              <h3>Transactions</h3>
              <p>Fees, payments, and account balance.</p>
            </div>
          </div>
        </div>
      </main>

      {needsProfile && (
        <CompleteProfileModal
          defaultFullName={student?.full_name || user.name}
          email={user.email}
        />
      )}
    </div>
  );
}