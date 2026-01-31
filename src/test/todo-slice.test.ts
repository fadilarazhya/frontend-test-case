import { describe, it, expect } from 'vitest'
import todoReducer, { addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted, markAllCompleted, markAllPending, updateTodoTitle, setLoading, setError, clearError, resetTodos, selectAllTodos, selectFilteredTodos, selectCurrentFilter, selectTodoById, selectTodosLoading, selectTodosError, selectTodosCounts, selectHasTodos, selectHasCompletedTodos, loadTodosFromStorage, saveTodosToStorage } from '@/src/store/slice/todo-slice'
import { FilterType } from '@/src/constant/filter'
import type { Todo, TodoState } from '@/src/model'

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

const createInitialState = (): TodoState => {
    return {
        todos: [],
        filter: FilterType.ALL,
        isLoading: false,
        error: null,
    }
}

const createStateWithTodos = (): TodoState => {
    return {
        todos: [
            createMockTodo({ id: '1', title: 'Task 1', completed: false }),
            createMockTodo({ id: '2', title: 'Task 2', completed: true }),
            createMockTodo({ id: '3', title: 'Task 3', completed: false }),
            createMockTodo({ id: '4', title: 'Task 4', completed: true }),
        ],
        filter: FilterType.ALL,
        isLoading: false,
        error: null,
    }
}

