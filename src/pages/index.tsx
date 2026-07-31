import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import {Analytics} from '@vercel/analytics/react';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBackdrop} aria-hidden="true" />
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroVisual} aria-hidden="true">
        <div className={styles.deviceFrame}>
          <div className={styles.deviceScreen}>
            <span className={styles.deviceBar} />
            <span className={styles.deviceBlock} />
            <span className={styles.deviceBlockShort} />
            <span className={styles.deviceOrb} />
          </div>
        </div>
        <div className={styles.playShape} />
      </div>
      <div className={clsx('container', styles.heroInner)}>
        <p className={styles.brand}>PMDM</p>
        <Heading as="h1" className={styles.heroTitle}>
          Apps Android y videojuegos, en un solo módulo
        </Heading>
        <p className={styles.heroLead}>
          Material del curso de Programación Multimedia y Dispositivos Móviles:
          Kotlin, Jetpack Compose y Unity 6.
        </p>
        <div className={styles.ctaGroup}>
          <Link className={styles.ctaPrimary} to="/docs/intro">
            Empieza por aquí
          </Link>
          <Link className={styles.ctaGhost} to="/docs/Android/indice">
            Android
          </Link>
          <Link className={styles.ctaGhost} to="/docs/Videojuegos/indice">
            Unity
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Módulo: ${siteConfig.title}`}
      description="Material del módulo PMDM: Android con Kotlin y Compose, y videojuegos con Unity.">
      <Analytics />
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
