import { describe, it, expect } from 'vitest'
import { createTodo, createInitialTodoState, generateTodoId, isValidTodo, isValidTodoArray, toggleTodoCompleted, updateTodoTitle, filterTodos, findTodoById, removeTodoById, sortTodosByCreatedAt, sortTodosByCompleted, getCompletedCount, getPendingCount, getTodoStats, searchTodosByTitle, isTodoTitleValid, isDuplicateTodoTitle, type Todo } from '@/src/model/todo-model'
import { FilterType } from '@/src/constant/filter'

const createMockTodo = (overrides: Partial<Todo> = {}): Todo => {
    return {
        id: 'todo_123_abc',
        title: 'Test Todo',
        completed: false,
        createdAt: 1000,
        updatedAt: 1000,
        ...overrides,
    }
}

const createMockTodos = (): Todo[] => {
    return [
        createMockTodo({ id: '1', title: 'Task 1', completed: false, createdAt: 1000 }),
        createMockTodo({ id: '2', title: 'Task 2', completed: true, createdAt: 2000 }),
        createMockTodo({ id: '3', title: 'Task 3', completed: false, createdAt: 3000 }),
        createMockTodo({ id: '4', title: 'Task 4', completed: true, createdAt: 4000 }),
    ]
}

describe('generateTodoId', () => {
    describe('Positive Cases', () => {
        it('should generate a string id', () => {
            const id = generateTodoId()

            expect(typeof id).toBe('string')
        })

        it('should generate id starting with "todo_"', () => {
            const id = generateTodoId()

            expect(id.startsWith('todo_')).toBe(true)
        })

        it('should generate unique ids on consecutive calls', () => {
            const id1 = generateTodoId()
            const id2 = generateTodoId()
            const id3 = generateTodoId()

            expect(id1).not.toBe(id2)
            expect(id2).not.toBe(id3)
            expect(id1).not.toBe(id3)
        })

        it('should generate id with minimum length', () => {
            const id = generateTodoId()

            expect(id.length).toBeGreaterThan(10)
        })
    })
})

describe('createTodo', () => {
    describe('Positive Cases', () => {
        it('should create todo with correct title', () => {
            const todo = createTodo('Buy groceries')

            expect(todo.title).toBe('Buy groceries')
        })

        it('should create todo with completed as false', () => {
            const todo = createTodo('New task')

            expect(todo.completed).toBe(false)
        })

        it('should create todo with id', () => {
            const todo = createTodo('Task')

            expect(todo.id).toBeTruthy()
            expect(todo.id.startsWith('todo_')).toBe(true)
        })

        it('should create todo with timestamps', () => {
            const before = Date.now()
            const todo = createTodo('Task')
            const after = Date.now()

            expect(todo.createdAt).toBeGreaterThanOrEqual(before)
            expect(todo.createdAt).toBeLessThanOrEqual(after)
            expect(todo.updatedAt).toBe(todo.createdAt)
        })

        it('should trim whitespace from title', () => {
            const todo = createTodo('  Trimmed title  ')

            expect(todo.title).toBe('Trimmed title')
        })
    })
})

describe('createInitialTodoState', () => {
    describe('Positive Cases', () => {
        it('should return state with empty todos array', () => {
            const state = createInitialTodoState()

            expect(state.todos).toEqual([])
        })

        it('should return state with ALL filter', () => {
            const state = createInitialTodoState()

            expect(state.filter).toBe(FilterType.ALL)
        })

        it('should return state with isLoading false', () => {
            const state = createInitialTodoState()

            expect(state.isLoading).toBe(false)
        })

        it('should return state with error null', () => {
            const state = createInitialTodoState()

            expect(state.error).toBeNull()
        })
    })
})

