import { describe, it, expect } from 'vitest'
import type { Post, Comment, Todo } from '@/src/model'

const createMockPost = (overrides: Partial<Post> = {}): Post => {
    return {
        userId: 1,
        id: 1,
        title: 'Test Post Title',
        body: 'Test post body content here',
        ...overrides,
    }
}

const createMockComment = (overrides: Partial<Comment> = {}): Comment => {
    return {
        postId: 1,
        id: 1,
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'Test comment body',
        ...overrides,
    }
}

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => {
    const now = Date.now()

    return {
        id: 'todo-1',
        title: 'Test Todo',
        completed: false,
        createdAt: now,
        updatedAt: now,
        ...overrides,
    }
}

const filterPostsByQuery = (posts: Post[], query: string): Post[] => {
    const trimmedQuery = query.toLowerCase().trim()

    if (trimmedQuery === '') {
        return posts
    }

    const result: Post[] = []

    for (const post of posts) {
        const titleMatch = post.title.toLowerCase().includes(trimmedQuery)
        const bodyMatch = post.body.toLowerCase().includes(trimmedQuery)

        if (titleMatch) {
            result.push(post)
            continue
        }

        if (bodyMatch) {
            result.push(post)
        }
    }

    return result
}

const filterPostsByUserId = (posts: Post[], userId: number): Post[] => {
    const result: Post[] = []

    for (const post of posts) {
        if (post.userId === userId) {
            result.push(post)
        }
    }

    return result
}

const filterCommentsByPostId = (comments: Comment[], postId: number): Comment[] => {
    const result: Comment[] = []

    for (const comment of comments) {
        if (comment.postId === postId) {
            result.push(comment)
        }
    }

    return result
}

const filterCommentsByEmail = (comments: Comment[], email: string): Comment[] => {
    const trimmedEmail = email.toLowerCase().trim()

    if (trimmedEmail === '') {
        return comments
    }

    const result: Comment[] = []

    for (const comment of comments) {
        const emailMatch = comment.email.toLowerCase().includes(trimmedEmail)

        if (emailMatch) {
            result.push(comment)
        }
    }

    return result
}

const filterTodosByStatus = (todos: Todo[], completed: boolean): Todo[] => {
    const result: Todo[] = []

    for (const todo of todos) {
        if (todo.completed === completed) {
            result.push(todo)
        }
    }

    return result
}

const filterTodosByQuery = (todos: Todo[], query: string): Todo[] => {
    const trimmedQuery = query.toLowerCase().trim()

    if (trimmedQuery === '') {
        return todos
    }

    const result: Todo[] = []

    for (const todo of todos) {
        const titleMatch = todo.title.toLowerCase().includes(trimmedQuery)

        if (titleMatch) {
            result.push(todo)
        }
    }

    return result
}

describe('filterPostsByQuery', () => {
    describe('Positive Cases', () => {
        it('should filter posts by title match', () => {
            const posts = [
                createMockPost({ id: 1, title: 'React Tutorial' }),
                createMockPost({ id: 2, title: 'Vue Guide' }),
                createMockPost({ id: 3, title: 'Angular Basics' }),
            ]
            const result = filterPostsByQuery(posts, 'react')

            expect(result).toHaveLength(1)
            expect(result[0].title).toBe('React Tutorial')
        })

        it('should filter posts by body match', () => {
            const posts = [
                createMockPost({ id: 1, body: 'Learn React hooks' }),
                createMockPost({ id: 2, body: 'Vue composition API' }),
            ]
            const result = filterPostsByQuery(posts, 'hooks')

            expect(result).toHaveLength(1)
            expect(result[0].id).toBe(1)
        })

        it('should be case insensitive', () => {
            const posts = [
                createMockPost({ id: 1, title: 'REACT Tutorial' }),
                createMockPost({ id: 2, title: 'react Guide' }),
            ]
            const result = filterPostsByQuery(posts, 'React')

            expect(result).toHaveLength(2)
        })

        it('should return all posts for empty query', () => {
            const posts = [
                createMockPost({ id: 1 }),
                createMockPost({ id: 2 }),
            ]
            const result = filterPostsByQuery(posts, '')

            expect(result).toHaveLength(2)
        })

        it('should return all posts for whitespace query', () => {
            const posts = [
                createMockPost({ id: 1 }),
                createMockPost({ id: 2 }),
            ]
            const result = filterPostsByQuery(posts, '   ')

            expect(result).toHaveLength(2)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty array for no matches', () => {
            const posts = [
                createMockPost({ id: 1, title: 'React Tutorial' }),
            ]
            const result = filterPostsByQuery(posts, 'xyz123')

            expect(result).toHaveLength(0)
        })

        it('should return empty array for empty posts', () => {
            const result = filterPostsByQuery([], 'react')

            expect(result).toHaveLength(0)
        })
    })
})

describe('filterPostsByUserId', () => {
    describe('Positive Cases', () => {
        it('should filter posts by user ID', () => {
            const posts = [
                createMockPost({ id: 1, userId: 1 }),
                createMockPost({ id: 2, userId: 2 }),
                createMockPost({ id: 3, userId: 1 }),
            ]
            const result = filterPostsByUserId(posts, 1)

            expect(result).toHaveLength(2)
        })

        it('should return single post for unique user', () => {
            const posts = [
                createMockPost({ id: 1, userId: 1 }),
                createMockPost({ id: 2, userId: 2 }),
            ]
            const result = filterPostsByUserId(posts, 2)

            expect(result).toHaveLength(1)
            expect(result[0].userId).toBe(2)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty array for non-existent user', () => {
            const posts = [
                createMockPost({ id: 1, userId: 1 }),
            ]
            const result = filterPostsByUserId(posts, 999)

            expect(result).toHaveLength(0)
        })

        it('should return empty array for empty posts', () => {
            const result = filterPostsByUserId([], 1)

            expect(result).toHaveLength(0)
        })
    })
})

