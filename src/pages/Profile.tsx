import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Grid, Bookmark, UserSquare2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { userService } from '@/services/api.service';

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
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('posts');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      
      try {
        const data = await userService.getUserProfile(username);
        setProfileData(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!profileData) return;
    
    setFollowLoading(true);
    try {
      const result = await userService.toggleFollow(profileData.id);
      setProfileData({
        ...profileData,
        isFollowing: result.isFollowing,
        hasRequestedFollow: result.isRequested,
        followers: result.isFollowing 
          ? profileData.followers + 1 
          : profileData.followers - (profileData.isFollowing ? 1 : 0),
      });
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const getFollowButtonText = () => {
    if (!profileData) return 'Follow';
    if (profileData.isFollowing) return 'Following';
    if (profileData.hasRequestedFollow) return 'Requested';
    return 'Follow';
  };

  const getFollowButtonVariant = () => {
    if (!profileData) return 'default';
    if (profileData.isFollowing || profileData.hasRequestedFollow) return 'outline';
    return 'default';
  };

  if (loading || !profileData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  const isOwnProfile = profileData.isOwnProfile || (currentUser && currentUser.username === username);

  return (
    <MainLayout>
      <div className="max-w-[935px] mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="flex gap-8 mb-12">
          <Avatar className="w-36 h-36">
            <AvatarImage src={profileData.profilePicture} />
            <AvatarFallback className="text-4xl">{profileData.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-xl font-light">{profileData.username}</h1>
              {isOwnProfile ? (
                <>
                  <Button variant="outline" size="sm">
                    Edit profile
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Button 
                  variant={getFollowButtonVariant()}
                  size="sm"
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                >
                  {followLoading ? 'Loading...' : getFollowButtonText()}
                </Button>
              )}
            </div>

            <div className="flex gap-10 mb-6">
              <div>
                <span className="font-semibold">{profileData.posts?.length || 0}</span> posts
              </div>
              <button className="hover:text-gray-600">
                <span className="font-semibold">{profileData.followers}</span> followers
              </button>
              <button className="hover:text-gray-600">
                <span className="font-semibold">{profileData.following}</span> following
              </button>
            </div>

            <div>
              <p className="font-semibold">{profileData.username}</p>
              {profileData.bio && <p className="text-sm mt-1">{profileData.bio}</p>}
              {profileData.isPrivate && (
                <p className="text-xs text-gray-500 mt-1">🔒 Private account</p>
              )}
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
            {isOwnProfile && (
              <>
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
              </>
            )}
          </TabsList>

          <TabsContent value="posts" className="mt-8">
            {profileData.isPrivate && !profileData.isFollowing && !isOwnProfile ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-black rounded-full flex items-center justify-center">
                  <UserSquare2 className="w-8 h-8" />
                </div>
                <p className="text-2xl font-light mb-2">This Account is Private</p>
                <p className="text-sm text-gray-500">
                  Follow to see their photos and videos.
                </p>
              </div>
            ) : (
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
            )}
          </TabsContent>

          {isOwnProfile && (
            <>
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
            </>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
}
