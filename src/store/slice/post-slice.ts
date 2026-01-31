import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

export interface Post {
    userId: number
    id: number
    title: string
    body: string
}

export interface Comment {
    postId: number
    id: number
    name: string
    email: string
    body: string
}

interface PostsState {
    posts: Post[]
    selectedPost: Post | null
    isLoading: boolean
    error: string | null
}

interface CommentsState {
    comments: Comment[]
    isLoading: boolean
    error: string | null
}

export interface PostPageState {
    posts: PostsState
    comments: CommentsState
    searchQuery: string
    searchedPostId: number | null
}

const initialState: PostPageState = {
    posts: {
        posts: [],
        selectedPost: null,
        isLoading: false,
        error: null,
    },
    comments: {
        comments: [],
        isLoading: false,
        error: null,
    },
    searchQuery: '',
    searchedPostId: null,
}

export const fetchPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
    'posts/fetchPosts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts')
            if (!response.ok) {
                return rejectWithValue('Failed to fetch posts')
            }
            const data = await response.json()
            return data
        } catch {
            return rejectWithValue('Network error occurred')
        }
    }
)

export const fetchSinglePost = createAsyncThunk<Post, number, { rejectValue: string }>(
    'posts/fetchSinglePost',
    async (postId, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            if (!response.ok) {
                return rejectWithValue('Failed to fetch post')
            }
            const data = await response.json()
            return data
        } catch {
            return rejectWithValue('Network error occurred')
        }
    }
)

export const fetchComments = createAsyncThunk<Comment[], number, { rejectValue: string }>(
    'posts/fetchComments',
    async (postId, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
            if (!response.ok) {
                return rejectWithValue('Failed to fetch comments')
            }
            const data = await response.json()
            return data
        } catch {
            return rejectWithValue('Network error occurred')
        }
    }
)

export const searchPostByIdThunk = createAsyncThunk<Post, number, { rejectValue: string }>(
    'posts/searchPostById',
    async (postId, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            if (!response.ok) {
                return rejectWithValue('Post not found')
            }
            const data = await response.json()
            return data
        } catch {
            return rejectWithValue('Network error occurred')
        }
    }
)

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
        },
        clearSearch: (state) => {
            state.searchQuery = ''
            state.searchedPostId = null
            state.posts.selectedPost = null
        },
        selectPost: (state, action: PayloadAction<Post | null>) => {
            state.posts.selectedPost = action.payload
        },
        clearSelectedPost: (state) => {
            state.posts.selectedPost = null
            state.comments.comments = []
        },
        setPostsLoading: (state, action: PayloadAction<boolean>) => {
            state.posts.isLoading = action.payload
        },
        setPostsError: (state, action: PayloadAction<string | null>) => {
            state.posts.error = action.payload
        },
        clearPostsError: (state) => {
            state.posts.error = null
        },
        setCommentsLoading: (state, action: PayloadAction<boolean>) => {
            state.comments.isLoading = action.payload
        },
        setCommentsError: (state, action: PayloadAction<string | null>) => {
            state.comments.error = action.payload
        },
        clearCommentsError: (state) => {
            state.comments.error = null
        },
        clearComments: (state) => {
            state.comments.comments = []
            state.comments.error = null
        },
        resetPostState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.posts.isLoading = true
                state.posts.error = null
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts.isLoading = false
                state.posts.posts = action.payload
                state.posts.error = null
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.posts.isLoading = false
                state.posts.error = action.payload || 'Unknown error'
            })
            .addCase(fetchSinglePost.pending, (state) => {
                state.posts.isLoading = true
                state.posts.error = null
            })
            .addCase(fetchSinglePost.fulfilled, (state, action) => {
                state.posts.isLoading = false
                state.posts.selectedPost = action.payload
            })
            .addCase(fetchSinglePost.rejected, (state, action) => {
                state.posts.isLoading = false
                state.posts.error = action.payload || 'Unknown error'
            })
            .addCase(fetchComments.pending, (state) => {
                state.comments.isLoading = true
                state.comments.error = null
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments.isLoading = false
                state.comments.comments = action.payload
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.comments.isLoading = false
                state.comments.error = action.payload || 'Unknown error'
            })
            .addCase(searchPostByIdThunk.pending, (state) => {
                state.posts.isLoading = true
                state.posts.selectedPost = null
                state.posts.error = null
            })
            .addCase(searchPostByIdThunk.fulfilled, (state, action) => {
                state.posts.isLoading = false
                state.posts.selectedPost = action.payload
                state.searchedPostId = action.payload.id
            })
            .addCase(searchPostByIdThunk.rejected, (state, action) => {
                state.posts.isLoading = false
                state.posts.error = action.payload || 'Unknown error'
                state.searchedPostId = null
            })
    },
})

export const {
    setSearchQuery,
    clearSearch,
    selectPost,
    clearSelectedPost,
    setPostsLoading,
    setPostsError,
    clearPostsError,
    setCommentsLoading,
    setCommentsError,
    clearCommentsError,
    clearComments,
    resetPostState,
} = postSlice.actions

export const selectAllPosts = (state: { posts: PostPageState }) => state.posts.posts.posts
export const selectSelectedPost = (state: { posts: PostPageState }) => state.posts.posts.selectedPost
export const selectPostsLoading = (state: { posts: PostPageState }) => state.posts.posts.isLoading
export const selectPostsError = (state: { posts: PostPageState }) => state.posts.posts.error
export const selectHasPosts = (state: { posts: PostPageState }) => state.posts.posts.posts.length > 0
export const selectComments = (state: { posts: PostPageState }) => state.posts.comments.comments
export const selectCommentsLoading = (state: { posts: PostPageState }) => state.posts.comments.isLoading
export const selectCommentsError = (state: { posts: PostPageState }) => state.posts.comments.error
export const selectHasComments = (state: { posts: PostPageState }) => state.posts.comments.comments.length > 0
export const selectSearchQuery = (state: { posts: PostPageState }) => state.posts.searchQuery
export const selectSearchedPostId = (state: { posts: PostPageState }) => state.posts.searchedPostId

export const selectPostById = (state: { posts: PostPageState }, id: number): Post | null => {
    return state.posts.posts.posts.find(post => post.id === id) || null
}

export const selectFilteredPosts = (state: { posts: PostPageState }, query: string): Post[] => {
    const trimmedQuery = query.trim()

    if (trimmedQuery === '') {
        return state.posts.posts.posts
    }

    const lowerQuery = trimmedQuery.toLowerCase()

    return state.posts.posts.posts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(lowerQuery)
        const bodyMatch = post.body.toLowerCase().includes(lowerQuery)
        return titleMatch || bodyMatch
    })
}

export default postSlice.reducer