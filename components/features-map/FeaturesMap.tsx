"use client"

import React, { useState, useMemo } from 'react';
import styles from './FeaturesMap.module.css';
import { Badge } from './BadgeComponent';

export type FeatureStatus =
    | 'deprecated'
    | 'backlog'
    | 'inprogress'
    | 'released'
    | 'beta'
    | 'experimental';

export type Feature = {
    title: string;
    description: string;
    href?: string;
    status: FeatureStatus;
};

export interface FeaturesMapProps {
    features: Feature[];
    className?: string;
}

type FeatureItemProps = {
    feature: Feature;
};

const statusLabel: Record<string, string> = {
    released: 'released',
    beta: 'beta',
    experimental: 'experimental',
    inprogress: 'in progress',
    backlog: 'backlog',
    deprecated: 'deprecated',
    all: 'all',
};

const FeatureItem: React.FC<FeatureItemProps> = ({ feature }) => {
    const hasLink = feature.href && feature.href !== '#' && feature.href.trim() !== '';

    const content = (
        <>
            <div className={styles.header}>
                <h3 className={styles.title}>{feature.title}</h3>
                <Badge variant={feature.status} label={statusLabel[feature.status] || feature.status} />
            </div>

            <p className={styles.description}>{feature.description}</p>

            {hasLink && (
                <div className={styles.footer}>
                    <span className={styles.link}>Read docs →</span>
                </div>
            )}
        </>
    );

    if (hasLink) {
        return (
            <a href={feature.href} className={styles.card}>
                {content}
            </a>
        );
    }

    return (
        <div className={styles.card}>
            {content}
        </div>
    );
};

export const FeaturesMap: React.FC<FeaturesMapProps> = ({
                                                            features,
                                                            className = '',
                                                        }) => {
    const [filter, setFilter] = useState<FeatureStatus | 'all'>('all');

    const availableStatuses = useMemo(() => {
        const statuses = new Set<FeatureStatus>();
        features.forEach(f => statuses.add(f.status));
        return Array.from(statuses);
    }, [features]);

    const filteredFeatures = useMemo(() => {
        if (filter === 'all') return features;
        return features.filter(f => f.status === filter);
    }, [features, filter]);

    return (
        <div className={className}>
            <div className={styles.filterContainer}>
                <button
                    onClick={() => setFilter('all')}
                    className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                >
                    All
                </button>
                {availableStatuses.map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`${styles.filterButton} ${filter === status ? styles.active : ''}`}
                    >
                        {statusLabel[status] || status}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {filteredFeatures.map((feature, index) => (
                    <FeatureItem key={feature.href || `feature-${index}`} feature={feature} />
                ))}
            </div>
        </div>
    );
};