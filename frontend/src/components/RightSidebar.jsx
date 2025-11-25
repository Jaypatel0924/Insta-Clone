import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  const { notification } = useSelector(store => store.notification || {});
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className='hidden xl:block w-80 pr-8 py-8'>
      {/* User Profile */}
      <div className='flex items-center justify-between mb-8'>
        <Link to={`/profile/${user?._id}`} className='flex items-center gap-3 flex-1 min-w-0'>
          <Avatar className='w-14 h-14'>
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
            <AvatarFallback className='text-base font-semibold'>
              {user?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <h1 className='font-semibold text-sm truncate'>{user?.username}</h1>
            <span className='text-gray-500 text-sm truncate'>{user?.fullName || user?.username}</span>
          </div>
        </Link>
        <Button variant="ghost" size="sm" className='text-blue-500 font-semibold hover:text-blue-600 hover:bg-transparent'>
          Switch
        </Button>
      </div>

      {/* Notifications Toggle */}
      <div className='mb-8'>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className='flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-gray-600 w-full'
        >
          <Bell size={16} />
          <span>Notifications</span>
        </button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className='mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200'>
          <div className='text-sm text-gray-600'>
            <p className='font-semibold mb-3'>Recent Activity</p>
            <div className='space-y-2 max-h-64 overflow-y-auto'>
              {Array.isArray(notification) && notification.length > 0 ? (
                notification.slice(0, 5).map((notif) => (
                  <div key={notif._id} className='text-xs py-1 border-b border-gray-200 last:border-0'>
                    <p className='text-gray-700'>{notif.text || 'New notification'}</p>
                  </div>
                ))
              ) : (
                <p className='text-gray-400 text-xs'>No notifications</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suggested Users */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='font-semibold text-gray-500 text-sm'>Suggestions For You</h2>
          <Button variant="ghost" size="sm" className='text-xs font-semibold hover:bg-transparent'>
            See All
          </Button>
        </div>
        <SuggestedUsers />
      </div>

      {/* Footer */}
      <div className='text-xs text-gray-400 space-y-3'>
        <div className='flex flex-wrap gap-x-3 gap-y-1'>
          {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language'].map((item) => (
            <button key={item} className='hover:text-gray-600 cursor-pointer'>
              {item}
            </button>
          ))}
        </div>
        <div>© 2024 INSTAGRAM FROM META</div>
      </div>
    </div>
  )
}

export default RightSidebar