import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, Hash, X, Clock } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { debounce } from 'lodash';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    users: [],
    hashtags: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
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
    ].slice(0, 10); // Keep only 10 most recent

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults({ users: [], hashtags: [] });
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
            hashtags: res.data.hashtags || []
          });
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults({ users: [], hashtags: [] });
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery, performSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleUserClick = (user) => {
    saveToRecentSearches(user, 'user');
    navigate(`/profile/${user._id}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleHashtagClick = (hashtag) => {
    saveToRecentSearches(hashtag, 'hashtag');
    navigate(`/explore/tags/${hashtag.name.replace('#', '')}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
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

  const hasResults = searchResults.users.length > 0 || searchResults.hashtags.length > 0;
  const showRecentSearches = recentSearches.length > 0 && !searchQuery && showResults;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(true)}
          type="text"
          className="w-full pl-10 pr-10 rounded-full bg-gray-100 border-0 focus-visible:ring-1 h-12 text-base"
          placeholder="Search users and hashtags..."
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

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {/* Loading State */}
          {isSearching && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          )}

          {/* Search Results */}
          {!isSearching && searchQuery && (
            <>
              {/* Users Results */}
              {searchResults.users.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">
                    Users
                  </div>
                  {searchResults.users.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleUserClick(user)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback>
                          {user.username?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.fullName}</p>
                      </div>
                      <User size={16} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Hashtags Results */}
              {searchResults.hashtags.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">
                    Hashtags
                  </div>
                  {searchResults.hashtags.map((hashtag) => (
                    <div
                      key={hashtag._id}
                      onClick={() => handleHashtagClick(hashtag)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Hash size={18} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{hashtag.name}</p>
                        <p className="text-xs text-gray-500">
                          {hashtag.postCount || 0} posts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!hasResults && searchQuery && !isSearching && (
                <div className="p-4 text-center text-gray-500">
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )}
            </>
          )}

          {/* Recent Searches */}
          {!isSearching && showRecentSearches && (
            <div>
              <div className="flex justify-between items-center px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50">
                <span>Recent Searches</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-blue-500 hover:text-blue-600 hover:bg-transparent"
                >
                  Clear all
                </Button>
              </div>
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
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 group"
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
          )}
        </div>
      )}

      {/* Overlay to close results when clicking outside */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default SearchComponent;