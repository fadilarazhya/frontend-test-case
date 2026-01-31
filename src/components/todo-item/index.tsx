import styles from './styles.module.css'
import Button from '@/src/components/button'

interface TodoItemProps {
    id: string
    title: string
    completed: boolean
    onToggle: (id: string) => void
    onDelete: (id: string) => void
    className?: string
}

const TodoItem = ({
    id,
    title,
    completed,
    onToggle,
    onDelete,
    className = '',
}: TodoItemProps) => {
    const handleToggle = () => {
        onToggle(id)
    }

    const handleDelete = () => {
        onDelete(id)
    }

    const containerClasses = [
        styles.container,
        completed ? styles.completed : '',
        className,
    ].filter(Boolean).join(' ')

    const checkboxClasses = [
        styles.checkbox,
        completed ? styles.checkboxChecked : '',
    ].filter(Boolean).join(' ')

    const titleClasses = [
        styles.title,
        completed ? styles.titleCompleted : '',
    ].filter(Boolean).join(' ')

    return (
        <div className={containerClasses}>
            <button
                type="button"
                className={checkboxClasses}
                onClick={handleToggle}
                aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
                {completed && (
                    <svg
                        className={styles.checkIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
            </button>

            <span className={titleClasses}>{title}</span>

            <div className={styles.actions}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    aria-label="Delete task"
                >
                    <svg
                        className={styles.deleteIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                </Button>
            </div>
        </div>
    )
}

export default TodoItem