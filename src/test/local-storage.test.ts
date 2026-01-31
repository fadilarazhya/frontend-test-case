import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage, clearLocalStorage, hasLocalStorageItem, getAllLocalStorageKeys, getLocalStorageSize } from '@/src/utils/local-storage'

let mockStore: Record<string, string> = {}

const mockLocalStorage = {
    getItem: vi.fn((key: string) => {
        return mockStore[key] || null
    }),
    setItem: vi.fn((key: string, value: string) => {
        mockStore[key] = value
    }),
    removeItem: vi.fn((key: string) => {
        delete mockStore[key]
    }),
    clear: vi.fn(() => {
        mockStore = {}
    }),
    key: vi.fn((index: number) => {
        const keys = Object.keys(mockStore)
        return keys[index] || null
    }),
    get length() {
        return Object.keys(mockStore).length
    },
}

beforeEach(() => {
    mockStore = {}
    vi.stubGlobal('localStorage', mockLocalStorage)
    vi.clearAllMocks()
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('saveToLocalStorage', () => {
    describe('Positive Cases', () => {
        it('should save string value', () => {
            const result = saveToLocalStorage('testKey', 'testValue')

            expect(result).toBe(true)
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'testKey',
                JSON.stringify('testValue')
            )
        })

        it('should save object value', () => {
            const obj = { name: 'Test', value: 123 }
            const result = saveToLocalStorage('objectKey', obj)

            expect(result).toBe(true)
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'objectKey',
                JSON.stringify(obj)
            )
        })

        it('should save array value', () => {
            const arr = [1, 2, 3, 4, 5]
            const result = saveToLocalStorage('arrayKey', arr)

            expect(result).toBe(true)
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'arrayKey',
                JSON.stringify(arr)
            )
        })

        it('should save number value', () => {
            const result = saveToLocalStorage('numberKey', 42)

            expect(result).toBe(true)
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'numberKey',
                JSON.stringify(42)
            )
        })

        it('should save boolean value', () => {
            const result = saveToLocalStorage('boolKey', true)

            expect(result).toBe(true)
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'boolKey',
                JSON.stringify(true)
            )
        })

        it('should save null value', () => {
            const result = saveToLocalStorage('nullKey', null)

            expect(result).toBe(true)
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'nullKey',
                JSON.stringify(null)
            )
        })
    })

    describe('Negative Cases', () => {
        it('should return false on QuotaExceededError', () => {
            const quotaError = new Error('Quota exceeded')
            quotaError.name = 'QuotaExceededError'
            mockLocalStorage.setItem.mockImplementationOnce(() => {
                throw quotaError
            })

            const result = saveToLocalStorage('testKey', 'value')

            expect(result).toBe(false)
        })

        it('should return false on general error', () => {
            mockLocalStorage.setItem.mockImplementationOnce(() => {
                throw new Error('General error')
            })

            const result = saveToLocalStorage('testKey', 'value')

            expect(result).toBe(false)
        })

        it('should return false on non-Error exception', () => {
            mockLocalStorage.setItem.mockImplementationOnce(() => {
                throw 'string error'
            })

            const result = saveToLocalStorage('testKey', 'value')

            expect(result).toBe(false)
        })
    })
})

describe('getFromLocalStorage', () => {
    describe('Positive Cases', () => {
        it('should retrieve string value', () => {
            mockStore['testKey'] = JSON.stringify('testValue')

            const result = getFromLocalStorage<string>('testKey')

            expect(result).toBe('testValue')
        })

        it('should retrieve object value', () => {
            const obj = { name: 'Test', value: 123 }
            mockStore['objectKey'] = JSON.stringify(obj)

            const result = getFromLocalStorage<typeof obj>('objectKey')

            expect(result).toEqual(obj)
        })

        it('should retrieve array value', () => {
            const arr = [1, 2, 3]
            mockStore['arrayKey'] = JSON.stringify(arr)

            const result = getFromLocalStorage<number[]>('arrayKey')

            expect(result).toEqual(arr)
        })

        it('should retrieve number value', () => {
            mockStore['numberKey'] = JSON.stringify(42)

            const result = getFromLocalStorage<number>('numberKey')

            expect(result).toBe(42)
        })

        it('should retrieve boolean value', () => {
            mockStore['boolKey'] = JSON.stringify(true)

            const result = getFromLocalStorage<boolean>('boolKey')

            expect(result).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return null for non-existent key', () => {
            const result = getFromLocalStorage<string>('nonExistentKey')

            expect(result).toBeNull()
        })

        it('should return null for invalid JSON', () => {
            mockStore['invalidKey'] = 'invalid json {'

            const result = getFromLocalStorage<string>('invalidKey')

            expect(result).toBeNull()
        })

        it('should return null on error', () => {
            mockLocalStorage.getItem.mockImplementationOnce(() => {
                throw new Error('Access denied')
            })

            const result = getFromLocalStorage<string>('testKey')

            expect(result).toBeNull()
        })
    })
})

