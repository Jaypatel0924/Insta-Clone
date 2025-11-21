import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { storyService } from '@/services/api.service';
import { useAuthStore } from '@/store/useAuthStore';

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
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {storyGroups.map((group) => (
            <button
              key={group.userId}
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
  );
}