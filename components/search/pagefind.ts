// Glue between Nextra's <Search> and Pagefind.
//
// Nextra's <Search> stores Pagefind on `window.pagefind`, and for every result it calls `result.data()`,
// which downloads one fragment file per page. We wrap it to:
// - boost results by area (Engine > SDK > API, see SEARCH_AREAS in search-config.mjs)
// - cap the results it sees, since a common word can match 100+ pages
// - start loading Pagefind (JS + WASM + index) when the user approaches the search box, not on the first keystroke

import {SEARCH_AREAS} from './search-config.mjs'

const PAGEFIND_URL = '/_pagefind/pagefind.js'
export const MAX_RESULTS = 10

type SearchResult = {id: string; score: number}
type SearchOptions = {filters?: Record<string, unknown>} & Record<string, unknown>
type SearchResponse = {results: SearchResult[]} & Record<string, unknown>
type PagefindModule = {
    options: (opts: Record<string, unknown>) => Promise<void>
    init: () => Promise<void>
    search: (term: string, opts?: SearchOptions) => Promise<SearchResponse>
    debouncedSearch: (term: string, opts?: SearchOptions, ms?: number) => Promise<SearchResponse | null>
    __limited?: true
}

declare global {
    interface Window {
        pagefind?: PagefindModule
    }
}

/**
 * Re-rank results by `score × area boost`. Results expose only ids before `data()`, so each area is looked
 * up with one filtered search; these reuse the index chunks the main search already loaded, so they run
 * locally without extra downloads.
 */
async function prioritize(mod: PagefindModule, term: string, opts: SearchOptions | undefined, response: SearchResponse) {
    const boosts = new Map<string, number>()
    const areaMatches = await Promise.all(
        SEARCH_AREAS.map(({name}) => mod.search(term, {...opts, filters: {...opts?.filters, area: name}}))
    )
    areaMatches.forEach((matches, i) => matches.results.forEach((r) => boosts.set(r.id, SEARCH_AREAS[i].boost)))
    const boosted = (r: SearchResult) => r.score * (boosts.get(r.id) ?? 1)
    const results = [...response.results].sort((a, b) => boosted(b) - boosted(a))
    return {...response, results: results.slice(0, MAX_RESULTS)}
}

function limited(mod: PagefindModule): PagefindModule {
    if (mod.__limited) return mod
    return {
        ...mod,
        search: async (term, opts) => prioritize(mod, term, opts, await mod.search(term, opts)),
        debouncedSearch: async (term, opts, ms) => {
            const response = await mod.debouncedSearch(term, opts, ms)
            // null = superseded by a newer keystroke; Nextra ignores it
            return response && prioritize(mod, term, opts, response)
        },
        __limited: true
    }
}

let installed = false

/** Wrap whatever gets assigned to `window.pagefind`, including Nextra's own import. */
export function installPagefindLimit() {
    if (installed || typeof window === 'undefined') return
    installed = true
    let current = window.pagefind && limited(window.pagefind)
    Object.defineProperty(window, 'pagefind', {
        configurable: true,
        get: () => current,
        set: (value?: PagefindModule) => {
            current = value && limited(value)
        }
    })
}

let loading: Promise<void> | null = null

/** Load Pagefind ahead of the first search. Safe to call many times; failures fall back to Nextra's loader. */
export function preloadPagefind() {
    if (typeof window === 'undefined' || window.pagefind || loading) return
    loading = (async () => {
        const mod: PagefindModule = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ PAGEFIND_URL)
        await mod.options({baseUrl: '/'})
        await mod.init()
        window.pagefind ??= mod
    })().catch(() => {
        // e.g. `next dev`, where the index doesn't exist; Nextra shows its own message on search
        loading = null
    })
}