describe('removeFromLocalStorage', () => {
    describe('Positive Cases', () => {
        it('should remove item by key', () => {
            mockStore['testKey'] = 'value'
            const result = removeFromLocalStorage('testKey')

            expect(result).toBe(true)
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('testKey')
        })

        it('should return true even for non-existent key', () => {
            const result = removeFromLocalStorage('nonExistentKey')

            expect(result).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false on error', () => {
            mockLocalStorage.removeItem.mockImplementationOnce(() => {
                throw new Error('Access denied')
            })

            const result = removeFromLocalStorage('testKey')

            expect(result).toBe(false)
        })
    })
})

describe('clearLocalStorage', () => {
    describe('Positive Cases', () => {
        it('should clear all items', () => {
            mockStore['key1'] = 'value1'
            mockStore['key2'] = 'value2'

            const result = clearLocalStorage()

            expect(result).toBe(true)
            expect(mockLocalStorage.clear).toHaveBeenCalled()
        })
    })

    describe('Negative Cases', () => {
        it('should return false on error', () => {
            mockLocalStorage.clear.mockImplementationOnce(() => {
                throw new Error('Access denied')
            })

            const result = clearLocalStorage()

            expect(result).toBe(false)
        })
    })
})

describe('hasLocalStorageItem', () => {
    describe('Positive Cases', () => {
        it('should return true for existing key', () => {
            mockStore['existingKey'] = 'some value'

            const result = hasLocalStorageItem('existingKey')

            expect(result).toBe(true)
        })
    })

    describe('Negative Cases', () => {
        it('should return false for non-existent key', () => {
            const result = hasLocalStorageItem('nonExistentKey')

            expect(result).toBe(false)
        })

        it('should return false on error', () => {
            mockLocalStorage.getItem.mockImplementationOnce(() => {
                throw new Error('Access denied')
            })

            const result = hasLocalStorageItem('testKey')

            expect(result).toBe(false)
        })
    })
})

describe('getAllLocalStorageKeys', () => {
    describe('Positive Cases', () => {
        it('should return all keys', () => {
            mockStore['key1'] = 'value1'
            mockStore['key2'] = 'value2'
            mockStore['key3'] = 'value3'

            const result = getAllLocalStorageKeys()

            expect(result).toHaveLength(3)
            expect(result).toContain('key1')
            expect(result).toContain('key2')
            expect(result).toContain('key3')
        })
    })

    describe('Negative Cases', () => {
        it('should return empty array for empty storage', () => {
            const result = getAllLocalStorageKeys()

            expect(result).toHaveLength(0)
        })

        it('should return empty array on error', () => {
            mockLocalStorage.key.mockImplementationOnce(() => {
                throw new Error('Access denied')
            })

            const result = getAllLocalStorageKeys()

            expect(result).toEqual([])
        })
    })
})

describe('getLocalStorageSize', () => {
    describe('Positive Cases', () => {
        it('should return total size of storage', () => {
            mockStore['key1'] = 'value1'
            mockStore['key2'] = 'value2'

            const result = getLocalStorageSize()

            expect(result).toBe(20)
        })

        it('should calculate size correctly for single item', () => {
            mockStore['ab'] = 'cd'

            const result = getLocalStorageSize()

            expect(result).toBe(4)
        })
    })

    describe('Negative Cases', () => {
        it('should return 0 for empty storage', () => {
            const result = getLocalStorageSize()

            expect(result).toBe(0)
        })

        it('should return 0 on error', () => {
            mockLocalStorage.key.mockImplementationOnce(() => {
                throw new Error('Access denied')
            })

            const result = getLocalStorageSize()

            expect(result).toBe(0)
        })
    })
})