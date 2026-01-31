'use client'

import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '@/src/store'
import { fetchPosts, fetchComments, setSearchQuery, clearSearch, selectPost, clearSelectedPost, selectAllPosts, selectSelectedPost, selectPostsLoading, selectPostsError, selectComments, selectCommentsLoading, selectCommentsError, selectSearchQuery, type Post } from '@/src/store/slice/post-slice'
import styles from './styles.module.css'

export default function PostsPage() {
    const dispatch = useDispatch<AppDispatch>()
    const posts = useSelector(selectAllPosts)
    const selectedPost = useSelector(selectSelectedPost)
    const loading = useSelector(selectPostsLoading)
    const error = useSelector(selectPostsError)
    const comments = useSelector(selectComments)
    const commentsLoading = useSelector(selectCommentsLoading)
    const commentsError = useSelector(selectCommentsError)
    const searchQuery = useSelector(selectSearchQuery)

    useEffect(() => {
        dispatch(fetchPosts())
    }, [dispatch])

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value))
    }, [dispatch])

    const handleClearSearch = useCallback(() => {
        dispatch(clearSearch())
    }, [dispatch])

    const handlePostClick = useCallback((post: Post) => {
        dispatch(selectPost(post))
        dispatch(fetchComments(post.id))
    }, [dispatch])

    const handleCloseModal = useCallback(() => {
        dispatch(clearSelectedPost())
    }, [dispatch])

    const handleRetry = useCallback(() => {
        dispatch(fetchPosts())
    }, [dispatch])

    const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            dispatch(clearSelectedPost())
        }
    }, [dispatch])

    const getFilteredPosts = useCallback(() => {
        if (!searchQuery.trim()) {
            return posts
        }
        const query = searchQuery.toLowerCase()
        return posts.filter((post) => {
            const matchesId = post.id.toString().includes(query)
            const matchesTitle = post.title.toLowerCase().includes(query)
            const matchesBody = post.body.toLowerCase().includes(query)
            if (matchesId) {
                return true
            }
            if (matchesTitle) {
                return true
            }
            if (matchesBody) {
                return true
            }
            return false
        })
    }, [posts, searchQuery])

    const highlightText = useCallback((text: string, query: string) => {
        if (!query.trim()) {
            return text
        }
        const regex = new RegExp(`(${query})`, 'gi')
        const parts = text.split(regex)
        return parts.map((part, index) => {
            if (part.toLowerCase() === query.toLowerCase()) {
                return <span key={index} className={styles.highlight}>{part}</span>
            }
            return part
        })
    }, [])

    const filteredPosts = getFilteredPosts()

    const getResultsTitle = useCallback(() => {
        if (searchQuery) {
            return 'Search Results'
        }
        return 'All Posts'
    }, [searchQuery])

    const getPostLabel = useCallback(() => {
        if (filteredPosts.length === 1) {
            return 'post'
        }
        return 'posts'
    }, [filteredPosts.length])

    const renderClearButton = () => {
        if (!searchQuery) {
            return null
        }
        return (
            <button className={styles.clearButton} onClick={handleClearSearch}>
                ×
            </button>
        )
    }

    const renderLoading = () => {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Loading posts...</p>
            </div>
        )
    }

    const renderError = () => {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>⚠️</div>
                <h3 className={styles.errorTitle}>Failed to Load Posts</h3>
                <p className={styles.errorMessage}>{error}</p>
                <button className={styles.retryButton} onClick={handleRetry}>
                    Try Again
                </button>
            </div>
        )
    }

    const renderEmpty = () => {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>No Posts Found</h3>
                <p className={styles.emptyMessage}>
                    No posts match your search criteria. Try a different search term.
                </p>
            </div>
        )
    }

    const renderComments = () => {
        if (commentsLoading) {
            return (
                <div className={styles.commentsLoading}>
                    <div className={styles.commentsSpinner}></div>
                    <span className={styles.commentsLoadingText}>Loading comments...</span>
                </div>
            )
        }

        if (commentsError) {
            return (
                <div className={styles.commentsError}>
                    Failed to load comments: {commentsError}
                </div>
            )
        }

        if (comments.length === 0) {
            return null
        }

        return (
            <div className={styles.commentsList}>
                {comments.map((comment) => (
                    <div key={comment.id} className={styles.commentCard}>
                        <div className={styles.commentHeader}>
                            <span className={styles.commentName}>{comment.name}</span>
                            <span className={styles.commentEmail}>{comment.email}</span>
                        </div>
                        <p className={styles.commentBody}>{comment.body}</p>
                    </div>
                ))}
            </div>
        )
    }

    const renderModal = () => {
        if (!selectedPost) {
            return null
        }

        return (
            <div className={styles.modalOverlay} onClick={handleOverlayClick}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <span className={styles.modalTitle}>Post Detail</span>
                        <button className={styles.modalClose} onClick={handleCloseModal}>
                            ×
                        </button>
                    </div>
                    <div className={styles.modalContent}>
                        <h2 className={styles.detailTitle}>{selectedPost.title}</h2>
                        <p className={styles.detailBody}>{selectedPost.body}</p>
                        <div className={styles.commentsSection}>
                            <h3 className={styles.commentsTitle}>
                                Comments ({comments.length})
                            </h3>
                            {renderComments()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderPosts = () => {
        return (
            <div className={styles.postsList}>
                {filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        className={styles.postCard}
                        onClick={() => handlePostClick(post)}
                    >
                        <div className={styles.postCardHeader}>
                            <h3 className={styles.postTitle}>
                                {highlightText(post.title, searchQuery)}
                            </h3>
                            <span className={styles.postId}>#{post.id}</span>
                        </div>
                        <p className={styles.postBody}>
                            {highlightText(post.body, searchQuery)}
                        </p>
                        <span className={styles.postMeta}>User ID: {post.userId}</span>
                    </div>
                ))}
            </div>
        )
    }

    const renderContent = () => {
        if (loading) {
            return renderLoading()
        }

        if (error) {
            return renderError()
        }

        if (filteredPosts.length === 0) {
            return renderEmpty()
        }

        return renderPosts()
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Posts</h1>
                <p className={styles.subtitle}>Browse and search posts from JSONPlaceholder API</p>
            </div>

            <div className={styles.searchContainer}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search posts by title or content..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                {renderClearButton()}
            </div>

            <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>
                    {getResultsTitle()}
                </h2>
                <span className={styles.resultsCount}>
                    {filteredPosts.length} {getPostLabel()}
                </span>
            </div>

            {renderContent()}
            {renderModal()}
        </div>
    )
}