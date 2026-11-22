// Post-build check of what Pagefind indexes. Runs after `pagefind` in `npm run build` (postbuild).
// Fails the build when an excluded page is indexed or an indexed page has no search section.
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { SEARCH_AREAS, SEARCH_SECTIONS, UNSEARCHABLE_PATHS } from '../components/search/search-config.mjs'

const SITE = '.next/server/app'
// Pages that may be indexed without a Docs/Blogs section (they only show up under "All")
const UNSECTIONED_ALLOWED = new Set(['/'])
// Next.js internals that must never be indexed
const INTERNAL = [/^\/_not-found/, /^\/_global-error/]

/** app/docs/ts-validation/ → /docs/ts-validation */
const sourceToRoute = (p) => '/' + p.replace(/^app\//, '').replace(/\/$/, '')
const excluded = UNSEARCHABLE_PATHS.map(sourceToRoute)

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(full)
    else if (entry.name.endsWith('.html')) yield full
  }
}

const routeOf = (file) => {
  const route = '/' + path.relative(SITE, file).replace(/\.html$/, '').split(path.sep).join('/')
  return route === '/index' ? '/' : route
}

const sections = Object.fromEntries(SEARCH_SECTIONS.map(([, name]) => [name, 0]))
const areas = Object.fromEntries(SEARCH_AREAS.map(({ name }) => [name, 0]))
const problems = []
let indexed = 0

for (const file of htmlFiles(SITE)) {
  const html = readFileSync(file, 'utf8')
  if (!html.includes('<main data-pagefind-body')) continue
  const route = routeOf(file)
  indexed++

  if (INTERNAL.some((re) => re.test(route))) problems.push(`${route}: Next.js internal page is indexed`)
  if (excluded.some((r) => route === r || route.startsWith(r + '/'))) problems.push(`${route}: excluded page is indexed`)

  const section = html.match(/data-pagefind-filter="section:([^"]+)"/)?.[1]
  if (section) sections[section] = (sections[section] ?? 0) + 1
  else if (!UNSECTIONED_ALLOWED.has(route)) problems.push(`${route}: indexed without a search section`)

  const area = html.match(/data-pagefind-filter="area:([^"]+)"/)?.[1]
  if (area) areas[area] = (areas[area] ?? 0) + 1
  else if (section === 'Docs') problems.push(`${route}: docs page without a priority area`)
}

const counts = (obj) => Object.entries(obj).map(([name, n]) => `${name} ${n}`).join(', ')
console.log(`[search] ${indexed} pages indexed (${counts(sections)}); docs priority: ${counts(areas)}`)
console.log(`[search] excluded: ${excluded.join(', ')}`)

if (problems.length) {
  console.error(`[search] ${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
