import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Plus, X, Loader } from 'lucide-react';
import { toast } from 'sonner';

const StoriesFeed = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const { followingStories } = useSelector(store => store.story || { followingStories: [] });
  const [selectedStoryGroup, setSelectedStoryGroup] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [viewedStories, setViewedStories] = useState(new Set());
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [storyFile, setStoryFile] = useState(null);
  const [storyText, setStoryText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-advance story every 5 seconds
  useEffect(() => {
    if (!selectedStoryGroup) return;

    const timer = setTimeout(() => {
      handleNextStory();
    }, 5000);

    storyTimerRef.current = timer;
    return () => clearTimeout(timer);
  }, [selectedStoryGroup, currentStoryIndex]);

  // Update progress bar
  useEffect(() => {
    if (!selectedStoryGroup) return;

    const interval = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [selectedStoryGroup, currentStoryIndex]);

  // Handle story click to open viewer
  const handleStoryClick = async (storyGroup, index = 0) => {
    setSelectedStoryGroup(storyGroup);
    setCurrentStoryIndex(index);
    setStoryProgress(0);
    
    // Mark as viewed
    if (storyGroup.stories[index] && !viewedStories.has(storyGroup.stories[index]._id)) {
      try {
        await axios.put(
          `http://localhost:5000/api/v1/story/view/${storyGroup.stories[index]._id}`,
          {},
          { withCredentials: true }
        );
        setViewedStories(prev => new Set(prev).add(storyGroup.stories[index]._id));
      } catch (error) {
        console.log('Error marking story as viewed:', error);
      }
    }
  };

  // Handle next story
  const handleNextStory = () => {
    if (selectedStoryGroup && currentStoryIndex < selectedStoryGroup.stories.length - 1) {
      handleStoryClick(selectedStoryGroup, currentStoryIndex + 1);
    } else if (followingStories && followingStories.length > 0) {
      // Move to next user's stories
      const currentGroupIndex = followingStories.findIndex(g => g.author._id === selectedStoryGroup?.author._id);
      if (currentGroupIndex !== -1 && currentGroupIndex < followingStories.length - 1) {
        handleStoryClick(followingStories[currentGroupIndex + 1], 0);
      } else {
        closeStories();
      }
    } else {
      closeStories();
    }
  };

  // Handle previous story
  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      handleStoryClick(selectedStoryGroup, currentStoryIndex - 1);
    }
  };

  // Close story viewer
  const closeStories = () => {
    setSelectedStoryGroup(null);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
  };

  // Handle story file selection
  const handleStoryFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setStoryFile(file);
    }
  };

  // Upload story
  const handleUploadStory = async () => {
    if (!storyFile && !storyText) {
      toast.error('Please add image/video or text to your story');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      
      if (storyFile) {
        formData.append('file', storyFile);
      }
      if (storyText) {
        formData.append('text', storyText);
      }

      const res = await axios.post(
        'http://localhost:5000/api/v1/story/create',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data.success) {
        toast.success('Story posted!');
        setShowCreateStory(false);
        setStoryFile(null);
        setStoryText('');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to post story');
    } finally {
      setIsUploading(false);
    }
  };

  // Get current story
  const currentStory = selectedStoryGroup?.stories[currentStoryIndex];

  if (!followingStories || followingStories.length === 0) {
    return (
      <div className='bg-white border border-gray-200 rounded-lg p-4 mb-4'>
        <p className='text-center text-gray-500 text-sm'>No stories available. Start by following users!</p>
      </div>
    );
  }

  return (
    <>
      {/* Stories Container - Horizontal Scroll */}
      <div className='bg-white border border-gray-200 rounded-lg p-4 mb-4 overflow-x-auto'>
        <div className='flex gap-4'>
          {/* Add Story Button */}
          <div 
            onClick={() => setShowCreateStory(true)}
            className='flex flex-col items-center gap-2 min-w-max cursor-pointer group'
          >
            <div className='relative'>
              <Avatar className='w-16 h-16 group-hover:opacity-80 transition'>
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
                <AvatarFallback className='text-lg font-semibold bg-linear-to-br from-purple-400 to-pink-500 text-white'>
                  {user?.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className='absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition'>
                <Plus size={14} />
              </button>
            </div>
            <p className='text-xs text-center text-gray-600 max-w-16 truncate'>Your Story</p>
          </div>

          {/* Stories List */}
          {followingStories.map((storyGroup, idx) => (
            <div
              key={idx}
              onClick={() => handleStoryClick(storyGroup, 0)}
              className='flex flex-col items-center gap-2 min-w-max cursor-pointer group'
            >
              <div className={`relative ${viewedStories.has(storyGroup.stories[0]?._id) ? 'ring-2 ring-gray-300' : 'ring-2 ring-pink-500'} group-hover:ring-4 transition`}>
                <Avatar className='w-16 h-16 group-hover:opacity-80 transition'>
                  <AvatarImage 
                    src={storyGroup.stories[0]?.image || storyGroup.stories[0]?.video || storyGroup.author?.profilePicture} 
                    alt={storyGroup.author?.username} 
                  />
                  <AvatarFallback className='text-lg font-semibold'>
                    {storyGroup.author?.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className='text-xs text-center text-gray-600 max-w-16 truncate group-hover:text-gray-900 transition'>
                {storyGroup.author?.username}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Creation Modal */}
      {showCreateStory && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg w-full max-w-md overflow-hidden'>
            {/* Header */}
            <div className='flex justify-between items-center p-4 border-b border-gray-200'>
              <h3 className='font-bold text-lg'>Create Story</h3>
              <button
                onClick={() => {
                  setShowCreateStory(false);
                  setStoryFile(null);
                  setStoryText('');
                }}
                className='text-2xl hover:opacity-70 font-light'
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className='p-4 space-y-4'>
              {/* Preview or Upload Area */}
              {storyFile ? (
                <div className='relative w-full h-64 bg-black rounded-lg overflow-hidden'>
                  {storyFile.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(storyFile)}
                      alt='Story preview'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(storyFile)}
                      className='w-full h-full object-cover'
                      controls
                    />
                  )}
                  <button
                    onClick={() => setStoryFile(null)}
                    className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600'
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className='w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition bg-gray-50 hover:bg-gray-100'
                >
                  <Plus size={40} className='text-gray-400 mb-2' />
                  <p className='text-gray-600 text-sm font-medium'>Click to add image or video</p>
                  <p className='text-gray-500 text-xs'>Up to 100MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*,video/*'
                onChange={handleStoryFileChange}
                className='hidden'
              />

              {/* Text Input */}
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder='Add text to your story (optional)'
                className='w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none h-20'
              />
            </div>

            {/* Actions */}
            <div className='flex gap-3 p-4 border-t border-gray-200'>
              <button
                onClick={() => {
                  setShowCreateStory(false);
                  setStoryFile(null);
                  setStoryText('');
                }}
                className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm transition'
              >
                Cancel
              </button>
              <button
                onClick={handleUploadStory}
                disabled={isUploading || (!storyFile && !storyText)}
                className='flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {isUploading && <Loader size={16} className='animate-spin' />}
                {isUploading ? 'Posting...' : 'Post Story'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {selectedStoryGroup && currentStory && (
        <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center'>
          {/* Header */}
          <div className='absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-linear-to-b from-black to-transparent text-white z-10'>
            <div className='flex items-center gap-3'>
              <Avatar className='w-10 h-10'>
                <AvatarImage 
                  src={selectedStoryGroup.author?.profilePicture} 
                  alt={selectedStoryGroup.author?.username} 
                />
                <AvatarFallback>
                  {selectedStoryGroup.author?.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-semibold text-sm'>{selectedStoryGroup.author?.username}</span>
                <span className='text-xs text-gray-300'>Now</span>
              </div>
            </div>
            <button
              onClick={closeStories}
              className='text-2xl hover:opacity-80'
            >
              ×
            </button>
          </div>

          {/* Story Content */}
          <div className='relative w-full max-w-md h-screen max-h-screen md:max-h-96'>
            {/* Progress Bars */}
            <div className='absolute top-0 left-0 right-0 h-1 bg-gray-600/40 flex gap-1 px-1 pt-1 z-20'>
              {selectedStoryGroup.stories.map((_, idx) => (
                <div
                  key={idx}
                  className='flex-1 h-0.5 bg-gray-600 rounded-full overflow-hidden'
                >
                  <div
                    className='h-full bg-white transition-all'
                    style={{
                      width: idx < currentStoryIndex ? '100%' : idx === currentStoryIndex ? `${storyProgress}%` : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Image/Video */}
            <div className='w-full h-full flex items-center justify-center bg-black'>
              {currentStory.image ? (
                <img
                  src={currentStory.image}
                  alt='Story'
                  className='w-full h-full object-cover'
                />
              ) : currentStory.video ? (
                <video
                  src={currentStory.video}
                  alt='Story'
                  className='w-full h-full object-cover'
                  autoPlay
                  muted
                />
              ) : (
                <div className='text-white text-center flex items-center justify-center h-full'>
                  {currentStory.text && (
                    <p className='text-4xl font-bold drop-shadow-lg px-6 text-center'>
                      {currentStory.text}
                    </p>
                  )}
                </div>
              )}
              
              {/* Story Text Overlay */}
              {currentStory.text && (currentStory.image || currentStory.video) && (
                <div className='absolute bottom-8 left-0 right-0 text-center'>
                  <p className='text-white text-lg font-semibold drop-shadow-lg px-4'>
                    {currentStory.text}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className='absolute inset-0 flex items-center justify-between px-4 z-20'>
              {currentStoryIndex > 0 && (
                <button
                  onClick={handlePrevStory}
                  className='text-white text-4xl hover:opacity-80 active:opacity-60 transition'
                >
                  ‹
                </button>
              )}
              <div className='flex-1' />
              {currentStoryIndex < selectedStoryGroup.stories.length - 1 && (
                <button
                  onClick={handleNextStory}
                  className='text-white text-4xl hover:opacity-80 active:opacity-60 transition'
                >
                  ›
                </button>
              )}
            </div>

            {/* Footer */}
            <div className='absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black to-transparent text-white z-10'>
              <div className='flex items-center justify-between text-xs text-gray-300'>
                <span>{currentStoryIndex + 1} / {selectedStoryGroup.stories.length}</span>
                <span>{currentStory.views?.length || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesFeed;
