import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type Track = {
  label: string;
  title: string;
  description: string;
  to: string;
  tone: 'android' | 'games';
};

const tracks: Track[] = [
  {
    label: 'Bloque 1',
    title: 'Android con Kotlin y Compose',
    description:
      'Desde Kotlin y la UI con Jetpack Compose hasta red, JSON, Room y multimedia.',
    to: '/docs/Android/indice',
    tone: 'android',
  },
  {
    label: 'Bloque 2',
    title: 'Videojuegos con Unity 6',
    description:
      'Editor, scripting en C#, físicas 2D y prácticas guiadas como Pong y Breakout.',
    to: '/docs/Videojuegos/indice',
    tone: 'games',
  },
];

export default function HomepageFeatures(): JSX.Element {
  return (
    <>
      <section className={styles.tracks} aria-labelledby="tracks-heading">
        <div className="container">
          <Heading as="h2" id="tracks-heading" className={styles.sectionTitle}>
            Elige por dónde continuar
          </Heading>
          <p className={styles.sectionLead}>
            Dos recorridos claros. Entra al índice de cada bloque cuando quieras.
          </p>
          <div className={styles.trackGrid}>
            {tracks.map((track) => (
              <Link
                key={track.to}
                className={`${styles.track} ${styles[track.tone]}`}
                to={track.to}>
                <span className={styles.trackLabel}>{track.label}</span>
                <span className={styles.trackTitle}>{track.title}</span>
                <span className={styles.trackDesc}>{track.description}</span>
                <span className={styles.trackCta}>Abrir índice</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.resources} aria-labelledby="resources-heading">
        <div className="container">
          <Heading as="h2" id="resources-heading" className={styles.sectionTitle}>
            También en clase
          </Heading>
          <p className={styles.sectionLead}>
            Los vídeos de las sesiones viven en YouTube; el código de ejemplo, en
            GitHub.
          </p>
          <div className={styles.resourceLinks}>
            <a
              className={styles.resourceLink}
              href="https://www.youtube.com/@resuacode"
              target="_blank"
              rel="noopener noreferrer">
              Canal de YouTube
            </a>
            <a
              className={styles.resourceLink}
              href="https://github.com/resuacode"
              target="_blank"
              rel="noopener noreferrer">
              GitHub
            </a>
            <Link className={styles.resourceLink} to="/docs/intro">
              Guía del módulo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