describe('isValidTodo', () => {
    describe('Positive Cases', () => {
        it('should return true for valid todo', () => {
            const todo = createMockTodo()

            expect(isValidTodo(todo)).toBe(true)
        })

        it('should return true for todo with all required fields', () => {
            const todo = {
                id: 'test_id',
                title: 'Test',
                completed: true,
                createdAt: 123456,
                updatedAt: 123456,
            }

            expect(isValidTodo(todo)).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false for null', () => {
            expect(isValidTodo(null)).toBe(false)
        })

        it('should return false for undefined', () => {
            expect(isValidTodo(undefined)).toBe(false)
        })

        it('should return false for string', () => {
            expect(isValidTodo('not a todo')).toBe(false)
        })

        it('should return false for number', () => {
            expect(isValidTodo(123)).toBe(false)
        })

        it('should return false for missing id', () => {
            const invalid = {
                title: 'Test',
                completed: false,
                createdAt: 123,
                updatedAt: 123,
            }

            expect(isValidTodo(invalid)).toBe(false)
        })

        it('should return false for missing title', () => {
            const invalid = {
                id: 'test',
                completed: false,
                createdAt: 123,
                updatedAt: 123,
            }

            expect(isValidTodo(invalid)).toBe(false)
        })

        it('should return false for missing completed', () => {
            const invalid = {
                id: 'test',
                title: 'Test',
                createdAt: 123,
                updatedAt: 123,
            }

            expect(isValidTodo(invalid)).toBe(false)
        })

        it('should return false for wrong type id', () => {
            const invalid = {
                id: 123,
                title: 'Test',
                completed: false,
                createdAt: 123,
                updatedAt: 123,
            }

            expect(isValidTodo(invalid)).toBe(false)
        })

        it('should return false for wrong type completed', () => {
            const invalid = {
                id: 'test',
                title: 'Test',
                completed: 'yes',
                createdAt: 123,
                updatedAt: 123,
            }

            expect(isValidTodo(invalid)).toBe(false)
        })
    })
})

describe('isValidTodoArray', () => {
    describe('Positive Cases', () => {
        it('should return true for empty array', () => {
            expect(isValidTodoArray([])).toBe(true)
        })

        it('should return true for array with valid todos', () => {
            const todos = createMockTodos()

            expect(isValidTodoArray(todos)).toBe(true)
        })

        it('should return true for single item array', () => {
            const todos = [createMockTodo()]

            expect(isValidTodoArray(todos)).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false for null', () => {
            expect(isValidTodoArray(null)).toBe(false)
        })

        it('should return false for object', () => {
            expect(isValidTodoArray({})).toBe(false)
        })

        it('should return false for string', () => {
            expect(isValidTodoArray('array')).toBe(false)
        })

        it('should return false for array with invalid item', () => {
            const invalid = [
                createMockTodo(),
                { invalid: true },
            ]

            expect(isValidTodoArray(invalid)).toBe(false)
        })

        it('should return false for array with null item', () => {
            const invalid = [createMockTodo(), null]

            expect(isValidTodoArray(invalid)).toBe(false)
        })
    })
})

describe('toggleTodoCompleted', () => {
    describe('Positive Cases', () => {
        it('should toggle false to true', () => {
            const todo = createMockTodo({ completed: false })
            const toggled = toggleTodoCompleted(todo)

            expect(toggled.completed).toBe(true)
        })

        it('should toggle true to false', () => {
            const todo = createMockTodo({ completed: true })
            const toggled = toggleTodoCompleted(todo)

            expect(toggled.completed).toBe(false)
        })

        it('should update updatedAt timestamp', () => {
            const todo = createMockTodo({ updatedAt: 1000 })
            const before = Date.now()
            const toggled = toggleTodoCompleted(todo)

            expect(toggled.updatedAt).toBeGreaterThanOrEqual(before)
        })

        it('should not mutate original todo', () => {
            const todo = createMockTodo({ completed: false })
            const toggled = toggleTodoCompleted(todo)

            expect(todo.completed).toBe(false)
            expect(toggled).not.toBe(todo)
        })

        it('should preserve other properties', () => {
            const todo = createMockTodo({ id: 'test_id', title: 'Test Title' })
            const toggled = toggleTodoCompleted(todo)

            expect(toggled.id).toBe('test_id')
            expect(toggled.title).toBe('Test Title')
        })
    })
})

