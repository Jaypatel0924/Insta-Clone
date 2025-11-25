import { Home, Search, Compass, MessageCircle, Heart, SquarePlus, User, Menu, Bookmark, Settings, LogOut, Film } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { InstagramLogo } from './InstagramLogo'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeItem, setActiveItem] = useState('Home');

    // Check screen size for responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // Update active item based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setActiveItem('Home');
        else if (path.includes('/chat')) setActiveItem('Messages');
        else if (path.includes('/profile')) setActiveItem('Profile');
        else if (path.includes('/explore')) setActiveItem('Explore');
        else if (path.includes('/search')) setActiveItem('Search');
    }, [location]);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        setActiveItem(textType);
        
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        } else if (textType === 'Explore') {
            navigate("/explore");
        } else if (textType === 'Search') {
            navigate("/search");
        } else if (textType === 'Notifications') {
            navigate("/notifications");
        } else if (textType === 'Saved') {
            navigate("/saved");
        } else if (textType === 'Settings') {
            navigate("/settings");
        } else if (textType === 'Reels') {
            navigate("/reels");
        }
    }

    // Instagram-style sidebar items
    const sidebarItems = [
        { 
            icon: <Home size={24} />, 
            activeIcon: <Home size={24} fill="currentColor" />,
            text: "Home" 
        },
        { 
            icon: <Search size={24} />, 
            activeIcon: <Search size={24} fill="currentColor" />,
            text: "Search" 
        },
        { 
            icon: <Compass size={24} />, 
            activeIcon: <Compass size={24} fill="currentColor" />,
            text: "Explore" 
        },
        { 
            icon: <MessageCircle size={24} />, 
            activeIcon: <MessageCircle size={24} fill="currentColor" />,
            text: "Messages" 
        },
        { 
            icon: <Heart size={24} />, 
            activeIcon: <Heart size={24} fill="currentColor" />,
            text: "Notifications" 
        },
        { 
            icon: <SquarePlus size={24} />, 
            activeIcon: <SquarePlus size={24} fill="currentColor" />,
            text: "Create" 
        },
        { 
            icon: <Film size={24} />, 
            activeIcon: <Film size={24} fill="currentColor" />,
            text: "Reels" 
        },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt={user?.username} />
                    <AvatarFallback className="text-xs">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            ),
            activeIcon: (
                <Avatar className='w-6 h-6 border-2 border-black'>
                    <AvatarImage src={user?.profilePicture} alt={user?.username} />
                    <AvatarFallback className="text-xs">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
    ]

    const moreItems = [
        { icon: <Settings size={20} />, text: "Settings" },
        { icon: <Bookmark size={20} />, text: "Saved" },
        { icon: <User size={20} />, text: "Switch Account" },
        { icon: <LogOut size={20} />, text: "Logout" },
    ]

    // Mobile Bottom Navigation
    if (isMobile) {
        const mobileItems = [
            { 
                icon: <Home size={24} />, 
                activeIcon: <Home size={24} fill="currentColor" />,
                text: "Home" 
            },
            { 
                icon: <Search size={24} />, 
                activeIcon: <Search size={24} fill="currentColor" />,
                text: "Search" 
            },
            { 
                icon: <SquarePlus size={24} />, 
                activeIcon: <SquarePlus size={24} fill="currentColor" />,
                text: "Create" 
            },
            { 
                icon: <Film size={24} />, 
                activeIcon: <Film size={24} fill="currentColor" />,
                text: "Reels" 
            },
            { 
                icon: <Heart size={24} />, 
                activeIcon: <Heart size={24} fill="currentColor" />,
                text: "Notifications" 
            },
            {
                icon: (
                    <Avatar className='w-6 h-6'>
                        <AvatarImage src={user?.profilePicture} alt={user?.username} />
                        <AvatarFallback className="text-xs">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                ),
                activeIcon: (
                    <Avatar className='w-6 h-6 border-2 border-black'>
                        <AvatarImage src={user?.profilePicture} alt={user?.username} />
                        <AvatarFallback className="text-xs">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                ),
                text: "Profile"
            },
        ];

        return (
            <>
                {/* Mobile Bottom Navigation - Instagram Style */}
                <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50'>
                    <div className='flex justify-around items-center py-3 px-2'>
                        {mobileItems.map((item, index) => {
                            const isActive = activeItem === item.text;
                            const hasNotification = item.text === "Notifications" && likeNotification.length > 0;

                            return (
                                <button 
                                    key={index}
                                    onClick={() => sidebarHandler(item.text)}
                                    className={`flex flex-col items-center p-2 rounded-lg cursor-pointer relative transition-all duration-200 ${
                                        isActive ? 'text-black' : 'text-gray-600'
                                    }`}
                                >
                                    <div className={`p-1 ${isActive ? 'transform scale-105' : ''}`}>
                                        {isActive ? item.activeIcon : item.icon}
                                    </div>
                                    {hasNotification && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                                    )}
                                    <span className={`text-[10px] mt-1 ${isActive ? 'font-semibold' : 'font-normal'}`}>
                                        {item.text === "Notifications" ? "Activity" : item.text}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <CreatePost open={open} setOpen={setOpen} />
            </>
        );
    }

    // Desktop Sidebar - Instagram Style
    return (
        <div className='fixed top-0 z-50 left-0 px-3 w-64 h-screen bg-white border-r border-gray-300'>
            <div className='flex flex-col h-full py-8'>
                {/* Instagram Logo */}
                <div className='px-3 mb-8'>
                    <div 
                        onClick={() => navigate("/")}
                        className='cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors'
                    >
                        <InstagramLogo textSize='text-xl' />
                    </div>
                </div>

                {/* Main Navigation */}
                <div className='flex-1 space-y-1 px-3'>
                    {sidebarItems.map((item, index) => {
                        const isActive = activeItem === item.text;
                        const hasNotification = item.text === "Notifications" && likeNotification.length > 0;

                        return (
                            <button
                                onClick={() => sidebarHandler(item.text)} 
                                key={index} 
                                className={`flex items-center gap-4 w-full p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                                    isActive 
                                        ? 'font-bold bg-gray-50' 
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className={`relative ${isActive ? 'text-black' : 'text-gray-800'}`}>
                                    {isActive ? item.activeIcon : item.icon}
                                    {hasNotification && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                                    )}
                                </div>
                                <span className={`text-base ${isActive ? 'font-bold' : 'font-normal'}`}>
                                    {item.text}
                                </span>
                                {hasNotification && likeNotification.length > 0 && (
                                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                                        {likeNotification.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* More Menu */}
                <div className='px-3 mt-4'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-4 w-full p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-200 group">
                                <Menu size={24} className="text-gray-800" />
                                <span className="text-base">More</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0 rounded-xl" align="start" side="top">
                            <div className="py-2">
                                {moreItems.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (item.text === 'Logout') {
                                                logoutHandler();
                                            } else if (item.text === 'Settings') {
                                                navigate('/settings');
                                            } else if (item.text === 'Saved') {
                                                navigate('/saved');
                                            }
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                    >
                                        {item.icon}
                                        <span className={item.text === 'Logout' ? 'text-red-500 font-semibold' : ''}>
                                            {item.text}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* User Profile at Bottom */}
                <div className='px-3 mt-6 pt-6 border-t border-gray-200'>
                    <button
                        onClick={() => sidebarHandler("Profile")}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                            activeItem === "Profile" ? 'bg-gray-50' : 'hover:bg-gray-50'
                        }`}
                    >
                        <Avatar className='w-8 h-8'>
                            <AvatarImage src={user?.profilePicture} alt={user?.username} />
                            <AvatarFallback className="text-sm">
                                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-semibold">{user?.username}</p>
                            <p className="text-xs text-gray-500">{user?.fullName || 'Instagrammer'}</p>
                        </div>
                    </button>
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
}

export default LeftSidebar;