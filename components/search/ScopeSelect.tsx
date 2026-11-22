import type {Ref} from 'react'
import styles from './ScopeSelect.module.css'

type ScopeSelectProps = {
    ref?: Ref<HTMLDivElement>
    value: string
    options: string[]
    onChange: (value: string) => void
}

/** Compact native dropdown, overlaid on the start edge of the search input by its parent */
export function ScopeSelect({ref, value, options, onChange}: ScopeSelectProps) {
    return (
        <div ref={ref} className={styles.scope}>
            <select aria-label="Search scope" value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <svg aria-hidden viewBox="0 0 16 16" width="12" height="12">
                <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
        </div>
    )
}
