import { describe, it, expect } from 'vitest'
import { createInitialCommentState, createEmptyComment, isValidComment, isValidCommentArray, filterCommentsByPostId, findCommentById, sortCommentsById, getCommentCount, getCommentPreview, searchCommentsByEmail, getUniqueEmailsFromComments, type Comment } from '@/src/model/comment-model'

const createMockComment = (overrides: Partial<Comment> = {}): Comment => {
    return {
        postId: 1,
        id: 1,
        name: 'Test Comment Name',
        email: 'test@example.com',
        body: 'Test comment body content here',
        ...overrides,
    }
}

const createMockComments = (): Comment[] => {
    return [
        createMockComment({ postId: 1, id: 1, email: 'user1@test.com' }),
        createMockComment({ postId: 1, id: 2, email: 'user2@test.com' }),
        createMockComment({ postId: 2, id: 3, email: 'user1@test.com' }),
        createMockComment({ postId: 2, id: 4, email: 'user3@test.com' }),
    ]
}

describe('createInitialCommentState', () => {
    describe('Positive Cases', () => {
        it('should return state with empty comments array', () => {
            const state = createInitialCommentState()

            expect(state.comments).toEqual([])
        })

        it('should return state with isLoading false', () => {
            const state = createInitialCommentState()

            expect(state.isLoading).toBe(false)
        })

        it('should return state with error null', () => {
            const state = createInitialCommentState()

            expect(state.error).toBeNull()
        })
    })
})

describe('createEmptyComment', () => {
    describe('Positive Cases', () => {
        it('should return comment with postId 0', () => {
            const comment = createEmptyComment()

            expect(comment.postId).toBe(0)
        })

        it('should return comment with id 0', () => {
            const comment = createEmptyComment()

            expect(comment.id).toBe(0)
        })

        it('should return comment with empty name', () => {
            const comment = createEmptyComment()

            expect(comment.name).toBe('')
        })

        it('should return comment with empty email', () => {
            const comment = createEmptyComment()

            expect(comment.email).toBe('')
        })

        it('should return comment with empty body', () => {
            const comment = createEmptyComment()

            expect(comment.body).toBe('')
        })
    })
})

describe('isValidComment', () => {
    describe('Positive Cases', () => {
        it('should return true for valid comment', () => {
            const comment = createMockComment()

            expect(isValidComment(comment)).toBe(true)
        })

        it('should return true for comment with all required fields', () => {
            const comment = {
                postId: 5,
                id: 10,
                name: 'Valid Name',
                email: 'valid@email.com',
                body: 'Valid body content',
            }

            expect(isValidComment(comment)).toBe(true)
        })

        it('should return true for comment with empty strings', () => {
            const comment = {
                postId: 1,
                id: 1,
                name: '',
                email: '',
                body: '',
            }

            expect(isValidComment(comment)).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false for null', () => {
            expect(isValidComment(null)).toBe(false)
        })

        it('should return false for undefined', () => {
            expect(isValidComment(undefined)).toBe(false)
        })

        it('should return false for string', () => {
            expect(isValidComment('not a comment')).toBe(false)
        })

        it('should return false for number', () => {
            expect(isValidComment(123)).toBe(false)
        })

        it('should return false for array', () => {
            expect(isValidComment([])).toBe(false)
        })

        it('should return false for missing postId', () => {
            const invalid = {
                id: 1,
                name: 'Name',
                email: 'email@test.com',
                body: 'Body',
            }

            expect(isValidComment(invalid)).toBe(false)
        })

        it('should return false for missing id', () => {
            const invalid = {
                postId: 1,
                name: 'Name',
                email: 'email@test.com',
                body: 'Body',
            }

            expect(isValidComment(invalid)).toBe(false)
        })

        it('should return false for missing name', () => {
            const invalid = {
                postId: 1,
                id: 1,
                email: 'email@test.com',
                body: 'Body',
            }

            expect(isValidComment(invalid)).toBe(false)
        })

        it('should return false for missing email', () => {
            const invalid = {
                postId: 1,
                id: 1,
                name: 'Name',
                body: 'Body',
            }

            expect(isValidComment(invalid)).toBe(false)
        })

        it('should return false for missing body', () => {
            const invalid = {
                postId: 1,
                id: 1,
                name: 'Name',
                email: 'email@test.com',
            }

            expect(isValidComment(invalid)).toBe(false)
        })

        it('should return false for wrong type postId', () => {
            const invalid = {
                postId: '1',
                id: 1,
                name: 'Name',
                email: 'email@test.com',
                body: 'Body',
            }

            expect(isValidComment(invalid)).toBe(false)
        })

        it('should return false for wrong type name', () => {
            const invalid = {
                postId: 1,
                id: 1,
                name: 123,
                email: 'email@test.com',
                body: 'Body',
            }

            expect(isValidComment(invalid)).toBe(false)
        })
    })
})

