import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import { InstagramLogo } from './InstagramLogo'

const Home = () => {
    useGetAllPost();
    useGetSuggestedUsers();
    
    return (
        <div className='min-h-screen bg-white'>
            {/* Mobile Layout */}
            <div className='block lg:hidden'>
                <div className='pb-16'> {/* Padding for bottom navigation */}
                    <Feed />
                    <Outlet />
                </div>
            </div>

            {/* Desktop Layout with Left Sidebar */}
            <div className='hidden lg:flex'>
                {/* Left Sidebar takes care of its own width */}
                
                {/* Main Content Area */}
                <div className='flex-1 flex justify-center'>
                    {/* Main Feed Container */}
                    <div className='max-w-2xl flex-1 border-x border-gray-300 min-h-screen bg-white'>
                        {/* Instagram-style Header */}
                        <div className='sticky top-0 z-10 bg-white border-b border-gray-300 py-4 px-6 hidden lg:block'>
                            <InstagramLogo textSize='text-2xl' />
                        </div>
                        
                        <Feed />
                        <Outlet />
                    </div>

                    {/* Right Sidebar */}
                    <div className='w-80 xl:w-96 hidden xl:block shrink-0'>
                        <div className='sticky top-0 h-screen overflow-y-auto py-8 px-6'>
                            <RightSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home