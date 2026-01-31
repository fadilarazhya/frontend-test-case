import type { ReactNode } from 'react'
import styles from './styles.module.css'

interface CardProps {
    children: ReactNode
    onClick?: () => void
    hoverable?: boolean
    className?: string
}

const Card = ({
    children,
    onClick,
    hoverable = false,
    className = '',
}: CardProps) => {
    const cardClasses = [
        styles.card,
        hoverable ? styles.hoverable : '',
        onClick ? styles.clickable : '',
        className,
    ].filter(Boolean).join(' ')

    return (
        <div
            className={cardClasses}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    )
}

export default Card