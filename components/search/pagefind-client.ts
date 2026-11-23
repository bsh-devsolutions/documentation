// Browser side of search: glue between Nextra's <Search> and Pagefind.
//
// Nextra's <Search> keeps Pagefind on `window.pagefind`, and for every result it calls `result.data()`,
// which downloads one fragment file per page. We wrap that module to:
// - re-rank results by area (Engine > SDK > API, see AREAS in config.mjs)
// - cap the results <Search> sees, since a common word can match 100+ pages
// and we start loading Pagefind (JS + WASM + index) when the user approaches the search box,
// not on the first keystroke.

import {AREAS, FILTERS} from './config.mjs'

const PAGEFIND_URL = '/_pagefind/pagefind.js'
const MAX_RESULTS = 10

type SearchResult = {id: string; score: number}
type SearchOptions = {filters?: Record<string, unknown>} & Record<string, unknown>
type SearchResponse = {results: SearchResult[]} & Record<string, unknown>
type Pagefind = {
    options: (opts: Record<string, unknown>) => Promise<void>
    init: () => Promise<void>
    search: (term: string, opts?: SearchOptions) => Promise<SearchResponse>
    debouncedSearch: (term: string, opts?: SearchOptions, ms?: number) => Promise<SearchResponse | null>
    __ranked?: true
}

declare global {
    interface Window {
        pagefind?: Pagefind
    }
}

/**
 * Map result id → area boost. Results expose only ids before `data()`, so each area is looked up with one
 * filtered search; these reuse the index chunks the main search already loaded, so nothing extra is downloaded.
 */
async function areaBoosts(pagefind: Pagefind, term: string, opts?: SearchOptions) {
    const boosts = new Map<string, number>()
    await Promise.all(
        AREAS.map(async ({name, boost}) => {
            const inArea = await pagefind.search(term, {...opts, filters: {...opts?.filters, [FILTERS.area]: name}})
            inArea.results.forEach((r) => boosts.set(r.id, boost))
        })
    )
    return boosts
}

/** Sort by `score × area boost` and keep the top MAX_RESULTS */
async function rank(pagefind: Pagefind, term: string, opts: SearchOptions | undefined, response: SearchResponse) {
    const boosts = await areaBoosts(pagefind, term, opts)
    const boosted = (r: SearchResult) => r.score * (boosts.get(r.id) ?? 1)
    const results = [...response.results].sort((a, b) => boosted(b) - boosted(a)).slice(0, MAX_RESULTS)
    return {...response, results}
}

function withRanking(pagefind: Pagefind): Pagefind {
    if (pagefind.__ranked) return pagefind
    return {
        ...pagefind,
        search: async (term, opts) => rank(pagefind, term, opts, await pagefind.search(term, opts)),
        debouncedSearch: async (term, opts, ms) => {
            const response = await pagefind.debouncedSearch(term, opts, ms)
            // null = superseded by a newer keystroke; Nextra ignores it
            return response && rank(pagefind, term, opts, response)
        },
        __ranked: true
    }
}

let installed = false

/** Rank whatever gets assigned to `window.pagefind`, including Nextra's own import. */
export function installResultRanking() {
    if (installed || typeof window === 'undefined') return
    installed = true
    let current = window.pagefind && withRanking(window.pagefind)
    Object.defineProperty(window, 'pagefind', {
        configurable: true,
        get: () => current,
        set: (value?: Pagefind) => {
            current = value && withRanking(value)
        }
    })
}

let loading: Promise<void> | null = null

/** Load Pagefind ahead of the first search. Safe to call many times; failures fall back to Nextra's loader. */
export function preloadPagefind() {
    if (typeof window === 'undefined' || window.pagefind || loading) return
    loading = (async () => {
        const pagefind: Pagefind = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ PAGEFIND_URL)
        await pagefind.options({baseUrl: '/'})
        await pagefind.init()
        window.pagefind ??= pagefind
    })().catch(() => {
        // e.g. `next dev`, where the index doesn't exist; Nextra shows its own message on search
        loading = null
    })
}