describe('isValidCommentArray', () => {
    describe('Positive Cases', () => {
        it('should return true for empty array', () => {
            expect(isValidCommentArray([])).toBe(true)
        })

        it('should return true for array with valid comments', () => {
            const comments = createMockComments()

            expect(isValidCommentArray(comments)).toBe(true)
        })

        it('should return true for single item array', () => {
            const comments = [createMockComment()]

            expect(isValidCommentArray(comments)).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false for null', () => {
            expect(isValidCommentArray(null)).toBe(false)
        })

        it('should return false for undefined', () => {
            expect(isValidCommentArray(undefined)).toBe(false)
        })

        it('should return false for object', () => {
            expect(isValidCommentArray({})).toBe(false)
        })

        it('should return false for array with invalid item', () => {
            const invalid = [
                createMockComment(),
                { invalid: true },
            ]

            expect(isValidCommentArray(invalid)).toBe(false)
        })

        it('should return false for array with null item', () => {
            const invalid = [createMockComment(), null]

            expect(isValidCommentArray(invalid)).toBe(false)
        })
    })
})

describe('filterCommentsByPostId', () => {
    describe('Positive Cases', () => {
        it('should filter comments by postId', () => {
            const comments = createMockComments()
            const filtered = filterCommentsByPostId(comments, 1)

            expect(filtered).toHaveLength(2)
            expect(filtered.every(c => c.postId === 1)).toBe(true)
        })

        it('should return all comments for post with multiple comments', () => {
            const comments = createMockComments()
            const filtered = filterCommentsByPostId(comments, 2)

            expect(filtered).toHaveLength(2)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty for non-existent postId', () => {
            const comments = createMockComments()
            const filtered = filterCommentsByPostId(comments, 999)

            expect(filtered).toHaveLength(0)
        })

        it('should return empty for empty comments array', () => {
            const filtered = filterCommentsByPostId([], 1)

            expect(filtered).toHaveLength(0)
        })
    })
})

describe('findCommentById', () => {
    describe('Positive Cases', () => {
        it('should find comment by id', () => {
            const comments = createMockComments()
            const found = findCommentById(comments, 2)

            expect(found).not.toBeNull()
            expect(found?.id).toBe(2)
        })

        it('should return correct comment data', () => {
            const comments = createMockComments()
            const found = findCommentById(comments, 1)

            expect(found?.email).toBe('user1@test.com')
        })
    })

    describe('Negative Cases', () => {
        it('should return null for non-existent id', () => {
            const comments = createMockComments()
            const found = findCommentById(comments, 999)

            expect(found).toBeNull()
        })

        it('should return null for empty array', () => {
            const found = findCommentById([], 1)

            expect(found).toBeNull()
        })

        it('should return null for negative id', () => {
            const comments = createMockComments()
            const found = findCommentById(comments, -1)

            expect(found).toBeNull()
        })
    })
})

describe('sortCommentsById', () => {
    describe('Positive Cases', () => {
        it('should sort ascending by default', () => {
            const comments = [
                createMockComment({ id: 3 }),
                createMockComment({ id: 1 }),
                createMockComment({ id: 2 }),
            ]
            const sorted = sortCommentsById(comments)

            expect(sorted[0].id).toBe(1)
            expect(sorted[1].id).toBe(2)
            expect(sorted[2].id).toBe(3)
        })

        it('should sort descending when specified', () => {
            const comments = [
                createMockComment({ id: 1 }),
                createMockComment({ id: 3 }),
                createMockComment({ id: 2 }),
            ]
            const sorted = sortCommentsById(comments, false)

            expect(sorted[0].id).toBe(3)
            expect(sorted[1].id).toBe(2)
            expect(sorted[2].id).toBe(1)
        })

        it('should not mutate original array', () => {
            const comments = createMockComments()
            const originalFirst = comments[0]
            sortCommentsById(comments)

            expect(comments[0]).toBe(originalFirst)
        })
    })

    describe('Negative Cases', () => {
        it('should handle empty array', () => {
            const sorted = sortCommentsById([])

            expect(sorted).toHaveLength(0)
        })

        it('should handle single item array', () => {
            const single = [createMockComment()]
            const sorted = sortCommentsById(single)

            expect(sorted).toHaveLength(1)
        })
    })
})

