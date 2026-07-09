import React from 'react';
import { Triangle, Shuffle, Settings, Gem } from 'lucide-react';
import styles from './Nodes.module.css';

export default function Nodes() {
  return (
    <>
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
    </>
  );
}