import React from 'react'
import Posts from './Posts'
import StoriesFeed from './StoriesFeed'
import { useSelector } from 'react-redux'
import { useGetFollowingStories } from '../hooks/useGetFollowingStories'

const Feed = () => {
  const { user } = useSelector(store => store.auth)
  useGetFollowingStories()

  return (
    <div className='flex-1 min-h-screen bg-gray-50'>
      <div className='max-w-2xl mx-auto pb-20 lg:pb-0'>
        {/* Stories Section */}
        <StoriesFeed />

        {/* Posts Section */}
        <Posts />

        {/* End of Feed Message */}
        <div className='text-center py-8'>
          <div className='w-16 h-16 mx-auto mb-4 border-2 border-gray-300 rounded-full flex items-center justify-center'>
            <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
              <span className='text-gray-500 text-2xl'>✓</span>
            </div>
          </div>
          <h3 className='font-semibold text-gray-800 mb-2'>You're all caught up</h3>
          <p className='text-gray-500 text-sm'>You've seen all new posts from the past 3 days.</p>
        </div>
      </div>
    </div>
  )
}

export default Feed