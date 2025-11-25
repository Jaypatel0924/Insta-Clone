// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import authSlice from "./authSlice.js";
// import postSlice from './postSlice.js';
// import socketSlice from "./socketSlice.js"
// import chatSlice from "./chatSlice.js";
// import rtnSlice from "./rtnSlice.js";

// import { 
//     persistReducer,
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER,
// } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'


// const persistConfig = {
//     key: 'root',
//     version: 1,
//     storage,
// }

// const rootReducer = combineReducers({
//     auth:authSlice,
//     post:postSlice,
//     socketio:socketSlice,
//     chat:chatSlice,
//     realTimeNotification:rtnSlice
// })

// const persistedReducer = persistReducer(persistConfig, rootReducer)

// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//             },
//         }),
// });
// export default store;
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from './postSlice.js';
import chatSlice from "./chatSlice.js";
import rtnSlice from "./rtnSlice.js";
import storySlice from "./storySlice.js";
import reelSlice from "./reelSlice.js";
import notificationSlice from "./notificationSlice.js";
import followSlice from "./followSlice.js";

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth']  // persist only auth (important!)
}

const rootReducer = combineReducers({
    auth: authSlice,
    post: postSlice,
    chat: chatSlice,
    realTimeNotification: rtnSlice,
    story: storySlice,
    reel: reelSlice,
    notification: notificationSlice,
    follow: followSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: ["chat.onlineUsers"], // optional
            },
        }),
});

export default store;
