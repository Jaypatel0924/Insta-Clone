import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';
import { Check, CheckCheck, Camera, Heart, Smile, MessageCircle } from 'lucide-react';

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);

  // Format time for messages
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
  };

  // Check if message contains only emojis for larger display
  const isEmojiOnly = (text) => {
    const emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55]|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
    return emojiRegex.test(text?.trim());
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Instagram-style Header */}
      <div className="sticky top-0 bg-white border-b border-gray-300 z-10">
        <div className="flex flex-col items-center justify-center py-4 px-6">
          <Avatar className="h-16 w-16 mb-3 border-2 border-gray-300">
            <AvatarImage src={selectedUser?.profilePicture} alt={selectedUser?.username} />
            <AvatarFallback className="text-lg font-semibold">
              {selectedUser?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="font-semibold text-lg mb-1">{selectedUser?.username}</h2>
          <p className="text-gray-500 text-sm mb-3">Instagram</p>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button 
              variant="outline" 
              className="h-8 px-4 text-xs font-semibold border-gray-300 hover:bg-gray-50"
            >
              View profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 space-y-3">
        {/* Date Separator */}
        <div className="flex justify-center">
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-xs text-gray-600 font-medium">Today</span>
          </div>
        </div>

        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === user?._id;
            const emojiOnly = isEmojiOnly(msg.message);

            return (
              <div
                key={msg._id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} items-end gap-2 group`}
              >
                {/* Other user's avatar (only show for received messages) */}
                {!isOwnMessage && (
                  <Avatar className="h-6 w-6 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AvatarImage src={selectedUser?.profilePicture} />
                    <AvatarFallback className="text-xs">
                      {selectedUser?.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                {/* Message Bubble */}
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div
                    className={`px-4 py-2 rounded-3xl break-words ${
                      emojiOnly 
                        ? 'text-3xl bg-transparent' 
                        : isOwnMessage
                          ? 'bg-[#3797F0] text-white rounded-tr-none'
                          : 'bg-gray-100 text-black rounded-tl-none'
                    } ${emojiOnly ? '' : 'shadow-sm'}`}
                  >
                    {msg.message}
                  </div>

                  {/* Message Time and Status */}
                  <div className={`flex items-center gap-1 mt-1 px-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.createdAt)}
                    </span>
                    {isOwnMessage && (
                      <div className="text-gray-400">
                        {msg.read ? (
                          <CheckCheck size={12} className="text-blue-500" />
                        ) : (
                          <Check size={12} />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* User's avatar (only show for sent messages) */}
                {isOwnMessage && (
                  <Avatar className="h-6 w-6 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback className="text-xs">
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No messages yet</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Send a message to start a conversation with {selectedUser?.username}
            </p>
          </div>
        )}

        {/* Typing Indicator (you can add this later) */}
        {/* {isTyping && (
          <div className="flex justify-start items-end gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>{selectedUser?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-3xl rounded-tl-none px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Quick Reactions Bar (like Instagram) */}
      <div className="border-t border-gray-300 bg-white p-4">
        <div className="flex justify-center space-x-6">
          <button className="flex flex-col items-center text-gray-500 hover:text-gray-700">
            <Heart size={20} />
            <span className="text-xs mt-1">Like</span>
          </button>
          <button className="flex flex-col items-center text-gray-500 hover:text-gray-700">
            <Camera size={20} />
            <span className="text-xs mt-1">Camera</span>
          </button>
          <button className="flex flex-col items-center text-gray-500 hover:text-gray-700">
            <Smile size={20} />
            <span className="text-xs mt-1">Emoji</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;