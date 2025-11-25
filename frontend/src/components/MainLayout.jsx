import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import { InstagramLogo } from './InstagramLogo'

const MainLayout = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* Mobile Header with Logo */}
      <div className='lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-40 py-3 px-4'>
        <div className='flex justify-center items-center'>
          <InstagramLogo textSize='text-lg' />
        </div>
      </div>

      {/* Desktop Layout with Sidebar */}
      <div className='hidden lg:flex'>
        {/* Fixed Sidebar */}
        <div className='fixed top-0 left-0 h-screen z-50'>
          <LeftSidebar />
        </div>
        
        {/* Main Content Area */}
        <div className='flex-1 lg:ml-64 min-h-screen'>
          <div className='max-w-6xl mx-auto'>
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className='lg:hidden'>
        {/* Main Content with Header and Footer Space */}
        <div className='pt-16 pb-20 min-h-screen'>
          <Outlet />
        </div>
      </div>

      {/* Mobile Bottom Navigation - Fixed at bottom */}
      <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50'>
        <LeftSidebar />
      </div>
    </div>
  )
}

export default MainLayout