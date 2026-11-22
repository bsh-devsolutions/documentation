import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import styles from './Changelog.module.css';
import {
  RELEASES,
  CHANGELOG_ROUTE,
  Release,
  ReleaseStatus,
  findRelease,
  formatReleaseDate,
  releaseHref,
  releaseStatus,
} from './releases';

const STATUS_LABEL: Record<ReleaseStatus, string | null> = {
  upcoming: 'Upcoming',
  latest: 'Latest',
  released: null,
};

const StatusPill: React.FC<{ status: ReleaseStatus }> = ({ status }) => {
  const label = STATUS_LABEL[status];
  if (!label) return null;
  return <span className={`${styles.pill} ${styles[status]}`}>{label}</span>;
};

const ReleaseDate: React.FC<{ release: Release; className?: string }> = ({ release, className }) =>
  release.date ? (
    <time dateTime={release.date} className={className}>
      {formatReleaseDate(release.date)}
    </time>
  ) : (
    <span className={className}>{formatReleaseDate(null)}</span>
  );

/** Index of all releases: version and date, each linking to its own page. */
export const ReleaseList: React.FC = () => (
  <ol className={styles.list}>
    {RELEASES.map((release) => (
      <li key={release.version}>
        <Link href={releaseHref(release.version)} className={styles.row}>
          <span className={styles.version}>
            v{release.version}
            <StatusPill status={releaseStatus(release)} />
          </span>
          <ReleaseDate release={release} className={styles.date} />
          <ChevronRight className={styles.chevron} size={18} aria-hidden />
        </Link>
      </li>
    ))}
  </ol>
);

/** Meta line under a release page title: date, status and a link back to all releases. */
export const ReleaseHeader: React.FC<{ version: string }> = ({ version }) => {
  const release = findRelease(version);
  if (!release) throw new Error(`Unknown release "${version}": add it to components/changelog/releases.ts`);
  return (
    <div className={styles.header}>
      <div className={styles.meta}>
        <StatusPill status={releaseStatus(release)} />
        <span className={styles.metaDate}>
          {release.date ? 'Released ' : ''}
          <ReleaseDate release={release} />
        </span>
      </div>
      <Link href={CHANGELOG_ROUTE} className={styles.back}>
        <ArrowLeft size={14} aria-hidden /> All releases
      </Link>
    </div>
  );
};

/** Footer links to the newer and older releases. */
export const ReleaseNav: React.FC<{ version: string }> = ({ version }) => {
  const index = RELEASES.findIndex((r) => r.version === version);
  if (index === -1) throw new Error(`Unknown release "${version}": add it to components/changelog/releases.ts`);
  const newer = RELEASES[index - 1];
  const older = RELEASES[index + 1];
  return (
    <nav className={styles.nav} aria-label="Releases">
      {older ? (
        <Link href={releaseHref(older.version)} className={styles.navLink}>
          <span className={styles.navLabel}>Older release</span>
          <span className={styles.navVersion}>
            <ChevronLeft size={16} aria-hidden /> v{older.version}
          </span>
        </Link>
      ) : <span />}
      {newer ? (
        <Link href={releaseHref(newer.version)} className={`${styles.navLink} ${styles.navNext}`}>
          <span className={styles.navLabel}>Newer release</span>
          <span className={styles.navVersion}>
            v{newer.version} <ChevronRight size={16} aria-hidden />
          </span>
        </Link>
      ) : <span />}
    </nav>
  );
};
