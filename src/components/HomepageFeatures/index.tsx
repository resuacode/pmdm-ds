import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Apuntes y ejemplos',
    Svg: require('@site/static/img/main/left.svg').default,
    description: (
      <>
        Apuntes de teoría y ejemplos prácticos para entender los conceptos.
      </>
    ),
  },
  {
    title: 'Ejercicios prácticos',
    Svg: require('@site/static/img/main/center.svg').default,
    description: (
      <>
        Todos los ejercicios que vamos planteando y realizando en clase resueltos paso a paso.
      </>
    ),
  },
  {
    title: 'Vídeos explicativos',
    Svg: require('@site/static/img//main/right.svg').default,
    description: (
      <>
        Encontrarás vídeos explicativos en mi canal de YouTube.<br />
        <a href="https://www.youtube.com/@resuadam2">¡Suscríbete!</a>
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
