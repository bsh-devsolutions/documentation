'use client'

import {Search} from 'nextra/components'
import {usePathname} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'
import styles from './ScopedSearch.module.css'
import {installPagefindLimit, preloadPagefind} from './pagefind'

installPagefindLimit()

type Scope = 'Docs' | 'Blogs' | 'All'

const SCOPES: Scope[] = ['Docs', 'Blogs', 'All']

const PLACEHOLDERS: Record<Scope, string> = {
    Docs: 'Search docs…',
    Blogs: 'Search blogs…',
    All: 'Search everything…'
}

function scopeForPath(pathname: string | null): Scope {
    if (pathname?.startsWith('/docs')) return 'Docs'
    if (pathname?.startsWith('/blogs')) return 'Blogs'
    return 'All'
}

/**
 * Nextra's <Search> limited by the Pagefind `section` filter (set per page in mdx-components.js).
 * The scope defaults to the section you are reading, and can be switched from the pills.
 */
export function ScopedSearch() {
    const pathname = usePathname()
    const [scope, setScope] = useState<Scope>(() => scopeForPath(pathname))
    const containerRef = useRef<HTMLDivElement>(null)
    const carriedQuery = useRef('')

    useEffect(() => {
        setScope(scopeForPath(pathname))
    }, [pathname])

    // <Search> only re-runs on text changes, so it is remounted per scope (see `key` below).
    // Carry the typed query over to the new instance so switching scope re-runs the search.
    useEffect(() => {
        const query = carriedQuery.current
        carriedQuery.current = ''
        const input = containerRef.current?.querySelector('input')
        if (!query || !input) return
        const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
        setValue?.call(input, query)
        input.dispatchEvent(new Event('input', {bubbles: true}))
        input.focus()
    }, [scope])

    function changeScope(next: Scope) {
        if (next === scope) return
        carriedQuery.current = containerRef.current?.querySelector('input')?.value ?? ''
        setScope(next)
    }

    return (
        <div
            ref={containerRef}
            className={styles.container}
            onPointerEnter={preloadPagefind}
            onFocus={preloadPagefind}
        >
            <div className={styles.scopes} role="radiogroup" aria-label="Search scope">
                {SCOPES.map((s) => (
                    <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={scope === s}
                        className={styles.scope}
                        data-active={scope === s || undefined}
                        onClick={() => changeScope(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>
            <Search
                key={scope}
                className={styles.search}
                placeholder={PLACEHOLDERS[scope]}
                searchOptions={scope === 'All' ? undefined : {filters: {section: scope}}}
                emptyResult={`No results in ${scope === 'All' ? 'the site' : scope}.`}
            />
        </div>
    )
}
