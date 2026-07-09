import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './Carousel.module.css';

export default function Carousel() {
  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselTrack}>
        
        {/* Slide 1 */}
        <div className={styles.heroContent}>
          <div className={styles.sparkTag}>
            <span className={styles.sparkle}>G</span>
            <span>Automated Log Tracking</span>
            <span className={styles.arrow}>➔</span>
          </div>
          <h1 className={styles.title}>One-click for Academic Efficiency</h1>
          <p className={styles.subtitle}>
            Dive into automated academic workflows, where clear institutional communication meets seamless processing operations
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnSecondary}>Open Portal <ArrowUpRight size={14} style={{ display: 'inline', marginLeft: '4px' }} /></button>
            <button className={styles.btnPrimary}>Discover More</button>
          </div>
        </div>

        {/* Slide 2 */}
        <div className={styles.heroContent}>
          <div className={styles.sparkTag}>
            <span className={styles.sparkle}>G</span>
            <span>Real-time Broadcasts</span>
            <span className={styles.arrow}>➔</span>
          </div>
          <h1 className={styles.title}>Instant Department Broadcasts</h1>
          <p className={styles.subtitle}>
            Distribute urgent updates, memos, and schedule changes instantly across multiple departments from a singular dashboard.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnSecondary}>View Bulletin <ArrowUpRight size={14} style={{ display: 'inline', marginLeft: '4px' }} /></button>
            <button className={styles.btnPrimary}>Learn More</button>
          </div>
        </div>

        {/* Slide 3 */}
        <div className={styles.heroContent}>
          <div className={styles.sparkTag}>
            <span className={styles.sparkle}>G</span>
            <span>Clearance & Approvals</span>
            <span className={styles.arrow}>➔</span>
          </div>
          <h1 className={styles.title}>Frictionless Processing Operations</h1>
          <p className={styles.subtitle}>
            Submit, review, and track digital request forms, supply requisitions, and leave applications through transparent pipelines.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnSecondary}>New Request <ArrowUpRight size={14} style={{ display: 'inline', marginLeft: '4px' }} /></button>
            <button className={styles.btnPrimary}>Documentation</button>
          </div>
        </div>

        {/* Slide 4 (Loop Duplicate) */}
        <div className={styles.heroContent}>
          <div className={styles.sparkTag}>
            <span className={styles.sparkle}>G</span>
            <span>Automated Log Tracking</span>
            <span className={styles.arrow}>➔</span>
          </div>
          <h1 className={styles.title}>One-click for Academic Efficiency</h1>
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
  );
}