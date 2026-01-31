export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    endpoints: {
        posts: '/posts',
        comments: '/comments',
    },
} as const

export const getEndpoint = (endpoint: keyof typeof API_CONFIG.endpoints): string => {
    return `${API_CONFIG.baseURL}${API_CONFIG.endpoints[endpoint]}`
}

export const getPostEndpoint = (id: number): string => {
    return `${API_CONFIG.baseURL}${API_CONFIG.endpoints.posts}/${id}`
}

export const getCommentsEndpoint = (postId: number): string => {
    return `${API_CONFIG.baseURL}${API_CONFIG.endpoints.comments}?postId=${postId}`
}