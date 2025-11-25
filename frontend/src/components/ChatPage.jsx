import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, Search, MoreHorizontal, Video, Phone, Info } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const sendMessageHandler = async (receiverId) => {
    try {
      if (!textMessage.trim()) return;

      const res = await axios.post(
        `http://localhost:5000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserSelect = (user) => {
    dispatch(setSelectedUser(user));
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToInbox = () => {
    setShowChat(false);
    dispatch(setSelectedUser(null));
  };

  // Filter users based on search query
  const filteredUsers = suggestedUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  // Mobile view: Show either inbox or chat
  if (isMobile) {
    if (showChat && selectedUser) {
      return (
        <div className="h-screen flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackToInbox}
                className="w-8 h-8"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedUser?.profilePicture} />
                <AvatarFallback>{selectedUser?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold text-sm">{selectedUser?.username}</span>
                <span className={`text-xs block ${onlineUsers.includes(selectedUser?._id) ? 'text-green-600' : 'text-gray-500'}`}>
                  {onlineUsers.includes(selectedUser?._id) ? 'Active now' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Video size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Phone size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Info size={18} />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-300 bg-white">
            <div className="flex items-center gap-2">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                className="flex-1 rounded-full bg-gray-100 border-0 focus-visible:ring-1"
                placeholder="Message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler(selectedUser?._id)}
              />
              <Button 
                onClick={() => sendMessageHandler(selectedUser?._id)}
                disabled={!textMessage.trim()}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Mobile Inbox View
    return (
      <div className="h-screen flex flex-col bg-white">
        {/* Inbox Header */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="font-bold text-xl">{user?.username}</h1>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={20} />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              className="w-full pl-10 rounded-full bg-gray-100 border-0 focus-visible:ring-1"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            const hasUnread = false; // You can add this logic based on your data

            return (
              <div
                key={suggestedUser._id}
                onClick={() => handleUserSelect(suggestedUser)}
                className="flex gap-3 items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              >
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>{suggestedUser?.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{suggestedUser?.username}</span>
                    <span className="text-xs text-gray-500">12:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 truncate">
                      Last message preview...
                    </span>
                    {hasUnread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="flex h-screen bg-white">
      {/* LEFT SIDEBAR - Inbox */}
      <section className="w-full md:w-96 border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="font-bold text-xl">{user?.username}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Video size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={20} />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              className="w-full pl-10 rounded-full bg-gray-100 border-0 focus-visible:ring-1"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <h2 className="font-semibold text-gray-600">Messages</h2>
          </div>
          {filteredUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            const hasUnread = false; // Add your unread logic here

            return (
              <div
                key={suggestedUser._id}
                onClick={() => handleUserSelect(suggestedUser)}
                className={`flex gap-3 items-center p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedUser?._id === suggestedUser._id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>{suggestedUser?.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{suggestedUser?.username}</span>
                    <span className="text-xs text-gray-500">12:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 truncate">
                      Last message preview...
                    </span>
                    {hasUnread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RIGHT SIDE - Chat or Empty State */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                <AvatarFallback>{selectedUser?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold">{selectedUser?.username}</span>
                <span className={`text-xs block ${onlineUsers.includes(selectedUser?._id) ? 'text-green-600' : 'text-gray-500'}`}>
                  {onlineUsers.includes(selectedUser?._id) ? 'Active now' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Video size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Phone size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Info size={20} />
              </Button>
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-hidden">
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-300 bg-white">
            <div className="flex items-center gap-2">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                className="flex-1 rounded-full bg-gray-100 border-0 focus-visible:ring-1"
                placeholder="Message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler(selectedUser?._id)}
              />
              <Button 
                onClick={() => sendMessageHandler(selectedUser?._id)}
                disabled={!textMessage.trim()}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
              >
                Send
              </Button>
            </div>
          </div>
        </section>
      ) : (
        // Empty State
        <section className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <MessageCircleCode className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-2xl font-light mb-2">Your Messages</h1>
            <p className="text-gray-500 mb-6">
              Send private messages to a friend or group.
            </p>
            <Button className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">
              Send Message
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ChatPage;