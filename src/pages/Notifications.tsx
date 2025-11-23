import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { userService } from '@/services/api.service';

interface FollowRequest {
  id: string;
  username: string;
  profilePicture: string;
  bio: string;
}

export default function Notifications() {
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowRequests = async () => {
      try {
        const data = await userService.getFollowRequests();
        setFollowRequests(data.requests || []);
      } catch (error) {
        console.error('Failed to fetch follow requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowRequests();
  }, []);

  const handleAcceptRequest = async (userId: string) => {
    try {
      await userService.acceptFollowRequest(userId);
      setFollowRequests(followRequests.filter(req => req.id !== userId));
    } catch (error) {
      console.error('Failed to accept follow request:', error);
    }
  };

  const handleRejectRequest = async (userId: string) => {
    try {
      await userService.rejectFollowRequest(userId);
      setFollowRequests(followRequests.filter(req => req.id !== userId));
    } catch (error) {
      console.error('Failed to reject follow request:', error);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[600px] mx-auto py-8 px-4">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {/* Follow Requests Section */}
                {followRequests.length > 0 && (
                  <>
                    <div className="p-4 bg-gray-50">
                      <h3 className="font-semibold text-sm">Follow Requests</h3>
                    </div>
                    {followRequests.map((request) => (
                      <div key={request.id} className="p-4 flex items-center gap-3 hover:bg-gray-50">
                        <Avatar className="w-11 h-11">
                          <AvatarImage src={request.profilePicture} />
                          <AvatarFallback>{request.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold">{request.username}</span>{' '}
                            wants to follow you.
                          </p>
                          {request.bio && (
                            <p className="text-xs text-gray-500 mt-1">{request.bio}</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Empty State */}
                {followRequests.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No follow requests</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </MainLayout>
  );
}