describe('getCommentCount', () => {
    describe('Positive Cases', () => {
        it('should count comments for postId', () => {
            const comments = createMockComments()
            const count = getCommentCount(comments, 1)

            expect(count).toBe(2)
        })

        it('should count all comments for post', () => {
            const comments = createMockComments()
            const count = getCommentCount(comments, 2)

            expect(count).toBe(2)
        })
    })

    describe('Negative Cases', () => {
        it('should return 0 for non-existent postId', () => {
            const comments = createMockComments()
            const count = getCommentCount(comments, 999)

            expect(count).toBe(0)
        })

        it('should return 0 for empty array', () => {
            const count = getCommentCount([], 1)

            expect(count).toBe(0)
        })
    })
})

describe('getCommentPreview', () => {
    describe('Positive Cases', () => {
        it('should return full body if shorter than maxLength', () => {
            const comment = createMockComment({ body: 'Short body' })
            const preview = getCommentPreview(comment, 100)

            expect(preview).toBe('Short body')
        })

        it('should truncate and add ellipsis for long body', () => {
            const longBody = 'This is a very long comment body that exceeds the maximum length'
            const comment = createMockComment({ body: longBody })
            const preview = getCommentPreview(comment, 20)

            expect(preview).toBe('This is a very long ...')
        })

        it('should use default maxLength of 50', () => {
            const longBody = 'a'.repeat(100)
            const comment = createMockComment({ body: longBody })
            const preview = getCommentPreview(comment)

            expect(preview.length).toBe(53)
            expect(preview.endsWith('...')).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should handle empty body', () => {
            const comment = createMockComment({ body: '' })
            const preview = getCommentPreview(comment, 50)

            expect(preview).toBe('')
        })
    })
})

describe('searchCommentsByEmail', () => {
    describe('Positive Cases', () => {
        it('should find comments by email match', () => {
            const comments = createMockComments()
            const results = searchCommentsByEmail(comments, 'user1@test.com')

            expect(results).toHaveLength(2)
        })

        it('should be case insensitive', () => {
            const comments = createMockComments()
            const results = searchCommentsByEmail(comments, 'USER1@TEST.COM')

            expect(results).toHaveLength(2)
        })

        it('should find partial matches', () => {
            const comments = createMockComments()
            const results = searchCommentsByEmail(comments, '@test.com')

            expect(results).toHaveLength(4)
        })

        it('should return all comments for empty query', () => {
            const comments = createMockComments()
            const results = searchCommentsByEmail(comments, '')

            expect(results).toHaveLength(4)
        })

        it('should return all comments for whitespace query', () => {
            const comments = createMockComments()
            const results = searchCommentsByEmail(comments, '   ')

            expect(results).toHaveLength(4)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty for no matches', () => {
            const comments = createMockComments()
            const results = searchCommentsByEmail(comments, 'nonexistent@email.com')

            expect(results).toHaveLength(0)
        })

        it('should return empty for empty array', () => {
            const results = searchCommentsByEmail([], 'user@test.com')

            expect(results).toHaveLength(0)
        })
    })
})

describe('getUniqueEmailsFromComments', () => {
    describe('Positive Cases', () => {
        it('should return unique emails', () => {
            const comments = createMockComments()
            const emails = getUniqueEmailsFromComments(comments)

            expect(emails).toHaveLength(3)
            expect(emails).toContain('user1@test.com')
            expect(emails).toContain('user2@test.com')
            expect(emails).toContain('user3@test.com')
        })

        it('should return single email when all same', () => {
            const comments = [
                createMockComment({ email: 'same@test.com' }),
                createMockComment({ email: 'same@test.com' }),
            ]
            const emails = getUniqueEmailsFromComments(comments)

            expect(emails).toHaveLength(1)
            expect(emails[0]).toBe('same@test.com')
        })
    })

    describe('Negative Cases', () => {
        it('should return empty for empty array', () => {
            const emails = getUniqueEmailsFromComments([])

            expect(emails).toHaveLength(0)
        })
    })
})