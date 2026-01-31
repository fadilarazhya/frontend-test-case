import styles from './styles.module.css'
import Card from '@/src/components/card'

interface PostItemProps {
    id: number
    userId: number
    title: string
    body: string
    onSelect?: (id: number) => void
    isSelected?: boolean
    className?: string
}

const PostItem = ({
    id,
    userId,
    title,
    body,
    onSelect,
    isSelected = false,
    className = '',
}: PostItemProps) => {
    const handleClick = () => {
        if (!onSelect) {
            return
        }

        onSelect(id)
    }

    const getContainerClasses = (): string => {
        const classes: string[] = [styles.container]

        if (isSelected) {
            classes.push(styles.selected)
        }

        if (className !== '') {
            classes.push(className)
        }

        return classes.join(' ')
    }

    const isHoverable = (): boolean => {
        if (onSelect) {
            return true
        }

        return false
    }

    const getClickHandler = (): (() => void) | undefined => {
        if (onSelect) {
            return handleClick
        }

        return undefined
    }

    const renderFooter = () => {
        if (!onSelect) {
            return null
        }

        return (
            <div className={styles.footer}>
                <span className={styles.viewComments}>
                    Click to view comments
                    <svg
                        className={styles.arrowIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                    </svg>
                </span>
            </div>
        )
    }

    return (
        <Card
            className={getContainerClasses()}
            onClick={getClickHandler()}
            hoverable={isHoverable()}
        >
            <div className={styles.header}>
                <span className={styles.postId}>#{id}</span>
                <span className={styles.userId}>User {userId}</span>
            </div>

            <h3 className={styles.title}>{title}</h3>

            <p className={styles.body}>{body}</p>

            {renderFooter()}
        </Card>
    )
}

export default PostItem