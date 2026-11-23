// Copies the prerendered HTML pages into one folder (SEARCH_SITE) for Pagefind and check-search.mjs.
// Next.js writes them to one of two places:
//   - plain `next build` (local):        .next/server/app/<route>.html
//   - with a deployment adapter (Vercel sets NEXT_ADAPTER_PATH):
//                                        .next/server/route-cache/<kind>/<hash>/$/<route>.html
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'

export const SEARCH_SITE = '.next/search-site'
const APP_DIR = '.next/server/app'
const ROUTE_CACHE_DIR = '.next/server/route-cache'

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(full)
    else if (entry.name.endsWith('.html')) yield full
  }
}

// Yields [source file, path relative to the site root]
function* pages() {
  if (existsSync(APP_DIR)) {
    for (const file of htmlFiles(APP_DIR)) yield [file, path.relative(APP_DIR, file)]
  }
  if (existsSync(ROUTE_CACHE_DIR)) {
    for (const file of htmlFiles(ROUTE_CACHE_DIR)) {
      const parts = path.relative(ROUTE_CACHE_DIR, file).split(path.sep)
      const marker = parts.indexOf('$')
      if (marker !== -1) yield [file, parts.slice(marker + 1).join(path.sep)]
    }
  }
}

rmSync(SEARCH_SITE, { recursive: true, force: true })
let count = 0
for (const [file, rel] of pages()) {
  const dest = path.join(SEARCH_SITE, rel)
  mkdirSync(path.dirname(dest), { recursive: true })
  cpSync(file, dest)
  count++
}

if (count === 0) {
  console.error(`[search] no prerendered HTML found in ${APP_DIR} or ${ROUTE_CACHE_DIR}`)
  process.exit(1)
}
console.log(`[search] collected ${count} HTML pages into ${SEARCH_SITE}`)
