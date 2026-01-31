import { describe, it, expect } from 'vitest'
import { createInitialPostState, createEmptyPost, isValidPost, isValidPostArray, getPostPreview, filterPostsByUserId, findPostById, sortPostsById, searchPostsByTitle, searchPostsById, type Post } from '@/src/model/post-model'

const createMockPost = (overrides: Partial<Post> = {}): Post => {
    return {
        userId: 1,
        id: 1,
        title: 'Test Post Title',
        body: 'Test post body content here',
        ...overrides,
    }
}

const createMockPosts = (): Post[] => {
    return [
        createMockPost({ userId: 1, id: 1, title: 'First Article', body: 'Body 1' }),
        createMockPost({ userId: 1, id: 2, title: 'Second Article', body: 'Body 2' }),
        createMockPost({ userId: 2, id: 3, title: 'Third Article', body: 'Body 3' }),
        createMockPost({ userId: 2, id: 4, title: 'Another Title', body: 'Body 4' }),
    ]
}

describe('createInitialPostState', () => {
    describe('Positive Cases', () => {
        it('should return state with empty posts array', () => {
            const state = createInitialPostState()

            expect(state.posts).toEqual([])
        })

        it('should return state with selectedPost null', () => {
            const state = createInitialPostState()

            expect(state.selectedPost).toBeNull()
        })

        it('should return state with isLoading false', () => {
            const state = createInitialPostState()

            expect(state.isLoading).toBe(false)
        })

        it('should return state with error null', () => {
            const state = createInitialPostState()

            expect(state.error).toBeNull()
        })
    })
})

describe('createEmptyPost', () => {
    describe('Positive Cases', () => {
        it('should return post with userId 0', () => {
            const post = createEmptyPost()

            expect(post.userId).toBe(0)
        })

        it('should return post with id 0', () => {
            const post = createEmptyPost()

            expect(post.id).toBe(0)
        })

        it('should return post with empty title', () => {
            const post = createEmptyPost()

            expect(post.title).toBe('')
        })

        it('should return post with empty body', () => {
            const post = createEmptyPost()

            expect(post.body).toBe('')
        })
    })
})

describe('isValidPost', () => {
    describe('Positive Cases', () => {
        it('should return true for valid post', () => {
            const post = createMockPost()

            expect(isValidPost(post)).toBe(true)
        })

        it('should return true for post with all required fields', () => {
            const post = {
                userId: 5,
                id: 10,
                title: 'Valid Title',
                body: 'Valid body content',
            }

            expect(isValidPost(post)).toBe(true)
        })

        it('should return true for post with empty strings', () => {
            const post = {
                userId: 1,
                id: 1,
                title: '',
                body: '',
            }

            expect(isValidPost(post)).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false for null', () => {
            expect(isValidPost(null)).toBe(false)
        })

        it('should return false for undefined', () => {
            expect(isValidPost(undefined)).toBe(false)
        })

        it('should return false for string', () => {
            expect(isValidPost('not a post')).toBe(false)
        })

        it('should return false for number', () => {
            expect(isValidPost(123)).toBe(false)
        })

        it('should return false for array', () => {
            expect(isValidPost([])).toBe(false)
        })

        it('should return false for missing userId', () => {
            const invalid = {
                id: 1,
                title: 'Test',
                body: 'Body',
            }

            expect(isValidPost(invalid)).toBe(false)
        })

        it('should return false for missing id', () => {
            const invalid = {
                userId: 1,
                title: 'Test',
                body: 'Body',
            }

            expect(isValidPost(invalid)).toBe(false)
        })

        it('should return false for missing title', () => {
            const invalid = {
                userId: 1,
                id: 1,
                body: 'Body',
            }

            expect(isValidPost(invalid)).toBe(false)
        })

        it('should return false for missing body', () => {
            const invalid = {
                userId: 1,
                id: 1,
                title: 'Test',
            }

            expect(isValidPost(invalid)).toBe(false)
        })

        it('should return false for wrong type userId', () => {
            const invalid = {
                userId: '1',
                id: 1,
                title: 'Test',
                body: 'Body',
            }

            expect(isValidPost(invalid)).toBe(false)
        })

        it('should return false for wrong type id', () => {
            const invalid = {
                userId: 1,
                id: '1',
                title: 'Test',
                body: 'Body',
            }

            expect(isValidPost(invalid)).toBe(false)
        })

        it('should return false for wrong type title', () => {
            const invalid = {
                userId: 1,
                id: 1,
                title: 123,
                body: 'Body',
            }

            expect(isValidPost(invalid)).toBe(false)
        })

        it('should return false for wrong type body', () => {
            const invalid = {
                userId: 1,
                id: 1,
                title: 'Test',
                body: 123,
            }

            expect(isValidPost(invalid)).toBe(false)
        })
    })
})

