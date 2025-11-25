import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Heart, MoreHorizontal, MessageCircle, Smile } from 'lucide-react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const Comment = ({ comment }) => {
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(comment?.likes || 0)
    const [showReplies, setShowReplies] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [replies, setReplies] = useState(comment?.replies || [])

    const handleLike = () => {
        if (isLiked) {
            setLikeCount(prev => prev - 1)
        } else {
            setLikeCount(prev => prev + 1)
        }
        setIsLiked(!isLiked)
    }

    const handleReply = (e) => {
        e.preventDefault()
        if (replyText.trim()) {
            const newReply = {
                id: Date.now(),
                author: {
                    username: 'current_user', // This would be the logged-in user
                    profilePicture: ''
                },
                text: replyText,
                timestamp: new Date().toISOString(),
                likes: 0
            }
            setReplies(prev => [...prev, newReply])
            setReplyText('')
            setShowReplies(true)
        }
    }

    const timeAgo = (timestamp) => {
        const now = new Date()
        const commentTime = new Date(timestamp)
        const diffInSeconds = Math.floor((now - commentTime) / 1000)
        
        if (diffInSeconds < 60) return 'just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
        return `${Math.floor(diffInSeconds / 2592000)}mo`
    }

    return (
        <div className='py-3 border-b border-gray-100 last:border-b-0'>
            {/* Main Comment */}
            <div className='flex gap-3'>
                {/* Avatar */}
                <Avatar className='w-8 h-8 flex-shrink-0'>
                    <AvatarImage 
                        src={comment?.author?.profilePicture} 
                        alt={comment?.author?.username}
                    />
                    <AvatarFallback className='text-xs'>
                        {comment?.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>

                {/* Comment Content */}
                <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                        <div className='flex-1'>
                            <p className='text-sm leading-5'>
                                <span className='font-semibold mr-2'>
                                    {comment?.author?.username}
                                </span>
                                {comment?.text}
                            </p>
                            
                            {/* Comment Meta */}
                            <div className='flex items-center gap-4 mt-2 text-xs text-gray-500'>
                                <span>{timeAgo(comment?.timestamp)}</span>
                                
                                {likeCount > 0 && (
                                    <span>{likeCount} like{likeCount !== 1 ? 's' : ''}</span>
                                )}
                                
                                {replies.length > 0 && (
                                    <button 
                                        onClick={() => setShowReplies(!showReplies)}
                                        className='hover:text-gray-700 font-medium'
                                    >
                                        {showReplies ? 'Hide' : 'View'} {replies.length} reply{replies.length !== 1 ? 'ies' : ''}
                                    </button>
                                )}
                                
                                <button className='hover:text-gray-700 font-medium'>
                                    Reply
                                </button>
                            </div>

                            {/* Like and Reply Actions */}
                            <div className='flex items-center gap-4 mt-2'>
                                <button 
                                    onClick={handleLike}
                                    className={`flex items-center gap-1 text-xs ${
                                        isLiked ? 'text-red-500' : 'text-gray-500'
                                    } hover:text-red-500 transition-colors`}
                                >
                                    <Heart 
                                        size={12} 
                                        fill={isLiked ? 'currentColor' : 'none'}
                                    />
                                    Like
                                </button>
                                
                                <button className='flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors'>
                                    <MessageCircle size={12} />
                                    Reply
                                </button>
                            </div>
                        </div>

                        {/* More Options */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreHorizontal size={14} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-2" align="end">
                                <div className="space-y-1">
                                    <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded">
                                        Report
                                    </button>
                                    <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded">
                                        Copy Link
                                    </button>
                                    <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded">
                                        Cancel
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Reply Input */}
                    <form onSubmit={handleReply} className='mt-3 flex gap-2'>
                        <div className='relative flex-1'>
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Add a reply..."
                                className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-gray-300"
                            />
                            <button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <Smile size={16} className="text-gray-400" />
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!replyText.trim()}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                                replyText.trim() 
                                    ? 'text-blue-500 hover:text-blue-600' 
                                    : 'text-blue-300 cursor-not-allowed'
                            }`}
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>

            {/* Replies Section */}
            {showReplies && replies.length > 0 && (
                <div className='ml-11 mt-3 space-y-3 border-l-2 border-gray-100 pl-4'>
                    {replies.map((reply) => (
                        <div key={reply.id} className='flex gap-3'>
                            <Avatar className='w-6 h-6 flex-shrink-0'>
                                <AvatarImage src={reply.author?.profilePicture} />
                                <AvatarFallback className='text-xs'>
                                    {reply.author?.username?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            
                            <div className='flex-1'>
                                <p className='text-sm leading-5'>
                                    <span className='font-semibold mr-2'>
                                        {reply.author?.username}
                                    </span>
                                    {reply.text}
                                </p>
                                
                                <div className='flex items-center gap-4 mt-1 text-xs text-gray-500'>
                                    <span>{timeAgo(reply.timestamp)}</span>
                                    {reply.likes > 0 && (
                                        <span>{reply.likes} like{reply.likes !== 1 ? 's' : ''}</span>
                                    )}
                                    <button className='hover:text-gray-700 font-medium'>
                                        Like
                                    </button>
                                    <button className='hover:text-gray-700 font-medium'>
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Comment