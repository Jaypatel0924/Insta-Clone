import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
    name: "story",
    initialState: {
        stories: [],
        followingStories: [],
        userStories: [],
        loading: false,
        error: null,
        currentStoryIndex: 0
    },
    reducers: {
        setStories: (state, action) => {
            state.stories = action.payload;
        },
        setFollowingStories: (state, action) => {
            state.followingStories = action.payload;
        },
        setUserStories: (state, action) => {
            state.userStories = action.payload;
        },
        addStory: (state, action) => {
            state.stories.unshift(action.payload);
        },
        deleteStory: (state, action) => {
            state.stories = state.stories.filter(story => story._id !== action.payload);
        },
        updateStoryViews: (state, action) => {
            const story = state.stories.find(s => s._id === action.payload.storyId);
            if (story) {
                story.views = action.payload.views;
            }
        },
        setCurrentStoryIndex: (state, action) => {
            state.currentStoryIndex = action.payload;
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
    setStories,
    setFollowingStories,
    setUserStories,
    addStory,
    deleteStory,
    updateStoryViews,
    setCurrentStoryIndex,
    setLoading,
    setError
} = storySlice.actions;

export default storySlice.reducer;
