import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { storyService } from '@/services/api.service';
import { useAuthStore } from '@/store/useAuthStore';
import StoryViewer from './StoryViewer';

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

export default function Stories() {
  const navigate = useNavigate();
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await storyService.getStories();
        setStoryGroups(data);
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      }
    };

    fetchStories();
  }, []);

  const hasNewStory = (group: StoryGroup) => {
    return group.stories.some(story => !story.hasViewed);
  };

  const handleStoryClick = (index: number) => {
    setSelectedGroupIndex(index);
    setViewerOpen(true);
  };

  const handleCreateStory = () => {
    navigate('/create-story');
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4">
            {/* Your story / Create story */}
            <button
              onClick={handleCreateStory}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div className="relative">
                <div className="p-[2px] rounded-full bg-gray-200">
                  <div className="bg-white p-[2px] rounded-full">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={user?.profilePicture} />
                      <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              </div>
              <span className="text-xs max-w-[64px] truncate">Your story</span>
            </button>

            {/* Other users' stories */}
            {storyGroups.map((group, index) => (
              <button
                key={group.userId}
                onClick={() => handleStoryClick(index)}
                className="flex flex-col items-center gap-1 flex-shrink-0"
              >
                <div
                  className={`p-[2px] rounded-full ${
                    hasNewStory(group)
                      ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
                      : 'bg-gray-200'
                  }`}
                >
                  <div className="bg-white p-[2px] rounded-full">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="text-xs max-w-[64px] truncate">
                  {group.userId === user?.id ? 'Your story' : group.username}
                </span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Story Viewer Modal */}
      {viewerOpen && storyGroups.length > 0 && (
        <StoryViewer
          storyGroups={storyGroups}
          initialGroupIndex={selectedGroupIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}