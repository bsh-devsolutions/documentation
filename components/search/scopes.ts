import {FILTERS, SECTIONS, classifyRoute} from './config.mjs'

export const ALL = 'All'

/** The dropdown options: every section in config.mjs, then All */
export const SCOPES: string[] = [...SECTIONS.map((s) => s.name), ALL]

/** The section being read (Docs on /docs/…), or All */
export const scopeForPath = (pathname: string | null): string =>
    (pathname && classifyRoute(pathname).section) || ALL

/** Props for Nextra's <Search> in a given scope */
export function searchPropsFor(scope: string) {
    if (scope === ALL) {
        return {placeholder: 'Search everything…', emptyResult: 'No results in the site.'}
    }
    return {
        placeholder: `Search ${scope.toLowerCase()}…`,
        emptyResult: `No results in ${scope}.`,
        searchOptions: {filters: {[FILTERS.section]: scope}}
    }
}
