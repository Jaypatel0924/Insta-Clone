import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2, VolumeX, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { reelService } from '@/services/api.service';

interface Reel {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  video: string;
  thumbnail: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

export default function Reels() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [reels, setReels] = useState<Reel[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const data = await reelService.getReels();
        setReels(data);
      } catch (error) {
        console.error('Failed to fetch reels:', error);
      }
    };

    fetchReels();
  }, []);

  useEffect(() => {
    // Auto-play video when it's in view
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
    }
  }, [currentIndex]);

  const toggleLike = async (id: string) => {
    try {
      const result = await reelService.toggleLikeReel(id);
      setReels(reels.map(reel =>
        reel.id === id
          ? { ...reel, isLiked: result.isLiked, likes: result.likes }
          : reel
      ));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'down' && currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handleScroll('up');
      if (e.key === 'ArrowDown') handleScroll('down');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length, handleScroll]);

  if (reels.length === 0) {
    return (
      <MainLayout>
        <div className="h-screen flex flex-col items-center justify-center bg-black">
          <p className="text-white mb-4">No reels available</p>
          <Button onClick={() => navigate('/create-reel')} className="bg-white text-black hover:bg-gray-200">
            <Plus className="w-5 h-5 mr-2" />
            Create Reel
          </Button>
        </div>
      </MainLayout>
    );
  }

  const currentReel = reels[currentIndex];

  return (
    <MainLayout>
      <div className="h-screen flex items-center justify-center bg-black relative">
        {/* Create Reel Button */}
        <button
          onClick={() => navigate('/create-reel')}
          className="fixed top-4 left-[280px] z-10 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Reel
        </button>

        <div className="relative w-full max-w-[500px] h-full bg-black">
          {/* Reel Content */}
          <div className="relative h-full">
            {/* Video */}
            <video
              ref={videoRef}
              src={currentReel.video}
              poster={currentReel.thumbnail}
              loop
              muted={muted}
              playsInline
              className="w-full h-full object-cover"
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.paused) {
                    videoRef.current.play();
                  } else {
                    videoRef.current.pause();
                  }
                }
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

            {/* User Info */}
            <div className="absolute bottom-20 left-4 right-20 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={currentReel.userAvatar} />
                  <AvatarFallback>{currentReel.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{currentReel.username}</span>
                <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  Follow
                </Button>
              </div>
              <p className="text-sm">{currentReel.caption}</p>
              {currentReel.hashtags.length > 0 && (
                <p className="text-sm text-blue-400 mt-1">
                  {currentReel.hashtags.map(tag => `#${tag}`).join(' ')}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="absolute bottom-20 right-4 flex flex-col gap-6 text-white">
              <button
                onClick={() => toggleLike(currentReel.id)}
                className="flex flex-col items-center gap-1"
              >
                <Heart
                  className={`w-7 h-7 ${currentReel.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                />
                <span className="text-xs">{currentReel.likes.toLocaleString()}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <MessageCircle className="w-7 h-7" />
                <span className="text-xs">{currentReel.comments}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <Send className="w-7 h-7" />
              </button>

              <button className="flex flex-col items-center gap-1">
                <Bookmark className="w-7 h-7" />
              </button>

              <button className="flex flex-col items-center gap-1">
                <MoreHorizontal className="w-7 h-7" />
              </button>
            </div>

            {/* Mute Button */}
            <button
              onClick={() => setMuted(!muted)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Indicators */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
            {currentIndex > 0 && (
              <button
                onClick={() => handleScroll('up')}
                className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
              >
                ↑
              </button>
            )}
            {currentIndex < reels.length - 1 && (
              <button
                onClick={() => handleScroll('down')}
                className="text-white bg-black/50 rounded-full p-2 ml-auto hover:bg-black/70"
              >
                ↓
              </button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}