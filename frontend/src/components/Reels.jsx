import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setReels, likeReel, incrementReelView } from '../redux/reelSlice';
import { Heart, MessageCircle, Share2, MoreVertical, Bookmark, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { timeAgo } from '@/lib/utils';

const Reels = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { reels } = useSelector(store => store.reel);
    const [loading, setLoading] = useState(false);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [timeLeft, setTimeLeft] = useState(5);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const lastScrollTimeRef = useRef(0);

    useEffect(() => {
        const fetchReels = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/v1/reel', {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setReels(res.data.reels));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReels();
    }, [dispatch]);

    const currentReel = reels[currentReelIndex];

    // Auto-advance to next reel after 5 seconds
    useEffect(() => {
        if (!reels.length) return;
        
        setTimeLeft(5);
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleNextReel();
                    return 5;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentReelIndex, reels.length]);

    useEffect(() => {
        if (currentReel) {
            setIsBookmarked(currentReel.bookmarks?.includes(user?._id) || false);
        }
    }, [currentReelIndex, reels, user]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                handlePrevReel();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                handleNextReel();
            } else if (e.key === ' ') {
                e.preventDefault();
                if (videoRef.current) {
                    videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [reels.length]);

    // Handle mouse wheel scroll
    useEffect(() => {
        const handleWheel = (e) => {
            // Throttle scroll to prevent too rapid changes
            const now = Date.now();
            if (now - lastScrollTimeRef.current < 500) return;
            
            if (e.deltaY > 0) {
                handleNextReel();
                lastScrollTimeRef.current = now;
            } else if (e.deltaY < 0) {
                handlePrevReel();
                lastScrollTimeRef.current = now;
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: true });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, [reels.length]);

    // Handle touch swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = (e) => {
        setTouchEnd(e.changedTouches[0].clientY);
        
        if (touchStart === null) return;
        
        const distance = touchStart - e.changedTouches[0].clientY;
        const isSwipe = Math.abs(distance) > 50;
        
        if (isSwipe) {
            // Throttle swipe to prevent too rapid changes
            const now = Date.now();
            if (now - lastScrollTimeRef.current < 500) return;
            
            if (distance > 0) {
                // Swiped up - next reel
                handleNextReel();
            } else {
                // Swiped down - previous reel
                handlePrevReel();
            }
            lastScrollTimeRef.current = now;
        }
    };

    const handleLike = async () => {
        if (!currentReel) return;
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/reel/${currentReel._id}/like`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                // Update local state immediately
                const updatedReels = reels.map(reel => 
                    reel._id === currentReel._id 
                        ? { ...reel, likes: res.data.reel.likes }
                        : reel
                );
                dispatch(setReels(updatedReels));
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to like reel');
        }
    };

    const handleShare = async () => {
        if (!currentReel) return;
        try {
            await axios.post(`http://localhost:5000/api/v1/reel/${currentReel._id}/share`, {}, {
                withCredentials: true
            });
            if (navigator.share) {
                navigator.share({
                    title: 'Check out this reel!',
                    text: currentReel.caption,
                    url: window.location.href
                });
            } else {
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBookmark = async () => {
        if (!currentReel) return;
        try {
            const res = await axios.get(
                `http://localhost:5000/api/v1/reel/${currentReel._id}/bookmark`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsBookmarked(!isBookmarked);
                toast.success(isBookmarked ? 'Removed from saved' : 'Saved to your collection');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to save reel');
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim() || !currentReel) return;
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/reel/${currentReel._id}/comment`, 
                { text: comment }, 
                { withCredentials: true }
            );
            if (res.data.success) {
                // Update reels with new comment
                const updatedReels = reels.map(reel => 
                    reel._id === currentReel._id 
                        ? { ...reel, comments: [...(reel.comments || []), res.data.comment] }
                        : reel
                );
                dispatch(setReels(updatedReels));
                setComment('');
                toast.success('Comment added!');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to add comment');
        }
    };

    const handleNextReel = () => {
        if (reels.length > 0) {
            setCurrentReelIndex((prev) => (prev + 1) % reels.length);
        }
    };

    const handlePrevReel = () => {
        if (reels.length > 0) {
            setCurrentReelIndex((prev) => (prev - 1 + reels.length) % reels.length);
        }
    };

    const handleViewCount = async () => {
        if (currentReel) {
            try {
                await axios.post(`http://localhost:5000/api/v1/reel/${currentReel._id}/view`, {}, {
                    withCredentials: true
                });
                dispatch(incrementReelView(currentReel._id));
            } catch (error) {
                console.log(error);
            }
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-700">Loading reels...</div>;
    }

    if (!reels.length) {
        return <div className="p-4 text-center text-gray-700">No reels available</div>;
    }

    if (!currentReel) {
        return <div className="p-4 text-center text-gray-700">No reels available</div>;
    }

    const isLiked = currentReel.likes.includes(user?._id);

    return (
        <>
            {/* Full Screen Reel Container - Adjusted for header */}
            <div 
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="fixed inset-0 bg-black overflow-hidden z-30 top-14 lg:top-0"
            >
                {/* Main Video Area */}
                <div className="w-full h-full flex items-center justify-center relative">
                    {/* Video */}
                    <div className="relative w-full h-full bg-black">
                        {currentReel.video ? (
                            <video
                                ref={videoRef}
                                src={currentReel.video}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted={isMuted}
                                onPlay={handleViewCount}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-white text-lg">Video not available</p>
                            </div>
                        )}

                        {/* Progress Bar - Top */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700 bg-opacity-50 z-20">
                            <div
                                className="h-full bg-white transition-all"
                                style={{ width: `${(5 - timeLeft) / 5 * 100}%` }}
                            />
                        </div>

                        {/* Header - Top with User Info and Menu (Instagram Style) */}
                        <div className="absolute top-0 left-0 right-0 z-30 bg-linear-to-b from-black/60 via-black/30 to-transparent p-4 flex items-center justify-between">
                            {/* User Info Left */}
                            <div className="flex items-center gap-3">
                                {currentReel.author?.profilePicture ? (
                                    <img
                                        src={currentReel.author.profilePicture}
                                        alt={currentReel.author.username}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-600 flex items-center justify-center text-white font-bold">
                                        {currentReel.author?.username?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-white font-bold text-sm md:text-base truncate">{currentReel.author?.username}</p>
                                    <p className="text-white/70 text-xs">{timeAgo(currentReel.createdAt)}</p>
                                </div>
                            </div>

                            {/* Right Controls */}
                            <div className="flex items-center gap-3">
                                {/* Timer - Inline */}
                                <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                    {timeLeft}s
                                </div>

                                {/* Volume Control */}
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition"
                                >
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>

                                {/* More Menu */}
                                <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Caption - Bottom Left */}
                        {currentReel.caption && (
                            <div className="absolute bottom-32 md:bottom-24 left-4 right-20 z-20 max-h-24 overflow-y-auto">
                                <p className="text-white text-sm leading-relaxed bg-black/40 p-3 rounded-lg">
                                    <span className="font-semibold mr-2">{currentReel.author?.username}</span>
                                    {currentReel.caption}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons - Right Side */}
                        <div className="absolute right-4 bottom-32 md:bottom-20 z-30 flex flex-col items-center gap-6">
                            {/* Like Button */}
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    onClick={handleLike}
                                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition transform hover:scale-110"
                                >
                                    <Heart
                                        size={28}
                                        className={isLiked ? 'fill-red-500 text-red-500' : ''}
                                    />
                                </button>
                                <p className="text-white text-xs font-semibold">{currentReel.likes?.length || 0}</p>
                            </div>

                            {/* Comment Button */}
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    onClick={() => setShowComments(!showComments)}
                                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition transform hover:scale-110"
                                >
                                    <MessageCircle size={28} />
                                </button>
                                <p className="text-white text-xs font-semibold">{currentReel.comments?.length || 0}</p>
                            </div>

                            {/* Share Button */}
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    onClick={handleShare}
                                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition transform hover:scale-110"
                                >
                                    <Share2 size={28} />
                                </button>
                                <p className="text-white text-xs font-semibold">Share</p>
                            </div>

                            {/* Bookmark Button */}
                            <div className="flex flex-col items-center gap-1">
                                <button
                                    onClick={handleBookmark}
                                    className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition transform hover:scale-110"
                                >
                                    <Bookmark
                                        size={28}
                                        className={isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}
                                    />
                                </button>
                                <p className="text-white text-xs font-semibold">Save</p>
                            </div>
                        </div>

                        {/* Navigation Arrows - Desktop Only */}
                        <button
                            onClick={handlePrevReel}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition hidden md:flex"
                        >
                            ▲
                        </button>

                        {/* Reel Counter */}
                        <div className="absolute top-4 left-0 right-0 flex justify-center z-30">
                            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {currentReelIndex + 1} / {reels.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 md:hidden bg-linear-to-t from-black via-black/80 to-transparent z-40 pt-6">
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/20">
                        {/* Previous Button */}
                        <button
                            onClick={handlePrevReel}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition text-xs font-semibold flex items-center justify-center gap-1"
                        >
                            ↑ Prev
                        </button>

                        {/* Reel Info */}
                        <div className="flex-1 text-center px-2">
                            <p className="text-white font-bold text-sm">{currentReel.author?.username}</p>
                            <p className="text-white/60 text-xs">{currentReelIndex + 1} / {reels.length}</p>
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={handleNextReel}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition text-xs font-semibold flex items-center justify-center gap-1"
                        >
                            Next ↓
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Modal */}
            {showComments && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
                    <div className="bg-white rounded-t-2xl w-full md:max-w-md h-96 flex flex-col animate-in slide-in-from-bottom">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h3 className="font-bold text-lg text-gray-900">Comments</h3>
                            <button
                                onClick={() => setShowComments(false)}
                                className="text-2xl hover:opacity-70 font-light text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        {/* Comments List - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {currentReel.comments && currentReel.comments.length > 0 ? (
                                currentReel.comments.map((comment) => (
                                    <div key={comment._id} className="flex gap-3">
                                        {comment.author?.profilePicture ? (
                                            <img
                                                src={comment.author.profilePicture}
                                                alt={comment.author.username}
                                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {comment.author?.username?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-gray-100 rounded-lg px-3 py-2">
                                                <p className="font-semibold text-sm text-gray-900">{comment.author?.username}</p>
                                                <p className="text-sm text-gray-700 whitespace-normal">{comment.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 text-sm py-8">No comments yet. Be the first!</p>
                            )}
                        </div>

                        {/* Add Comment Input - Fixed at Bottom */}
                        <div className="border-t border-gray-200 p-4 bg-white">
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                    placeholder="Add a comment..."
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 bg-white"
                                    autoFocus
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!comment.trim()}
                                    className="text-blue-500 hover:text-blue-600 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Reels;
