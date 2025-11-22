import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(post.isSaved);

  const toggleLike = async () => {
    try {
      const result = await postService.toggleLike(post.id);
      setIsLiked(result.isLiked);
      setLikes(result.likes);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const toggleSave = async () => {
    try {
      await postService.toggleSave(post.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.userAvatar} />
            <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">{post.username}</span>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Image(s) */}
      <div className="relative">
        <img
          src={post.images[currentImageIndex]}
          alt="Post"
          className="w-full aspect-square object-cover"
        />
        {post.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {post.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike}>
              <Heart
                className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
            <button>
              <MessageCircle className="w-6 h-6" />
            </button>
            <button>
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button onClick={toggleSave}>
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-sm">{likes.toLocaleString()} likes</span>
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{post.username}</span>
          <span>{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments > 0 && (
          <button className="text-sm text-gray-500 mt-2">
            View all {post.comments} comments
          </button>
        )}

        {/* Time */}
        <p className="text-xs text-gray-500 mt-2 uppercase">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}
