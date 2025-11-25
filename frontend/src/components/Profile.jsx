import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { AtSign, Heart, MessageCircle, MapPin, Calendar, Link as LinkIcon, Settings, Bookmark, Grid3X3, Play, UserPlus, Mail, LogOut } from 'lucide-react';
import { setSelectedPost } from '@/redux/postSlice';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const [followStatus, setFollowStatus] = useState('follow'); // 'follow', 'following', 'requested'
  const [loading, setLoading] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  useEffect(() => {
    // Update follow status based on current user's data
    if (user && userProfile && user._id !== userProfile._id) {
      const isFollowingUser = user.following?.includes(userProfile._id);
      setFollowStatus(isFollowingUser ? 'following' : 'follow');
    }
  }, [user, userProfile]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const handlePostClick = (post) => {
    dispatch(setSelectedPost(post));
    navigate(`/post/${post._id}`);
  }

  const handleFollowClick = async () => {
    if (!userProfile?._id) return;
    
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );
      
      if (res.data.success) {
        if (res.data.action === 'follow') {
          setFollowStatus('following');
          toast.success('Following ' + userProfile.username);
        } else if (res.data.action === 'unfollow') {
          setFollowStatus('follow');
          toast.success('Unfollowed ' + userProfile.username);
        } else if (res.data.action === 'requested') {
          setFollowStatus('requested');
          toast.success('Follow request sent to ' + userProfile.username);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating follow status');
    } finally {
      setLoading(false);
    }
  };

  const displayedPosts = activeTab === 'posts' ? userProfile?.posts : activeTab === 'saved' ? userProfile?.bookmarks : activeTab === 'reels' ? userProfile?.reels : userProfile?.taggedInPosts;

  // Format numbers with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  // Calculate account age
  const getAccountAge = () => {
    if (!userProfile?.createdAt) return '';
    const created = new Date(userProfile.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      {/* Profile Header */}
      <div className='flex flex-col md:flex-row gap-8 md:gap-16 mb-12'>
        {/* Profile Picture */}
        <div className='flex justify-center md:justify-start'>
          <Avatar className='h-24 w-24 md:h-32 md:w-32 border-2 border-gray-300'>
            <AvatarImage src={userProfile?.profilePicture} alt={userProfile?.username} />
            <AvatarFallback className='text-2xl font-semibold'>
              {userProfile?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className='flex-1 space-y-4'>
          {/* Username and Actions */}
          <div className='flex flex-col md:flex-row md:items-center gap-4'>
            <h1 className='text-2xl md:text-3xl font-light text-gray-800'>{userProfile?.username}</h1>
            
            <div className='flex items-center gap-2 flex-wrap'>
              {isLoggedInUserProfile ? (
                <>
                  <Link to="/account/edit">
                    <Button variant="outline" className="h-8 text-sm font-medium border-gray-300 hover:bg-gray-50">
                      Edit profile
                    </Button>
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-8 text-sm font-medium border-gray-300 hover:bg-gray-50">
                        View archive
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Your Archive</DialogTitle>
                        <DialogDescription>Posts you've archived will appear here</DialogDescription>
                      </DialogHeader>
                      <div className="text-center py-8">
                        <p className="text-gray-500">No archived posts yet</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings size={18} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-black">Account</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm flex items-center gap-2 text-gray-900">
                          <UserPlus size={16} />
                          Switch accounts
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-red-50 rounded text-sm flex items-center gap-2 text-red-600 hover:text-red-700">
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleFollowClick}
                    disabled={loading}
                    className={`h-8 text-sm font-medium ${
                      followStatus === 'following' ? 'bg-gray-200 text-black hover:bg-gray-300' :
                      followStatus === 'requested' ? 'bg-gray-300 text-black hover:bg-gray-400' :
                      'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {loading ? 'Loading...' : followStatus === 'following' ? 'Following' : followStatus === 'requested' ? 'Requested' : 'Follow'}
                  </Button>
                  <Button variant="outline" className="h-8 text-sm font-medium border-gray-300 hover:bg-gray-50">
                    <Mail size={16} />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className='flex items-center gap-8 text-sm'>
            <div className='text-center'>
              <span className='font-semibold block'>{formatNumber(userProfile?.posts?.length)}</span>
              <span className='text-gray-600'>posts</span>
            </div>
            <div className='text-center'>
              <span className='font-semibold block'>{formatNumber(userProfile?.followers?.length)}</span>
              <span className='text-gray-600'>followers</span>
            </div>
            <div className='text-center'>
              <span className='font-semibold block'>{formatNumber(userProfile?.following?.length)}</span>
              <span className='text-gray-600'>following</span>
            </div>
          </div>

          {/* Bio and Details */}
          <div className='space-y-2'>
            <div className='space-y-1'>
              <h2 className='font-semibold text-sm'>{userProfile?.fullName}</h2>
              <p className='text-sm text-gray-800'>{userProfile?.bio || 'No bio yet'}</p>
            </div>

            {/* Additional Info */}
            <div className='flex flex-wrap gap-4 text-xs text-gray-600'>
              {userProfile?.website && (
                <div className='flex items-center gap-1'>
                  <LinkIcon size={12} />
                  <a href={userProfile.website} className='text-blue-600 hover:text-blue-800'>
                    {userProfile.website}
                  </a>
                </div>
              )}
              {userProfile?.location && (
                <div className='flex items-center gap-1'>
                  <MapPin size={12} />
                  <span>{userProfile.location}</span>
                </div>
              )}
              {userProfile?.createdAt && (
                <div className='flex items-center gap-1'>
                  <Calendar size={12} />
                  <span>Joined {getAccountAge()} ago</span>
                </div>
              )}
            </div>

            {/* Username Badge */}
            <Badge variant="secondary" className="w-fit text-xs">
              <AtSign size={12} />
              <span className="ml-1">{userProfile?.username}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className='border-t border-gray-300'>
        <div className='flex items-center justify-center gap-12 md:gap-16 text-xs font-semibold text-gray-600'>
          <button
            onClick={() => handleTabChange('posts')}
            className={`flex items-center gap-1 py-4 border-t transition-colors ${
              activeTab === 'posts' 
                ? 'text-black border-black' 
                : 'border-transparent hover:text-gray-800'
            }`}
          >
            <Grid3X3 size={16} />
            <span>POSTS</span>
          </button>
          
          {isLoggedInUserProfile && (
            <button
              onClick={() => handleTabChange('saved')}
              className={`flex items-center gap-1 py-4 border-t transition-colors ${
                activeTab === 'saved' 
                  ? 'text-black border-black' 
                  : 'border-transparent hover:text-gray-800'
              }`}
            >
              <Bookmark size={16} />
              <span>SAVED</span>
            </button>
          )}
          
          <button
            onClick={() => handleTabChange('reels')}
            className={`flex items-center gap-1 py-4 border-t transition-colors ${
              activeTab === 'reels' 
                ? 'text-black border-black' 
                : 'border-transparent hover:text-gray-800'
            }`}
          >
            <Play size={16} />
            <span>REELS</span>
          </button>
          
          <button
            onClick={() => handleTabChange('tagged')}
            className={`flex items-center gap-1 py-4 border-t transition-colors ${
              activeTab === 'tagged' 
                ? 'text-black border-black' 
                : 'border-transparent hover:text-gray-800'
            }`}
          >
            <span>TAGGED</span>
          </button>
        </div>
      </div>

      {/* Posts/Reels Grid */}
      <div className='pb-8'>
        {displayedPosts && displayedPosts.length > 0 ? (
          <div className='grid grid-cols-3 gap-1 md:gap-4'>
            {displayedPosts.map((item) => {
              // Safety check for item ID
              const itemId = item?._id || item?.id;
              if (!itemId) return null;
              
              return (
              <div 
                key={itemId} 
                className='relative group cursor-pointer aspect-square bg-gray-100 rounded-lg overflow-hidden'
                onClick={() => {
                  if (activeTab === 'reels') {
                    navigate(`/reel/${itemId}`);
                  } else {
                    handlePostClick(item);
                  }
                }}
              >
                {activeTab === 'reels' && item.thumbnail ? (
                  <img 
                    src={item.thumbnail} 
                    alt='reel' 
                    className='w-full h-full object-cover'
                  />
                ) : item.image ? (
                  <img 
                    src={item.image} 
                    alt='post' 
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm'>
                    <p>No media</p>
                  </div>
                )}
                {/* Hover Overlay */}
                <div className='absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300'>
                  <div className='flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-6'>
                    {activeTab === 'reels' ? (
                      <div className='flex items-center gap-2 font-semibold'>
                        <Play size={20} fill='currentColor' />
                      </div>
                    ) : (
                      <>
                        <div className='flex items-center gap-2 font-semibold'>
                          <Heart size={20} fill='currentColor' />
                          <span>{formatNumber(item?.likes?.length)}</span>
                        </div>
                        <div className='flex items-center gap-2 font-semibold'>
                          <MessageCircle size={20} fill='currentColor' />
                          <span>{formatNumber(item?.comments?.length)}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Edit/Delete buttons for own posts */}
                  {isLoggedInUserProfile && activeTab === 'posts' && (
                    <div className='absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit functionality - use handlePostClick to set Redux state
                          handlePostClick(item);
                        }}
                        className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition text-xs font-semibold'
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this post?')) {
                            try {
                              const res = await axios.delete(
                                `http://localhost:5000/api/v1/post/delete/${itemId}`,
                                { withCredentials: true }
                              );
                              if (res.data.success) {
                                toast.success('Post deleted');
                                window.location.reload();
                              }
                            } catch (error) {
                              toast.error('Failed to delete post');
                            }
                          }
                        }}
                        className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition text-xs font-semibold'
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <div className='w-24 h-24 border-2 border-gray-400 border-dashed rounded-full flex items-center justify-center mb-4'>
              {activeTab === 'posts' ? (
                <Grid3X3 size={32} className='text-gray-400' />
              ) : activeTab === 'reels' ? (
                <Play size={32} className='text-gray-400' />
              ) : (
                <Bookmark size={32} className='text-gray-400' />
              )}
            </div>
            <h3 className='text-2xl font-light text-gray-800 mb-2'>
              {activeTab === 'posts' ? 'Share Photos' : activeTab === 'reels' ? 'Share Reels' : 'Save Photos'}
            </h3>
            <p className='text-gray-500 max-w-md mb-4'>
              {activeTab === 'posts' 
                ? 'When you share photos, they will appear on your profile.'
                : activeTab === 'reels'
                ? 'When you share reels, they will appear here.'
                : 'Save photos and videos that you want to see again.'
              }
            </p>
            {activeTab === 'posts' && isLoggedInUserProfile && (
              <Button className='bg-[#0095F6] hover:bg-[#1877F2] text-white'>
                Share your first photo
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile