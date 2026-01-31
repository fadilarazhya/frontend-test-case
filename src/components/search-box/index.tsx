import type { KeyboardEvent } from 'react'
import styles from './styles.module.css'
import Input from '@/src/components/input'
import Button from '@/src/components/button'

interface SearchBoxProps {
    value: string
    onChange: (value: string) => void
    onSearch: () => void
    onClear?: () => void
    placeholder?: string
    isLoading?: boolean
    className?: string
    inputType?: 'text' | 'number'
    showSearchButton?: boolean
}

const SearchBox = ({
    value,
    onChange,
    onSearch,
    onClear,
    placeholder = 'Search...',
    isLoading = false,
    className = '',
    inputType = 'number',
    showSearchButton = true,
}: SearchBoxProps) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') {
            return
        }

        e.preventDefault()
        onSearch()
    }

    const handleClear = () => {
        onChange('')

        if (onClear) {
            onClear()
        }
    }

    const containerClasses = [
        styles.container,
        className,
    ].filter(Boolean).join(' ')

    const hasValue = value.trim().length > 0

    return (
        <div className={containerClasses}>
            <div className={styles.inputWrapper}>
                <div className={styles.iconWrapper}>
                    <svg
                        className={styles.searchIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </div>
                <Input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    type={inputType}
                    disabled={isLoading}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                />
                {hasValue && (
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                        <svg
                            className={styles.clearIcon}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
            {showSearchButton && (
                <Button
                    variant="primary"
                    onClick={onSearch}
                    disabled={!hasValue}
                    isLoading={isLoading}
                >
                    Search
                </Button>
            )}
        </div>
    )
}

export default SearchBox