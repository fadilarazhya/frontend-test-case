import { get } from '@/src/utils/fetch-wrapper'
import { getEndpoint, getPostEndpoint, getCommentsEndpoint } from '@/src/config/api'
import { isValidPost, isValidPostArray, type Post } from '@/src/model/post-model'
import { isValidCommentArray, type Comment } from '@/src/model/comment-model'

export interface FetchPostsResult {
    data: Post[]
    success: boolean
    error: string | null
}

export interface FetchPostResult {
    data: Post | null
    success: boolean
    error: string | null
}

export interface FetchCommentsResult {
    data: Comment[]
    success: boolean
    error: string | null
}

export const fetchAllPosts = async (): Promise<FetchPostsResult> => {
    try {
        const endpoint = getEndpoint('posts')
        const response = await get<unknown>(endpoint)

        if (!isValidPostArray(response)) {
            return {
                data: [],
                success: false,
                error: 'Invalid response format from server',
            }
        }

        return {
            data: response,
            success: true,
            error: null,
        }
    } catch (error) {
        let errorMessage = 'Failed to fetch posts'

        if (error instanceof Error) {
            errorMessage = error.message
        }

        return {
            data: [],
            success: false,
            error: errorMessage,
        }
    }
}

export const fetchPostById = async (id: number): Promise<FetchPostResult> => {
    try {
        const endpoint = getPostEndpoint(id)
        const response = await get<unknown>(endpoint)

        if (!isValidPost(response)) {
            return {
                data: null,
                success: false,
                error: 'Invalid response format from server',
            }
        }

        return {
            data: response,
            success: true,
            error: null,
        }
    } catch (error) {
        let errorMessage = 'Failed to fetch post'

        if (error instanceof Error) {
            errorMessage = error.message
        }

        return {
            data: null,
            success: false,
            error: errorMessage,
        }
    }
}

export const fetchCommentsByPostId = async (postId: number): Promise<FetchCommentsResult> => {
    try {
        const endpoint = getCommentsEndpoint(postId)
        const response = await get<unknown>(endpoint)

        if (!isValidCommentArray(response)) {
            return {
                data: [],
                success: false,
                error: 'Invalid response format from server',
            }
        }

        return {
            data: response,
            success: true,
            error: null,
        }
    } catch (error) {
        let errorMessage = 'Failed to fetch comments'

        if (error instanceof Error) {
            errorMessage = error.message
        }

        return {
            data: [],
            success: false,
            error: errorMessage,
        }
    }
}

export const searchPostById = async (id: number): Promise<FetchPostsResult> => {
    const result = await fetchPostById(id)

    if (!result.success) {
        return {
            data: [],
            success: false,
            error: result.error,
        }
    }

    if (result.data === null) {
        return {
            data: [],
            success: true,
            error: null,
        }
    }

    return {
        data: [result.data],
        success: true,
        error: null,
    }
}

export const fetchPostWithComments = async (
    postId: number
): Promise<{
    post: Post | null
    comments: Comment[]
    success: boolean
    error: string | null
}> => {
    const postResult = await fetchPostById(postId)

    if (!postResult.success) {
        return {
            post: null,
            comments: [],
            success: false,
            error: postResult.error,
        }
    }

    const commentsResult = await fetchCommentsByPostId(postId)

    if (!commentsResult.success) {
        return {
            post: postResult.data,
            comments: [],
            success: true,
            error: null,
        }
    }

    return {
        post: postResult.data,
        comments: commentsResult.data,
        success: true,
        error: null,
    }
}