describe('updateTodoTitle', () => {
    describe('Positive Cases', () => {
        it('should update title', () => {
            const todo = createMockTodo({ title: 'Old Title' })
            const updated = updateTodoTitle(todo, 'New Title')

            expect(updated.title).toBe('New Title')
        })

        it('should trim whitespace from new title', () => {
            const todo = createMockTodo()
            const updated = updateTodoTitle(todo, '  Trimmed  ')

            expect(updated.title).toBe('Trimmed')
        })

        it('should update updatedAt timestamp', () => {
            const todo = createMockTodo({ updatedAt: 1000 })
            const before = Date.now()
            const updated = updateTodoTitle(todo, 'New')

            expect(updated.updatedAt).toBeGreaterThanOrEqual(before)
        })

        it('should not mutate original todo', () => {
            const todo = createMockTodo({ title: 'Original' })
            const updated = updateTodoTitle(todo, 'Updated')

            expect(todo.title).toBe('Original')
            expect(updated).not.toBe(todo)
        })
    })
})

describe('filterTodos', () => {
    describe('Positive Cases', () => {
        it('should return all todos for ALL filter', () => {
            const todos = createMockTodos()
            const filtered = filterTodos(todos, FilterType.ALL)

            expect(filtered).toHaveLength(4)
            expect(filtered).toEqual(todos)
        })

        it('should return only completed todos for COMPLETED filter', () => {
            const todos = createMockTodos()
            const filtered = filterTodos(todos, FilterType.COMPLETED)

            expect(filtered).toHaveLength(2)
            expect(filtered.every(t => t.completed)).toBe(true)
        })

        it('should return only pending todos for PENDING filter', () => {
            const todos = createMockTodos()
            const filtered = filterTodos(todos, FilterType.PENDING)

            expect(filtered).toHaveLength(2)
            expect(filtered.every(t => !t.completed)).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty array when filtering empty array', () => {
            const filtered = filterTodos([], FilterType.ALL)

            expect(filtered).toHaveLength(0)
        })

        it('should return empty when no completed todos exist', () => {
            const todos = [
                createMockTodo({ completed: false }),
                createMockTodo({ completed: false }),
            ]
            const filtered = filterTodos(todos, FilterType.COMPLETED)

            expect(filtered).toHaveLength(0)
        })

        it('should return empty when no pending todos exist', () => {
            const todos = [
                createMockTodo({ completed: true }),
                createMockTodo({ completed: true }),
            ]
            const filtered = filterTodos(todos, FilterType.PENDING)

            expect(filtered).toHaveLength(0)
        })
    })
})

describe('findTodoById', () => {
    describe('Positive Cases', () => {
        it('should find todo by id', () => {
            const todos = createMockTodos()
            const found = findTodoById(todos, '2')

            expect(found).not.toBeNull()
            expect(found?.id).toBe('2')
        })

        it('should return correct todo data', () => {
            const todos = createMockTodos()
            const found = findTodoById(todos, '1')

            expect(found?.title).toBe('Task 1')
            expect(found?.completed).toBe(false)
        })
    })

    describe('Negative Cases', () => {
        it('should return null for non-existent id', () => {
            const todos = createMockTodos()
            const found = findTodoById(todos, 'non-existent')

            expect(found).toBeNull()
        })

        it('should return null for empty array', () => {
            const found = findTodoById([], 'any-id')

            expect(found).toBeNull()
        })
    })
})

describe('removeTodoById', () => {
    describe('Positive Cases', () => {
        it('should remove todo by id', () => {
            const todos = createMockTodos()
            const result = removeTodoById(todos, '1')

            expect(result).toHaveLength(3)
            expect(result.find(t => t.id === '1')).toBeUndefined()
        })

        it('should keep other todos intact', () => {
            const todos = createMockTodos()
            const result = removeTodoById(todos, '2')

            expect(result.find(t => t.id === '1')).toBeDefined()
            expect(result.find(t => t.id === '3')).toBeDefined()
            expect(result.find(t => t.id === '4')).toBeDefined()
        })

        it('should not mutate original array', () => {
            const todos = createMockTodos()
            const originalLength = todos.length
            removeTodoById(todos, '1')

            expect(todos).toHaveLength(originalLength)
        })
    })

    describe('Negative Cases', () => {
        it('should return same array for non-existent id', () => {
            const todos = createMockTodos()
            const result = removeTodoById(todos, 'non-existent')

            expect(result).toHaveLength(4)
        })

        it('should return empty array when removing from empty array', () => {
            const result = removeTodoById([], 'any-id')

            expect(result).toHaveLength(0)
        })
    })
})

