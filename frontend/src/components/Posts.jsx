import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'
import { Loader2, Camera, Plus } from 'lucide-react'

const Posts = () => {
  const { posts, loading } = useSelector(store => store.post);
  const { user } = useSelector(store => store.auth);

  return (
    <div className="pb-8">
   

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Camera size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Posts Yet</h3>
          <p className="text-gray-500 max-w-md">
            When people you follow share photos and videos, they'll appear here.
          </p>
          <button className="mt-4 text-blue-500 font-semibold text-sm hover:text-blue-600">
            Discover people to follow
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
          
          {/* End of Feed Indicator */}
        
        </div>
      )}
    </div>
  )
}

export default Posts