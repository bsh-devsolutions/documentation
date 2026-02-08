'use client';

import React from 'react';
import styles from './TriggerFunction.module.css';
import { Badge } from '../Badge';
import { Accordion, AccordionItem } from '../Accordion';

export interface TriggerFunctionProps {
  name: string;
  category: string;
  description: string;
  input?: any;
  output?: any;
}

export function TriggerFunction({
  name,
  category,
  description,
  input,
  output,
}: TriggerFunctionProps) {
  const getCategoryVariant = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'mapping': return 'beta';
      case 'mailing': return 'new';
      case 'http': return 'experimental';
      case 'entities': return 'soon';
      case 'caching': return 'planned';
      default: return 'soon';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.name}>
            {name}
            <Badge label={category} variant={getCategoryVariant(category)} />
          </div>
        </div>
      </div>
      
      <div className={styles.description}>
        {description}
      </div>

      {(input || output) && (
        <div className={styles.schemas}>
          <Accordion>
            {input && (
              <AccordionItem id={`${name}-input`} title="Input">
                  <pre className={styles.schemaContent}>
                    {JSON.stringify(input, null, 2)}
                  </pre>
              </AccordionItem>
            )}
            {output && (
              <AccordionItem id={`${name}-output`} title="Output">
                <div className={styles.schemaSection}>
                  <pre className={styles.schemaContent}>
                    {JSON.stringify(output, null, 2)}
                  </pre>
                </div>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      )}
    </div>
  );
}
