import { configureStore } from '@reduxjs/toolkit'
import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { todoReducer, postReducer } from '@/src/store/slice'

export const store = configureStore({
    reducer: {
        todos: todoReducer,
        posts: postReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['todos/saveToStorage/fulfilled'],
            },
        }),
    devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>

export const getState = (): RootState => {
    return store.getState()
}

export const dispatch = (action: Parameters<AppDispatch>[0]): ReturnType<AppDispatch> => {
    return store.dispatch(action)
}

export default store