export interface Comment {
    postId: number
    id: number
    name: string
    email: string
    body: string
}

export interface CommentState {
    comments: Comment[]
    isLoading: boolean
    error: string | null
}

export const createInitialCommentState = (): CommentState => {
    return {
        comments: [],
        isLoading: false,
        error: null,
    }
}

export const isValidComment = (data: unknown): data is Comment => {
    if (typeof data !== 'object') {
        return false
    }

    if (data === null) {
        return false
    }

    const comment = data as Record<string, unknown>

    if (typeof comment.postId !== 'number') {
        return false
    }

    if (typeof comment.id !== 'number') {
        return false
    }

    if (typeof comment.name !== 'string') {
        return false
    }

    if (typeof comment.email !== 'string') {
        return false
    }

    if (typeof comment.body !== 'string') {
        return false
    }

    return true
}

export const isValidCommentArray = (data: unknown): data is Comment[] => {
    if (!Array.isArray(data)) {
        return false
    }

    for (const item of data) {
        if (!isValidComment(item)) {
            return false
        }
    }

    return true
}

export const createEmptyComment = (): Comment => {
    return {
        postId: 0,
        id: 0,
        name: '',
        email: '',
        body: '',
    }
}

export const filterCommentsByPostId = (comments: Comment[], postId: number): Comment[] => {
    const filtered: Comment[] = []

    for (const comment of comments) {
        if (comment.postId === postId) {
            filtered.push(comment)
        }
    }

    return filtered
}

export const findCommentById = (comments: Comment[], id: number): Comment | null => {
    for (const comment of comments) {
        if (comment.id === id) {
            return comment
        }
    }

    return null
}

export const sortCommentsById = (comments: Comment[], ascending: boolean = true): Comment[] => {
    const sorted = [...comments]

    sorted.sort((a, b) => {
        if (ascending) {
            return a.id - b.id
        }

        return b.id - a.id
    })

    return sorted
}

export const getCommentCount = (comments: Comment[], postId: number): number => {
    let count = 0

    for (const comment of comments) {
        if (comment.postId === postId) {
            count++
        }
    }

    return count
}

export const getCommentPreview = (comment: Comment, maxLength: number = 50): string => {
    if (comment.body.length <= maxLength) {
        return comment.body
    }

    return comment.body.substring(0, maxLength) + '...'
}

export const searchCommentsByEmail = (comments: Comment[], email: string): Comment[] => {
    const lowerEmail = email.toLowerCase().trim()

    if (lowerEmail === '') {
        return comments
    }

    const results: Comment[] = []

    for (const comment of comments) {
        const lowerCommentEmail = comment.email.toLowerCase()

        if (lowerCommentEmail.includes(lowerEmail)) {
            results.push(comment)
        }
    }

    return results
}

export const getUniqueEmailsFromComments = (comments: Comment[]): string[] => {
    const emailSet = new Set<string>()

    for (const comment of comments) {
        emailSet.add(comment.email)
    }

    return Array.from(emailSet)
}