describe('isValidPostArray', () => {
    describe('Positive Cases', () => {
        it('should return true for empty array', () => {
            expect(isValidPostArray([])).toBe(true)
        })

        it('should return true for array with valid posts', () => {
            const posts = createMockPosts()

            expect(isValidPostArray(posts)).toBe(true)
        })

        it('should return true for single item array', () => {
            const posts = [createMockPost()]

            expect(isValidPostArray(posts)).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false for null', () => {
            expect(isValidPostArray(null)).toBe(false)
        })

        it('should return false for undefined', () => {
            expect(isValidPostArray(undefined)).toBe(false)
        })

        it('should return false for object', () => {
            expect(isValidPostArray({})).toBe(false)
        })

        it('should return false for string', () => {
            expect(isValidPostArray('array')).toBe(false)
        })

        it('should return false for array with invalid item', () => {
            const invalid = [
                createMockPost(),
                { invalid: true },
            ]

            expect(isValidPostArray(invalid)).toBe(false)
        })

        it('should return false for array with null item', () => {
            const invalid = [createMockPost(), null]

            expect(isValidPostArray(invalid)).toBe(false)
        })
    })
})

describe('getPostPreview', () => {
    describe('Positive Cases', () => {
        it('should return full body if shorter than maxLength', () => {
            const post = createMockPost({ body: 'Short body' })
            const preview = getPostPreview(post, 100)

            expect(preview).toBe('Short body')
        })

        it('should truncate and add ellipsis for long body', () => {
            const longBody = 'This is a very long body that exceeds the maximum length allowed'
            const post = createMockPost({ body: longBody })
            const preview = getPostPreview(post, 20)

            expect(preview).toBe('This is a very long ...')
            expect(preview.length).toBe(23)
        })

        it('should use default maxLength of 100', () => {
            const longBody = 'a'.repeat(150)
            const post = createMockPost({ body: longBody })
            const preview = getPostPreview(post)

            expect(preview.length).toBe(103)
            expect(preview.endsWith('...')).toBe(true)
        })

        it('should return exact body if length equals maxLength', () => {
            const body = 'a'.repeat(50)
            const post = createMockPost({ body })
            const preview = getPostPreview(post, 50)

            expect(preview).toBe(body)
        })
    })

    describe('Negative Cases', () => {
        it('should handle empty body', () => {
            const post = createMockPost({ body: '' })
            const preview = getPostPreview(post, 100)

            expect(preview).toBe('')
        })

        it('should handle very small maxLength', () => {
            const post = createMockPost({ body: 'Hello World' })
            const preview = getPostPreview(post, 5)

            expect(preview).toBe('Hello...')
        })
    })
})

describe('filterPostsByUserId', () => {
    describe('Positive Cases', () => {
        it('should filter posts by userId', () => {
            const posts = createMockPosts()
            const filtered = filterPostsByUserId(posts, 1)

            expect(filtered).toHaveLength(2)
            expect(filtered.every(p => p.userId === 1)).toBe(true)
        })

        it('should return all posts for user with multiple posts', () => {
            const posts = createMockPosts()
            const filtered = filterPostsByUserId(posts, 2)

            expect(filtered).toHaveLength(2)
        })

        it('should return single post for user with one post', () => {
            const posts = [
                createMockPost({ userId: 1 }),
                createMockPost({ userId: 2 }),
                createMockPost({ userId: 3 }),
            ]
            const filtered = filterPostsByUserId(posts, 3)

            expect(filtered).toHaveLength(1)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty for non-existent userId', () => {
            const posts = createMockPosts()
            const filtered = filterPostsByUserId(posts, 999)

            expect(filtered).toHaveLength(0)
        })

        it('should return empty for empty posts array', () => {
            const filtered = filterPostsByUserId([], 1)

            expect(filtered).toHaveLength(0)
        })
    })
})

