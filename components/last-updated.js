/**
 * "Last updated on …" comes from the page's own frontmatter instead of git:
 *
 *   ---
 *   lastUpdated: 2026-11-22
 *   ---
 *
 * Nextra's git timestamp is replaced on every page; a page without `lastUpdated` shows no date.
 * Set or refresh the dates with `npm run last-updated` (see scripts/last-updated.mjs).
 */
function toTimestamp(value) {
    if (!value) return undefined
    const time = new Date(value).getTime()
    return Number.isNaN(time) ? undefined : time
}

export function withLastUpdated(Wrapper) {
    return function LastUpdatedWrapper({metadata, ...props}) {
        return Wrapper({
            ...props,
            metadata: {...metadata, timestamp: toTimestamp(metadata?.lastUpdated)}
        })
    }
}
