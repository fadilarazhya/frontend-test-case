import type { ChangeEvent, KeyboardEvent } from 'react'
import styles from './styles.module.css'

interface InputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    type?: 'text' | 'number' | 'email' | 'password'
    disabled?: boolean
    autoFocus?: boolean
    maxLength?: number
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
    className?: string
    id?: string
}

const Input = ({
    value,
    onChange,
    placeholder = '',
    type = 'text',
    disabled = false,
    autoFocus = false,
    maxLength,
    onKeyDown,
    className = '',
    id,
}: InputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    const inputClasses = [
        styles.input,
        disabled ? styles.disabled : '',
        className,
    ].filter(Boolean).join(' ')

    return (
        <input
            id={id}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            maxLength={maxLength}
            onKeyDown={onKeyDown}
            className={inputClasses}
        />
    )
}

export default Input