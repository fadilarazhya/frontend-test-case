import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import styles from './styles.module.css'
import Input from '@/src/components/input'
import Button from '@/src/components/button'

interface TodoFormProps {
    onSubmit: (title: string) => void
    isLoading?: boolean
    className?: string
}

const TodoForm = ({
    onSubmit,
    isLoading = false,
    className = '',
}: TodoFormProps) => {
    const [title, setTitle] = useState('')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        const trimmedTitle = title.trim()

        if (trimmedTitle.length === 0) {
            return
        }

        onSubmit(trimmedTitle)
        setTitle('')
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') {
            return
        }

        e.preventDefault()
        handleSubmit(e as unknown as FormEvent)
    }

    const containerClasses = [
        styles.container,
        className,
    ].filter(Boolean).join(' ')

    const isSubmitDisabled = title.trim().length === 0 || isLoading

    return (
        <form onSubmit={handleSubmit} className={containerClasses}>
            <div className={styles.inputWrapper}>
                <Input
                    value={title}
                    onChange={setTitle}
                    placeholder="What needs to be done?"
                    disabled={isLoading}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            </div>
            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitDisabled}
                isLoading={isLoading}
            >
                Add Task
            </Button>
        </form>
    )
}

export default TodoForm