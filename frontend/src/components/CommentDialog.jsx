import React, { useEffect, useState, useRef } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal, Heart, MessageCircle, Share, Bookmark, Smile, Send, Flag, Trash2, Link2, MapPin } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const { selectedPost, posts } = useSelector(store => store.post)
  const { user } = useSelector(store => store.auth)
  const [comment, setComment] = useState([])
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const commentsEndRef = useRef(null)

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments || [])
      setLikeCount(selectedPost.likes?.length || 0)
      setIsLiked(selectedPost.likes?.includes(user?._id) || false)
      setIsBookmarked(selectedPost.bookmarks?.includes(user?._id) || false)
    }
  }, [selectedPost, user])

  useEffect(() => {
    // Scroll to bottom when comments update
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comment])

  const changeEventHandler = (e) => {
    setText(e.target.value)
  }

  const sendMessageHandler = async () => {
    try {
      if (!text.trim()) return

      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${selectedPost?._id}/comment`,
        { text: text.trim() },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]
        setComment(updatedCommentData)

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        )

        dispatch(setPosts(updatedPostData))
        setText("")
        inputRef.current?.focus()
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to post comment')
    }
  }

  const handleLike = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${selectedPost?._id}/${isLiked ? 'dislike' : 'like'}`,
        { withCredentials: true }
      )

      if (res.data.success) {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
        
        // Update posts in store
        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { 
            ...p, 
            likes: isLiked 
              ? p.likes.filter(id => id !== user?._id)
              : [...p.likes, user?._id]
          } : p
        )
        dispatch(setPosts(updatedPostData))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleBookmark = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${selectedPost?._id}/bookmark`,
        { withCredentials: true }
      )

      if (res.data.success) {
        setIsBookmarked(!isBookmarked)
        toast.success(isBookmarked ? 'Removed from saved' : 'Saved to your collection')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && text.trim()) {
      sendMessageHandler()
    }
  }

  const timeAgo = (timestamp) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now - postTime) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
    return `${Math.floor(diffInSeconds / 2592000)}mo`
  }

  const copyPostLink = () => {
    const postUrl = `${window.location.origin}/post/${selectedPost?._id}`
    navigator.clipboard.writeText(postUrl)
    toast.success('Link copied to clipboard')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 flex bg-white rounded-lg overflow-hidden">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Post by {selectedPost?.author?.username}</DialogTitle>
            <DialogDescription>View post and comments</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <div className='flex flex-1 h-full'>
          {/* Left Side - Image */}
          <div className='flex-1 bg-black flex items-center justify-center'>
            <img
              src={selectedPost?.image}
              alt="post"
              className='max-h-full max-w-full object-contain'
            />
          </div>

          {/* Right Side - Content */}
          <div className='w-96 flex flex-col border-l border-gray-300'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-300'>
              <div className='flex gap-3 items-center'>
                <Avatar className='w-8 h-8'>
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback>
                    {selectedPost?.author?.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <Link 
                    to={`/profile/${selectedPost?.author?._id}`}
                    className='font-semibold text-sm hover:text-gray-600'
                  >
                    {selectedPost?.author?.username}
                  </Link>
                  {selectedPost?.location?.placeName && (
                    <span className='text-xs text-gray-500 flex items-center gap-1'>
                      <MapPin size={10} />
                      {selectedPost.location.placeName}
                    </span>
                  )}
                </div>
              </div>

              {/* More Options */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="end">
                  <div className="py-1">
                    {selectedPost?.author?._id === user?._id ? (
                      <>
                        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50">
                          <Trash2 size={16} />
                          Delete Post
                        </button>
                        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50">
                          Edit Post
                        </button>
                      </>
                    ) : (
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-50">
                        <Flag size={16} />
                        Report
                      </button>
                    )}
                    <button 
                      onClick={copyPostLink}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50 border-t border-gray-100"
                    >
                      <Link2 size={16} />
                      Copy Link
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50">
                      Share to...
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50 border-t border-gray-100">
                      Cancel
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Comments Section */}
            <div className='flex-1 overflow-y-auto'>
              {/* Post Caption */}
              {selectedPost?.caption && (
                <div className='p-4 border-b border-gray-100'>
                  <div className='flex gap-3'>
                    <Avatar className='w-8 h-8 shrink-0'>
                      <AvatarImage src={selectedPost?.author?.profilePicture} />
                      <AvatarFallback>
                        {selectedPost?.author?.username?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm leading-5'>
                        <span className='font-semibold mr-2'>
                          {selectedPost?.author?.username}
                        </span>
                        {selectedPost.caption}
                      </p>
                      <div className='flex items-center gap-4 mt-1 text-xs text-gray-500'>
                        <span>{timeAgo(selectedPost.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className='p-4'>
                {comment.length > 0 ? (
                  comment.map((c) => (
                    <Comment key={c._id} comment={c} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No comments yet</p>
                    <p className="text-xs">Start the conversation</p>
                  </div>
                )}
                <div ref={commentsEndRef} />
              </div>
            </div>

            {/* Actions */}
            <div className='border-t border-gray-300 p-4 space-y-3'>
              {/* Like, Comment, Share, Bookmark */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    className={`h-8 w-8 ${isLiked ? 'text-red-500' : 'text-gray-900'}`}
                  >
                    <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageCircle size={24} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share size={24} />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  className={`h-8 w-8 ${isBookmarked ? 'text-gray-900' : 'text-gray-900'}`}
                >
                  <Bookmark size={24} fill={isBookmarked ? 'currentColor' : 'none'} />
                </Button>
              </div>

              {/* Likes Count */}
              {likeCount > 0 && (
                <div className='text-sm font-semibold'>
                  {likeCount.toLocaleString()} like{likeCount !== 1 ? 's' : ''}
                </div>
              )}

              {/* Timestamp */}
              <div className='text-xs text-gray-500 uppercase'>
                {timeAgo(selectedPost?.createdAt)}
              </div>

              {/* Comment Input */}
              <div className='flex items-center gap-2 pt-2 border-t border-gray-100'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Smile size={20} className="text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="start">
                    <div className="text-center text-gray-500 py-4">
                      <p>Emoji picker would go here</p>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a comment..."
                  className="flex-1 outline-none text-sm placeholder-gray-500 bg-white text-gray-900"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={sendMessageHandler}
                  disabled={!text.trim()}
                  className={`font-semibold px-2 ${
                    text.trim() 
                      ? 'text-blue-500 hover:text-blue-600' 
                      : 'text-blue-300 cursor-not-allowed'
                  }`}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog