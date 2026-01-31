import type { ReactNode, MouseEvent } from 'react'
import styles from './styles.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
    children: ReactNode
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    type?: 'button' | 'submit' | 'reset'
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    isLoading?: boolean
    className?: string
}

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    className = '',
}: ButtonProps) => {
    const getVariantClass = (): string => {
        if (variant === 'primary') {
            return styles.primary
        }

        if (variant === 'secondary') {
            return styles.secondary
        }

        if (variant === 'danger') {
            return styles.danger
        }

        if (variant === 'ghost') {
            return styles.ghost
        }

        return styles.primary
    }

    const getSizeClass = (): string => {
        if (size === 'sm') {
            return styles.sm
        }

        if (size === 'lg') {
            return styles.lg
        }

        return styles.md
    }

    const isDisabled = disabled || isLoading

    const buttonClasses = [
        styles.button,
        getVariantClass(),
        getSizeClass(),
        className,
    ].filter(Boolean).join(' ')

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={buttonClasses}
        >
            {isLoading && (
                <span className={styles.spinner} />
            )}
            <span className={isLoading ? styles.loadingText : ''}>
                {children}
            </span>
        </button>
    )
}

export default Button