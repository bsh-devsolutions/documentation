// Post-build check of the Pagefind index. Runs after `pagefind` in `npm run build` (postbuild).
// Every built page must be tagged exactly as classifyRoute() in components/search/config.mjs says.
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { FILTERS, UNSEARCHABLE, classifyRoute } from '../components/search/config.mjs'

const SITE = '.next/server/app'
// Next.js internals that must never be indexed
const INTERNAL = [/^\/_not-found/, /^\/_global-error/]

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

const filterValue = (html, name) => html.match(new RegExp(`data-pagefind-filter="${name}:([^"]+)"`))?.[1]

const counts = { section: {}, area: {} }
const tally = (kind, value) => value && (counts[kind][value] = (counts[kind][value] ?? 0) + 1)
const problems = []
let indexed = 0

for (const file of htmlFiles(SITE)) {
  const route = routeOf(file)
  const html = readFileSync(file, 'utf8')
  const isIndexed = html.includes('<main data-pagefind-body')
  if (INTERNAL.some((re) => re.test(route))) {
    if (isIndexed) problems.push(`${route}: Next.js internal page is indexed`)
    continue
  }

  const expected = classifyRoute(route)
  if (isIndexed !== expected.searchable) {
    // Pages can also opt out with `searchable: false` front matter, so only an unexpected *indexed* page fails
    if (isIndexed) problems.push(`${route}: indexed, but listed in UNSEARCHABLE`)
    continue
  }
  if (!isIndexed) continue
  indexed++

  for (const kind of ['section', 'area']) {
    const actual = filterValue(html, FILTERS[kind])
    if (actual !== expected[kind]) problems.push(`${route}: ${kind} is ${actual ?? 'missing'}, expected ${expected[kind] ?? 'none'}`)
    tally(kind, actual)
  }
}

const summary = (obj) => Object.entries(obj).map(([name, n]) => `${name} ${n}`).join(', ')
console.log(`[search] ${indexed} pages indexed (${summary(counts.section)}); areas: ${summary(counts.area)}`)
console.log(`[search] excluded: ${UNSEARCHABLE.join(', ')}`)

if (problems.length) {
  console.error(`[search] ${problems.length} problem(s):\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
