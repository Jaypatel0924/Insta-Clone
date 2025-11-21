import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Grid, Bookmark, UserSquare2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const userPosts = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&q=80',
  'https://images.unsplash.com/photo-1682687221038-404cb8830901?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=400&q=80',
  'https://images.unsplash.com/photo-1682687220067-dced9a881b56?w=400&q=80',
];

export default function Profile() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('posts');

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-[935px] mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="flex gap-8 mb-12">
          <Avatar className="w-36 h-36">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback className="text-4xl">{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-xl font-light">{user.username}</h1>
              <Button variant="outline" size="sm">
                Edit profile
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-10 mb-6">
              <div>
                <span className="font-semibold">9</span> posts
              </div>
              <button className="hover:text-gray-600">
                <span className="font-semibold">{user.followers.toLocaleString()}</span> followers
              </button>
              <button className="hover:text-gray-600">
                <span className="font-semibold">{user.following.toLocaleString()}</span> following
              </button>
            </div>

            <div>
              <p className="font-semibold">{user.username}</p>
              {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-center border-t border-gray-200 bg-transparent h-auto p-0">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 data-[state=active]:border-t data-[state=active]:border-black -mt-px"
            >
              <Grid className="w-4 h-4" />
              <span className="uppercase text-xs font-semibold">Posts</span>
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="flex items-center gap-2 data-[state=active]:border-t data-[state=active]:border-black -mt-px"
            >
              <Bookmark className="w-4 h-4" />
              <span className="uppercase text-xs font-semibold">Saved</span>
            </TabsTrigger>
            <TabsTrigger
              value="tagged"
              className="flex items-center gap-2 data-[state=active]:border-t data-[state=active]:border-black -mt-px"
            >
              <UserSquare2 className="w-4 h-4" />
              <span className="uppercase text-xs font-semibold">Tagged</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-8">
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative group cursor-pointer overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Post ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-8">
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-2xl font-light mb-2">Save</p>
              <p className="text-sm text-gray-500">
                Save photos and videos that you want to see again.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="tagged" className="mt-8">
            <div className="text-center py-12">
              <UserSquare2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-2xl font-light mb-2">Photos of you</p>
              <p className="text-sm text-gray-500">
                When people tag you in photos, they'll appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
