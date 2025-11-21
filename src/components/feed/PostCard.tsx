import { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Stories from '@/components/feed/Stories';
import PostCard from '@/components/feed/PostCard';
import { usePostStore } from '@/store/usePostStore';
import { postService } from '@/services/api.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const suggestions = [
  { id: '1', username: 'photography_pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photo', followedBy: 'john_doe' },
  { id: '2', username: 'art_lover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=art', followedBy: 'jane_smith' },
  { id: '3', username: 'tech_enthusiast', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech', followedBy: 'mike_wilson' },
  { id: '4', username: 'music_vibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music', followedBy: 'sarah_jones' },
  { id: '5', username: 'book_worm', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=book', followedBy: 'alex_brown' },
];

export default function Feed() {
  const { posts, setPosts } = usePostStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getFeedPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, [setPosts]);

  return (
    <MainLayout>
      <div className="max-w-[935px] mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed */}
          <div className="lg:col-span-2">
            <Stories />
            
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="fixed w-[320px]">
              {/* Suggestions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500">
                    Suggestions For You
                  </h3>
                  <button className="text-xs font-semibold">See All</button>
                </div>
                
                <div className="space-y-3">
                  {suggestions.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">{user.username}</p>
                          <p className="text-xs text-gray-500">
                            Followed by {user.followedBy}
                          </p>
                        </div>
                      </div>
                      <Button variant="link" size="sm" className="text-blue-600 font-semibold">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-400 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <a href="#" className="hover:underline">About</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Help</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Press</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">API</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Jobs</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Privacy</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Terms</a>
                </div>
                <p>© 2024 INSTAGRAM CLONE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}