import React from "react";
import { Zap, Shield, Rocket, Code, Info } from 'lucide-react';
import styles from './HomePage.module.css';

interface CustomCalloutProps {
  type?: "info" | "warning" | "error";
  children: React.ReactNode;
}

const CustomCallout: React.FC<CustomCalloutProps> = ({ type = "info", children }) => (
  <div className={`${styles.customCallout} ${styles[type]}`}>
    <div className={styles.customCalloutIcon}>
      {type === "info" && <Info size={20} />}
    </div>
    <div className={styles.customCalloutContent}>{children}</div>
  </div>
);

export const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>BSH Solutions</h1>
        
        <p className={styles.description}>
          <strong>Build, Scale, and Secure your applications with ease.</strong>
        </p>

        <p className={styles.subDescription}>
          BSH Solutions provides a suite of tools and libraries designed to accelerate your development workflow, from robust backend engines to seamless data validation.
        </p>

        <div className={styles.actions}>
          <a href="/docs/bsh-engine/installation" className={styles.primaryButton}>
            Get Started
          </a>
          <a href="https://github.com/bsh-devsolutions" target="_blank" className={styles.secondaryButton}>
            GitHub
          </a>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Why BSH Solutions?</h2>

      <div className={styles.grid}>
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <Zap className={styles.zapIcon} />
            <h3 className={styles.featureTitle}>Rapid Development</h3>
          </div>
          <p className={styles.featureDescription}>Reduce boilerplate and focus on your business logic. Our tools are built for speed and efficiency.</p>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <Shield className={styles.shieldIcon} />
            <h3 className={styles.featureTitle}>Secure by Default</h3>
          </div>
          <p className={styles.featureDescription}>Built-in security policies, roles, and access control to keep your data safe from the ground up.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <Rocket className={styles.rocketIcon} />
            <h3 className={styles.featureTitle}>Scalable Architecture</h3>
          </div>
          <p className={styles.featureDescription}>Designed to grow with your application, from MVP to enterprise-scale systems.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <Code className={styles.codeIcon} />
            <h3 className={styles.featureTitle}>Developer Friendly</h3>
          </div>
          <p className={styles.featureDescription}>Comprehensive documentation, SDKs, and CLI tools to make your development experience seamless.</p>
        </div>
      </div>

      <div className={styles.calloutWrapper}>
        <CustomCallout type="info">
          BSH Solutions is constantly evolving. Check out our <a href="/docs/bsh-engine/features-map">Features Map</a> to see what's new and what's coming next!
        </CustomCallout>
      </div>
    </div>
  );
};
