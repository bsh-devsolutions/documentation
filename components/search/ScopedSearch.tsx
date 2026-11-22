'use client'

import {Search} from 'nextra/components'
import {usePathname} from 'next/navigation'
import {type CSSProperties, type RefObject, useEffect, useRef, useState} from 'react'
import styles from './ScopedSearch.module.css'
import {ScopeSelect} from './ScopeSelect'
import {SCOPES, scopeForPath, searchPropsFor} from './scopes'
import {installResultRanking, preloadPagefind} from './pagefind-client'

installResultRanking()

/** The scope follows the section being read, until the user picks another */
function useScope() {
    const pathname = usePathname()
    const [scope, setScope] = useState(() => scopeForPath(pathname))
    useEffect(() => setScope(scopeForPath(pathname)), [pathname])
    return [scope, setScope] as const
}

/** An element's width as the `--scope-width` CSS variable (undefined until measured) */
function useWidthVar<T extends HTMLElement>() {
    const ref = useRef<T>(null)
    const [width, setWidth] = useState<number>()
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new ResizeObserver(() => setWidth(el.offsetWidth))
        observer.observe(el)
        return () => observer.disconnect()
    }, [])
    const style = width ? ({'--scope-width': `${width}px`} as CSSProperties) : undefined
    return [ref, style] as const
}

/** Set an input's value the way typing does, so React's onChange fires */
function typeInto(input: HTMLInputElement, value: string) {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, value)
    input.dispatchEvent(new Event('input', {bubbles: true}))
}

/**
 * Nextra's <Search> only re-runs on text changes, so it is remounted whenever `key` changes.
 * Call `carry()` before such a change: the typed query is re-typed into the new input, which gets focus.
 */
function useQueryCarryOver(container: RefObject<HTMLElement | null>, key: string) {
    const carried = useRef<string | null>(null) // null = nothing to carry (e.g. scope changed by navigation)
    const input = () => container.current?.querySelector('input')

    useEffect(() => {
        const query = carried.current
        carried.current = null
        const el = input()
        if (query === null || !el) return
        if (query) typeInto(el, query)
        el.focus()
    }, [key])

    return function carry() {
        carried.current = input()?.value ?? ''
    }
}

/**
 * Nextra's <Search>, limited to one section with the Pagefind `section` filter (see config.mjs).
 * The scope defaults to the section being read, and can be changed from the dropdown inside the input.
 */
export function ScopedSearch() {
    const [scope, setScope] = useScope()
    const containerRef = useRef<HTMLDivElement>(null)
    const [selectRef, widthVar] = useWidthVar<HTMLDivElement>()
    const carry = useQueryCarryOver(containerRef, scope)

    function changeScope(next: string) {
        if (next === scope) return
        carry()
        setScope(next)
    }

    return (
        <div
            ref={containerRef}
            className={styles.container}
            style={widthVar}
            onPointerEnter={preloadPagefind}
            onFocus={preloadPagefind}
        >
            <ScopeSelect ref={selectRef} value={scope} options={SCOPES} onChange={changeScope}/>
            <Search key={scope} className={styles.search} {...searchPropsFor(scope)}/>
        </div>
    )
}
