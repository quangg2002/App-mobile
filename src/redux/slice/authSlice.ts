import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AuthState {
    fullname: string,
    phoneNumber: string,
    access_token: string,
    role: string,
    isLoading: boolean,
    showTabBar: boolean,
    deviceToken: string,
    userId: string,
};

const initialState: AuthState = {
    fullname: '',
    phoneNumber: '',
    access_token: '',
    role: '',
    isLoading: false,
    showTabBar: false,
    deviceToken: '',
    userId: '',
};

const authSlice = createSlice({
    name: 'authReducer',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ role: string, phoneNumber: string, access_token: string, fullname: string, userId: string }>) => {
            const { role, phoneNumber, access_token, fullname, userId } = action.payload;
            state.role = role;
            state.phoneNumber = phoneNumber;
            state.access_token = access_token;
            state.fullname = fullname;
            state.userId = userId;
        },
        logout: (state) => initialState,
        showLoading: (state) => {
            return { ...state, isLoading: true };
        },
        hideLoading: (state) => {
            return { ...state, isLoading: false };
        },
        showTabBar: (state) => {
            return { ...state, showTabBar: true };
        },
        hideTabBar: (state) => {
            return { ...state, showTabBar: false };
        },
        saveDeviceToken: (state, action) => {
            return { ...state, deviceToken: action.payload }
        }
    },
    extraReducers(builder) {

    },
});

export const { login, showLoading, hideLoading, logout, showTabBar, hideTabBar, saveDeviceToken } = authSlice.actions;
export default authSlice.reducer;