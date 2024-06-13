import { combineReducers } from '@reduxjs/toolkit';
import authReducer, { AuthState } from '../slice/authSlice';
import chatReducer, { ChatState } from '../slice/chatSlice';

export interface RootReducer {
    authReducer: AuthState,
    chatReducer: ChatState,

}

const rootReducer = {
    authReducer,
    chatReducer,

}

export default combineReducers(rootReducer);