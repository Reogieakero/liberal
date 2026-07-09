"use client";

import React from 'react';
import { Shield, KeyRound, User, ArrowLeft, Eye, EyeOff, Terminal, Activity, Radio, Cpu } from 'lucide-react';
import Link from 'next/link';
import styles from './admin-login.module.css';
import { useAdminLoginForm } from '../hooks/useAdminLoginForm';
import { usePasswordVisibility } from '../hooks/usePasswordVisibility';

export default function AdminLogin() {
  const {
    username,
    password,
    error,
    isSubmitting,
    setUsername,
    setPassword,
    handleSubmit,
  } = useAdminLoginForm();

  const { isVisible: showPassword, toggle: toggleShowPassword, inputType } = usePasswordVisibility();

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
        <div className={styles.nodeIcon}><Activity size={10} /></div>
        <div className={styles.nodeText}>
          <h4>Server Status</h4>
          <p>Running smoothly</p>
        </div>
      </div>

      <div className={`${styles.node} ${styles.nodeBottomLeft}`}>
        <div className={styles.nodeIcon}><Terminal size={10} /></div>
        <div className={styles.nodeText}>
          <h4>Connection</h4>
          <p>Fully secure</p>
        </div>
      </div>

      <div className={`${styles.node} ${styles.nodeTopRight}`}>
        <div className={styles.nodeTextRight}>
          <h4>Security</h4>
          <p>Encrypted portal</p>
        </div>
        <div className={styles.nodeIcon}><Radio size={10} /></div>
      </div>

      <div className={`${styles.node} ${styles.nodeBottomRight}`}>
        <div className={styles.nodeTextRight}>
          <h4>System Performance</h4>
          <p>Optimal load</p>
        </div>
        <div className={styles.nodeIcon}><Cpu size={10} /></div>
      </div>

      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={14} /> Back to Portal
        </Link>
        <div className={styles.securityBadge}>
          <Shield size={12} className={styles.shieldIcon} /> Secure Access
        </div>
      </header>

      <main className={styles.mainWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <div className={styles.logoCircle}></div>
            <h1 className={styles.title}>Admin Dashboard Login</h1>
            <p className={styles.subtitle}>Please sign in with your administrator account details to manage your institution</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>Username or Email</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={16} />
                <input
                  type="text"
                  id="username"
                  className={styles.input}
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <KeyRound className={styles.inputIcon} size={16} />
                <input
                  type={inputType}
                  id="password"
                  className={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.toggleVisible}
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className={styles.errorMessage} role="alert">
                {error}
              </p>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Institutional Management Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
}