"use client";

import React from 'react';
import { Shield, ArrowLeft, Info, GraduationCap, BookOpen, CalendarCheck, Users } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

function GoogleIcon() {
  return (
    <svg className={styles.googleIcon} width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.1 8.1 3l6-6C34.6 5.1 29.6 3 24 3c-7.8 0-14.5 4.4-17.7 10.7z"/>
      <path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 36.4 26.9 37 24 37c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.5 40.5 16.2 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6C41.9 36.1 45 30.6 45 24c0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

export default function StudentLogin() {
  const { signInWithGoogle, isRedirecting, error } = useGoogleSignIn();

  return (
    <div className={styles.container}>
      {/* Immersive Background Blur Layers */}
      <div className={styles.blurRight}></div>
      <div className={styles.blurLeft}></div>
      <div className={styles.blurCenter}></div>

      {/* Decorative Background Lines */}
      <div className={styles.matrixLines}>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
        <span className={styles.line}></span>
      </div>

      {/* Friendly Informational Floating Nodes */}
      <div className={`${styles.node} ${styles.nodeTopLeft}`}>
        <div className={styles.nodeIcon}><BookOpen size={10} /></div>
        <div className={styles.nodeText}>
          <h4>Courses</h4>
          <p>Up to date</p>
        </div>
      </div>

      <div className={`${styles.node} ${styles.nodeBottomLeft}`}>
        <div className={styles.nodeIcon}><CalendarCheck size={10} /></div>
        <div className={styles.nodeText}>
          <h4>Attendance</h4>
          <p>Synced daily</p>
        </div>
      </div>

      <div className={`${styles.node} ${styles.nodeTopRight}`}>
        <div className={styles.nodeTextRight}>
          <h4>Security</h4>
          <p>Google-verified</p>
        </div>
        <div className={styles.nodeIcon}><Shield size={10} /></div>
      </div>

      <div className={`${styles.node} ${styles.nodeBottomRight}`}>
        <div className={styles.nodeTextRight}>
          <h4>Classmates</h4>
          <p>Stay connected</p>
        </div>
        <div className={styles.nodeIcon}><Users size={10} /></div>
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={14} /> Back to Landing 
        </Link>
        <div className={styles.securityBadge}>
          <Shield size={12} /> Secure Access
        </div>
      </header>

      <main className={styles.mainWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <div className={styles.logoCircle}></div>
            <h1 className={styles.title}>Student Portal Login</h1>
            <p className={styles.subtitle}>Sign in with your school Google account to view classes, grades, and assignments</p>
          </div>

          <div className={styles.authArea}>
            {error && (
              <p className={styles.errorMessage} role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              className={styles.googleBtn}
              onClick={signInWithGoogle}
              disabled={isRedirecting}
            >
              <GoogleIcon />
              {isRedirecting ? 'Redirecting…' : 'Continue with Google'}
            </button>

            <div className={styles.infoNote}>
              <Info size={13} />
              <p>
                New here? No problem — signing in with your school Google account sets up
                your student profile automatically. There's no separate sign-up step.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Institutional Management Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
}