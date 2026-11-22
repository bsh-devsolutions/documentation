// Shared by the MDX search wrapper (search-wrapper.jsx) and the post-build check (scripts/check-search.mjs)

// Source folders kept out of the Pagefind index (the pages stay reachable by URL)
export const UNSEARCHABLE_PATHS = [
  'app/docs/ts-validation/', // hidden from navigation
  'app/docs/bsh-engine/changelog/' // mentions every feature, so it outranks the real pages
]

// Pagefind "section" filter values, used by the search scope switch (ScopedSearch.tsx)
export const SEARCH_SECTIONS = [
  ['app/docs/', 'Docs'],
  ['app/blogs/', 'Blogs']
]

// Result priority inside the docs (soft): each result's Pagefind score is multiplied by its area's boost.
// Engine wins close calls over SDK, and SDK over API, but a clearly stronger match in a lower area still
// ranks above a weak one in a higher area (e.g. "refresh token" → the API page first).
// A page belongs to the area with the longest matching path; pages outside every area (blogs, home) get 1.
export const SEARCH_AREAS = [
  { name: 'Engine', path: 'app/docs/', boost: 1.2 },
  { name: 'SDK', path: 'app/docs/bsh-engine/sdk/', boost: 1.1 },
  { name: 'API', path: 'app/docs/bsh-engine/api/', boost: 1 }
]

/** The area for a source file path, or undefined */
export function searchAreaFor(filePath) {
  return SEARCH_AREAS.filter(({ path }) => filePath.includes(path)).sort((a, b) => b.path.length - a.path.length)[0]
    ?.name
}
