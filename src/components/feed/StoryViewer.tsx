import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { storyService } from '@/services/api.service';

interface Story {
  id: string;
  image: string;
  caption: string;
  views: number;
  hasViewed: boolean;
  createdAt: string;
}

interface StoryGroup {
  userId: string;
  username: string;
  avatar: string;
  stories: Story[];
}

interface StoryViewerProps {
  storyGroups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ storyGroups, initialGroupIndex, onClose }: StoryViewerProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  useEffect(() => {
    if (!currentStory) return;

    // Mark story as viewed
    const markViewed = async () => {
      try {
        await storyService.addStoryView(currentStory.id);
      } catch (error) {
        console.error('Failed to mark story as viewed:', error);
      }
    };

    markViewed();
  }, [currentStory]);

  useEffect(() => {
    // Auto-progress story
    const duration = 5000; // 5 seconds per story
    const interval = 50; // Update every 50ms

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (interval / duration) * 100;
        if (newProgress >= 100) {
          nextStory();
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentGroupIndex, currentStoryIndex]);

  const nextStory = () => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else if (currentGroupIndex < storyGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
      const prevGroup = storyGroups[currentGroupIndex - 1];
      setCurrentStoryIndex(prevGroup.stories.length - 1);
      setProgress(0);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftSide = x < rect.width / 2;

    if (isLeftSide) {
      previousStory();
    } else {
      nextStory();
    }
  };

  if (!currentGroup || !currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-10"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation buttons */}
      {currentGroupIndex > 0 && (
        <button
          onClick={previousStory}
          className="absolute left-4 text-white z-10"
        >
          <ChevronLeft className="w-12 h-12" />
        </button>
      )}

      {currentGroupIndex < storyGroups.length - 1 && (
        <button
          onClick={nextStory}
          className="absolute right-4 text-white z-10"
        >
          <ChevronRight className="w-12 h-12" />
        </button>
      )}

      {/* Story container */}
      <div className="relative w-full max-w-[500px] h-[90vh] bg-black">
        {/* Progress bars */}
        <div className="absolute top-2 left-0 right-0 flex gap-1 px-2 z-10">
          {currentGroup.stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index < currentStoryIndex ? '100%' : index === currentStoryIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="absolute top-6 left-4 right-4 flex items-center gap-2 z-10">
          <Avatar className="w-10 h-10 border-2 border-white">
            <AvatarImage src={currentGroup.avatar} />
            <AvatarFallback>{currentGroup.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold">{currentGroup.username}</span>
          <span className="text-white text-sm opacity-70">
            {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Story image */}
        <div
          onClick={handleClick}
          className="w-full h-full flex items-center justify-center cursor-pointer"
        >
          <img
            src={currentStory.image}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <p>{currentStory.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}
