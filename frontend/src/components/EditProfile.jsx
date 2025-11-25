import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2, Camera, ArrowLeft, User, Link, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio || '',
        gender: user?.gender || '',
        website: user?.website || '',
        location: user?.location || ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            
            // Validate file size (max 5MB for profile pictures)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            
            setInput({ ...input, profilePhoto: file });
            
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                // You can set a temporary preview URL here if needed
            };
            reader.readAsDataURL(file);
        }
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        formData.append("website", input.website);
        formData.append("location", input.location);
        
        if(input.profilePhoto && typeof input.profilePhoto !== 'string'){
            formData.append("profilePhoto", input.profilePhoto);
        }
        
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/v1/user/profile/edit', formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                withCredentials:true
            });
            
            if(res.data.success){
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender,
                    website: res.data.user?.website,
                    location: res.data.user?.location
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success('Profile updated successfully!');
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className='max-w-4xl mx-auto px-4 py-6'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-8 pb-4 border-b border-gray-300'>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(`/profile/${user?._id}`)}
                    className="h-8 w-8 hover:bg-gray-100"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className='font-bold text-2xl'>Edit profile</h1>
                    <p className='text-gray-600 text-sm'>Make changes to your profile here</p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Left Column - Profile Picture */}
                <div className='lg:col-span-1'>
                    <div className='sticky top-6'>
                        <h2 className='font-semibold text-lg mb-4'>Profile Picture</h2>
                        
                        <div className='relative group'>
                            <Avatar className='w-32 h-32 mx-auto border-2 border-gray-200'>
                                <AvatarImage 
                                    src={
                                        input.profilePhoto && typeof input.profilePhoto !== 'string' 
                                            ? URL.createObjectURL(input.profilePhoto) 
                                            : user?.profilePicture
                                    } 
                                    alt="profile" 
                                />
                                <AvatarFallback className='text-2xl'>
                                    {user?.username?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            
                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all cursor-pointer'>
                                <Camera 
                                    size={24} 
                                    className='text-white opacity-0 group-hover:opacity-100 transition-opacity' 
                                />
                            </div>
                            
                            <input 
                                ref={imageRef} 
                                onChange={fileChangeHandler} 
                                type='file' 
                                className='hidden' 
                                accept='image/*'
                            />
                        </div>
                        
                        <Button 
                            onClick={() => imageRef?.current.click()} 
                            variant="outline"
                            className='w-full mt-4 border-gray-300 hover:bg-gray-50'
                        >
                            <Camera size={16} className='mr-2' />
                            Change Profile Photo
                        </Button>
                        
                        <p className='text-xs text-gray-500 text-center mt-2'>
                            Recommended: Square JPG, PNG less than 5MB
                        </p>
                    </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Username (Read-only) */}
                    <div className='bg-white border border-gray-300 rounded-lg p-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Username
                        </label>
                        <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                            <User size={16} className='text-gray-400' />
                            <span className='text-gray-900'>{user?.username}</span>
                        </div>
                        <p className='text-xs text-gray-500 mt-2'>
                            Username cannot be changed
                        </p>
                    </div>

                    {/* Bio */}
                    <div className='bg-white border border-gray-300 rounded-lg p-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Bio
                        </label>
                        <Textarea 
                            value={input.bio} 
                            onChange={(e) => setInput({ ...input, bio: e.target.value })} 
                            placeholder="Tell your story..."
                            className="min-h-[100px] resize-none border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                            maxLength={150}
                        />
                        <div className='flex justify-between items-center mt-2'>
                            <p className='text-xs text-gray-500'>
                                Brief description for your profile
                            </p>
                            <span className='text-xs text-gray-500'>
                                {input.bio.length}/150
                            </span>
                        </div>
                    </div>

                    {/* Website */}
                    <div className='bg-white border border-gray-300 rounded-lg p-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Website
                        </label>
                        <div className='relative'>
                            <Link size={16} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                            <input
                                type="url"
                                value={input.website}
                                onChange={(e) => setInput({ ...input, website: e.target.value })}
                                placeholder="https://example.com"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                            />
                        </div>
                        <p className='text-xs text-gray-500 mt-2'>
                            Add a link to your website or portfolio
                        </p>
                    </div>

                    {/* Location */}
                    <div className='bg-white border border-gray-300 rounded-lg p-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Location
                        </label>
                        <div className='relative'>
                            <MapPin size={16} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                            <input
                                type="text"
                                value={input.location}
                                onChange={(e) => setInput({ ...input, location: e.target.value })}
                                placeholder="Your city or country"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className='bg-white border border-gray-300 rounded-lg p-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Gender
                        </label>
                        <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                            <SelectTrigger className="w-full border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400">
                                <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Prefer not to say</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Account Creation Date (Read-only) */}
                    <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Member since
                        </label>
                        <div className='flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200'>
                            <Calendar size={16} className='text-gray-400' />
                            <span className='text-gray-600 text-sm'>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3 justify-end pt-6 border-t border-gray-200'>
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/profile/${user?._id}`)}
                            className='border-gray-300 hover:bg-gray-50'
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={editProfileHandler} 
                            disabled={loading}
                            className='bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold min-w-24'
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile