import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        markAsRead: (state, action) => {
            const notification = state.notifications.find(n => n._id === action.payload);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        deleteNotification: (state, action) => {
            const notification = state.notifications.find(n => n._id === action.payload);
            if (notification && !notification.isRead) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            state.notifications = state.notifications.filter(n => n._id !== action.payload);
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        clearUnreadCount: (state) => {
            state.unreadCount = 0;
            state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    setNotifications,
    addNotification,
    markAsRead,
    deleteNotification,
    setUnreadCount,
    clearUnreadCount,
    setLoading,
    setError
} = notificationSlice.actions;

export default notificationSlice.reducer;
