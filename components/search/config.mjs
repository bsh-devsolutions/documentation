export const FILTERS = {
    section: 'section',
    area: 'area'
}

export const UNSEARCHABLE = [
    '/docs/ts-validation',
    '/docs/bsh-engine/changelog'
]

export const SECTIONS = [
    {name: 'Docs', route: '/docs'},
    {name: 'Blogs', route: '/blogs'}
]

/** Result score × boost: Engine > SDK > API on close calls; most specific route wins; others get 1. */
export const AREAS = [
    {name: 'Engine', route: '/docs', boost: 1.2},
    {name: 'SDK', route: '/docs/bsh-engine/sdk', boost: 1.1},
    {name: 'API', route: '/docs/bsh-engine/api', boost: 1}
]

const matches = (route, prefix) => route === prefix || route.startsWith(prefix + '/')

/** The rule with the longest matching route, or undefined */
const mostSpecific = (rules, route) => rules
    .filter((rule) => matches(route, rule.route))
    .sort((a, b) => b.route.length - a.route.length)[0]

/**
 * How search treats the page at `route`.
 * @returns {{ searchable: boolean, section?: string, area?: string }}
 */
export function classifyRoute(route) {
    return {
        searchable: !UNSEARCHABLE.some((prefix) => matches(route, prefix)),
        section: mostSpecific(SECTIONS, route)?.name,
        area: mostSpecific(AREAS, route)?.name
    }
}
