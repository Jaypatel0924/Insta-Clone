import { createSlice } from "@reduxjs/toolkit";

const followSlice = createSlice({
    name: "follow",
    initialState: {
        followRequests: [],
        sentRequests: [],
        followers: [],
        following: [],
        loading: false,
        error: null
    },
    reducers: {
        setFollowRequests: (state, action) => {
            state.followRequests = action.payload;
        },
        setSentRequests: (state, action) => {
            state.sentRequests = action.payload;
        },
        setFollowers: (state, action) => {
            state.followers = action.payload;
        },
        setFollowing: (state, action) => {
            state.following = action.payload;
        },
        addFollowRequest: (state, action) => {
            state.followRequests.push(action.payload);
        },
        removeFollowRequest: (state, action) => {
            state.followRequests = state.followRequests.filter(req => req._id !== action.payload);
        },
        acceptFollowRequest: (state, action) => {
            state.followRequests = state.followRequests.filter(req => req._id !== action.payload);
            state.following.push(action.payload);
        },
        rejectFollowRequest: (state, action) => {
            state.followRequests = state.followRequests.filter(req => req._id !== action.payload);
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
    setFollowRequests,
    setSentRequests,
    setFollowers,
    setFollowing,
    addFollowRequest,
    removeFollowRequest,
    acceptFollowRequest,
    rejectFollowRequest,
    setLoading,
    setError
} = followSlice.actions;

export default followSlice.reducer;
