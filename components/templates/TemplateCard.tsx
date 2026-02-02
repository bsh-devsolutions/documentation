import React from 'react';
import styles from './TemplateCard.module.css';

interface TemplateCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  tag?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  icon,
  title,
  description,
  href,
  tag = 'Template',
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.templateCard}
    >
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.footer}>
        <span className={styles.tag}>{tag}</span>
      </div>
    </a>
  );
};

interface TemplatesGridProps {
  children: React.ReactNode;
}

export const TemplatesGrid: React.FC<TemplatesGridProps> = ({ children }) => {
  return <div className={styles.templatesGrid}>{children}</div>;
};
