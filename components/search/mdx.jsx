import {isValidElement} from 'react'
import {getPageMap} from 'nextra/page-map'
import {normalizePages} from 'nextra/normalize-pages'
import {FILTERS, classifyRoute} from './config.mjs'

const BREADCRUMB_SEPARATOR = ' › '

function routeFromFilePath(filePath) {
    const match = filePath.match(/(?:^|\/)app((?:\/[^/]+)*?)\/page\.mdx?$/)
    if (!match) return null
    return match[1].replace(/\/\([^/]+\)/g, '') || '/'
}

function titleText(title) {
    if (typeof title === 'string' || typeof title === 'number') return String(title)
    if (Array.isArray(title)) return title.map(titleText).join('')
    if (isValidElement(title)) return title.props.title ?? titleText(title.props.children)
    return ''
}

async function breadcrumbFor(route) {
    if (route === '/') return null
    const {activePath} = normalizePages({list: await getPageMap(), route})
    const crumbs = activePath
        .slice(1) // the root ("Documentations" / "Blogs"): the scope switch already says it
        .map((item) => titleText(item.title).trim())
        .filter((title, i, all) => title && title !== all[i - 1]) // "Triggers › Triggers" → "Triggers"
    return crumbs.length > 1 ? crumbs.join(BREADCRUMB_SEPARATOR) : null
}

/** Hidden markers Pagefind reads: the filters, and the breadcrumb as the result title */
function PagefindTags({section, area, breadcrumb}) {
    return (
        <>
            {section && <span data-pagefind-filter={`${FILTERS.section}:${section}`} hidden/>}
            {area && <span data-pagefind-filter={`${FILTERS.area}:${area}`} hidden/>}
            {breadcrumb && (
                <span data-pagefind-meta="title" data-pagefind-ignore hidden>
          {breadcrumb}
        </span>
            )}
        </>
    )
}

/**
 * Search-related overrides for useMDXComponents():
 * - `wrapper`: applies classifyRoute() (searchable / section / area) and the breadcrumb title to every page
 * - `Cards`: card grids only link to other pages, so their text stays out of results
 */
export function searchMdxComponents({wrapper: ThemeWrapper, Cards}) {
    async function SearchWrapper({metadata, children, ...props}) {
        const route = routeFromFilePath(metadata?.filePath ?? '')
        const {searchable, section, area} = route ? classifyRoute(route) : {searchable: true}
        const indexed = searchable && metadata?.searchable !== false
        const breadcrumb = indexed && route ? await breadcrumbFor(route) : null

        return ThemeWrapper({
            ...props,
            metadata: indexed ? metadata : {...metadata, searchable: false},
            children: (
                <>
                    <PagefindTags section={section} area={area} breadcrumb={breadcrumb}/>
                    {children}
                </>
            )
        })
    }

    const SearchIgnoredCards = Object.assign((props) => <Cards data-pagefind-ignore="all" {...props} />, {
        Card: Cards.Card
    })

    return {wrapper: SearchWrapper, Cards: SearchIgnoredCards}
}
