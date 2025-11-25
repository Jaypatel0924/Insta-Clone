# Instagram Clone - Complete Implementation Guide

## 🎉 Project Overview

This is a fully-featured Instagram clone built with MERN stack (MongoDB, Express, React, Node.js) that includes all major Instagram features.

## ✨ Features Implemented

### 1. **Stories** 📸
- Create stories with image and text
- View stories from following users
- Story view count
- Auto-delete after 24 hours
- Real-time notifications for story views

### 2. **Reels** 🎥
- Create and share video reels
- Like reels
- Comment on reels
- Share reels with others
- View count tracking
- Trending reels section

### 3. **Follow System** 👥
- Public and private accounts
- Follow requests for private accounts
- Accept/reject follow requests
- Auto-follow for public accounts
- Block users functionality

### 4. **Notifications** 🔔
- Like notifications
- Comment notifications
- Follow/follow request notifications
- Mark as read functionality
- Delete notifications
- Unread count tracking

### 5. **Explore** 🔍
- Discover new posts
- Discover new reels
- Explore suggested users
- Search users
- Search posts
- Search hashtags
- Trending posts and reels

### 6. **Messages** 💬
- Send text messages
- Send images, videos, and reels
- Emoji support
- Message deletion
- Mark messages as read
- Real-time messaging with WebSocket

### 7. **Posts** 📝
- Add posts with captions
- Add location information with coordinates
- Tag other users in posts
- Mention users in captions
- Like and comment on posts
- Save posts to collections

### 8. **Settings** ⚙️
- Toggle private/public account
- Account switching (Personal, Business, Creator)
- Block users
- Two-factor authentication (ready)
- Password management (ready)
- Security settings

### 9. **Real-time Updates** ⚡
- Socket.io integration
- Real-time notifications
- Online user status
- Typing indicators
- Live feed updates

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

