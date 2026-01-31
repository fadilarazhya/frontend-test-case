import styles from './styles.module.css'
import { FilterType } from '@/src/constant/filter'
import type { FilterTypeValue } from '@/src/constant/filter'

interface TodoFilterProps {
    currentFilter: FilterTypeValue
    onFilterChange: (filter: FilterTypeValue) => void
    counts: {
        all: number
        completed: number
        pending: number
    }
    className?: string
}

const TodoFilter = ({
    currentFilter,
    onFilterChange,
    counts,
    className = '',
}: TodoFilterProps) => {
    const handleFilterClick = (filter: FilterTypeValue) => {
        onFilterChange(filter)
    }

    const getButtonClasses = (filter: FilterTypeValue): string => {
        const baseClasses = styles.filterButton

        if (currentFilter === filter) {
            return `${baseClasses} ${styles.active}`
        }

        return baseClasses
    }

    const containerClasses = [
        styles.container,
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={containerClasses}>
            <button
                type="button"
                className={getButtonClasses(FilterType.ALL)}
                onClick={() => handleFilterClick(FilterType.ALL)}
            >
                All
                <span className={styles.count}>{counts.all}</span>
            </button>

            <button
                type="button"
                className={getButtonClasses(FilterType.PENDING)}
                onClick={() => handleFilterClick(FilterType.PENDING)}
            >
                Pending
                <span className={styles.count}>{counts.pending}</span>
            </button>

            <button
                type="button"
                className={getButtonClasses(FilterType.COMPLETED)}
                onClick={() => handleFilterClick(FilterType.COMPLETED)}
            >
                Completed
                <span className={styles.count}>{counts.completed}</span>
            </button>
        </div>
    )
}

export default TodoFilter