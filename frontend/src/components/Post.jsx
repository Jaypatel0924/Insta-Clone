import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Bookmark, MessageCircle, MoreHorizontal, Send, Heart, MapPin, Flag, Trash2, Link2 } from 'lucide-react'
import { Button } from './ui/button'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { timeAgo } from '@/lib/utils'

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    
    // Move useSelector hooks to the top
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    
    const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [isBookmarked, setIsBookmarked] = useState(user?.bookmarks?.includes(post._id) || false);

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setText(e.target.value);
    };

    const likeOrDislikeHandler = async () => {
        try {
            const action = isLiked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:5000/api/v1/post/${post._id}/${action}`, { withCredentials: true });

            if (res.data.success) {
                setIsLiked(!isLiked);
                setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

                const updatedPostData = posts.map(p =>
                    p._id === post._id
                        ? { 
                            ...p, 
                            likes: isLiked 
                                ? p.likes.filter(id => id !== user._id) 
                                : [...p.likes, user._id] 
                        }
                        : p
                );

                dispatch(setPosts(updatedPostData));
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to like post');
        }
    };

    const commentHandler = async (e) => {
        if (e) e.preventDefault();
        if (!text.trim()) return;

        try {
            const res = await axios.post(
                `http://localhost:5000/api/v1/post/${post._id}/comment`,
                { text: text.trim() },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );

            if (res.data.success) {
                const updatedPostData = posts.map(p =>
                    p._id === post._id 
                        ? { ...p, comments: [...p.comments, res.data.comment] }
                        : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success('Comment added');
                setText("");
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to add comment');
        }
    };

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(
                `http://localhost:5000/api/v1/post/delete/${post._id}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                const updatedPostData = posts.filter(p => p._id !== post._id);
                dispatch(setPosts(updatedPostData));
                toast.success('Post deleted');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to delete post');
        }
    };

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/v1/post/${post._id}/bookmark`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsBookmarked(!isBookmarked);
                toast.success(isBookmarked ? 'Removed from saved' : 'Saved to your collection');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to save post');
        }
    };

    const copyPostLink = () => {
        const postUrl = `${window.location.origin}/post/${post._id}`;
        navigator.clipboard.writeText(postUrl);
        toast.success('Link copied to clipboard');
    };

    return (
        <div className='bg-white border border-gray-300 rounded-lg mb-6 max-w-xl mx-auto'>
            {/* POST HEADER */}
            <div className='flex items-center justify-between p-4'>
                <div className='flex items-center gap-3'>
                    <Avatar className='w-8 h-8'>
                        <AvatarImage src={post.author?.profilePicture} />
                        <AvatarFallback className='text-xs'>
                            {post.author?.username?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <span className='font-semibold text-sm'>{post.author?.username}</span>
                        {post.location?.placeName && (
                            <span className='text-xs text-gray-500 flex items-center gap-1'>
                                <MapPin size={10} />
                                {post.location.placeName}
                            </span>
                        )}
                    </div>
                </div>

                {/* OPTIONS MENU */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0" align="end">
                        <div className="py-1">
                            {user?._id === post.author?._id ? (
                                <>
                                    <button 
                                        onClick={deletePostHandler}
                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                                    >
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

            {/* POST IMAGE */}
            <div className='aspect-square bg-black flex items-center justify-center'>
                <img
                    className='w-full h-full object-cover'
                    src={post.image}
                    alt="post"
                />
            </div>

            {/* ACTION BUTTONS */}
            <div className='p-4'>
                <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-4'>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={likeOrDislikeHandler}
                            className={`h-8 w-8 ${isLiked ? 'text-red-500' : 'text-gray-900'}`}
                        >
                            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                dispatch(setSelectedPost(post));
                                setOpen(true);
                            }}
                            className="h-8 w-8"
                        >
                            <MessageCircle size={24} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Send size={24} />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={bookmarkHandler}
                        className={`h-8 w-8 ${isBookmarked ? 'text-gray-900' : 'text-gray-900'}`}
                    >
                        <Bookmark size={24} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </Button>
                </div>

                {/* LIKES COUNT */}
                {likeCount > 0 && (
                    <div className='mb-2'>
                        <span className='font-semibold text-sm'>{likeCount.toLocaleString()} likes</span>
                    </div>
                )}

                {/* CAPTION */}
                <div className='mb-1'>
                    <p className='text-sm'>
                        <span className='font-semibold mr-2'>{post.author?.username}</span>
                        {post.caption}
                    </p>
                </div>

                {/* TAGGED USERS */}
                {post.taggedUsers && post.taggedUsers.length > 0 && (
                    <div className='mb-2 flex flex-wrap gap-1'>
                        <span className='text-xs text-gray-600'>Tagged: </span>
                        {post.taggedUsers.map((taggedUser, idx) => (
                            <span key={taggedUser._id} className='text-xs'>
                                <span className='text-blue-500 font-semibold cursor-pointer hover:underline'>
                                    @{taggedUser.username}
                                </span>
                                {idx < post.taggedUsers.length - 1 && <span className='text-gray-600'>, </span>}
                            </span>
                        ))}
                    </div>
                )}

                {/* VIEW COMMENTS */}
                {post.comments.length > 0 && (
                    <button
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }}
                        className='text-gray-500 text-sm mb-2 hover:text-gray-700'
                    >
                        View all {post.comments.length} comments
                    </button>
                )}

                {/* TIMESTAMP */}
                <div className='mb-3'>
                    <span className='text-gray-400 text-xs uppercase'>
                        {timeAgo(post.createdAt)}
                    </span>
                </div>

                {/* ADD COMMENT */}
                <form onSubmit={commentHandler} className='flex items-center gap-2 border-t border-gray-100 pt-3'>
                    <input
                        type="text"
                        placeholder='Add a comment...'
                        value={text}
                        onChange={changeEventHandler}
                        className='flex-1 outline-none text-sm placeholder-gray-500'
                    />
                    <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        disabled={!text.trim()}
                        className={`font-semibold px-2 ${
                            text.trim() 
                                ? 'text-blue-500 hover:text-blue-600' 
                                : 'text-blue-300 cursor-not-allowed'
                        }`}
                    >
                        Post
                    </Button>
                </form>
            </div>

            {/* COMMENTS MODAL */}
            <CommentDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Post;