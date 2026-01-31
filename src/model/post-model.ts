export interface Post {
    userId: number
    id: number
    title: string
    body: string
}

export interface PostState {
    posts: Post[]
    selectedPost: Post | null
    isLoading: boolean
    error: string | null
}

export const createInitialPostState = (): PostState => {
    return {
        posts: [],
        selectedPost: null,
        isLoading: false,
        error: null,
    }
}

export const isValidPost = (data: unknown): data is Post => {
    if (typeof data !== 'object') {
        return false
    }

    if (data === null) {
        return false
    }

    const post = data as Record<string, unknown>

    if (typeof post.userId !== 'number') {
        return false
    }

    if (typeof post.id !== 'number') {
        return false
    }

    if (typeof post.title !== 'string') {
        return false
    }

    if (typeof post.body !== 'string') {
        return false
    }

    return true
}

export const isValidPostArray = (data: unknown): data is Post[] => {
    if (!Array.isArray(data)) {
        return false
    }

    for (const item of data) {
        if (!isValidPost(item)) {
            return false
        }
    }

    return true
}

export const createEmptyPost = (): Post => {
    return {
        userId: 0,
        id: 0,
        title: '',
        body: '',
    }
}

export const getPostPreview = (post: Post, maxLength: number = 100): string => {
    if (post.body.length <= maxLength) {
        return post.body
    }

    return post.body.substring(0, maxLength) + '...'
}

export const filterPostsByUserId = (posts: Post[], userId: number): Post[] => {
    const filtered: Post[] = []

    for (const post of posts) {
        if (post.userId === userId) {
            filtered.push(post)
        }
    }

    return filtered
}

export const findPostById = (posts: Post[], id: number): Post | null => {
    for (const post of posts) {
        if (post.id === id) {
            return post
        }
    }

    return null
}

export const sortPostsById = (posts: Post[], ascending: boolean = true): Post[] => {
    const sorted = [...posts]

    sorted.sort((a, b) => {
        if (ascending) {
            return a.id - b.id
        }

        return b.id - a.id
    })

    return sorted
}

export const searchPostsByTitle = (posts: Post[], query: string): Post[] => {
    const lowerQuery = query.toLowerCase().trim()

    if (lowerQuery === '') {
        return posts
    }

    const results: Post[] = []

    for (const post of posts) {
        const lowerTitle = post.title.toLowerCase()

        if (lowerTitle.includes(lowerQuery)) {
            results.push(post)
        }
    }

    return results
}

export const searchPostsById = (posts: Post[], id: number): Post[] => {
    const results: Post[] = []

    for (const post of posts) {
        if (post.id === id) {
            results.push(post)
        }
    }

    return results
}