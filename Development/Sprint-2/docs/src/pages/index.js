import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import '/src/css/custom.css'

import Exposition from '@site/src/components/Exposition';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <Heading as="h1" className={clsx('hero__title title_tagline ')}>
          It's as Easy as EZBASE
        </Heading>

        <p className="hero__subtitle">Powered by the robust Rust, EZBASE is an Open Source <br /> Backend solution for your next SaaS and Mobile App in 1 file</p>

        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg demo-button hero-button"
            to="/docs/start-developing"
          >
            Try Demo
          </Link>
          <Link
            className="button button--secondary button--lg doc-button hero-button"
            to="/docs/intro"
            style={{ marginLeft: '10px' }}
          >
            Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <Heading as="h1" className={'center-heading'}>
          Explore Our Products
        </Heading>

        <HomepageFeatures />

        <Heading as="h1" className={'center-heading'}>
          Start Developing Your Next Solution
        </Heading>

        <Exposition />
      </main>
    </Layout>
  );
}
