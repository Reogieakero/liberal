import React from 'react';
import { Shield, User, ArrowUpRight } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
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
        <a href="#account" className={styles.createAccount}>
          <User size={12} /> Faculty Portal
        </a>
      </div>
    </header>
  );
}