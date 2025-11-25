import React, { useRef, useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, X, Image, Smile, MapPin, Users, ChevronLeft, Search, Check, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const videoRef = useRef();
  const textareaRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [contentType, setContentType] = useState('post'); // 'post', 'reel', 'story'
  
  // New states for features
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showTagPeople, setShowTagPeople] = useState(false);
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  // Common emojis for quick selection
  const commonEmojis = ['😊', '😂', '❤️', '🔥', '👍', '👏', '🎉', '🙏', '🥰', '😍', '🤩', '😎', '🤗', '👋', '💕', '🌟', '💯', '😘'];

  // Get user's current location
  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use OpenStreetMap Nominatim API for reverse geocoding (free)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const locationName = getLocationName(data.address);
            setUserLocation(locationName);
            setSelectedLocation(locationName);
            toast.success('Location detected successfully!');
          }
        } catch (error) {
          console.error('Error getting location:', error);
          toast.error('Failed to get location details');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationLoading(false);
        toast.error('Unable to access your location');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Helper function to format location name
  const getLocationName = (address) => {
    if (address.road && address.city) {
      return `${address.road}, ${address.city}`;
    } else if (address.city) {
      return address.city;
    } else if (address.town) {
      return address.town;
    } else if (address.village) {
      return address.village;
    } else if (address.county) {
      return address.county;
    } else if (address.state) {
      return address.state;
    } else if (address.country) {
      return address.country;
    }
    return 'Current Location';
  };

  // Search locations using OpenStreetMap Nominatim API
  const searchLocations = async (query) => {
    if (!query.trim()) return;
    
    try {
      setSearchLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`
      );
      const data = await response.json();
      
      const formattedLocations = data.map(item => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        type: item.type
      }));
      
      setLocations(formattedLocations);
    } catch (error) {
      console.error('Error searching locations:', error);
      toast.error('Failed to search locations');
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (showLocationSearch && locationSearchQuery) {
      const delaySearch = setTimeout(() => {
        searchLocations(locationSearchQuery);
      }, 500); // Debounce search

      return () => clearTimeout(delaySearch);
    } else if (showLocationSearch && !locationSearchQuery) {
      setLocations([]);
    }
  }, [locationSearchQuery, showLocationSearch]);

  // Fetch real users from API for tagging
  useEffect(() => {
    const fetchUsers = async () => {
      if (showTagPeople && tagSearchQuery.trim()) {
        try {
          setSearchLoading(true);
          const res = await axios.get(
            `http://localhost:5000/api/v1/user/search?q=${encodeURIComponent(tagSearchQuery)}`,
            { withCredentials: true }
          );

          if (res.data.success) {
            // Filter out current user and already tagged users
            const filteredUsers = res.data.users.filter(
              u => u._id !== user?._id && !taggedUsers.find(tagged => tagged._id === u._id)
            );
            setSuggestedUsers(filteredUsers);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          // Fallback to mock data if API fails
          const mockUsers = getMockUsers(tagSearchQuery).filter(
            u => u._id !== user?._id && !taggedUsers.find(tagged => tagged._id === u._id)
          );
          setSuggestedUsers(mockUsers);
        } finally {
          setSearchLoading(false);
        }
      } else if (showTagPeople && !tagSearchQuery.trim()) {
        // Show suggested users when search is empty
        fetchSuggestedUsers();
      }
    };

    fetchUsers();
  }, [tagSearchQuery, showTagPeople, user?._id, taggedUsers]);

  // Mock users fallback
  const getMockUsers = (query) => {
    const mockUsers = [
      { _id: '1', username: 'alex_johnson', fullName: 'Alex Johnson', profilePicture: '' },
      { _id: '2', username: 'sarah_m', fullName: 'Sarah Miller', profilePicture: '' },
      { _id: '3', username: 'mike_taylor', fullName: 'Mike Taylor', profilePicture: '' },
      { _id: '4', username: 'emma_wilson', fullName: 'Emma Wilson', profilePicture: '' },
      { _id: '5', username: 'john_doe', fullName: 'John Doe', profilePicture: '' },
      { _id: '6', username: 'lisa_ray', fullName: 'Lisa Ray', profilePicture: '' },
    ];
    
    if (!query) return mockUsers.slice(0, 4);
    
    return mockUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.fullName.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Fetch suggested users (followed users or recent interactions)
  const fetchSuggestedUsers = async () => {
    try {
      setSearchLoading(true);
      // Try to get followed users or suggested users
      const res = await axios.get(
        'http://localhost:5000/api/v1/user/following',
        { withCredentials: true }
      );

      if (res.data.success && res.data.following) {
        const filteredUsers = res.data.following.filter(
          u => u._id !== user?._id && !taggedUsers.find(tagged => tagged._id === u._id)
        );
        setSuggestedUsers(filteredUsers.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      // Fallback to mock data
      setSuggestedUsers(getMockUsers('').slice(0, 4));
    } finally {
      setSearchLoading(false);
    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (contentType === 'post') {
        if (!file.type.startsWith('image/')) {
          toast.error('Please select an image file');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error('Image size should be less than 10MB');
          return;
        }
      } else if (contentType === 'reel' || contentType === 'story') {
        if (!file.type.startsWith('video/')) {
          toast.error('Please select a video file');
          return;
        }
        if (file.size > 100 * 1024 * 1024) {
          toast.error('Video size should be less than 100MB');
          return;
        }
        // Check video duration
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          if (contentType === 'reel' && video.duration < 30) {
            toast.error('Reel must be at least 30 seconds');
            return;
          }
          if (contentType === 'story' && video.duration > 120) {
            toast.error('Story must be less than 2 minutes');
            return;
          }
          setVideoDuration(video.duration);
        };
        video.src = URL.createObjectURL(file);
      }

      setFile(file);
      
      if (contentType === 'post') {
        const dataUrl = await readFileAsDataURL(file);
        setImagePreview(dataUrl);
      } else {
        const dataUrl = await readFileAsDataURL(file);
        setImagePreview(dataUrl);
      }
      setCurrentStep(2);
    }
  };

  const addEmoji = (emoji) => {
    setCaption(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.display_name);
    setShowLocationSearch(false);
    setLocationSearchQuery("");
  };

  const handleTagUser = (userToTag) => {
    if (!taggedUsers.find(u => u._id === userToTag._id)) {
      setTaggedUsers(prev => [...prev, userToTag]);
      // Add tag to caption in a clean way
      const newCaption = caption.trim() + (caption.trim() ? ' ' : '') + `@${userToTag.username}`;
      setCaption(newCaption);
    }
    setShowTagPeople(false);
    setTagSearchQuery("");
    textareaRef.current?.focus();
  };

  const removeTaggedUser = (userId) => {
    const userToRemove = taggedUsers.find(u => u._id === userId);
    if (userToRemove) {
      // Remove the @username from caption
      const usernameRegex = new RegExp(`@${userToRemove.username}\\b`, 'g');
      const newCaption = caption.replace(usernameRegex, '').replace(/\s+/g, ' ').trim();
      setCaption(newCaption);
    }
    setTaggedUsers(prev => prev.filter(u => u._id !== userId));
  };

  const createPostHandler = async () => {
    if (!imagePreview) {
      toast.error('Please select content first');
      return;
    }

    if (!file) {
      toast.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption || "");
    
    // Add location as JSON object with placeName
    if (selectedLocation) {
      formData.append("location", JSON.stringify({
        placeName: selectedLocation,
        latitude: null,
        longitude: null
      }));
    }
    
    if (taggedUsers.length > 0) {
      formData.append("taggedUsers", JSON.stringify(taggedUsers.map(u => u._id)));
    }
    
    if (file) {
      if (contentType === 'post') {
        formData.append("image", file);
      } else if (contentType === 'reel') {
        formData.append("video", file);
      } else if (contentType === 'story') {
        formData.append("file", file);
      }
    }

    try {
      setLoading(true);
      let endpoint = 'http://localhost:5000/api/v1/post/addpost';
      
      if (contentType === 'reel') {
        endpoint = 'http://localhost:5000/api/v1/reel/create';
      } else if (contentType === 'story') {
        endpoint = 'http://localhost:5000/api/v1/story/create';
      }

      const res = await axios.post(
        endpoint,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      if (res.data.success) {
        if (contentType === 'post') {
          dispatch(setPosts([res.data.post, ...posts]));
          toast.success('Your post has been shared!');
        } else if (contentType === 'reel') {
          toast.success('Your reel has been uploaded!');
        } else if (contentType === 'story') {
          toast.success('Your story has been shared!');
        }
        resetForm();
        setOpen(false);
      }
    } catch (error) {
      console.error('Post creation error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || `Failed to create ${contentType}`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile("");
    setCaption("");
    setImagePreview("");
    setCurrentStep(1);
    setLoading(false);
    setShowEmojiPicker(false);
    setShowLocationSearch(false);
    setShowTagPeople(false);
    setLocations([]);
    setSearchQuery("");
    setLocationSearchQuery("");
    setTagSearchQuery("");
    setTaggedUsers([]);
    setSuggestedUsers([]);
    setSelectedLocation("");
    setSearchLoading(false);
    setLocationLoading(false);
    setUserLocation(null);
    setVideoDuration(0);
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker || showLocationSearch || showTagPeople) {
        setShowEmojiPicker(false);
        setShowLocationSearch(false);
        setShowTagPeople(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker, showLocationSearch, showTagPeople]);

  // Step 1: Select Image
  const renderSelectImageStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {currentStep === 1 && (
        <div className="text-center mb-8 w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Choose post type</h3>
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={() => {
                setContentType('post');
                imageRef.current?.click();
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                contentType === 'post'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Post
            </button>
            <button
              onClick={() => {
                setContentType('reel');
                videoRef.current?.click();
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                contentType === 'reel'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Reel (30s+)
            </button>
            <button
              onClick={() => {
                setContentType('story');
                videoRef.current?.click();
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                contentType === 'story'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Story
            </button>
          </div>
        </div>
      )}
      <div className="text-center mb-8">
        <div className="w-24 h-24 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Image size={40} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-light text-gray-800 mb-2">Drag {contentType === 'post' ? 'photos' : 'videos'} here</h3>
      </div>
      
      <Button
        onClick={() => {
          if (contentType === 'post') {
            imageRef.current?.click();
          } else {
            videoRef.current?.click();
          }
        }}
        className="bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
      >
        Select from computer
      </Button>
    </div>
  );

  // Emoji Picker Component
  const EmojiPicker = () => (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 w-64">
      <div className="grid grid-cols-8 gap-1">
        {commonEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => addEmoji(emoji)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  // Location Search Component
  const LocationSearch = () => (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={locationSearchQuery}
            onChange={(e) => setLocationSearchQuery(e.target.value)}
            placeholder="Search locations..."
            className="w-full pl-8 pr-3 py-2 text-sm border-none focus:outline-none"
            autoFocus
          />
        </div>
        
        {/* Current Location Button */}
        <button
          onClick={getUserCurrentLocation}
          disabled={locationLoading}
          className="w-full flex items-center gap-2 px-2 py-2 text-sm text-blue-500 hover:bg-blue-50 rounded mt-2 disabled:opacity-50"
        >
          <Navigation size={14} />
          {locationLoading ? 'Detecting location...' : 'Use current location'}
        </button>
      </div>
      
      <div className="py-1">
        {searchLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 size={16} className="animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Searching locations...</span>
          </div>
        ) : locations.length > 0 ? (
          locations.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(location)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="font-medium">{location.display_name.split(',')[0]}</div>
                <div className="text-gray-500 text-xs truncate">
                  {location.display_name.split(',').slice(1).join(',').trim()}
                </div>
              </div>
              {selectedLocation === location.display_name && <Check size={16} className="text-blue-500 shrink-0" />}
            </button>
          ))
        ) : locationSearchQuery ? (
          <div className="px-3 py-4 text-sm text-gray-500 text-center">
            No locations found
          </div>
        ) : (
          <div className="px-3 py-4 text-sm text-gray-500 text-center">
            Search for locations or use current location
          </div>
        )}
      </div>
    </div>
  );

  // Tag People Component
  const TagPeople = () => (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={tagSearchQuery}
            onChange={(e) => setTagSearchQuery(e.target.value)}
            placeholder="Search people..."
            className="w-full pl-8 pr-3 py-2 text-sm border-none focus:outline-none"
            autoFocus
          />
        </div>
      </div>
      <div className="py-1">
        {searchLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 size={16} className="animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Searching users...</span>
          </div>
        ) : suggestedUsers.length > 0 ? (
          suggestedUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleTagUser(user)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="text-xs">
                  {user.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="font-semibold">{user.username}</div>
                <div className="text-gray-500 text-xs">{user.fullName}</div>
              </div>
            </button>
          ))
        ) : (
          <div className="px-3 py-4 text-sm text-gray-500 text-center">
            {tagSearchQuery ? 'No users found' : 'Search for users to tag'}
          </div>
        )}
      </div>
    </div>
  );

  // Step 2: Edit Post
  const renderEditPostStep = () => (
    <div className="flex flex-col md:flex-row h-[80vh] max-h-[700px]">
      {/* Left Side - Image/Video Preview */}
      <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-auto">
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {contentType === 'post' ? (
            <img
              src={imagePreview}
              alt="preview"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={imagePreview}
              controls
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      </div>

      {/* Right Side - Post Details */}
      <div className="w-full md:w-80 flex flex-col border-t md:border-t-0 md:border-l border-gray-300">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-300">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="text-xs">
              {user?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">{user?.username}</span>
        </div>

        {/* Caption Input */}
        <div className="flex-1 p-4 relative bg-white overflow-y-auto">
          <textarea
            ref={textareaRef}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full h-32 resize-none border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3 text-sm placeholder-gray-400 bg-white text-gray-900 font-medium"
            maxLength={2200}
          />
          
          {/* Character Count and Emoji */}
          <div className="flex justify-between items-center mt-3 relative">
            <div className="relative">
              <Smile 
                size={20} 
                className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowLocationSearch(false);
                  setShowTagPeople(false);
                }}
              />
              {showEmojiPicker && <EmojiPicker />}
            </div>
            <span className="text-xs font-medium text-gray-500">{caption.length}/2,200</span>
          </div>

          {/* Tagged Users Display */}
          {taggedUsers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {taggedUsers.map(user => (
                <div key={user._id} className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-xs border border-blue-200 font-semibold text-blue-700">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback className="text-[8px] bg-blue-200 text-blue-900">
                      {user.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  @{user.username}
                  <button 
                    onClick={() => removeTaggedUser(user._id)} 
                    className="text-blue-500 hover:text-blue-700 ml-1 font-bold"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Selected Location Display */}
          {selectedLocation && (
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
              <MapPin size={14} className="text-gray-600" />
              <span className="flex-1 truncate">{selectedLocation}</span>
              <button 
                onClick={() => setSelectedLocation("")} 
                className="text-gray-500 hover:text-gray-700 font-bold"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Additional Options */}
          <div className="space-y-2 mt-6">
            <div className="relative">
              <button
                onClick={() => {
                  setShowTagPeople(!showTagPeople);
                  setShowLocationSearch(false);
                  setShowEmojiPicker(false);
                  setTagSearchQuery("");
                }}
                className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer py-2 w-full font-semibold text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">Tag people</span>
                </div>
              </button>
              {showTagPeople && <TagPeople />}
            </div>
            
            <div className="relative">
              <button
                onClick={() => {
                  setShowLocationSearch(!showLocationSearch);
                  setShowTagPeople(false);
                  setShowEmojiPicker(false);
                  setLocationSearchQuery("");
                }}
                className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer py-2 w-full font-semibold text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">Add location</span>
                </div>
              </button>
              {showLocationSearch && <LocationSearch />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <Button
            onClick={createPostHandler}
            disabled={loading || !imagePreview}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              'Share Post'
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 max-w-4xl w-full mx-4 md:mx-auto overflow-hidden bg-white rounded-lg">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Share photos and videos with your followers</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex items-center gap-2">
            {currentStep === 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentStep(1)}
                className="h-8 w-8 p-0 hover:bg-transparent"
              >
                <ChevronLeft size={20} />
              </Button>
            )}
            <X 
              size={20} 
              className="cursor-pointer text-gray-800" 
              onClick={handleClose}
            />
          </div>
          
          <h2 className="font-semibold text-base text-gray-800 flex-1 text-center">
            {currentStep === 1 
              ? 'Create new ' + contentType 
              : 'Edit ' + contentType}
          </h2>
          
          {currentStep === 2 && (
            <Button
              variant="ghost"
              onClick={createPostHandler}
              disabled={loading}
              className="text-[#0095F6] font-semibold hover:text-[#1877F2] hover:bg-transparent px-3 py-1 text-sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Share'
              )}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="w-full">
          {currentStep === 1 ? renderSelectImageStep() : renderEditPostStep()}
        </div>

        {/* Hidden file input */}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={fileChangeHandler}
        />
        <input
          ref={videoRef}
          type="file"
          className="hidden"
          accept="video/*"
          onChange={fileChangeHandler}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;