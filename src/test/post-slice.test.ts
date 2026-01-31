import { describe, it, expect } from 'vitest'
import postReducer, { setSearchQuery, clearSearch, selectPost, clearSelectedPost, setPostsLoading, setPostsError, clearPostsError, setCommentsLoading, setCommentsError, clearCommentsError, clearComments, resetPostState, selectAllPosts, selectSelectedPost, selectPostsLoading, selectPostsError, selectHasPosts, selectComments, selectCommentsLoading, selectCommentsError, selectHasComments, selectSearchQuery, selectSearchedPostId, selectPostById, selectFilteredPosts, fetchPosts, fetchSinglePost, fetchComments, searchPostByIdThunk, type PostPageState } from '@/src/store/slice/post-slice'
import type { Post, Comment } from '@/src/model'

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

const createInitialState = (): PostPageState => {
    return {
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
}

const createStateWithPosts = (): PostPageState => {
    return {
        posts: {
            posts: [
                createMockPost({ id: 1, title: 'Post 1', body: 'Body 1' }),
                createMockPost({ id: 2, title: 'Post 2', body: 'Body 2' }),
                createMockPost({ id: 3, title: 'Another Title', body: 'Different Body' }),
            ],
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
}

const createStateWithComments = (): PostPageState => {
    return {
        ...createStateWithPosts(),
        comments: {
            comments: [
                createMockComment({ id: 1, postId: 1 }),
                createMockComment({ id: 2, postId: 1 }),
            ],
            isLoading: false,
            error: null,
        },
    }
}

describe('postSlice reducer', () => {
    describe('Initial State', () => {
        it('should return initial state for unknown action', () => {
            const result = postReducer(undefined, { type: 'unknown' })

            expect(result.posts.posts).toEqual([])
            expect(result.posts.selectedPost).toBeNull()
            expect(result.posts.isLoading).toBe(false)
            expect(result.posts.error).toBeNull()
            expect(result.comments.comments).toEqual([])
            expect(result.searchQuery).toBe('')
            expect(result.searchedPostId).toBeNull()
        })
    })

    describe('setSearchQuery', () => {
        describe('Positive Cases', () => {
            it('should set search query', () => {
                const state = createInitialState()
                const result = postReducer(state, setSearchQuery('test query'))

                expect(result.searchQuery).toBe('test query')
            })

            it('should update existing search query', () => {
                const state = { ...createInitialState(), searchQuery: 'old query' }
                const result = postReducer(state, setSearchQuery('new query'))

                expect(result.searchQuery).toBe('new query')
            })
        })

        describe('Negative Cases', () => {
            it('should handle empty string', () => {
                const state = { ...createInitialState(), searchQuery: 'existing' }
                const result = postReducer(state, setSearchQuery(''))

                expect(result.searchQuery).toBe('')
            })
        })
    })

    describe('clearSearch', () => {
        describe('Positive Cases', () => {
            it('should clear search query and related state', () => {
                const state: PostPageState = {
                    ...createStateWithPosts(),
                    searchQuery: 'test',
                    searchedPostId: 5,
                    posts: {
                        ...createStateWithPosts().posts,
                        selectedPost: createMockPost(),
                    },
                }
                const result = postReducer(state, clearSearch())

                expect(result.searchQuery).toBe('')
                expect(result.searchedPostId).toBeNull()
                expect(result.posts.selectedPost).toBeNull()
            })
        })
    })

    describe('selectPost', () => {
        describe('Positive Cases', () => {
            it('should select a post', () => {
                const state = createInitialState()
                const post = createMockPost()
                const result = postReducer(state, selectPost(post))

                expect(result.posts.selectedPost).toEqual(post)
            })
        })

        describe('Negative Cases', () => {
            it('should set selectedPost to null', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: {
                        ...createInitialState().posts,
                        selectedPost: createMockPost(),
                    },
                }
                const result = postReducer(state, selectPost(null))

                expect(result.posts.selectedPost).toBeNull()
            })
        })
    })

    describe('clearSelectedPost', () => {
        describe('Positive Cases', () => {
            it('should clear selected post and comments', () => {
                const state = createStateWithComments()
                state.posts.selectedPost = createMockPost()
                const result = postReducer(state, clearSelectedPost())

                expect(result.posts.selectedPost).toBeNull()
                expect(result.comments.comments).toEqual([])
            })
        })
    })

    describe('setPostsLoading', () => {
        describe('Positive Cases', () => {
            it('should set loading to true', () => {
                const state = createInitialState()
                const result = postReducer(state, setPostsLoading(true))

                expect(result.posts.isLoading).toBe(true)
            })

            it('should set loading to false', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, isLoading: true },
                }
                const result = postReducer(state, setPostsLoading(false))

                expect(result.posts.isLoading).toBe(false)
            })
        })
    })

    describe('setPostsError', () => {
        describe('Positive Cases', () => {
            it('should set error message', () => {
                const state = createInitialState()
                const result = postReducer(state, setPostsError('Error occurred'))

                expect(result.posts.error).toBe('Error occurred')
            })

            it('should set error to null', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, error: 'Some error' },
                }
                const result = postReducer(state, setPostsError(null))

                expect(result.posts.error).toBeNull()
            })
        })
    })

    describe('clearPostsError', () => {
        describe('Positive Cases', () => {
            it('should clear posts error', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, error: 'Error' },
                }
                const result = postReducer(state, clearPostsError())

                expect(result.posts.error).toBeNull()
            })
        })
    })

    describe('setCommentsLoading', () => {
        describe('Positive Cases', () => {
            it('should set comments loading to true', () => {
                const state = createInitialState()
                const result = postReducer(state, setCommentsLoading(true))

                expect(result.comments.isLoading).toBe(true)
            })

            it('should set comments loading to false', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    comments: { ...createInitialState().comments, isLoading: true },
                }
                const result = postReducer(state, setCommentsLoading(false))

                expect(result.comments.isLoading).toBe(false)
            })
        })
    })

    describe('setCommentsError', () => {
        describe('Positive Cases', () => {
            it('should set comments error message', () => {
                const state = createInitialState()
                const result = postReducer(state, setCommentsError('Comments error'))

                expect(result.comments.error).toBe('Comments error')
            })
        })
    })

    describe('clearCommentsError', () => {
        describe('Positive Cases', () => {
            it('should clear comments error', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    comments: { ...createInitialState().comments, error: 'Error' },
                }
                const result = postReducer(state, clearCommentsError())

                expect(result.comments.error).toBeNull()
            })
        })
    })

    describe('clearComments', () => {
        describe('Positive Cases', () => {
            it('should clear comments and error', () => {
                const state: PostPageState = {
                    ...createStateWithComments(),
                    comments: {
                        ...createStateWithComments().comments,
                        error: 'Some error',
                    },
                }
                const result = postReducer(state, clearComments())

                expect(result.comments.comments).toEqual([])
                expect(result.comments.error).toBeNull()
            })
        })
    })

    describe('resetPostState', () => {
        describe('Positive Cases', () => {
            it('should reset to initial state', () => {
                const state: PostPageState = {
                    posts: {
                        posts: [createMockPost()],
                        selectedPost: createMockPost(),
                        isLoading: true,
                        error: 'Error',
                    },
                    comments: {
                        comments: [createMockComment()],
                        isLoading: true,
                        error: 'Error',
                    },
                    searchQuery: 'test',
                    searchedPostId: 5,
                }
                const result = postReducer(state, resetPostState())

                expect(result.posts.posts).toEqual([])
                expect(result.posts.selectedPost).toBeNull()
                expect(result.posts.isLoading).toBe(false)
                expect(result.posts.error).toBeNull()
                expect(result.comments.comments).toEqual([])
                expect(result.searchQuery).toBe('')
                expect(result.searchedPostId).toBeNull()
            })
        })
    })

    describe('fetchPosts async thunk', () => {
        describe('Positive Cases', () => {
            it('should set loading true on pending', () => {
                const state = createInitialState()
                const action = { type: fetchPosts.pending.type }
                const result = postReducer(state, action)

                expect(result.posts.isLoading).toBe(true)
                expect(result.posts.error).toBeNull()
            })

            it('should set posts on fulfilled', () => {
                const posts = [createMockPost(), createMockPost({ id: 2 })]
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, isLoading: true },
                }
                const action = { type: fetchPosts.fulfilled.type, payload: posts }
                const result = postReducer(state, action)

                expect(result.posts.posts).toEqual(posts)
                expect(result.posts.isLoading).toBe(false)
                expect(result.posts.error).toBeNull()
            })
        })

        describe('Negative Cases', () => {
            it('should set error on rejected', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, isLoading: true },
                }
                const action = { type: fetchPosts.rejected.type, payload: 'Fetch failed' }
                const result = postReducer(state, action)

                expect(result.posts.isLoading).toBe(false)
                expect(result.posts.error).toBe('Fetch failed')
            })
        })
    })

    describe('fetchSinglePost async thunk', () => {
        describe('Positive Cases', () => {
            it('should set loading true on pending', () => {
                const state = createInitialState()
                const action = { type: fetchSinglePost.pending.type }
                const result = postReducer(state, action)

                expect(result.posts.isLoading).toBe(true)
                expect(result.posts.error).toBeNull()
            })

            it('should set selectedPost on fulfilled', () => {
                const post = createMockPost()
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, isLoading: true },
                }
                const action = { type: fetchSinglePost.fulfilled.type, payload: post }
                const result = postReducer(state, action)

                expect(result.posts.selectedPost).toEqual(post)
                expect(result.posts.isLoading).toBe(false)
            })
        })

        describe('Negative Cases', () => {
            it('should set error on rejected', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, isLoading: true },
                }
                const action = { type: fetchSinglePost.rejected.type, payload: 'Post not found' }
                const result = postReducer(state, action)

                expect(result.posts.isLoading).toBe(false)
                expect(result.posts.error).toBe('Post not found')
            })
        })
    })

    describe('fetchComments async thunk', () => {
        describe('Positive Cases', () => {
            it('should set comments loading true on pending', () => {
                const state = createInitialState()
                const action = { type: fetchComments.pending.type }
                const result = postReducer(state, action)

                expect(result.comments.isLoading).toBe(true)
                expect(result.comments.error).toBeNull()
            })

            it('should set comments on fulfilled', () => {
                const comments = [createMockComment(), createMockComment({ id: 2 })]
                const state: PostPageState = {
                    ...createInitialState(),
                    comments: { ...createInitialState().comments, isLoading: true },
                }
                const action = {
                    type: fetchComments.fulfilled.type,
                    payload: comments,
                }
                const result = postReducer(state, action)

                expect(result.comments.comments).toEqual(comments)
                expect(result.comments.isLoading).toBe(false)
            })
        })

        describe('Negative Cases', () => {
            it('should set error on rejected', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    comments: { ...createInitialState().comments, isLoading: true },
                }
                const action = { type: fetchComments.rejected.type, payload: 'Comments fetch failed' }
                const result = postReducer(state, action)

                expect(result.comments.isLoading).toBe(false)
                expect(result.comments.error).toBe('Comments fetch failed')
            })
        })
    })

    describe('searchPostByIdThunk async thunk', () => {
        describe('Positive Cases', () => {
            it('should set loading and clear selectedPost on pending', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, selectedPost: createMockPost() },
                }
                const action = { type: searchPostByIdThunk.pending.type }
                const result = postReducer(state, action)

                expect(result.posts.isLoading).toBe(true)
                expect(result.posts.selectedPost).toBeNull()
                expect(result.posts.error).toBeNull()
            })

            it('should set selectedPost and searchedPostId on fulfilled', () => {
                const post = createMockPost({ id: 5 })
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, isLoading: true },
                }
                const action = { type: searchPostByIdThunk.fulfilled.type, payload: post }
                const result = postReducer(state, action)

                expect(result.posts.selectedPost).toEqual(post)
                expect(result.searchedPostId).toBe(5)
                expect(result.posts.isLoading).toBe(false)
            })
        })

        describe('Negative Cases', () => {
            it('should set error and clear searchedPostId on rejected', () => {
                const state: PostPageState = {
                    ...createInitialState(),
                    posts: { ...createInitialState().posts, isLoading: true },
                    searchedPostId: 5,
                }
                const action = { type: searchPostByIdThunk.rejected.type, payload: 'Not found' }
                const result = postReducer(state, action)

                expect(result.posts.isLoading).toBe(false)
                expect(result.posts.error).toBe('Not found')
                expect(result.searchedPostId).toBeNull()
            })
        })
    })
})

