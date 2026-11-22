export type ReleaseStatus = 'upcoming' | 'latest' | 'released';

export interface Release {
  version: string;
  /** ISO date (YYYY-MM-DD), or null while the release date is not set */
  date: string | null;
}

/**
 * All BSH Engine releases, newest first.
 * When adding a release: add it here, create `app/docs/bsh-engine/changelog/<version>/page.mdx`.
 */
export const RELEASES: Release[] = [
  { version: '0.0.7', date: null },
  { version: '0.0.6', date: '2026-10-03' },
  { version: '0.0.5', date: '2026-04-12' },
  { version: '0.0.4', date: '2026-02-02' },
  { version: '0.0.3', date: '2026-01-08' },
  { version: '0.0.2', date: '2025-12-14' },
  { version: '0.0.1', date: '2025-11-01' },
];

export const CHANGELOG_ROUTE = '/docs/bsh-engine/changelog';

export const releaseHref = (version: string) => `${CHANGELOG_ROUTE}/${version}`;

/** Unreleased versions are "upcoming"; the newest dated one is "latest". */
export function releaseStatus(release: Release): ReleaseStatus {
  if (!release.date) return 'upcoming';
  const latest = RELEASES.find((r) => r.date);
  return latest?.version === release.version ? 'latest' : 'released';
}

export function formatReleaseDate(date: string | null): string {
  if (!date) return 'Date to be announced';
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export const findRelease = (version: string) => RELEASES.find((r) => r.version === version);
