import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { setAuthUser } from "../redux/authSlice";

const followUnfollowUser = async (userId) => {
    try {
        console.log(`Calling follow API for user: ${userId}`);
        
        // ✅ CORRECTED: Use /api/v1/user instead of /api/users
        const response = await fetch(`http://localhost:5000/api/v1/user/followorunfollow/${userId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response text:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Success response:', data);
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw new Error(error.message || 'Failed to follow/unfollow user');
    }
};

const SuggestedUsers = () => {
    const { suggestedUsers, user: currentUser } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    
    const isFollowingUser = (userId) => {
        return currentUser?.following?.includes(userId);
    };

    const handleFollow = async (userId) => {
        setLoading(userId);
        setError(null);
        
        try {
            const response = await followUnfollowUser(userId);
            
            if (response.success) {
                dispatch(setAuthUser(response.user));
            }
        } catch (err) {
            setError(err.message);
            console.error('Follow/Unfollow error:', err);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className='space-y-3'>
            {error && (
                <div className="text-red-500 text-xs p-2 bg-red-50 rounded">
                    Error: {error}
                </div>
            )}
            
            {suggestedUsers.slice(0, 5).map((user) => {
                const isFollowed = isFollowingUser(user._id);
                const isLoading = loading === user._id;
                
                return (
                    <div key={user._id} className='flex items-center justify-between group'>
                        <Link 
                            to={`/profile/${user?._id}`} 
                            className='flex items-center gap-3 flex-1 min-w-0'
                        >
                            <Avatar className='w-8 h-8'>
                                <AvatarImage 
                                    src={user?.profilePicture} 
                                    alt={user?.username}
                                />
                                <AvatarFallback className='text-xs font-semibold'>
                                    {user?.username?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className='flex-1 min-w-0'>
                                <h3 className='font-semibold text-sm truncate'>{user?.username}</h3>
                                <p className='text-gray-500 text-xs truncate'>Suggested for you</p>
                            </div>
                        </Link>
                        
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFollow(user._id)}
                            disabled={isLoading}
                            className={`text-xs px-2 transition-all ${
                                isFollowed 
                                    ? 'text-gray-900 hover:bg-gray-100' 
                                    : 'text-blue-500 hover:text-blue-600 hover:bg-transparent font-semibold'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? '...' : isFollowed ? 'Following' : 'Follow'}
                        </Button>
                    </div>
                );
            })}
        </div>
    )
}

export default SuggestedUsers