describe('Post Selectors', () => {
    const createRootState = (postState: PostPageState) => ({
        posts: postState,
    })

    describe('selectAllPosts', () => {
        it('should return all posts', () => {
            const state = createRootState(createStateWithPosts())
            const posts = selectAllPosts(state)

            expect(posts).toHaveLength(3)
        })

        it('should return empty for no posts', () => {
            const state = createRootState(createInitialState())
            const posts = selectAllPosts(state)

            expect(posts).toHaveLength(0)
        })
    })

    describe('selectSelectedPost', () => {
        it('should return selected post', () => {
            const postState: PostPageState = {
                ...createInitialState(),
                posts: { ...createInitialState().posts, selectedPost: createMockPost() },
            }
            const state = createRootState(postState)
            const post = selectSelectedPost(state)

            expect(post).not.toBeNull()
        })

        it('should return null when no post selected', () => {
            const state = createRootState(createInitialState())
            const post = selectSelectedPost(state)

            expect(post).toBeNull()
        })
    })

    describe('selectPostsLoading', () => {
        it('should return loading state', () => {
            const postState: PostPageState = {
                ...createInitialState(),
                posts: { ...createInitialState().posts, isLoading: true },
            }
            const state = createRootState(postState)
            const loading = selectPostsLoading(state)

            expect(loading).toBe(true)
        })
    })

    describe('selectPostsError', () => {
        it('should return error state', () => {
            const postState: PostPageState = {
                ...createInitialState(),
                posts: { ...createInitialState().posts, error: 'Test error' },
            }
            const state = createRootState(postState)
            const error = selectPostsError(state)

            expect(error).toBe('Test error')
        })
    })

    describe('selectHasPosts', () => {
        it('should return true when posts exist', () => {
            const state = createRootState(createStateWithPosts())
            const hasPosts = selectHasPosts(state)

            expect(hasPosts).toBe(true)
        })

        it('should return false when no posts', () => {
            const state = createRootState(createInitialState())
            const hasPosts = selectHasPosts(state)

            expect(hasPosts).toBe(false)
        })
    })

    describe('selectComments', () => {
        it('should return comments', () => {
            const state = createRootState(createStateWithComments())
            const comments = selectComments(state)

            expect(comments).toHaveLength(2)
        })
    })

    describe('selectCommentsLoading', () => {
        it('should return comments loading state', () => {
            const postState: PostPageState = {
                ...createInitialState(),
                comments: { ...createInitialState().comments, isLoading: true },
            }
            const state = createRootState(postState)
            const loading = selectCommentsLoading(state)

            expect(loading).toBe(true)
        })
    })

    describe('selectCommentsError', () => {
        it('should return comments error', () => {
            const postState: PostPageState = {
                ...createInitialState(),
                comments: { ...createInitialState().comments, error: 'Comments error' },
            }
            const state = createRootState(postState)
            const error = selectCommentsError(state)

            expect(error).toBe('Comments error')
        })
    })

    describe('selectHasComments', () => {
        it('should return true when comments exist', () => {
            const state = createRootState(createStateWithComments())
            const hasComments = selectHasComments(state)

            expect(hasComments).toBe(true)
        })

        it('should return false when no comments', () => {
            const state = createRootState(createInitialState())
            const hasComments = selectHasComments(state)

            expect(hasComments).toBe(false)
        })
    })

    describe('selectSearchQuery', () => {
        it('should return search query', () => {
            const postState: PostPageState = {
                ...createInitialState(),
                searchQuery: 'test search',
            }
            const state = createRootState(postState)
            const query = selectSearchQuery(state)

            expect(query).toBe('test search')
        })
    })

    describe('selectSearchedPostId', () => {
        it('should return searched post id', () => {
            const postState: PostPageState = {
                ...createInitialState(),
                searchedPostId: 42,
            }
            const state = createRootState(postState)
            const id = selectSearchedPostId(state)

            expect(id).toBe(42)
        })

        it('should return null when not searched', () => {
            const state = createRootState(createInitialState())
            const id = selectSearchedPostId(state)

            expect(id).toBeNull()
        })
    })

    describe('selectPostById', () => {
        it('should find post by id', () => {
            const state = createRootState(createStateWithPosts())
            const post = selectPostById(state, 2)

            expect(post).not.toBeNull()
            expect(post?.id).toBe(2)
        })

        it('should return null for non-existent id', () => {
            const state = createRootState(createStateWithPosts())
            const post = selectPostById(state, 999)

            expect(post).toBeNull()
        })
    })

    describe('selectFilteredPosts', () => {
        it('should filter posts by query', () => {
            const state = createRootState(createStateWithPosts())
            const filtered = selectFilteredPosts(state, 'Post')

            expect(filtered).toHaveLength(2)
        })

        it('should return all posts for empty query', () => {
            const state = createRootState(createStateWithPosts())
            const filtered = selectFilteredPosts(state, '')

            expect(filtered).toHaveLength(3)
        })

        it('should be case insensitive', () => {
            const state = createRootState(createStateWithPosts())
            const filtered = selectFilteredPosts(state, 'POST')

            expect(filtered).toHaveLength(2)
        })

        it('should search in body too', () => {
            const state = createRootState(createStateWithPosts())
            const filtered = selectFilteredPosts(state, 'Different')

            expect(filtered).toHaveLength(1)
            expect(filtered[0].body).toContain('Different')
        })

        it('should return empty for no matches', () => {
            const state = createRootState(createStateWithPosts())
            const filtered = selectFilteredPosts(state, 'xyz123')

            expect(filtered).toHaveLength(0)
        })
    })
})