describe('sortTodosByCreatedAt', () => {
    describe('Positive Cases', () => {
        it('should sort descending by default (newest first)', () => {
            const todos = createMockTodos()
            const sorted = sortTodosByCreatedAt(todos)

            expect(sorted[0].createdAt).toBe(4000)
            expect(sorted[3].createdAt).toBe(1000)
        })

        it('should sort ascending when specified', () => {
            const todos = createMockTodos()
            const sorted = sortTodosByCreatedAt(todos, true)

            expect(sorted[0].createdAt).toBe(1000)
            expect(sorted[3].createdAt).toBe(4000)
        })

        it('should not mutate original array', () => {
            const todos = createMockTodos()
            const originalFirst = todos[0]
            sortTodosByCreatedAt(todos)

            expect(todos[0]).toBe(originalFirst)
        })
    })

    describe('Negative Cases', () => {
        it('should handle empty array', () => {
            const sorted = sortTodosByCreatedAt([])

            expect(sorted).toHaveLength(0)
        })

        it('should handle single item array', () => {
            const single = [createMockTodo()]
            const sorted = sortTodosByCreatedAt(single)

            expect(sorted).toHaveLength(1)
        })
    })
})

describe('sortTodosByCompleted', () => {
    describe('Positive Cases', () => {
        it('should put pending todos first', () => {
            const todos = createMockTodos()
            const sorted = sortTodosByCompleted(todos)

            expect(sorted[0].completed).toBe(false)
            expect(sorted[1].completed).toBe(false)
        })

        it('should put completed todos last', () => {
            const todos = createMockTodos()
            const sorted = sortTodosByCompleted(todos)

            expect(sorted[2].completed).toBe(true)
            expect(sorted[3].completed).toBe(true)
        })

        it('should not mutate original array', () => {
            const todos = createMockTodos()
            const originalFirst = todos[0]
            sortTodosByCompleted(todos)

            expect(todos[0]).toBe(originalFirst)
        })
    })

    describe('Negative Cases', () => {
        it('should handle empty array', () => {
            const sorted = sortTodosByCompleted([])

            expect(sorted).toHaveLength(0)
        })
    })
})

describe('getCompletedCount', () => {
    describe('Positive Cases', () => {
        it('should count completed todos', () => {
            const todos = createMockTodos()
            const count = getCompletedCount(todos)

            expect(count).toBe(2)
        })

        it('should return 0 for no completed todos', () => {
            const todos = [
                createMockTodo({ completed: false }),
                createMockTodo({ completed: false }),
            ]
            const count = getCompletedCount(todos)

            expect(count).toBe(0)
        })

        it('should count all when all completed', () => {
            const todos = [
                createMockTodo({ completed: true }),
                createMockTodo({ completed: true }),
            ]
            const count = getCompletedCount(todos)

            expect(count).toBe(2)
        })
    })

    describe('Negative Cases', () => {
        it('should return 0 for empty array', () => {
            const count = getCompletedCount([])

            expect(count).toBe(0)
        })
    })
})

describe('getPendingCount', () => {
    describe('Positive Cases', () => {
        it('should count pending todos', () => {
            const todos = createMockTodos()
            const count = getPendingCount(todos)

            expect(count).toBe(2)
        })

        it('should return 0 for no pending todos', () => {
            const todos = [
                createMockTodo({ completed: true }),
                createMockTodo({ completed: true }),
            ]
            const count = getPendingCount(todos)

            expect(count).toBe(0)
        })
    })

    describe('Negative Cases', () => {
        it('should return 0 for empty array', () => {
            const count = getPendingCount([])

            expect(count).toBe(0)
        })
    })
})

