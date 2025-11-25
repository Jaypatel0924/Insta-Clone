import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, Hash, X, Clock, Grid3X3, Heart, MessageCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { debounce } from 'lodash';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    users: [],
    hashtags: [],
    posts: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeSection, setActiveSection] = useState('all'); // 'all', 'users', 'hashtags', 'posts'
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Handle URL search parameter
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
      setShowResults(true);
    }
  }, [searchParams]);

  // Save to recent searches
  const saveToRecentSearches = (item, type) => {
    const newSearch = {
      id: type === 'user' ? item._id : `hashtag-${item.name}`,
      type,
      data: item,
      timestamp: new Date().toISOString()
    };

    const updatedSearches = [
      newSearch,
      ...recentSearches.filter(search => 
        search.id !== newSearch.id
      )
    ].slice(0, 10);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults({ users: [], hashtags: [], posts: [] });
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/search?q=${encodeURIComponent(query)}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setSearchResults({
            users: res.data.users || [],
            hashtags: res.data.hashtags || [],
            posts: res.data.posts || []
          });
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults({ users: [], hashtags: [], posts: [] });
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(true);
    
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleUserClick = (user) => {
    saveToRecentSearches(user, 'user');
    navigate(`/profile/${user._id}`);
    setShowResults(false);
    setSearchQuery('');
    setSearchParams({});
  };

  const handleHashtagClick = (hashtag) => {
    saveToRecentSearches(hashtag, 'hashtag');
    navigate(`/explore/tags/${hashtag.name.replace('#', '')}`);
    setShowResults(false);
    setSearchQuery('');
    setSearchParams({});
  };

  const handlePostClick = (post) => {
    navigate(`/post/${post._id}`);
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    setSearchParams({});
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeRecentSearch = (id, e) => {
    e.stopPropagation();
    const updatedSearches = recentSearches.filter(search => search.id !== id);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Filter buttons component
  const FilterButtons = () => (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {[
        { key: 'all', label: 'All', count: searchResults.users.length + searchResults.hashtags.length + searchResults.posts.length },
        { key: 'users', label: 'Users', count: searchResults.users.length },
        { key: 'hashtags', label: 'Hashtags', count: searchResults.hashtags.length },
        { key: 'posts', label: 'Posts', count: searchResults.posts.length }
      ].map((filter) => (
        <button
          key={filter.key}
          onClick={() => setActiveSection(filter.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            activeSection === filter.key
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
          <span className={`text-xs ${
            activeSection === filter.key ? 'bg-white text-gray-900' : 'bg-gray-300 text-gray-700'
          } rounded-full px-2 py-1 min-w-6 text-center`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );

  // User card component
  const UserCard = ({ user, compact = false }) => (
    <div
      onClick={() => handleUserClick(user)}
      className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg ${
        compact ? 'border-0' : 'border border-gray-200'
      }`}
    >
      <Avatar className={compact ? "w-10 h-10" : "w-16 h-16"}>
        <AvatarImage src={user.profilePicture} />
        <AvatarFallback>{user.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${compact ? 'text-sm' : ''} truncate`}>{user.username}</p>
        <p className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'} truncate`}>
          {user.fullName}
        </p>
        {!compact && (
          <p className="text-gray-500 text-sm">
            {user.followersCount || 0} followers
          </p>
        )}
      </div>
      {!compact && (
        <Button variant="outline" size="sm">
          Follow
        </Button>
      )}
    </div>
  );

  // Hashtag card component
  const HashtagCard = ({ hashtag, compact = false }) => (
    <div
      onClick={() => handleHashtagClick(hashtag)}
      className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg ${
        compact ? 'border-0' : 'border border-gray-200'
      }`}
    >
      <div className={`rounded-full bg-blue-100 flex items-center justify-center ${
        compact ? 'w-10 h-10' : 'w-16 h-16'
      }`}>
        <Hash size={compact ? 18 : 24} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${compact ? 'text-sm' : 'text-lg'} truncate`}>
          {hashtag.name}
        </p>
        <p className={`text-gray-500 ${compact ? 'text-xs' : ''}`}>
          {hashtag.postCount || 0} posts
        </p>
      </div>
    </div>
  );

  // Post card component
  const PostCard = ({ post, compact = false }) => (
    <div
      onClick={() => handlePostClick(post)}
      className={`bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group ${
        compact ? 'aspect-square' : 'w-full h-48'
      }`}
    >
      <img
        src={post.image}
        alt="Post"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart size={16} />
            <span className="text-sm">{post.likesCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            <span className="text-sm">{post.commentsCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const hasResults = searchResults.users.length > 0 || searchResults.hashtags.length > 0 || searchResults.posts.length > 0;
  const showRecentSearches = recentSearches.length > 0 && !searchQuery && showResults;

  // Main search results content
  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Searching...</p>
        </div>
      );
    }

    if (!hasResults && searchQuery) {
      return (
        <div className="p-8 text-center text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <p>No results found for "{searchQuery}"</p>
          <p className="text-sm mt-2">Try searching for users, hashtags, or posts</p>
        </div>
      );
    }

    if (!searchQuery) {
      return null;
    }

    return (
      <div className="p-4">
        <FilterButtons />
        
        {/* All Results */}
        {activeSection === 'all' && (
          <div className="space-y-6">
            {/* Users Section */}
            {searchResults.users.length > 0 && (
              <section>
                <h3 className="font-semibold text-lg mb-3">Users</h3>
                <div className="space-y-2">
                  {searchResults.users.slice(0, 3).map(user => (
                    <UserCard key={user._id} user={user} compact />
                  ))}
                </div>
                {searchResults.users.length > 3 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => setActiveSection('users')}
                  >
                    View all {searchResults.users.length} users
                  </Button>
                )}
              </section>
            )}

            {/* Hashtags Section */}
            {searchResults.hashtags.length > 0 && (
              <section>
                <h3 className="font-semibold text-lg mb-3">Hashtags</h3>
                <div className="space-y-2">
                  {searchResults.hashtags.slice(0, 3).map(hashtag => (
                    <HashtagCard key={hashtag._id} hashtag={hashtag} compact />
                  ))}
                </div>
                {searchResults.hashtags.length > 3 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => setActiveSection('hashtags')}
                  >
                    View all {searchResults.hashtags.length} hashtags
                  </Button>
                )}
              </section>
            )}

            {/* Posts Section */}
            {searchResults.posts.length > 0 && (
              <section>
                <h3 className="font-semibold text-lg mb-3">Posts</h3>
                <div className="grid grid-cols-3 gap-2">
                  {searchResults.posts.slice(0, 6).map(post => (
                    <PostCard key={post._id} post={post} compact />
                  ))}
                </div>
                {searchResults.posts.length > 6 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => setActiveSection('posts')}
                  >
                    View all {searchResults.posts.length} posts
                  </Button>
                )}
              </section>
            )}
          </div>
        )}

        {/* Users Only */}
        {activeSection === 'users' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-3">Users ({searchResults.users.length})</h3>
            {searchResults.users.map(user => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}

        {/* Hashtags Only */}
        {activeSection === 'hashtags' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-3">Hashtags ({searchResults.hashtags.length})</h3>
            {searchResults.hashtags.map(hashtag => (
              <HashtagCard key={hashtag._id} hashtag={hashtag} />
            ))}
          </div>
        )}

        {/* Posts Only */}
        {activeSection === 'posts' && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Posts ({searchResults.posts.length})</h3>
            <div className="grid grid-cols-3 gap-3">
              {searchResults.posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <div className="sticky top-0 bg-white border-b border-gray-300 z-10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              type="text"
              className="w-full pl-12 pr-10 rounded-full bg-gray-100 border-0 focus-visible:ring-1 h-12 text-base"
              placeholder="Search users, hashtags, and posts..."
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Recent Searches */}
        {showRecentSearches && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Recent Searches</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecentSearches}
                className="text-blue-500 hover:text-blue-600 hover:bg-transparent"
              >
                Clear all
              </Button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search) => (
                <div
                  key={search.id}
                  onClick={() => {
                    if (search.type === 'user') {
                      handleUserClick(search.data);
                    } else {
                      handleHashtagClick(search.data);
                    }
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-200 group"
                >
                  {search.type === 'user' ? (
                    <>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={search.data.profilePicture} />
                        <AvatarFallback>
                          {search.data.username?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{search.data.username}</p>
                        <p className="text-xs text-gray-500">{search.data.fullName}</p>
                      </div>
                      <User size={16} className="text-gray-400" />
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Hash size={18} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{search.data.name}</p>
                        <p className="text-xs text-gray-500">
                          {search.data.postCount || 0} posts
                        </p>
                      </div>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => removeRecentSearch(search.id, e)}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {renderSearchResults()}

        {/* Empty State when no search and no recent searches */}
        {!searchQuery && !showRecentSearches && (
          <div className="text-center py-16 text-gray-500">
            <Search size={64} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Search Instagram</h3>
            <p>Search for users, hashtags, or posts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;