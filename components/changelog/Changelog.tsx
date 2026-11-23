import React from 'react';
import Link from 'next/link';
import {ChevronLeft, ChevronRight, ArrowLeft} from 'lucide-react';
import styles from './Changelog.module.css';
import {
    CHANGELOG_ROUTE,
    Release,
    ReleaseStatus,
    formatReleaseDate,
    getRelease,
    getReleases,
    releaseHref,
    releaseStatus,
} from './releases';

const STATUS_LABEL: Record<ReleaseStatus, string | null> = {
    upcoming: 'Upcoming',
    latest: 'Latest',
    released: null,
};

const StatusPill: React.FC<{ status: ReleaseStatus }> = ({status}) => {
    const label = STATUS_LABEL[status];
    if (!label) return null;
    return <span className={`${styles.pill} ${styles[status]}`}>{label}</span>;
};

const ReleaseDate: React.FC<{ release: Release; className?: string }> = ({release, className}) =>
    release.date ? (
        <time dateTime={release.date} className={className}>
            {formatReleaseDate(release.date)}
        </time>
    ) : (
        <span className={className}>{formatReleaseDate(null)}</span>
    );

/** Index of all releases: version, date and summary, each linking to its own page. */
export async function ReleaseList() {
    const releases = await getReleases();
    return (
        <ol className={styles.list}>
            {releases.map((release) => (
                <li key={release.version}>
                    <Link href={releaseHref(release.version)} className={styles.row}>
            <span className={styles.version}>
              v{release.version}
                <StatusPill status={releaseStatus(release, releases)}/>
            </span>
                        <ReleaseDate release={release} className={styles.date}/>
                        <ChevronRight className={styles.chevron} size={18} aria-hidden/>
                        <span className={styles.summary}>{release.summary}</span>
                    </Link>
                </li>
            ))}
        </ol>
    );
}

/** Under a release page title: status, date, a link back to all releases and the release summary. */
export async function ReleaseHeader({version}: { version: string }) {
    const {release, releases} = await getRelease(version);
    return (
        <div className={styles.header}>
            <Link href={CHANGELOG_ROUTE} className={styles.back}>
                <ArrowLeft size={14} aria-hidden/> All releases
            </Link>
            <div className={styles.meta}>
        <span className={styles.metaDate}>
          {release.date ? 'Released ' : ''}
            <ReleaseDate release={release}/>
        </span>
                <StatusPill status={releaseStatus(release, releases)}/>
            </div>
            <p className={styles.lead}>{release.summary}</p>
        </div>
    );
}

/** Footer links to the newer and older releases. */
export async function ReleaseNav({version}: { version: string }) {
    const {releases, index} = await getRelease(version);
    const newer = releases[index - 1];
    const older = releases[index + 1];
    return (
        <nav className={styles.nav} aria-label="Releases">
            {older ? (
                <Link href={releaseHref(older.version)} className={styles.navLink}>
                    <span className={styles.navLabel}>Older release</span>
                    <span className={styles.navVersion}>
            <ChevronLeft size={16} aria-hidden/> v{older.version}
          </span>
                </Link>
            ) : <span/>}
            {newer ? (
                <Link href={releaseHref(newer.version)} className={`${styles.navLink} ${styles.navNext}`}>
                    <span className={styles.navLabel}>Newer release</span>
                    <span className={styles.navVersion}>
            v{newer.version} <ChevronRight size={16} aria-hidden/>
          </span>
                </Link>
            ) : <span/>}
        </nav>
    );
}