describe('todoSlice reducer', () => {
    describe('Initial State', () => {
        it('should return initial state for unknown action', () => {
            const result = todoReducer(undefined, { type: 'unknown' })

            expect(result.todos).toEqual([])
            expect(result.filter).toBe(FilterType.ALL)
            expect(result.isLoading).toBe(false)
            expect(result.error).toBeNull()
        })
    })

    describe('addTodo', () => {
        describe('Positive Cases', () => {
            it('should add new todo', () => {
                const state = createInitialState()
                const result = todoReducer(state, addTodo('New Task'))

                expect(result.todos).toHaveLength(1)
                expect(result.todos[0].title).toBe('New Task')
            })

            it('should add todo at the beginning', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, addTodo('First Task'))

                expect(result.todos[0].title).toBe('First Task')
            })

            it('should set completed to false', () => {
                const state = createInitialState()
                const result = todoReducer(state, addTodo('Task'))

                expect(result.todos[0].completed).toBe(false)
            })

            it('should trim whitespace from title', () => {
                const state = createInitialState()
                const result = todoReducer(state, addTodo('  Trimmed  '))

                expect(result.todos[0].title).toBe('Trimmed')
            })

            it('should generate unique id', () => {
                const state = createInitialState()
                const result = todoReducer(state, addTodo('Task'))

                expect(result.todos[0].id).toBeTruthy()
                expect(result.todos[0].id.startsWith('todo_')).toBe(true)
            })
        })

        describe('Negative Cases', () => {
            it('should not add todo with empty string', () => {
                const state = createInitialState()
                const result = todoReducer(state, addTodo(''))

                expect(result.todos).toHaveLength(0)
            })

            it('should not add todo with whitespace only', () => {
                const state = createInitialState()
                const result = todoReducer(state, addTodo('   '))

                expect(result.todos).toHaveLength(0)
            })
        })
    })

    describe('toggleTodo', () => {
        describe('Positive Cases', () => {
            it('should toggle incomplete to complete', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, toggleTodo('1'))

                expect(result.todos.find(t => t.id === '1')?.completed).toBe(true)
            })

            it('should toggle complete to incomplete', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, toggleTodo('2'))

                expect(result.todos.find(t => t.id === '2')?.completed).toBe(false)
            })

            it('should update updatedAt timestamp', () => {
                const state = createStateWithTodos()
                const originalUpdatedAt = state.todos[0].updatedAt
                const result = todoReducer(state, toggleTodo('1'))

                expect(result.todos[0].updatedAt).toBeGreaterThan(originalUpdatedAt)
            })
        })

        describe('Negative Cases', () => {
            it('should not change state for non-existent id', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, toggleTodo('non-existent'))

                expect(result.todos).toEqual(state.todos)
            })
        })
    })

    describe('deleteTodo', () => {
        describe('Positive Cases', () => {
            it('should delete todo by id', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, deleteTodo('1'))

                expect(result.todos).toHaveLength(3)
                expect(result.todos.find(t => t.id === '1')).toBeUndefined()
            })

            it('should keep other todos intact', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, deleteTodo('2'))

                expect(result.todos.find(t => t.id === '1')).toBeDefined()
                expect(result.todos.find(t => t.id === '3')).toBeDefined()
            })
        })

        describe('Negative Cases', () => {
            it('should not change length for non-existent id', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, deleteTodo('non-existent'))

                expect(result.todos).toHaveLength(4)
            })
        })
    })

    describe('setFilter', () => {
        describe('Positive Cases', () => {
            it('should set filter to COMPLETED', () => {
                const state = createInitialState()
                const result = todoReducer(state, setFilter(FilterType.COMPLETED))

                expect(result.filter).toBe(FilterType.COMPLETED)
            })

            it('should set filter to PENDING', () => {
                const state = createInitialState()
                const result = todoReducer(state, setFilter(FilterType.PENDING))

                expect(result.filter).toBe(FilterType.PENDING)
            })

            it('should set filter back to ALL', () => {
                const state = { ...createInitialState(), filter: FilterType.COMPLETED }
                const result = todoReducer(state, setFilter(FilterType.ALL))

                expect(result.filter).toBe(FilterType.ALL)
            })
        })
    })

    describe('clearCompleted', () => {
        describe('Positive Cases', () => {
            it('should remove all completed todos', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, clearCompleted())

                expect(result.todos).toHaveLength(2)
                expect(result.todos.every(t => !t.completed)).toBe(true)
            })

            it('should keep pending todos', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, clearCompleted())

                expect(result.todos.find(t => t.id === '1')).toBeDefined()
                expect(result.todos.find(t => t.id === '3')).toBeDefined()
            })
        })

        describe('Negative Cases', () => {
            it('should handle empty todos', () => {
                const state = createInitialState()
                const result = todoReducer(state, clearCompleted())

                expect(result.todos).toHaveLength(0)
            })

            it('should keep all when none completed', () => {
                const state: TodoState = {
                    ...createInitialState(),
                    todos: [
                        createMockTodo({ id: '1', completed: false }),
                        createMockTodo({ id: '2', completed: false }),
                    ],
                }
                const result = todoReducer(state, clearCompleted())

                expect(result.todos).toHaveLength(2)
            })
        })
    })

    describe('markAllCompleted', () => {
        describe('Positive Cases', () => {
            it('should mark all todos as completed', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, markAllCompleted())

                expect(result.todos.every(t => t.completed)).toBe(true)
            })

            it('should update updatedAt for changed todos', () => {
                const state: TodoState = {
                    ...createInitialState(),
                    todos: [createMockTodo({ id: '1', completed: false, updatedAt: 1000 })],
                }
                const result = todoReducer(state, markAllCompleted())

                expect(result.todos[0].updatedAt).toBeGreaterThan(1000)
            })
        })

        describe('Negative Cases', () => {
            it('should handle empty todos', () => {
                const state = createInitialState()
                const result = todoReducer(state, markAllCompleted())

                expect(result.todos).toHaveLength(0)
            })
        })
    })

    describe('markAllPending', () => {
        describe('Positive Cases', () => {
            it('should mark all todos as pending', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, markAllPending())

                expect(result.todos.every(t => !t.completed)).toBe(true)
            })

            it('should update updatedAt for changed todos', () => {
                const state: TodoState = {
                    ...createInitialState(),
                    todos: [createMockTodo({ id: '1', completed: true, updatedAt: 1000 })],
                }
                const result = todoReducer(state, markAllPending())

                expect(result.todos[0].updatedAt).toBeGreaterThan(1000)
            })
        })
    })

    describe('updateTodoTitle', () => {
        describe('Positive Cases', () => {
            it('should update todo title', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, updateTodoTitle({ id: '1', title: 'Updated Title' }))

                expect(result.todos.find(t => t.id === '1')?.title).toBe('Updated Title')
            })

            it('should trim whitespace from title', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, updateTodoTitle({ id: '1', title: '  Trimmed  ' }))

                expect(result.todos.find(t => t.id === '1')?.title).toBe('Trimmed')
            })

            it('should update updatedAt timestamp', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, updateTodoTitle({ id: '1', title: 'New' }))

                expect(result.todos[0].updatedAt).toBeGreaterThan(1000)
            })
        })

        describe('Negative Cases', () => {
            it('should not update with empty title', () => {
                const state = createStateWithTodos()
                const originalTitle = state.todos[0].title
                const result = todoReducer(state, updateTodoTitle({ id: '1', title: '' }))

                expect(result.todos.find(t => t.id === '1')?.title).toBe(originalTitle)
            })

            it('should not update with whitespace only title', () => {
                const state = createStateWithTodos()
                const originalTitle = state.todos[0].title
                const result = todoReducer(state, updateTodoTitle({ id: '1', title: '   ' }))

                expect(result.todos.find(t => t.id === '1')?.title).toBe(originalTitle)
            })

            it('should not update for non-existent id', () => {
                const state = createStateWithTodos()
                const result = todoReducer(state, updateTodoTitle({ id: 'non-existent', title: 'New' }))

                expect(result.todos).toEqual(state.todos)
            })
        })
    })

    describe('setLoading', () => {
        describe('Positive Cases', () => {
            it('should set loading to true', () => {
                const state = createInitialState()
                const result = todoReducer(state, setLoading(true))

                expect(result.isLoading).toBe(true)
            })

            it('should set loading to false', () => {
                const state = { ...createInitialState(), isLoading: true }
                const result = todoReducer(state, setLoading(false))

                expect(result.isLoading).toBe(false)
            })
        })
    })

    describe('setError', () => {
        describe('Positive Cases', () => {
            it('should set error message', () => {
                const state = createInitialState()
                const result = todoReducer(state, setError('Error message'))

                expect(result.error).toBe('Error message')
            })

            it('should set error to null', () => {
                const state = { ...createInitialState(), error: 'Some error' }
                const result = todoReducer(state, setError(null))

                expect(result.error).toBeNull()
            })
        })
    })

    describe('clearError', () => {
        describe('Positive Cases', () => {
            it('should clear error', () => {
                const state = { ...createInitialState(), error: 'Some error' }
                const result = todoReducer(state, clearError())

                expect(result.error).toBeNull()
            })
        })
    })

    describe('resetTodos', () => {
        describe('Positive Cases', () => {
            it('should reset to initial state', () => {
                const state = {
                    todos: createStateWithTodos().todos,
                    filter: FilterType.COMPLETED,
                    isLoading: true,
                    error: 'Some error',
                }
                const result = todoReducer(state, resetTodos())

                expect(result.todos).toEqual([])
                expect(result.filter).toBe(FilterType.ALL)
                expect(result.isLoading).toBe(false)
                expect(result.error).toBeNull()
            })
        })
    })

    describe('loadTodosFromStorage async thunk', () => {
        describe('Positive Cases', () => {
            it('should set loading true on pending', () => {
                const state = createInitialState()
                const action = { type: loadTodosFromStorage.pending.type }
                const result = todoReducer(state, action)

                expect(result.isLoading).toBe(true)
                expect(result.error).toBeNull()
            })

            it('should set todos on fulfilled', () => {
                const todos = [createMockTodo()]
                const state = { ...createInitialState(), isLoading: true }
                const action = { type: loadTodosFromStorage.fulfilled.type, payload: todos }
                const result = todoReducer(state, action)

                expect(result.todos).toEqual(todos)
                expect(result.isLoading).toBe(false)
            })
        })

        describe('Negative Cases', () => {
            it('should set error on rejected', () => {
                const state = { ...createInitialState(), isLoading: true }
                const action = { type: loadTodosFromStorage.rejected.type }
                const result = todoReducer(state, action)

                expect(result.isLoading).toBe(false)
                expect(result.error).toBe('Failed to load todos from storage')
            })
        })
    })

    describe('saveTodosToStorage async thunk', () => {
        describe('Negative Cases', () => {
            it('should set error on rejected', () => {
                const state = createInitialState()
                const action = { type: saveTodosToStorage.rejected.type }
                const result = todoReducer(state, action)

                expect(result.error).toBe('Failed to save todos to storage')
            })
        })
    })
})

