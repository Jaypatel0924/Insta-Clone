import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { postService } from '@/services/api.service';

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  images: string[];
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

export default function Saved() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const data = await postService.getSavedPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch saved posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-[935px] mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-8">Saved Posts</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-2xl font-light mb-2">Save</p>
            <p className="text-sm text-gray-500">
              Save photos and videos that you want to see again.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square relative group cursor-pointer overflow-hidden"
              >
                <img
                  src={post.images[0]}
                  alt={`Post by ${post.username}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-6 text-white font-semibold">
                    <div className="flex items-center gap-2">
                      <Heart className="w-6 h-6 fill-white" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 fill-white" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
