'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, User, ArrowUpRight, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.logoCircle}></div>
      </div>

      <nav className={styles.nav}>
        <a href="#home" className={styles.navLink}>Home</a>
        <a href="#attendance" className={styles.navLink}>Attendance</a>
        <a href="#announcements" className={styles.navLink}>Announcements</a>
        <a href="#transactions" className={styles.navLink}>Transactions</a>
        <a href="#features" className={styles.navLink}>Features</a>
        <a href="#faq" className={styles.navLink}>FAQ</a>
        <button className={styles.protectionBtn}>
          Security <ArrowUpRight size={12} /> 
          <Shield size={12} className={styles.shieldIcon} />
        </button>
      </nav>

      <div className={styles.auth}>
        <Link href="/login" className={styles.createAccount}>
          <User size={12} /> Student Login
        </Link>
      </div>

      <button
        className={styles.hamburgerBtn}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <div className={`${styles.mobileNav} ${menuOpen ? styles.open : ''}`}>
        <a href="#home" className={styles.navLink} onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#attendance" className={styles.navLink} onClick={() => setMenuOpen(false)}>Attendance</a>
        <a href="#announcements" className={styles.navLink} onClick={() => setMenuOpen(false)}>Announcements</a>
        <a href="#transactions" className={styles.navLink} onClick={() => setMenuOpen(false)}>Transactions</a>
        <a href="#features" className={styles.navLink} onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#faq" className={styles.navLink} onClick={() => setMenuOpen(false)}>FAQ</a>
        <button className={styles.protectionBtn}>
          Security <ArrowUpRight size={12} />
          <Shield size={12} />
        </button>
        <Link href="/login" className={styles.createAccount} onClick={() => setMenuOpen(false)}>
          <User size={12} /> Student Login
        </Link>
      </div>
    </header>
  );
}