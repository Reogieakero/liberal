import React from 'react';
import Header from './components/Header';
import Nodes from './components/Nodes';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import { ArrowDown } from 'lucide-react';
import styles from './Landing.module.css';

export default function Landing() {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        {/* Background Visual Enhancements */}
        <div className={styles.blurRight}></div>
        <div className={styles.blurLeft}></div>
        
        <div className={styles.matrixLines}>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </div>

        {/* Dynamic & Interactive Information Blocks */}
        <Nodes />
        <Carousel />

        {/* Structural Indicators */}
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

      <Footer />
    </div>
  );
}