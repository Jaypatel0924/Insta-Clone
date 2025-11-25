import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Search } from 'lucide-react';

const Explore = () => {
    const [explorePosts, setExplorePosts] = useState([]);
    const [exploreReels, setExploreReels] = useState([]);
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [trendingReels, setTrendingReels] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeTab, setActiveTab] = useState('posts'); // posts, reels, users
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchExploreContent();
    }, []);

    const fetchExploreContent = async () => {
        try {
            setLoading(true);
            const [postsRes, reelsRes, trendingPostsRes, trendingReelsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/v1/explore/posts', { withCredentials: true }),
                axios.get('http://localhost:5000/api/v1/explore/reels', { withCredentials: true }),
                axios.get('http://localhost:5000/api/v1/explore/trending/posts', { withCredentials: true }),
                axios.get('http://localhost:5000/api/v1/explore/trending/reels', { withCredentials: true }),
                axios.get('http://localhost:5000/api/v1/explore/users', { withCredentials: true })
            ]);

            if (postsRes.data.success) setExplorePosts(postsRes.data.posts);
            if (reelsRes.data.success) setExploreReels(reelsRes.data.reels);
            if (trendingPostsRes.data.success) setTrendingPosts(trendingPostsRes.data.posts);
            if (trendingReelsRes.data.success) setTrendingReels(trendingReelsRes.data.reels);
            if (usersRes.data.success) setSuggestedUsers(usersRes.data.users);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            if (activeTab === 'users') {
                const res = await axios.get(`http://localhost:5000/api/v1/explore/search/users?q=${searchQuery}`, {
                    withCredentials: true
                });
                setSearchResults(res.data.users || []);
            } else if (activeTab === 'posts') {
                const res = await axios.get(`http://localhost:5000/api/v1/explore/search/posts?q=${searchQuery}`, {
                    withCredentials: true
                });
                setSearchResults(res.data.posts || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchHashtag = async () => {
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/v1/explore/search/hashtags?q=${searchQuery}`, {
                withCredentials: true
            });
            setSearchResults(res.data.posts || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Search Bar */}
            <div className="mb-6 flex gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users, posts, or #hashtags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                >
                    Search
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`pb-2 font-semibold ${activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab('reels')}
                    className={`pb-2 font-semibold ${activeTab === 'reels' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Reels
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-2 font-semibold ${activeTab === 'users' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('trending')}
                    className={`pb-2 font-semibold ${activeTab === 'trending' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Trending
                </button>
            </div>

            {loading && <div className="text-center py-10">Loading...</div>}

            {/* Posts Grid */}
            {activeTab === 'posts' && !loading && (
                <div className="grid grid-cols-3 gap-4">
                    {(searchResults.length > 0 ? searchResults : explorePosts).map((post) => (
                        <div key={post._id} className="relative group overflow-hidden rounded-lg bg-gray-200">
                            <img
                                src={post.image}
                                alt="post"
                                className="w-full h-80 object-cover group-hover:opacity-75"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition">
                                <div className="flex items-center gap-1 text-white">
                                    <Heart size={20} />
                                    <span>{post.likes?.length || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 text-white">
                                    <MessageCircle size={20} />
                                    <span>{post.comments?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reels Grid */}
            {activeTab === 'reels' && !loading && (
                <div className="grid grid-cols-3 gap-4">
                    {(searchResults.length > 0 ? searchResults : exploreReels).map((reel) => (
                        <div key={reel._id} className="relative group overflow-hidden rounded-lg bg-gray-200">
                            <video
                                src={reel.video}
                                className="w-full h-80 object-cover group-hover:opacity-75"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition">
                                <div className="flex items-center gap-1 text-white">
                                    <Heart size={20} />
                                    <span>{reel.likes?.length || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 text-white">
                                    <MessageCircle size={20} />
                                    <span>{reel.comments?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Users Grid */}
            {activeTab === 'users' && !loading && (
                <div className="grid grid-cols-4 gap-4">
                    {(searchResults.length > 0 ? searchResults : suggestedUsers).map((suggestedUser) => (
                        <div key={suggestedUser._id} className="bg-white rounded-lg p-4 text-center border">
                            <img
                                src={suggestedUser.profilePicture}
                                alt={suggestedUser.username}
                                className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                            />
                            <h3 className="font-semibold text-sm">{suggestedUser.username}</h3>
                            <p className="text-xs text-gray-500 mb-3">{suggestedUser.followers?.length || 0} followers</p>
                            <button className="w-full bg-blue-500 text-white py-1 rounded text-xs hover:bg-blue-600 font-semibold">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Trending */}
            {activeTab === 'trending' && !loading && (
                <div className="space-y-4">
                    <div>
                        <h2 className="font-bold text-lg mb-4">Trending Posts</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {trendingPosts.slice(0, 9).map((post) => (
                                <div key={post._id} className="relative group overflow-hidden rounded-lg bg-gray-200">
                                    <img
                                        src={post.image}
                                        alt="post"
                                        className="w-full h-80 object-cover group-hover:opacity-75"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="font-bold text-lg mb-4">Trending Reels</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {trendingReels.slice(0, 9).map((reel) => (
                                <div key={reel._id} className="relative group overflow-hidden rounded-lg bg-gray-200">
                                    <video
                                        src={reel.video}
                                        className="w-full h-80 object-cover group-hover:opacity-75"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Explore;
