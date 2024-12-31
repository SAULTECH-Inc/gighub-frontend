import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {initialState, User} from "../../services/types";
import AuthService from "../../services/api/authService";

// Async thunk for login
export const login = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            return await AuthService().login(credentials.email, credentials.password);
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);

// Async thunk for logout (if needed)
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
    try {
        await AuthService().logout();
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || error.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string | null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
