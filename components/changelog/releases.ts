import {getPageMap} from 'nextra/page-map';
import type {PageMapItem} from 'nextra';

export type ReleaseStatus = 'upcoming' | 'latest' | 'released';

export interface Release {
    version: string;
    date: string | null;
    summary: string;
}

export const CHANGELOG_ROUTE = '/docs/bsh-engine/changelog';

export const releaseHref = (version: string) => `${CHANGELOG_ROUTE}/${version}`;

const VERSION_RE = /^\d+\.\d+\.\d+$/;

const compareVersions = (a: string, b: string) => {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
    return 0;
};

/** YAML may parse an unquoted date as a Date */
const toIsoDate = (value: unknown): string | null => {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return typeof value === 'string' && value ? value : null;
};

/**
 * All BSH Engine releases, newest first.
 * Each release is a `changelog/<version>/page.mdx`; its frontmatter holds
 * `date` (quoted 'YYYY-MM-DD', omitted while unreleased) and `description` (the summary).
 */
export async function getReleases(): Promise<Release[]> {
    const items: PageMapItem[] = await getPageMap(CHANGELOG_ROUTE);
    return items
        .filter((item): item is Extract<PageMapItem, { frontMatter?: unknown }> =>
            'name' in item && VERSION_RE.test(item.name) && 'frontMatter' in item)
        .map((item) => {
            const fm = (item.frontMatter ?? {}) as Record<string, unknown>;
            if (typeof fm.description !== 'string' || !fm.description) {
                throw new Error(`Release ${item.name}: add a "description" to its page.mdx frontmatter`);
            }
            return {version: item.name, date: toIsoDate(fm.date), summary: fm.description};
        })
        .sort((a, b) => compareVersions(b.version, a.version));
}

export async function getRelease(version: string) {
    const releases = await getReleases();
    const index = releases.findIndex((r) => r.version === version);
    if (index === -1) throw new Error(`Unknown release "${version}": create changelog/${version}/page.mdx`);
    return {releases, index, release: releases[index]};
}

/** Unreleased versions are "upcoming"; the newest dated one is "latest". */
export function releaseStatus(release: Release, releases: Release[]): ReleaseStatus {
    if (!release.date) return 'upcoming';
    return releases.find((r) => r.date)?.version === release.version ? 'latest' : 'released';
}

export function formatReleaseDate(date: string | null): string {
    if (!date) return '';
    return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}
