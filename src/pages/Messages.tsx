import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Image as ImageIcon, Heart, Info, MessageCircle, Smile, Film } from 'lucide-react';

interface Chat {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text?: string;
  mediaType?: 'reel' | 'image';
  mediaUrl?: string;
  emoji?: string;
  timestamp: string;
  seen: boolean;
}

const mockChats: Chat[] = [
  {
    id: '1',
    username: 'john_doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    lastMessage: 'Hey! How are you?',
    timestamp: '2m',
    unread: true,
    online: true,
  },
  {
    id: '2',
    username: 'jane_smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    lastMessage: 'Thanks for sharing!',
    timestamp: '1h',
    unread: false,
    online: false,
  },
  {
    id: '3',
    username: 'mike_wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    lastMessage: 'See you tomorrow!',
    timestamp: '3h',
    unread: false,
    online: true,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    text: 'Hey! How are you?',
    timestamp: '10:30 AM',
    seen: true,
  },
  {
    id: '2',
    senderId: 'me',
    text: "I'm good! How about you?",
    timestamp: '10:32 AM',
    seen: true,
  },
  {
    id: '3',
    senderId: '1',
    text: 'Doing great! Want to grab coffee later?',
    timestamp: '10:35 AM',
    seen: true,
  },
  {
    id: '4',
    senderId: 'me',
    text: 'Sure! What time works for you?',
    timestamp: '10:36 AM',
    seen: false,
  },
];

const emojis = ['😊', '❤️', '👍', '😂', '🎉', '🔥', '👏', '💯'];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      seen: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const handleSendEmoji = (emoji: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      emoji: emoji,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      seen: false,
    };

    setMessages([...messages, newMessage]);
    setShowEmojiPicker(false);
  };

  const handleSendMedia = (type: 'reel' | 'image') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      mediaType: type,
      mediaUrl: 'https://via.placeholder.com/300',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      seen: false,
    };

    setMessages([...messages, newMessage]);
    setShowMediaOptions(false);
  };

  return (
    <MainLayout>
      <div className="h-screen flex">
        {/* Chat List */}
        <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>

          <ScrollArea className="flex-1">
            {mockChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{chat.username}</p>
                  <p className={`text-sm ${chat.unread ? 'font-semibold' : 'text-gray-500'}`}>
                    {chat.lastMessage}
                  </p>
                </div>

                <div className="text-xs text-gray-500">{chat.timestamp}</div>
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedChat.username}</p>
                  {selectedChat.online && (
                    <p className="text-xs text-gray-500">Active now</p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Info className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.emoji ? (
                      <div className="text-4xl">
                        {message.emoji}
                      </div>
                    ) : message.mediaType ? (
                      <div
                        className={`max-w-[300px] rounded-lg overflow-hidden ${
                          message.senderId === 'me' ? 'bg-blue-600' : 'bg-gray-100'
                        }`}
                      >
                        {message.mediaType === 'reel' && (
                          <div className="relative">
                            <Film className="w-8 h-8 absolute top-2 left-2 text-white" />
                            <img
                              src={message.mediaUrl}
                              alt="Reel"
                              className="w-full"
                            />
                            <p className="px-4 py-2 text-white text-sm">Shared a reel</p>
                          </div>
                        )}
                        {message.mediaType === 'image' && (
                          <img
                            src={message.mediaUrl}
                            alt="Shared"
                            className="w-full"
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[70%] rounded-3xl px-4 py-2 ${
                          message.senderId === 'me'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-black'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mb-2 p-2 bg-gray-100 rounded-lg flex gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSendEmoji(emoji)}
                      className="text-2xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Media Options */}
              {showMediaOptions && (
                <div className="mb-2 p-3 bg-gray-100 rounded-lg flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMedia('image')}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Send Photo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMedia('reel')}
                  >
                    <Film className="w-4 h-4 mr-2" />
                    Send Reel
                  </Button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowMediaOptions(false);
                  }}
                >
                  <Smile className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowMediaOptions(!showMediaOptions);
                    setShowEmojiPicker(false);
                  }}
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Message..."
                  className="flex-1 border-gray-300 rounded-full"
                />
                {messageText.trim() ? (
                  <Button onClick={handleSendMessage} size="icon" variant="ghost">
                    <Send className="w-5 h-5 text-blue-600" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => handleSendEmoji('❤️')}>
                    <Heart className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <MessageCircle className="w-24 h-24 mx-auto mb-4 text-gray-300" />
              <h3 className="text-2xl font-light mb-2">Your Messages</h3>
              <p className="text-gray-500">Send private photos and messages to a friend.</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