describe('filterCommentsByPostId', () => {
    describe('Positive Cases', () => {
        it('should filter comments by post ID', () => {
            const comments = [
                createMockComment({ id: 1, postId: 1 }),
                createMockComment({ id: 2, postId: 2 }),
                createMockComment({ id: 3, postId: 1 }),
            ]
            const result = filterCommentsByPostId(comments, 1)

            expect(result).toHaveLength(2)
        })

        it('should return all comments for specific post', () => {
            const comments = [
                createMockComment({ id: 1, postId: 5 }),
                createMockComment({ id: 2, postId: 5 }),
                createMockComment({ id: 3, postId: 5 }),
            ]
            const result = filterCommentsByPostId(comments, 5)

            expect(result).toHaveLength(3)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty array for non-existent post', () => {
            const comments = [
                createMockComment({ id: 1, postId: 1 }),
            ]
            const result = filterCommentsByPostId(comments, 999)

            expect(result).toHaveLength(0)
        })

        it('should return empty array for empty comments', () => {
            const result = filterCommentsByPostId([], 1)

            expect(result).toHaveLength(0)
        })
    })
})

describe('filterCommentsByEmail', () => {
    describe('Positive Cases', () => {
        it('should filter comments by email', () => {
            const comments = [
                createMockComment({ id: 1, email: 'user1@test.com' }),
                createMockComment({ id: 2, email: 'user2@test.com' }),
                createMockComment({ id: 3, email: 'user1@example.com' }),
            ]
            const result = filterCommentsByEmail(comments, 'user1')

            expect(result).toHaveLength(2)
        })

        it('should be case insensitive', () => {
            const comments = [
                createMockComment({ id: 1, email: 'USER@test.com' }),
            ]
            const result = filterCommentsByEmail(comments, 'user')

            expect(result).toHaveLength(1)
        })

        it('should return all comments for empty email', () => {
            const comments = [
                createMockComment({ id: 1 }),
                createMockComment({ id: 2 }),
            ]
            const result = filterCommentsByEmail(comments, '')

            expect(result).toHaveLength(2)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty array for no matches', () => {
            const comments = [
                createMockComment({ id: 1, email: 'test@test.com' }),
            ]
            const result = filterCommentsByEmail(comments, 'xyz')

            expect(result).toHaveLength(0)
        })
    })
})

describe('filterTodosByStatus', () => {
    describe('Positive Cases', () => {
        it('should filter completed todos', () => {
            const todos = [
                createMockTodo({ id: '1', completed: true, createdAt: 1000, updatedAt: 1000 }),
                createMockTodo({ id: '2', completed: false, createdAt: 2000, updatedAt: 2000 }),
                createMockTodo({ id: '3', completed: true, createdAt: 3000, updatedAt: 3000 }),
            ]
            const result = filterTodosByStatus(todos, true)

            expect(result).toHaveLength(2)
        })

        it('should filter pending todos', () => {
            const todos = [
                createMockTodo({ id: '1', completed: true, createdAt: 1000, updatedAt: 1000 }),
                createMockTodo({ id: '2', completed: false, createdAt: 2000, updatedAt: 2000 }),
                createMockTodo({ id: '3', completed: false, createdAt: 3000, updatedAt: 3000 }),
            ]
            const result = filterTodosByStatus(todos, false)

            expect(result).toHaveLength(2)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty array when no todos match', () => {
            const todos = [
                createMockTodo({ id: '1', completed: false, createdAt: 1000, updatedAt: 1000 }),
            ]
            const result = filterTodosByStatus(todos, true)

            expect(result).toHaveLength(0)
        })

        it('should return empty array for empty todos', () => {
            const result = filterTodosByStatus([], true)

            expect(result).toHaveLength(0)
        })
    })
})

describe('filterTodosByQuery', () => {
    describe('Positive Cases', () => {
        it('should filter todos by title', () => {
            const todos = [
                createMockTodo({ id: '1', title: 'Buy groceries', createdAt: 1000, updatedAt: 1000 }),
                createMockTodo({ id: '2', title: 'Learn React', createdAt: 2000, updatedAt: 2000 }),
                createMockTodo({ id: '3', title: 'Buy books', createdAt: 3000, updatedAt: 3000 }),
            ]
            const result = filterTodosByQuery(todos, 'buy')

            expect(result).toHaveLength(2)
        })

        it('should be case insensitive', () => {
            const todos = [
                createMockTodo({ id: '1', title: 'URGENT Task', createdAt: 1000, updatedAt: 1000 }),
            ]
            const result = filterTodosByQuery(todos, 'urgent')

            expect(result).toHaveLength(1)
        })

        it('should return all todos for empty query', () => {
            const todos = [
                createMockTodo({ id: '1', createdAt: 1000, updatedAt: 1000 }),
                createMockTodo({ id: '2', createdAt: 2000, updatedAt: 2000 }),
            ]
            const result = filterTodosByQuery(todos, '')

            expect(result).toHaveLength(2)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty array for no matches', () => {
            const todos = [
                createMockTodo({ id: '1', title: 'Task 1', createdAt: 1000, updatedAt: 1000 }),
            ]
            const result = filterTodosByQuery(todos, 'xyz')

            expect(result).toHaveLength(0)
        })

        it('should return empty array for empty todos', () => {
            const result = filterTodosByQuery([], 'task')

            expect(result).toHaveLength(0)
        })
    })
})