## 🗄️ Database Models

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  profilePicture: String,
  bio: String,
  gender: String,
  website: String,
  isPrivate: Boolean,
  isVerified: Boolean,
  followers: [ObjectId],
  following: [ObjectId],
  followRequests: [ObjectId],
  posts: [ObjectId],
  stories: [ObjectId],
  reels: [ObjectId],
  bookmarks: [ObjectId],
  blockedUsers: [ObjectId],
  accountSwitches: [{accountName, accountType, createdAt}]
}
```

### Post Model
```javascript
{
  caption: String,
  image: String,
  author: ObjectId,
  likes: [ObjectId],
  comments: [ObjectId],
  location: {placeName, latitude, longitude},
  taggedUsers: [ObjectId],
  mentions: [ObjectId],
  savedCount: Number
}
```

### Story Model
```javascript
{
  author: ObjectId,
  image: String,
  text: String,
  views: [ObjectId],
  expiresAt: Date (auto-delete after 24h)
}
```

### Reel Model
```javascript
{
  author: ObjectId,
  video: String,
  caption: String,
  music: String,
  likes: [ObjectId],
  comments: [ObjectId],
  viewCount: Number,
  shares: Number
}
```

### Message Model
```javascript
{
  senderId: ObjectId,
  receiverId: ObjectId,
  message: String,
  mediaType: String (text/image/video/reel/emoji),
  mediaUrl: String,
  emoji: String,
  isRead: Boolean,
  deletedFor: [ObjectId]
}
```

### Notification Model
```javascript
{
  recipient: ObjectId,
  sender: ObjectId,
  type: String (like/comment/follow/follow_request/mention/message),
  post: ObjectId,
  reel: ObjectId,
  text: String,
  isRead: Boolean
}
```

## 🔌 API Endpoints

### Story APIs
- `POST /api/v1/story/create` - Create story
- `GET /api/v1/story/:id` - Get user stories
- `GET /api/v1/story/following/all` - Get following stories
- `PUT /api/v1/story/view/:id` - View story
- `DELETE /api/v1/story/delete/:id` - Delete story

### Reel APIs
- `POST /api/v1/reel/create` - Create reel
- `GET /api/v1/reel` - Get all reels
- `GET /api/v1/reel/user/:id` - Get user reels
- `POST /api/v1/reel/:id/like` - Like reel
- `POST /api/v1/reel/:id/comment` - Add comment
- `GET /api/v1/reel/:id/comments` - Get comments
- `DELETE /api/v1/reel/:id/delete` - Delete reel
- `POST /api/v1/reel/:id/share` - Share reel
- `POST /api/v1/reel/:id/view` - Increment view count

### Follow Request APIs
- `POST /api/v1/follow-request/send/:id` - Send follow request
- `GET /api/v1/follow-request` - Get follow requests
- `PUT /api/v1/follow-request/accept/:id` - Accept request
- `PUT /api/v1/follow-request/reject/:id` - Reject request
- `DELETE /api/v1/follow-request/cancel/:id` - Cancel request

### Notification APIs
- `GET /api/v1/notification` - Get notifications
- `PUT /api/v1/notification/:id/read` - Mark as read
- `PUT /api/v1/notification/read/all` - Mark all as read
- `DELETE /api/v1/notification/:id` - Delete notification
- `GET /api/v1/notification/unread/count` - Get unread count

### Explore APIs
- `GET /api/v1/explore/posts` - Explore posts
- `GET /api/v1/explore/reels` - Explore reels
- `GET /api/v1/explore/trending/posts` - Trending posts
- `GET /api/v1/explore/trending/reels` - Trending reels
- `GET /api/v1/explore/users` - Suggested users
- `GET /api/v1/explore/search/users?q=query` - Search users
- `GET /api/v1/explore/search/posts?q=query` - Search posts
- `GET /api/v1/explore/search/hashtags?q=query` - Search hashtags

### Message APIs
- `POST /api/v1/message/send/:id` - Send message
- `GET /api/v1/message/all/:id` - Get messages
- `DELETE /api/v1/message/delete/:id` - Delete message
- `POST /api/v1/message/read` - Mark messages as read

### User APIs
- `PUT /api/v1/user/privacy/toggle` - Toggle private account
- `POST /api/v1/user/block/:id` - Block user
- `POST /api/v1/user/account/switch/add` - Add account switch
- `GET /api/v1/user/account/switches` - Get account switches

## 🎨 Frontend Components

### New Components Created
- `Stories.jsx` - Story viewer and creator
- `Reels.jsx` - Reel player with interactions
- `Explore.jsx` - Explore feed with search
- `Notifications.jsx` - Notification center
- `Settings.jsx` - Account settings and privacy

### Redux Slices
- `storySlice.js` - Story state management
- `reelSlice.js` - Reel state management
- `notificationSlice.js` - Notification state management
- `followSlice.js` - Follow request state management

### Custom Hooks
- `useGetFollowingStories()` - Fetch following stories
- `useGetReels()` - Fetch reels
- `useGetNotifications()` - Fetch notifications

## 🔗 Routes

### Frontend Routes
- `/` - Home feed
- `/stories` - Stories
- `/reels` - Reels feed
- `/explore` - Explore page
- `/notifications` - Notifications
- `/chat` - Messages
- `/profile/:id` - User profile
- `/settings` - Settings
- `/account/edit` - Edit profile
- `/post/:id` - Single post view

## 🚀 Usage Examples

### Create a Story
```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('text', 'Story text');

const res = await axios.post('/api/v1/story/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
});
```

### Create a Reel
```javascript
const formData = new FormData();
formData.append('video', videoFile);
formData.append('caption', 'Reel caption');
formData.append('music', 'Music name');

const res = await axios.post('/api/v1/reel/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
});
```

### Send Follow Request
```javascript
const res = await axios.post(
    `/api/v1/follow-request/send/${userId}`,
    {},
    { withCredentials: true }
);
```

### Send Message with Media
```javascript
const formData = new FormData();
formData.append('textMessage', 'Hello');
formData.append('mediaType', 'image');
formData.append('media', mediaFile);

const res = await axios.post(
    `/api/v1/message/send/${receiverId}`,
    formData,
    { withCredentials: true }
);
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT authentication
- Secure cookies (httpOnly, sameSite)
- CORS configuration
- Input validation
- Rate limiting ready

## 📝 Environment Variables Required

```
MONGODB_URI=
SECRET_KEY=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or kill existing process
```

### MongoDB Connection Error
- Verify connection string
- Check network access in MongoDB Atlas

### Cloudinary Upload Failed
- Verify API credentials
- Check file size limits

### CORS Errors
- Ensure frontend URL matches in backend CORS config
- Check credentials: true settings

## 📦 Dependencies

### Backend
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cloudinary
- socket.io
- multer
- dotenv

### Frontend
- react
- react-router-dom
- redux & react-redux
- axios
- socket.io-client
- tailwindcss
- lucide-react

## 🎯 Future Enhancements

- Video chat/calling
- Story polls and questions
- Advanced analytics
- AI-powered recommendations
- Payment integration
- Email verification
- SMS notifications
- Multiple file uploads

## 📞 Support

For issues or questions, please create an issue in the repository.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Happy Coding! 🚀**
