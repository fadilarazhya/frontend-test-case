import { type FilterTypeValue, FilterType } from '@/src/constant/filter'

export interface Todo {
    id: string
    title: string
    completed: boolean
    createdAt: number
    updatedAt: number
}

export interface TodoState {
    todos: Todo[]
    filter: FilterTypeValue
    isLoading: boolean
    error: string | null
}

export const createInitialTodoState = (): TodoState => {
    return {
        todos: [],
        filter: FilterType.ALL,
        isLoading: false,
        error: null,
    }
}

export const generateTodoId = (): string => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    return `todo_${timestamp}_${random}`
}

export const createTodo = (title: string): Todo => {
    const now = Date.now()

    return {
        id: generateTodoId(),
        title: title.trim(),
        completed: false,
        createdAt: now,
        updatedAt: now,
    }
}

export const isValidTodo = (data: unknown): data is Todo => {
    if (typeof data !== 'object') {
        return false
    }

    if (data === null) {
        return false
    }

    const todo = data as Record<string, unknown>

    if (typeof todo.id !== 'string') {
        return false
    }

    if (typeof todo.title !== 'string') {
        return false
    }

    if (typeof todo.completed !== 'boolean') {
        return false
    }

    if (typeof todo.createdAt !== 'number') {
        return false
    }

    if (typeof todo.updatedAt !== 'number') {
        return false
    }

    return true
}

export const isValidTodoArray = (data: unknown): data is Todo[] => {
    if (!Array.isArray(data)) {
        return false
    }

    for (const item of data) {
        if (!isValidTodo(item)) {
            return false
        }
    }

    return true
}

export const toggleTodoCompleted = (todo: Todo): Todo => {
    return {
        ...todo,
        completed: !todo.completed,
        updatedAt: Date.now(),
    }
}

export const updateTodoTitle = (todo: Todo, newTitle: string): Todo => {
    return {
        ...todo,
        title: newTitle.trim(),
        updatedAt: Date.now(),
    }
}

export const filterTodos = (todos: Todo[], filter: FilterTypeValue): Todo[] => {
    if (filter === FilterType.ALL) {
        return todos
    }

    const filtered: Todo[] = []

    for (const todo of todos) {
        if (filter === FilterType.COMPLETED && todo.completed) {
            filtered.push(todo)
        }

        if (filter === FilterType.PENDING && !todo.completed) {
            filtered.push(todo)
        }
    }

    return filtered
}

export const findTodoById = (todos: Todo[], id: string): Todo | null => {
    for (const todo of todos) {
        if (todo.id === id) {
            return todo
        }
    }

    return null
}

export const removeTodoById = (todos: Todo[], id: string): Todo[] => {
    const result: Todo[] = []

    for (const todo of todos) {
        if (todo.id !== id) {
            result.push(todo)
        }
    }

    return result
}

export const sortTodosByCreatedAt = (todos: Todo[], ascending: boolean = false): Todo[] => {
    const sorted = [...todos]

    sorted.sort((a, b) => {
        if (ascending) {
            return a.createdAt - b.createdAt
        }

        return b.createdAt - a.createdAt
    })

    return sorted
}

export const sortTodosByCompleted = (todos: Todo[]): Todo[] => {
    const sorted = [...todos]

    sorted.sort((a, b) => {
        if (a.completed === b.completed) {
            return b.createdAt - a.createdAt
        }

        if (a.completed) {
            return 1
        }

        return -1
    })

    return sorted
}

export const getCompletedCount = (todos: Todo[]): number => {
    let count = 0

    for (const todo of todos) {
        if (todo.completed) {
            count++
        }
    }

    return count
}

export const getPendingCount = (todos: Todo[]): number => {
    let count = 0

    for (const todo of todos) {
        if (!todo.completed) {
            count++
        }
    }

    return count
}

export const getTodoStats = (todos: Todo[]): { total: number; completed: number; pending: number } => {
    let completed = 0
    let pending = 0

    for (const todo of todos) {
        if (todo.completed) {
            completed++
        }

        if (!todo.completed) {
            pending++
        }
    }

    return {
        total: todos.length,
        completed,
        pending,
    }
}

export const searchTodosByTitle = (todos: Todo[], query: string): Todo[] => {
    const lowerQuery = query.toLowerCase().trim()

    if (lowerQuery === '') {
        return todos
    }

    const results: Todo[] = []

    for (const todo of todos) {
        const lowerTitle = todo.title.toLowerCase()

        if (lowerTitle.includes(lowerQuery)) {
            results.push(todo)
        }
    }

    return results
}

export const isTodoTitleValid = (title: string): boolean => {
    const trimmed = title.trim()

    if (trimmed.length === 0) {
        return false
    }

    if (trimmed.length > 200) {
        return false
    }

    return true
}

export const isDuplicateTodoTitle = (todos: Todo[], title: string): boolean => {
    const lowerTitle = title.toLowerCase().trim()

    for (const todo of todos) {
        if (todo.title.toLowerCase() === lowerTitle) {
            return true
        }
    }

    return false
}