import React from 'react';
import { Shield, User, Triangle, Shuffle, Settings, Gem, ArrowUpRight, ArrowDown } from 'lucide-react';
import { SiVercel, SiZapier, SiLoom, SiCashapp, SiLoops, SiRam, SiRaycast } from 'react-icons/si';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
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

      <main className={styles.main}>
        <div className={styles.blurRight}></div>
        <div className={styles.blurLeft}></div>

        <div className={`${styles.node} ${styles.nodeTopLeft}`}>
          <div className={styles.nodeIcon}><Triangle size={10} fill="currentColor" /></div>
          <div className={styles.nodeText}>
            <h4>Check-In</h4>
            <p>Active Now</p>
          </div>
        </div>

        <div className={`${styles.node} ${styles.nodeBottomLeft}`}>
          <div className={styles.nodeIcon}><Shuffle size={10} /></div>
          <div className={styles.nodeText}>
            <h4>Requests</h4>
            <p>Pending Approval</p>
          </div>
        </div>

        <div className={`${styles.node} ${styles.nodeTopRight}`}>
          <div className={styles.nodeTextRight}>
            <h4>Updates</h4>
            <p>Latest Post</p>
          </div>
          <div className={styles.nodeIcon}><Settings size={10} /></div>
        </div>

        <div className={`${styles.node} ${styles.nodeBottomRight}`}>
          <div className={styles.nodeTextRight}>
            <h4>Submissions</h4>
            <p>Verified</p>
          </div>
          <div className={styles.nodeIcon}><Gem size={10} /></div>
        </div>

        <div className={styles.carouselContainer}>
          <div className={styles.carouselTrack}>
            <div className={styles.heroContent}>
              <div className={styles.sparkTag}>
                <span className={styles.sparkle}>G</span>
                <span>Automated Log Tracking</span>
                <span className={styles.arrow}>➔</span>
              </div>
              <h1 className={styles.title}>
                One-click for Academic Efficiency
              </h1>
              <p className={styles.subtitle}>
                Dive into automated academic workflows, where clear institutional communication meets seamless processing operations
              </p>
              <div className={styles.ctaButtons}>
                <button className={styles.btnSecondary}>Open Portal <ArrowUpRight size={14} style={{ display: 'inline', marginLeft: '4px' }} /></button>
                <button className={styles.btnPrimary}>Discover More</button>
              </div>
            </div>

            <div className={styles.heroContent}>
              <div className={styles.sparkTag}>
                <span className={styles.sparkle}>G</span>
                <span>Real-time Broadcasts</span>
                <span className={styles.arrow}>➔</span>
              </div>
              <h1 className={styles.title}>
                Instant Department Broadcasts
              </h1>
              <p className={styles.subtitle}>
                Distribute urgent updates, memos, and schedule changes instantly across multiple departments from a singular dashboard.
              </p>
              <div className={styles.ctaButtons}>
                <button className={styles.btnSecondary}>View Bulletin <ArrowUpRight size={14} style={{ display: 'inline', marginLeft: '4px' }} /></button>
                <button className={styles.btnPrimary}>Learn More</button>
              </div>
            </div>

            <div className={styles.heroContent}>
              <div className={styles.sparkTag}>
                <span className={styles.sparkle}>G</span>
                <span>Clearance & Approvals</span>
                <span className={styles.arrow}>➔</span>
              </div>
              <h1 className={styles.title}>
                Frictionless Processing Operations
              </h1>
              <p className={styles.subtitle}>
                Submit, review, and track digital request forms, supply requisitions, and leave applications through transparent pipelines.
              </p>
              <div className={styles.ctaButtons}>
                <button className={styles.btnSecondary}>New Request <ArrowUpRight size={14} style={{ display: 'inline', marginLeft: '4px' }} /></button>
                <button className={styles.btnPrimary}>Documentation</button>
              </div>
            </div>

            <div className={styles.heroContent}>
              <div className={styles.sparkTag}>
                <span className={styles.sparkle}>G</span>
                <span>Automated Log Tracking</span>
                <span className={styles.arrow}>➔</span>
              </div>
              <h1 className={styles.title}>
                One-click for Academic Efficiency
              </h1>
              <p className={styles.subtitle}>
                Dive into automated academic workflows, where clear institutional communication meets seamless processing operations
              </p>
              <div className={styles.ctaButtons}>
                <button className={styles.btnSecondary}>Open Portal <ArrowUpRight size={14} style={{ display: 'inline', marginLeft: '4px' }} /></button>
                <button className={styles.btnPrimary}>Discover More</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.matrixLines}>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </div>

        <div className={styles.scrollIndicator}>
          <ArrowDown size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> 02/03 . Scroll down
        </div>

        <div className={styles.horizonsIndicator}>
          <span className={styles.horizonsText}>Faculty horizons</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.logoRow}>
          <span><SiVercel size={12} /> Vercel</span>
          <span><SiLoom size={12} /> loom</span>
          <span><SiCashapp size={12} /> Cash App</span>
          <span><SiLoops size={12} /> Loops</span>
          <span><SiZapier size={12} /> _zapier</span>
          <span><SiRam size={12} /> ramp ↗</span>
          <span><SiRaycast size={12} /> Raycast</span>
        </div>
      </footer>
    </div>
  );
}