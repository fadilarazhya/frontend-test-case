import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import type { Todo, TodoState } from '@/src/model'
import { createTodo, filterTodos, removeTodoById, toggleTodoCompleted, createInitialTodoState, isValidTodoArray } from '@/src/model'
import { saveToLocalStorage, getFromLocalStorage } from '@/src/utils/local-storage'
import { StorageKey } from '@/src/constant/storage'
import { FilterType } from '@/src/constant/filter'
import type { FilterTypeValue } from '@/src/constant/filter'

const initialState: TodoState = createInitialTodoState()

export const loadTodosFromStorage = createAsyncThunk(
    'todos/loadFromStorage',
    async () => {
        const stored = getFromLocalStorage<Todo[]>(StorageKey.TODOS)

        if (stored === null) {
            return []
        }

        if (!isValidTodoArray(stored)) {
            return []
        }

        return stored
    }
)

export const saveTodosToStorage = createAsyncThunk(
    'todos/saveToStorage',
    async (todos: Todo[]) => {
        const success = saveToLocalStorage(StorageKey.TODOS, todos)
        return success
    }
)

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<string>) => {
            const title = action.payload.trim()

            if (title.length === 0) {
                return
            }

            const newTodo = createTodo(title)
            state.todos.unshift(newTodo)
        },

        toggleTodo: (state, action: PayloadAction<string>) => {
            const todoId = action.payload
            const todoIndex = state.todos.findIndex(todo => todo.id === todoId)

            if (todoIndex === -1) {
                return
            }

            const todo = state.todos[todoIndex]
            state.todos[todoIndex] = toggleTodoCompleted(todo)
        },

        deleteTodo: (state, action: PayloadAction<string>) => {
            const todoId = action.payload
            state.todos = removeTodoById(state.todos, todoId)
        },

        setFilter: (state, action: PayloadAction<FilterTypeValue>) => {
            state.filter = action.payload
        },

        clearCompleted: (state) => {
            const pendingTodos: Todo[] = []

            for (const todo of state.todos) {
                if (!todo.completed) {
                    pendingTodos.push(todo)
                }
            }

            state.todos = pendingTodos
        },

        markAllCompleted: (state) => {
            for (let i = 0; i < state.todos.length; i++) {
                if (!state.todos[i].completed) {
                    state.todos[i] = {
                        ...state.todos[i],
                        completed: true,
                        updatedAt: Date.now(),
                    }
                }
            }
        },

        markAllPending: (state) => {
            for (let i = 0; i < state.todos.length; i++) {
                if (state.todos[i].completed) {
                    state.todos[i] = {
                        ...state.todos[i],
                        completed: false,
                        updatedAt: Date.now(),
                    }
                }
            }
        },

        updateTodoTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const { id, title } = action.payload
            const trimmedTitle = title.trim()

            if (trimmedTitle.length === 0) {
                return
            }

            const todoIndex = state.todos.findIndex(todo => todo.id === id)

            if (todoIndex === -1) {
                return
            }

            state.todos[todoIndex] = {
                ...state.todos[todoIndex],
                title: trimmedTitle,
                updatedAt: Date.now(),
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },

        clearError: (state) => {
            state.error = null
        },

        resetTodos: (state) => {
            state.todos = []
            state.filter = FilterType.ALL
            state.isLoading = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadTodosFromStorage.pending, (state) => {
            state.isLoading = true
            state.error = null
        })

        builder.addCase(loadTodosFromStorage.fulfilled, (state, action) => {
            state.todos = action.payload
            state.isLoading = false
        })

        builder.addCase(loadTodosFromStorage.rejected, (state) => {
            state.isLoading = false
            state.error = 'Failed to load todos from storage'
        })

        builder.addCase(saveTodosToStorage.rejected, (state) => {
            state.error = 'Failed to save todos to storage'
        })
    },
})

export const selectAllTodos = (state: { todos: TodoState }): Todo[] => {
    return state.todos.todos
}

export const selectCurrentFilter = (state: { todos: TodoState }): FilterTypeValue => {
    return state.todos.filter
}

export const selectFilteredTodos = createSelector(
    [selectAllTodos, selectCurrentFilter],
    (todos, filter) => {
        return filterTodos(todos, filter)
    }
)

export const selectTodoById = (id: string) =>
    createSelector(
        [selectAllTodos],
        (todos) => {
            return todos.find(todo => todo.id === id) ?? null
        }
    )

export const selectTodosLoading = (state: { todos: TodoState }): boolean => {
    return state.todos.isLoading
}

export const selectTodosError = (state: { todos: TodoState }): string | null => {
    return state.todos.error
}

export const selectTodosCounts = createSelector(
    [selectAllTodos],
    (todos) => {
        let completed = 0
        let pending = 0

        for (const todo of todos) {
            if (todo.completed) {
                completed++
            } else {
                pending++
            }
        }

        return {
            all: todos.length,
            completed,
            pending,
        }
    }
)

export const selectHasTodos = (state: { todos: TodoState }): boolean => {
    return state.todos.todos.length > 0
}

export const selectHasCompletedTodos = (state: { todos: TodoState }): boolean => {
    for (const todo of state.todos.todos) {
        if (todo.completed) {
            return true
        }
    }

    return false
}

export const {
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted,
    markAllCompleted,
    markAllPending,
    updateTodoTitle,
    setLoading,
    setError,
    clearError,
    resetTodos,
} = todoSlice.actions

export default todoSlice.reducer