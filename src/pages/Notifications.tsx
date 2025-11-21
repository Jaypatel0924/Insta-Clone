import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  postImage?: string;
  isFollowing?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    username: 'john_doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    text: 'liked your photo.',
    timestamp: '2m',
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&q=80',
  },
  {
    id: '2',
    type: 'follow',
    username: 'jane_smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    text: 'started following you.',
    timestamp: '1h',
    isFollowing: false,
  },
  {
    id: '3',
    type: 'comment',
    username: 'mike_wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    text: 'commented: "Amazing shot! 🔥"',
    timestamp: '3h',
    postImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80',
  },
  {
    id: '4',
    type: 'like',
    username: 'sarah_jones',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    text: 'liked your photo.',
    timestamp: '5h',
    postImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&q=80',
  },
  {
    id: '5',
    type: 'follow',
    username: 'alex_brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    text: 'started following you.',
    timestamp: '1d',
    isFollowing: true,
  },
  {
    id: '6',
    type: 'mention',
    username: 'emma_davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    text: 'mentioned you in a comment.',
    timestamp: '2d',
    postImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80',
  },
];

export default function Notifications() {
  return (
    <MainLayout>
      <div className="max-w-[600px] mx-auto py-8 px-4">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="divide-y divide-gray-200">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className="p-4 flex items-center gap-3 hover:bg-gray-50">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={notification.avatar} />
                    <AvatarFallback>{notification.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{notification.username}</span>{' '}
                      {notification.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                  </div>

                  {notification.type === 'follow' && notification.isFollowing !== undefined && (
                    <Button
                      size="sm"
                      variant={notification.isFollowing ? 'outline' : 'default'}
                    >
                      {notification.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}

                  {notification.postImage && (
                    <img
                      src={notification.postImage}
                      alt="Post"
                      className="w-11 h-11 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </MainLayout>
  );
}
