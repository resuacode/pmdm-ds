import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

type PdfSection = 'android' | 'videojuegos';

type Props = {
  file: PdfSection;
  label?: string;
};

const DEFAULT_LABELS: Record<PdfSection, string> = {
  android: 'Descargar sección Android en PDF',
  videojuegos: 'Descargar sección Videojuegos en PDF',
};

export default function PdfDownloadButton({file, label}: Props): JSX.Element {
  const pdfUrl = useBaseUrl(`/pdf/${file}.pdf`);
  const text = label ?? DEFAULT_LABELS[file];

  return (
    <p className={styles.wrap}>
      <a className={styles.button} href={pdfUrl} download={`${file}-pmdm.pdf`}>
        {text}
      </a>
    </p>
  );
}
