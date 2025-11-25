import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import CommentDialog from './CommentDialog';
import { setSelectedPost } from '@/redux/postSlice';
import axios from 'axios';
import { toast } from 'sonner';
import { timeAgo } from '@/lib/utils';

const SinglePost = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedPost } = useSelector(store => store.post);
  const { user } = useSelector(store => store.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [openComments, setOpenComments] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch post if not in Redux
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // If no postId, we can't fetch anything
        if (!postId) {
          console.error('No postId provided');
          setLoading(false);
          return;
        }

        console.log('Fetching post with ID:', postId);

        // Always fetch fresh from API to ensure we have latest data
        const res = await axios.get(
          `http://localhost:5000/api/v1/post/${postId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setPost(res.data.post);
          dispatch(setSelectedPost(res.data.post));
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        toast.error('Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, dispatch]);

  const displayPost = post || selectedPost;

  useEffect(() => {
    if (displayPost) {
      setIsLiked(displayPost.likes?.includes(user?._id) || false);
      setLikeCount(displayPost.likes?.length || 0);
    }
  }, [displayPost, user]);

  const handleLike = async () => {
    try {
      const action = isLiked ? 'dislike' : 'like';
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${postId}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to like post');
    }
  };

  const handleImageError = () => {
    setImageError(true);
    console.log('Image failed to load:', selectedPost?.image);
  };

  // Fix Cloudinary URL - ensure HTTPS and proper format
  const getImageUrl = (url) => {
    if (!url) return '/placeholder-image.jpg';
    
    // Ensure HTTPS for Cloudinary
    if (url.includes('cloudinary.com')) {
      return url.replace('http://', 'https://');
    }
    
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!displayPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500">Post not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Post</h1>
        </div>
      </div>

      {/* Post Content */}
      <div className="w-full max-w-3xl mx-auto py-4 px-0 md:px-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={displayPost.author?.profilePicture} 
                  alt={displayPost.author?.username}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <AvatarFallback className="bg-gray-200 text-gray-900">
                  {displayPost.author?.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-gray-900">{displayPost.author?.username}</p>
                {displayPost.location?.placeName && (
                  <p className="text-xs text-gray-500">{displayPost.location.placeName}</p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <MoreHorizontal size={16} />
            </Button>
          </div>

          {/* Post Image */}
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
            {imageError ? (
              <div className="text-center text-gray-500">
                <p>Image failed to load</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setImageError(false)}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <img
                src={getImageUrl(displayPost.image)}
                alt="post"
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className={`h-10 w-10 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-900'} hover:bg-gray-100`}
                >
                  <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenComments(true)}
                  className="h-10 w-10 rounded-full hover:bg-gray-100"
                >
                  <MessageCircle size={24} />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                  <Send size={24} />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                <Bookmark size={24} />
              </Button>
            </div>

            {/* Likes Count */}
            {likeCount > 0 && (
              <div className="mb-3">
                <span className="font-semibold text-sm text-gray-900">{likeCount} likes</span>
              </div>
            )}

            {/* Caption */}
            <div className="mb-3">
              <p className="text-sm text-gray-900">
                <span className="font-semibold mr-2">{displayPost.author?.username}</span>
                {displayPost.caption}
              </p>
            </div>

            {/* Tagged Users */}
            {displayPost.taggedUsers && displayPost.taggedUsers.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                <span className="text-xs text-gray-600">Tagged: </span>
                {displayPost.taggedUsers.map((taggedUser, idx) => (
                  <span key={taggedUser._id} className="text-xs">
                    <span className="text-blue-500 font-semibold cursor-pointer hover:underline">
                      @{taggedUser.username}
                    </span>
                    {idx < displayPost.taggedUsers.length - 1 && <span className="text-gray-600">, </span>}
                  </span>
                ))}
              </div>
            )}

            {/* View Comments */}
            {displayPost.comments?.length > 0 && (
              <button
                onClick={() => setOpenComments(true)}
                className="text-gray-500 text-sm mb-3 hover:text-gray-700 font-medium"
              >
                View all {displayPost.comments.length} comments
              </button>
            )}

            {/* Timestamp */}
            {displayPost.createdAt && (
              <p className="text-gray-400 text-xs">
                {timeAgo(displayPost.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      <CommentDialog open={openComments} setOpen={setOpenComments} />
    </div>
  );
};

export default SinglePost;