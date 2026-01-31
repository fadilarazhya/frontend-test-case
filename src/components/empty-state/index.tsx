import type { ReactNode } from 'react'
import styles from './styles.module.css'

interface EmptyStateProps {
    title?: string
    message: string
    icon?: ReactNode
    action?: ReactNode
    className?: string
}

const EmptyState = ({
    title,
    message,
    icon,
    action,
    className = '',
}: EmptyStateProps) => {
    const containerClasses = [
        styles.container,
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={containerClasses}>
            {icon && (
                <div className={styles.iconWrapper}>
                    {icon}
                </div>
            )}

            {title && (
                <h3 className={styles.title}>{title}</h3>
            )}

            <p className={styles.message}>{message}</p>

            {action && (
                <div className={styles.actionWrapper}>
                    {action}
                </div>
            )}
        </div>
    )
}

export default EmptyState