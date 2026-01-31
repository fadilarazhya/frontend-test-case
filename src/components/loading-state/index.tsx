import styles from './styles.module.css'
import { LoadingMessage } from '@/src/constant/messages'

interface LoadingStateProps {
    message?: string
    className?: string
}

const LoadingState = ({
    message = LoadingMessage.DEFAULT,
    className = '',
}: LoadingStateProps) => {
    const containerClasses = [
        styles.container,
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={containerClasses}>
            <div className={styles.spinnerWrapper}>
                <div className={styles.spinner} />
            </div>
            <p className={styles.message}>{message}</p>
        </div>
    )
}

export default LoadingState