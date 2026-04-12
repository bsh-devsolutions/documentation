'use client';

import React, { ReactNode, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './ConfigComponent.module.css';

export interface ConfigComponentProps {
  title: string;
  configKey: string;
  summary?: string;
  required?: boolean;
  defaultValue?: string;
  anchor?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

function toAnchorId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function ConfigComponent({
  title,
  configKey,
  summary,
  required = false,
  defaultValue,
  anchor,
  defaultOpen = true,
  children,
}: ConfigComponentProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section id={anchor || toAnchorId(configKey)} className={styles.section}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{title}</h2>
            <code className={styles.key}>{configKey}</code>
          </div>

          <div className={styles.meta}>
            <span className={`${styles.badge} ${required ? styles.required : styles.optional}`}>
              {required ? 'Required' : 'Optional'}
            </span>
            {defaultValue ? (
              <span className={styles.defaultBadge}>Default: {defaultValue}</span>
            ) : null}
            <ChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
          </div>
        </header>
      </button>

      {isOpen ? (
        <div id={contentId} className={styles.content}>
          {summary ? <p className={styles.summary}>{summary}</p> : null}
          {children}
        </div>
      ) : null}
    </section>
  );
}
