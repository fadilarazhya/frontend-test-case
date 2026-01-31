import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './styles.module.css'
import { TodoForm, TodoItem, TodoFilter, LoadingState, EmptyState } from '@/src/components'
import { addTodo, toggleTodo, deleteTodo, setFilter, loadTodosFromStorage, saveTodosToStorage, selectFilteredTodos, selectCurrentFilter, selectTodosLoading, selectTodosCounts, selectAllTodos } from '@/src/store/slice/todo-slice'
import type { AppDispatch } from '@/src/store/store'
import type { FilterTypeValue } from '@/src/constant/filter'
import { EmptyMessage } from '@/src/constant/messages'

const TodoPage = () => {
    const dispatch = useDispatch<AppDispatch>()

    const todos = useSelector(selectAllTodos)
    const filteredTodos = useSelector(selectFilteredTodos)
    const currentFilter = useSelector(selectCurrentFilter)
    const isLoading = useSelector(selectTodosLoading)
    const counts = useSelector(selectTodosCounts)

    const hasInitialLoadCompleted = useRef(false)

    useEffect(() => {
        dispatch(loadTodosFromStorage())
    }, [dispatch])

    useEffect(() => {
        if (!isLoading && !hasInitialLoadCompleted.current) {
            hasInitialLoadCompleted.current = true
        }
    }, [isLoading])

    useEffect(() => {
        if (!hasInitialLoadCompleted.current) {
            return
        }

        dispatch(saveTodosToStorage(todos))
    }, [todos, dispatch])

    const handleAddTodo = (title: string) => {
        dispatch(addTodo(title))
    }

    const handleToggleTodo = (id: string) => {
        dispatch(toggleTodo(id))
    }

    const handleDeleteTodo = (id: string) => {
        dispatch(deleteTodo(id))
    }

    const handleFilterChange = (filter: FilterTypeValue) => {
        dispatch(setFilter(filter))
    }

    const getEmptyMessage = (totalTodos: number): string => {
        if (totalTodos === 0) {
            return EmptyMessage.NO_TODOS
        }

        return EmptyMessage.NO_RESULTS
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <LoadingState message="Loading your tasks..." />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>My Tasks</h1>
                    <p className={styles.subtitle}>
                        Stay organized and get things done
                    </p>
                </header>

                <section className={styles.formSection}>
                    <TodoForm onSubmit={handleAddTodo} />
                </section>

                <section className={styles.filterSection}>
                    <TodoFilter
                        currentFilter={currentFilter}
                        onFilterChange={handleFilterChange}
                        counts={counts}
                    />
                </section>

                <section className={styles.listSection}>
                    {filteredTodos.length === 0 && (
                        <EmptyState
                            title="No tasks found"
                            message={getEmptyMessage(todos.length)}
                        />
                    )}

                    {filteredTodos.length > 0 && (
                        <div className={styles.todoList}>
                            {filteredTodos.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    id={todo.id}
                                    title={todo.title}
                                    completed={todo.completed}
                                    onToggle={handleToggleTodo}
                                    onDelete={handleDeleteTodo}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default TodoPage