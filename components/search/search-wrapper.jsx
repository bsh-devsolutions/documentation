import { isValidElement } from 'react'
import { getPageMap } from 'nextra/page-map'
import { normalizePages } from 'nextra/normalize-pages'
import { SEARCH_SECTIONS, UNSEARCHABLE_PATHS, searchAreaFor } from './search-config.mjs'

const BREADCRUMB_SEPARATOR = ' › '

/** app/docs/bsh-engine/entities/page.mdx → /docs/bsh-engine/entities */
function routeFromFilePath(filePath) {
  const match = filePath.match(/(?:^|\/)app((?:\/[^/]+)*?)\/page\.mdx?$/)
  if (!match) return null
  return match[1].replace(/\/\([^/]+\)/g, '') || '/'
}

/** Sidebar titles can be React elements (e.g. <Title title="…" badge="…" />) */
function titleText(title) {
  if (typeof title === 'string' || typeof title === 'number') return String(title)
  if (Array.isArray(title)) return title.map(titleText).join('')
  if (isValidElement(title)) return title.props.title ?? titleText(title.props.children)
  return ''
}

async function breadcrumbFor(route) {
  if (!route || route === '/') return null
  const { activePath } = normalizePages({ list: await getPageMap(), route })
  // Drop the root ("Documentations" / "Blogs"): the search scope switch already says it
  const crumbs = activePath
    .slice(1)
    .map((item) => titleText(item.title).trim())
    .filter((title, i, all) => title && title !== all[i - 1]) // "Triggers › Triggers" → "Triggers"
  // A single crumb adds nothing over the page's own <h1>, which Pagefind uses by default
  return crumbs.length > 1 ? crumbs.join(BREADCRUMB_SEPARATOR) : null
}

/**
 * Wraps the theme's MDX wrapper to feed Pagefind:
 * - `searchable: false` for UNSEARCHABLE_PATHS
 * - a `section` filter (Docs / Blogs) and an `area` filter (Engine / SDK / API) for result priority
 * - a breadcrumb result title, so "Overview" or "Configuration" results say where they live
 */
export function createSearchWrapper(ThemeWrapper) {
  return async function SearchWrapper({ metadata, children, ...props }) {
    const filePath = metadata?.filePath ?? ''
    const searchable = !UNSEARCHABLE_PATHS.some((p) => filePath.includes(p)) && metadata?.searchable !== false
    const section = SEARCH_SECTIONS.find(([p]) => filePath.includes(p))?.[1]
    const area = searchAreaFor(filePath)
    const breadcrumb = searchable ? await breadcrumbFor(routeFromFilePath(filePath)) : null

    return ThemeWrapper({
      ...props,
      metadata: searchable ? metadata : { ...metadata, searchable: false },
      children: (
        <>
          {section && <span data-pagefind-filter={`section:${section}`} hidden />}
          {area && <span data-pagefind-filter={`area:${area}`} hidden />}
          {breadcrumb && (
            <span data-pagefind-meta="title" data-pagefind-ignore hidden>
              {breadcrumb}
            </span>
          )}
          {children}
        </>
      )
    })
  }
}