describe('getTodoStats', () => {
    describe('Positive Cases', () => {
        it('should return correct stats', () => {
            const todos = createMockTodos()
            const stats = getTodoStats(todos)

            expect(stats.total).toBe(4)
            expect(stats.completed).toBe(2)
            expect(stats.pending).toBe(2)
        })

        it('should handle all completed', () => {
            const todos = [
                createMockTodo({ completed: true }),
                createMockTodo({ completed: true }),
            ]
            const stats = getTodoStats(todos)

            expect(stats.total).toBe(2)
            expect(stats.completed).toBe(2)
            expect(stats.pending).toBe(0)
        })

        it('should handle all pending', () => {
            const todos = [
                createMockTodo({ completed: false }),
                createMockTodo({ completed: false }),
            ]
            const stats = getTodoStats(todos)

            expect(stats.total).toBe(2)
            expect(stats.completed).toBe(0)
            expect(stats.pending).toBe(2)
        })
    })

    describe('Negative Cases', () => {
        it('should handle empty array', () => {
            const stats = getTodoStats([])

            expect(stats.total).toBe(0)
            expect(stats.completed).toBe(0)
            expect(stats.pending).toBe(0)
        })
    })
})

describe('searchTodosByTitle', () => {
    describe('Positive Cases', () => {
        it('should find todos by title match', () => {
            const todos = createMockTodos()
            const results = searchTodosByTitle(todos, 'Task 1')

            expect(results).toHaveLength(1)
            expect(results[0].title).toBe('Task 1')
        })

        it('should be case insensitive', () => {
            const todos = createMockTodos()
            const results = searchTodosByTitle(todos, 'TASK')

            expect(results).toHaveLength(4)
        })

        it('should find partial matches', () => {
            const todos = createMockTodos()
            const results = searchTodosByTitle(todos, 'ask')

            expect(results).toHaveLength(4)
        })

        it('should return all todos for empty query', () => {
            const todos = createMockTodos()
            const results = searchTodosByTitle(todos, '')

            expect(results).toHaveLength(4)
        })

        it('should return all todos for whitespace query', () => {
            const todos = createMockTodos()
            const results = searchTodosByTitle(todos, '   ')

            expect(results).toHaveLength(4)
        })
    })

    describe('Negative Cases', () => {
        it('should return empty for no matches', () => {
            const todos = createMockTodos()
            const results = searchTodosByTitle(todos, 'xyz123')

            expect(results).toHaveLength(0)
        })

        it('should return empty for empty array', () => {
            const results = searchTodosByTitle([], 'Task')

            expect(results).toHaveLength(0)
        })
    })
})

describe('isTodoTitleValid', () => {
    describe('Positive Cases', () => {
        it('should return true for valid title', () => {
            expect(isTodoTitleValid('Valid title')).toBe(true)
        })

        it('should return true for single character', () => {
            expect(isTodoTitleValid('a')).toBe(true)
        })

        it('should return true for title with 200 characters', () => {
            const title = 'a'.repeat(200)
            expect(isTodoTitleValid(title)).toBe(true)
        })

        it('should return true after trimming whitespace', () => {
            expect(isTodoTitleValid('  valid  ')).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false for empty string', () => {
            expect(isTodoTitleValid('')).toBe(false)
        })

        it('should return false for whitespace only', () => {
            expect(isTodoTitleValid('   ')).toBe(false)
        })

        it('should return false for title over 200 characters', () => {
            const title = 'a'.repeat(201)
            expect(isTodoTitleValid(title)).toBe(false)
        })
    })
})

describe('isDuplicateTodoTitle', () => {
    describe('Positive Cases', () => {
        it('should return true for exact duplicate', () => {
            const todos = createMockTodos()
            const result = isDuplicateTodoTitle(todos, 'Task 1')

            expect(result).toBe(true)
        })

        it('should return true for case insensitive duplicate', () => {
            const todos = createMockTodos()
            const result = isDuplicateTodoTitle(todos, 'TASK 1')

            expect(result).toBe(true)
        })

        it('should return true after trimming whitespace', () => {
            const todos = createMockTodos()
            const result = isDuplicateTodoTitle(todos, '  Task 1  ')

            expect(result).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false for unique title', () => {
            const todos = createMockTodos()
            const result = isDuplicateTodoTitle(todos, 'Unique Title')

            expect(result).toBe(false)
        })

        it('should return false for empty array', () => {
            const result = isDuplicateTodoTitle([], 'Any Title')

            expect(result).toBe(false)
        })

        it('should return false for partial match', () => {
            const todos = createMockTodos()
            const result = isDuplicateTodoTitle(todos, 'Task')

            expect(result).toBe(false)
        })
    })
})