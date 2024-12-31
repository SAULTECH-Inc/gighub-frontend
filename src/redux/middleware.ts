import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import AuthService from "../services/api/authService.ts";

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: AuthService
            }
        }),
    devTools: import.meta.env.NODE_ENV === 'development',
});

export default store;
