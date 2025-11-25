import { createSlice } from "@reduxjs/toolkit";

const reelSlice = createSlice({
    name: "reel",
    initialState: {
        reels: [],
        userReels: [],
        exploreReels: [],
        trendingReels: [],
        loading: false,
        error: null,
        currentReelIndex: 0
    },
    reducers: {
        setReels: (state, action) => {
            state.reels = action.payload;
        },
        setUserReels: (state, action) => {
            state.userReels = action.payload;
        },
        setExploreReels: (state, action) => {
            state.exploreReels = action.payload;
        },
        setTrendingReels: (state, action) => {
            state.trendingReels = action.payload;
        },
        addReel: (state, action) => {
            state.reels.unshift(action.payload);
        },
        likeReel: (state, action) => {
            const reel = state.reels.find(r => r._id === action.payload.reelId);
            if (reel) {
                if (action.payload.isLiked) {
                    reel.likes.push(action.payload.userId);
                } else {
                    reel.likes = reel.likes.filter(id => id !== action.payload.userId);
                }
            }
        },
        deleteReel: (state, action) => {
            state.reels = state.reels.filter(reel => reel._id !== action.payload);
        },
        addReelComment: (state, action) => {
            const reel = state.reels.find(r => r._id === action.payload.reelId);
            if (reel && reel.comments) {
                reel.comments.push(action.payload.comment);
            }
        },
        shareReel: (state, action) => {
            const reel = state.reels.find(r => r._id === action.payload);
            if (reel) {
                reel.shares = (reel.shares || 0) + 1;
            }
        },
        incrementReelView: (state, action) => {
            const reel = state.reels.find(r => r._id === action.payload);
            if (reel) {
                reel.viewCount = (reel.viewCount || 0) + 1;
            }
        },
        setCurrentReelIndex: (state, action) => {
            state.currentReelIndex = action.payload;
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
    setReels,
    setUserReels,
    setExploreReels,
    setTrendingReels,
    addReel,
    likeReel,
    deleteReel,
    addReelComment,
    shareReel,
    incrementReelView,
    setCurrentReelIndex,
    setLoading,
    setError
} = reelSlice.actions;

export default reelSlice.reducer;
