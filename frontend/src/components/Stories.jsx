import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setFollowingStories } from '../redux/storySlice';
import useGetFollowingStories from '../hooks/useGetFollowingStories';

const Stories = () => {
    // Use the custom hook to fetch stories with auto-refresh
    useGetFollowingStories();
    
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { followingStories } = useSelector(store => store.story);
    const [loading, setLoading] = useState(false);
    const [currentStoryGroup, setCurrentStoryGroup] = useState(null);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

    const handleStoryClick = (storyGroup) => {
        setCurrentStoryGroup(storyGroup);
        setCurrentStoryIndex(0);
    };

    const handleNextStory = () => {
        if (currentStoryGroup && currentStoryIndex < currentStoryGroup.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else {
            closeStoryView();
        }
    };

    const handlePrevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        }
    };

    const closeStoryView = () => {
        setCurrentStoryGroup(null);
        setCurrentStoryIndex(0);
    };

    const viewStory = async (storyId) => {
        try {
            await axios.put(`http://localhost:5000/api/v1/story/view/${storyId}`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading stories...</div>;
    }

    return (
        <div className="flex gap-2 overflow-x-auto p-4 bg-white rounded-lg border">
            {/* Story creation button */}
            <div className="shrink-0">
                <div className="w-16 h-24 bg-linear-to-b from-pink-400 to-blue-500 rounded-lg flex items-center justify-center cursor-pointer border-2 border-pink-500">
                    <span className="text-white text-2xl">+</span>
                </div>
            </div>

            {/* Stories from following */}
            {followingStories.map((storyGroup) => (
                <div
                    key={storyGroup.author._id}
                    className="shrink-0 cursor-pointer"
                    onClick={() => handleStoryClick(storyGroup)}
                >
                    <div className="w-16 h-24 rounded-lg border-2 border-gray-300 overflow-hidden hover:border-pink-500">
                        <img
                            src={storyGroup.stories[0]?.image}
                            alt={storyGroup.author.username}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-xs mt-1 text-center truncate w-16">
                        {storyGroup.author.username}
                    </p>
                </div>
            ))}

            {/* Story Viewer Modal */}
            {currentStoryGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="relative w-full max-w-sm h-screen max-h-96">
                    {/* Story Image or Video */}
                        {currentStoryGroup.stories[currentStoryIndex]?.image ? (
                            <img
                                src={currentStoryGroup.stories[currentStoryIndex]?.image}
                                alt="story"
                                className="w-full h-full object-cover rounded-lg"
                                onLoad={() => viewStory(currentStoryGroup.stories[currentStoryIndex]._id)}
                            />
                        ) : currentStoryGroup.stories[currentStoryIndex]?.video ? (
                            <video
                                src={currentStoryGroup.stories[currentStoryIndex]?.video}
                                alt="story"
                                className="w-full h-full object-cover rounded-lg"
                                autoPlay
                                onPlay={() => viewStory(currentStoryGroup.stories[currentStoryIndex]._id)}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                <p>No media</p>
                            </div>
                        )}

                        {/* Story Text Overlay */}
                        {currentStoryGroup.stories[currentStoryIndex]?.text && (
                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 p-4">
                                <p className="text-white text-sm">
                                    {currentStoryGroup.stories[currentStoryIndex].text}
                                </p>
                            </div>
                        )}

                        {/* Author Info */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 px-3 py-2 rounded-full">
                            <img
                                src={currentStoryGroup.author.profilePicture}
                                alt={currentStoryGroup.author.username}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="text-white text-sm">{currentStoryGroup.author.username}</span>
                        </div>

                        {/* View Count */}
                        <div className="absolute top-4 right-4 bg-black/40 px-3 py-2 rounded text-white text-xs">
                            👁️ {currentStoryGroup.stories[currentStoryIndex]?.views?.length || 0}
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={handlePrevStory}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
                        >
                            ‹
                        </button>

                        <button
                            onClick={handleNextStory}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
                        >
                            ›
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={closeStoryView}
                            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                        >
                            ×
                        </button>

                        {/* Story Progress Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600 rounded-t-lg overflow-hidden">
                            <div
                                className="h-full bg-white"
                                style={{
                                    width: `${((currentStoryIndex + 1) / currentStoryGroup.stories.length) * 100}%`,
                                    transition: 'width 0.3s'
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stories;
