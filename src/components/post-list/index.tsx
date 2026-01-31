import type { ReactNode } from 'react'
import styles from './styles.module.css'

interface PostListProps {
    children: ReactNode
    className?: string
}

const PostList = ({
    children,
    className = '',
}: PostListProps) => {
    const containerClasses = [
        styles.container,
        className,
    ].filter(Boolean).join(' ')

    return (
        <div className={containerClasses}>
            {children}
        </div>
    )
}

export default PostList