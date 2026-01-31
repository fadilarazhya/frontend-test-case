import styles from './styles.module.css'
import LoadingState from '@/src/components/loading-state'
import ErrorState from '@/src/components/error-state'
import EmptyState from '@/src/components/empty-state'
import { LoadingMessage, EmptyMessage } from '@/src/constant/messages'

interface CommentData {
    id: number
    name: string
    email: string
    body: string
}

interface CommentListProps {
    postId: number
    comments: CommentData[]
    isLoading: boolean
    error: string | null
    onRetry?: () => void
    className?: string
}

const CommentList = ({
    postId,
    comments,
    isLoading,
    error,
    onRetry,
    className = '',
}: CommentListProps) => {
    const getContainerClasses = (): string => {
        const classes: string[] = [styles.container]

        if (className !== '') {
            classes.push(className)
        }

        return classes.join(' ')
    }

    const containerClasses = getContainerClasses()

    if (isLoading) {
        return (
            <div className={containerClasses}>
                <LoadingState message={LoadingMessage.FETCHING_COMMENTS} />
            </div>
        )
    }

    if (error) {
        return (
            <div className={containerClasses}>
                <ErrorState
                    message={error}
                    onRetry={onRetry}
                />
            </div>
        )
    }

    if (comments.length === 0) {
        return (
            <div className={containerClasses}>
                <EmptyState message={EmptyMessage.NO_COMMENTS} />
            </div>
        )
    }

    const renderCommentItem = (comment: CommentData) => {
        return (
            <div key={comment.id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                    <span className={styles.commentName}>{comment.name}</span>
                    <span className={styles.commentEmail}>{comment.email}</span>
                </div>
                <p className={styles.commentBody}>{comment.body}</p>
            </div>
        )
    }

    return (
        <div className={containerClasses}>
            <div className={styles.header}>
                <h4 className={styles.title}>
                    Comments for Post #{postId}
                </h4>
                <span className={styles.count}>
                    {comments.length} comments
                </span>
            </div>

            <div className={styles.list}>
                {comments.map((comment) => renderCommentItem(comment))}
            </div>
        </div>
    )
}

export default CommentList