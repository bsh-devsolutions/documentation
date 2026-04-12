import React from "react";
import { ArrowRight, CheckCircle2, Code, Rocket, Shield, Zap } from "lucide-react";
import styles from "./HomePage.module.css";

const features = [
  {
    title: "Rapid Development",
    description:
      "Ship faster with composable tools that remove boilerplate and keep teams focused on product value.",
    icon: Zap,
    iconClass: styles.zapIcon,
  },
  {
    title: "Secure by Default",
    description:
      "Use opinionated security defaults for policies, access controls, and safe environment management.",
    icon: Shield,
    iconClass: styles.shieldIcon,
  },
  {
    title: "Scalable Architecture",
    description:
      "Move from MVP to enterprise workloads with patterns designed for growth and operational reliability.",
    icon: Rocket,
    iconClass: styles.rocketIcon,
  },
  {
    title: "Developer First",
    description:
      "Get productive quickly through practical docs, clear APIs, and a workflow that favors developer speed.",
    icon: Code,
    iconClass: styles.codeIcon,
  },
];

const pillars = [
  "Modular architecture for clean boundaries",
  "Built-in validation and strong typing patterns",
  "Production-minded defaults from day one",
];

export const HomePage: React.FC = () => {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Developer Platform</span>
        <h1 className={styles.title}>Build, Scale, and Secure with BSH Solutions</h1>

        <p className={styles.description}>
          A modern toolkit for teams that want to ship dependable software faster.
          From backend foundations to validation and workflow tooling, BSH Solutions
          keeps engineering focused on outcomes.
        </p>

        <div className={styles.actions}>
          <a href="/docs/bsh-engine/installation" className={styles.primaryButton}>
            Start Building
            <ArrowRight size={18} />
          </a>
          <a
            href="https://github.com/bsh-devsolutions"
            target="_blank"
            rel="noreferrer"
            className={styles.secondaryButton}
          >
            View on GitHub
          </a>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>4+</span>
            <span className={styles.statLabel}>Core building blocks</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Open-source focused</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>Docs-first</span>
            <span className={styles.statLabel}>Designed for quick onboarding</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why Choose BSH Solutions</h2>
        <p className={styles.sectionDescription}>
          Built to support fast iteration without compromising maintainability or
          security.
        </p>

        <div className={styles.grid}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className={styles.featureCard}>
                <div className={styles.featureHeader}>
                  <Icon className={feature.iconClass} />
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                </div>
                <p className={styles.featureDescription}>{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.bottomSection}>
        <div className={styles.callout}>
          <h3 className={styles.calloutTitle}>Built for real-world delivery</h3>
          <ul className={styles.pillarList}>
            {pillars.map((item) => (
              <li key={item} className={styles.pillarItem}>
                <CheckCircle2 size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className={styles.calloutFooter}>
            Explore our{" "}
            <a href="/docs/bsh-engine/features-map">Features Map</a> for upcoming
            improvements and roadmap updates.
          </p>
        </div>
      </section>
    </main>
  );
};
