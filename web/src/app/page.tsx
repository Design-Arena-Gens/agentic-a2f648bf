"use client";

import dynamic from 'next/dynamic';
import styles from './page.module.css';

const SceneCanvas = dynamic(() => import('@/components/SceneCanvas'), { ssr: false });

export default function Page() {
  return (
    <main className={styles.main}>
      <SceneCanvas />
      <div className={styles.overlay}>
        <div className={styles.title}>???? ? 15s ?????</div>
        <div className={styles.hint}>??????????????????</div>
      </div>
    </main>
  );
}
