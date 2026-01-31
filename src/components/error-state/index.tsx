import styles from './styles.module.css'
import Button from '@/src/components/button'

interface ErrorStateProps {
    title?: string
    message: string
    onRetry?: () => void
    retryLabel?: string
    className?: string
}

const ErrorState = ({
    title = 'Oops! Something went wrong',
    message,
    onRetry,
    retryLabel = 'Try Again',
    className = '',
}: ErrorStateProps) => {
    const containerClasses = [
        styles.container,
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={containerClasses}>
            <div className={styles.iconWrapper}>
                <svg
                    className={styles.icon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                </svg>
            </div>

            <h3 className={styles.title}>{title}</h3>

            <p className={styles.message}>{message}</p>

            {onRetry && (
                <div className={styles.actionWrapper}>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={onRetry}
                    >
                        {retryLabel}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default ErrorState