describe('findPostById', () => {
    describe('Positive Cases', () => {
        it('should find post by id', () => {
            const posts = createMockPosts()
            const found = findPostById(posts, 2)

            expect(found).not.toBeNull()
            expect(found?.id).toBe(2)
        })

        it('should return correct post data', () => {
            const posts = createMockPosts()
            const found = findPostById(posts, 1)

            expect(found?.title).toBe('First Article')
            expect(found?.body).toBe('Body 1')
        })

        it('should find first matching post', () => {
            const posts = createMockPosts()
            const found = findPostById(posts, 3)

            expect(found?.title).toBe('Third Article')
        })
    })

    describe('Negative Cases', () => {
        it('should return null for non-existent id', () => {
            const posts = createMockPosts()
            const found = findPostById(posts, 999)

            expect(found).toBeNull()
        })

        it('should return null for empty array', () => {
            const found = findPostById([], 1)

            expect(found).toBeNull()
        })

        it('should return null for negative id', () => {
            const posts = createMockPosts()
            const found = findPostById(posts, -1)

            expect(found).toBeNull()
        })
    })
})

describe('sortPostsById', () => {
    describe('Positive Cases', () => {
        it('should sort ascending by default', () => {
            const posts = [
                createMockPost({ id: 3 }),
                createMockPost({ id: 1 }),
                createMockPost({ id: 2 }),
            ]
            const sorted = sortPostsById(posts)

            expect(sorted[0].id).toBe(1)
            expect(sorted[1].id).toBe(2)
            expect(sorted[2].id).toBe(3)
        })

        it('should sort descending when specified', () => {
            const posts = [
                createMockPost({ id: 1 }),
                createMockPost({ id: 3 }),
                createMockPost({ id: 2 }),
            ]
            const sorted = sortPostsById(posts, false)

            expect(sorted[0].id).toBe(3)
            expect(sorted[1].id).toBe(2)
            expect(sorted[2].id).toBe(1)
        })

        it('should not mutate original array', () => {
            const posts = createMockPosts()
            const originalFirst = posts[0]
            sortPostsById(posts)

            expect(posts[0]).toBe(originalFirst)
        })
    })

    describe('Negative Cases', () => {
        it('should handle empty array', () => {
            const sorted = sortPostsById([])

            expect(sorted).toHaveLength(0)
        })

        it('should handle single item array', () => {
            const single = [createMockPost()]
            const sorted = sortPostsById(single)

            expect(sorted).toHaveLength(1)
        })
    })
})

describe('searchPostsByTitle', () => {
    describe('Positive Cases', () => {
        it('should find posts by title match', () => {
            const posts = createMockPosts()
            const results = searchPostsByTitle(posts, 'First Article')

            expect(results).toHaveLength(1)
            expect(results[0].title).toBe('First Article')
        })

        it('should be case insensitive', () => {
            const posts = createMockPosts()
            const results = searchPostsByTitle(posts, 'ARTICLE')

            expect(results).toHaveLength(3)
        })

        it('should find partial matches', () => {
            const posts = createMockPosts()
            const results = searchPostsByTitle(posts, 'ticle')

            expect(results).toHaveLength(3)
        })

        it('should return all posts for empty query', () => {
            const posts = createMockPosts()
            const results = searchPostsByTitle(posts, '')

            expect(results).toHaveLength(4)
        })

        it('should return all posts for whitespace query', () => {
            const posts = createMockPosts()
            const results = searchPostsByTitle(posts, '   ')

            expect(results).toHaveLength(4)
        })

        it('should find single unique match', () => {
            const posts = createMockPosts()
            const results = searchPostsByTitle(posts, 'Another')

            expect(results).toHaveLength(1)
            expect(results[0].title).toBe('Another Title')
        })
    })

    describe('Negative Cases', () => {
        it('should return empty for no matches', () => {
            const posts = createMockPosts()
            const results = searchPostsByTitle(posts, 'xyz123')

            expect(results).toHaveLength(0)
        })

        it('should return empty for empty array', () => {
            const results = searchPostsByTitle([], 'Article')

            expect(results).toHaveLength(0)
        })
    })
})

describe('searchPostsById', () => {
    describe('Positive Cases', () => {
        it('should find posts by id', () => {
            const posts = createMockPosts()
            const results = searchPostsById(posts, 2)

            expect(results).toHaveLength(1)
            expect(results[0].id).toBe(2)
        })

        it('should return array with single post', () => {
            const posts = createMockPosts()
            const results = searchPostsById(posts, 1)

            expect(results).toHaveLength(1)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty for non-existent id', () => {
            const posts = createMockPosts()
            const results = searchPostsById(posts, 999)

            expect(results).toHaveLength(0)
        })

        it('should return empty for empty array', () => {
            const results = searchPostsById([], 1)

            expect(results).toHaveLength(0)
        })

        it('should return empty for negative id', () => {
            const posts = createMockPosts()
            const results = searchPostsById(posts, -1)

            expect(results).toHaveLength(0)
        })
    })
})