import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Message {
    id: string,
    content: string,
    sentAt: string,
    sentBy: string,
    image?: string,
};

interface ChatRoom {
    participants: string[],
    messages: Message[],
};

export interface ChatState {
    chatRoom: ChatRoom[],
    incommingCallShow: boolean,
};

const initialState: ChatState = {
    chatRoom: [],
    incommingCallShow: false,
};

const chatSlice = createSlice({
    name: 'chatReducer',
    initialState,
    reducers: {
        saveChatRoom: (state, action) => {
            state.chatRoom = action.payload;
        },
        clearChatRoom: (state) => initialState,
        showIncommingCall: (state) => {
            return { ...state, incommingCallShow: true };
        },
        hideIncommingCall: (state) => {
            return { ...state, incommingCallShow: false };
        }
    },
    extraReducers(builder) {

    },
});

export const { saveChatRoom, clearChatRoom, showIncommingCall, hideIncommingCall } = chatSlice.actions;
export default chatSlice.reducer;