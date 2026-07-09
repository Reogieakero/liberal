import React from 'react';
import { SiVercel, SiZapier, SiLoom, SiCashapp, SiLoops, SiRam, SiRaycast } from 'react-icons/si';
import styles from './Footer.module.css';

export default function Footer() {
  return (
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
  );
}