describe('Todo Selectors', () => {
    const createRootState = (todoState: TodoState) => ({
        todos: todoState,
    })

    describe('selectAllTodos', () => {
        it('should return all todos', () => {
            const state = createRootState(createStateWithTodos())
            const todos = selectAllTodos(state)

            expect(todos).toHaveLength(4)
        })
    })

    describe('selectFilteredTodos', () => {
        it('should return all todos for ALL filter', () => {
            const state = createRootState(createStateWithTodos())
            const todos = selectFilteredTodos(state)

            expect(todos).toHaveLength(4)
        })

        it('should return completed todos for COMPLETED filter', () => {
            const todoState = { ...createStateWithTodos(), filter: FilterType.COMPLETED }
            const state = createRootState(todoState)
            const todos = selectFilteredTodos(state)

            expect(todos).toHaveLength(2)
            expect(todos.every(t => t.completed)).toBe(true)
        })

        it('should return pending todos for PENDING filter', () => {
            const todoState = { ...createStateWithTodos(), filter: FilterType.PENDING }
            const state = createRootState(todoState)
            const todos = selectFilteredTodos(state)

            expect(todos).toHaveLength(2)
            expect(todos.every(t => !t.completed)).toBe(true)
        })
    })

    describe('selectCurrentFilter', () => {
        it('should return current filter', () => {
            const todoState = { ...createInitialState(), filter: FilterType.COMPLETED }
            const state = createRootState(todoState)
            const filter = selectCurrentFilter(state)

            expect(filter).toBe(FilterType.COMPLETED)
        })
    })

    describe('selectTodoById', () => {
        it('should find todo by id', () => {
            const state = createRootState(createStateWithTodos())
            const todo = selectTodoById(state, '2')

            expect(todo).not.toBeNull()
            expect(todo?.id).toBe('2')
        })

        it('should return null for non-existent id', () => {
            const state = createRootState(createStateWithTodos())
            const todo = selectTodoById(state, 'non-existent')

            expect(todo).toBeNull()
        })
    })

    describe('selectTodosLoading', () => {
        it('should return loading state', () => {
            const todoState = { ...createInitialState(), isLoading: true }
            const state = createRootState(todoState)
            const loading = selectTodosLoading(state)

            expect(loading).toBe(true)
        })
    })

    describe('selectTodosError', () => {
        it('should return error state', () => {
            const todoState = { ...createInitialState(), error: 'Test error' }
            const state = createRootState(todoState)
            const error = selectTodosError(state)

            expect(error).toBe('Test error')
        })
    })

    describe('selectTodosCounts', () => {
        it('should return correct counts', () => {
            const state = createRootState(createStateWithTodos())
            const counts = selectTodosCounts(state)

            expect(counts.all).toBe(4)
            expect(counts.completed).toBe(2)
            expect(counts.pending).toBe(2)
        })

        it('should return zeros for empty todos', () => {
            const state = createRootState(createInitialState())
            const counts = selectTodosCounts(state)

            expect(counts.all).toBe(0)
            expect(counts.completed).toBe(0)
            expect(counts.pending).toBe(0)
        })
    })

    describe('selectHasTodos', () => {
        it('should return true when todos exist', () => {
            const state = createRootState(createStateWithTodos())
            const hasTodos = selectHasTodos(state)

            expect(hasTodos).toBe(true)
        })

        it('should return false when no todos', () => {
            const state = createRootState(createInitialState())
            const hasTodos = selectHasTodos(state)

            expect(hasTodos).toBe(false)
        })
    })

    describe('selectHasCompletedTodos', () => {
        it('should return true when completed todos exist', () => {
            const state = createRootState(createStateWithTodos())
            const hasCompleted = selectHasCompletedTodos(state)

            expect(hasCompleted).toBe(true)
        })

        it('should return false when no completed todos', () => {
            const todoState: TodoState = {
                ...createInitialState(),
                todos: [createMockTodo({ completed: false })],
            }
            const state = createRootState(todoState)
            const hasCompleted = selectHasCompletedTodos(state)

            expect(hasCompleted).toBe(false)
        })

        it('should return false for empty todos', () => {
            const state = createRootState(createInitialState())
            const hasCompleted = selectHasCompletedTodos(state)

            expect(hasCompleted).toBe(false)
        })
    })
})