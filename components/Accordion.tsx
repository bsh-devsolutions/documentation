'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Accordion.module.css';

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion');
  }
  return context;
}

export interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string[];
  className?: string;
}

export function Accordion({ children, defaultOpen = [], className = '' }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={`${styles.accordion} ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function AccordionItem({ id, title, description, children }: AccordionItemProps) {
  const { openItems, toggle } = useAccordion();
  const isOpen = openItems.has(id);

  return (
    <div className={styles.item}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => toggle(id)}
        aria-expanded={isOpen}
      >
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {description && <span className={styles.description}>{description}</span>}
        </div>
        <ChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </button>
      <div className={`${styles.content} ${isOpen ? styles.contentOpen : ''}`}>
        <div className={styles.contentInner}>
          <div className={styles.contentBody}>{children}</div>
        </div>
      </div>
    </div>
  );
}
