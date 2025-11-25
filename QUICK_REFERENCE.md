# Quick Reference Guide

A cheat sheet for common tasks in the Instagram Clone project.

---

## 🚀 Getting Started (First Time)

```bash
# Backend setup
cd backend
npm install
# Create .env file with MongoDB, Cloudinary, Secret
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
# Create .env file with API URLs
npm run dev

# Access at http://localhost:5173
```

---

## 📝 Environment Variables Cheat Sheet

### Backend .env (Required)
```
PORT=5000
MONGO_DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
SECRET_KEY=abc123def456ghi789jkl012mno345pqr
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend .env (Required)
```
VITE_BACKEND_API=http://localhost:5000/api/v1
VITE_SOCKET_IO_URL=http://localhost:5000
```

---

## 🔧 Common Terminal Commands

### Backend Commands
```bash
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run lint         # Check code quality
cd ..                # Go to parent directory
```

### Frontend Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
```

### Database Commands
```bash
mongosh                                      # Connect to MongoDB
mongosh "mongodb+srv://user:pass@..."       # Connect to Atlas
use instaclone                               # Switch database
db.users.find()                              # View all users
db.posts.find()                              # View all posts
db.dropDatabase()                            # Delete all data (⚠️ careful!)
```

### Kill Process Using Port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

---

## 📡 API Endpoints Quick Reference

### User
```
POST   /user/register              Register
POST   /user/login                 Login
GET    /user/logout                Logout
GET    /user/:id/profile           Get profile
POST   /user/profile/edit          Edit profile
GET    /user/suggested             Get suggestions
POST   /user/followorunfollow/:id  Follow/Unfollow
```

### Posts
```
POST   /post/addpost               Create
GET    /post/allpost               Get all
POST   /post/:id/like              Like
POST   /post/:id/comment           Comment
DELETE /post/:id                   Delete
```

### Stories
```
POST   /story/create               Create
GET    /story/:id                  Get user stories
PUT    /story/view/:id             View story
DELETE /story/delete/:id           Delete
```

### Reels
```
POST   /reel/create                Create
GET    /reel                        Get all
POST   /reel/:id/like              Like
POST   /reel/:id/comment           Comment
```

### Messages
```
POST   /message/send/:id           Send
GET    /message/all/:id            Get all
DELETE /message/delete/:id         Delete
```

### Notifications
```
GET    /notification               Get all
PUT    /notification/:id/read      Mark read
DELETE /notification/:id           Delete
```

### Follow Requests
```
POST   /follow-request/send/:id    Send
GET    /follow-request             Get pending
PUT    /follow-request/accept/:id  Accept
```

### Explore
```
GET    /explore/posts?page=1       Explore posts
GET    /explore/reels?page=1       Explore reels
GET    /explore/trending/posts     Trending posts
GET    /explore/search/users?q=... Search users
```

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Pass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Pass123"
  }'
```

### Get Profile (with token)
```bash
curl http://localhost:5000/api/v1/user/123/profile \
  -b cookies.txt
```

### Create Post
```bash
curl -X POST http://localhost:5000/api/v1/post/addpost \
  -b cookies.txt \
  -F "caption=My first post" \
  -F "image=@/path/to/image.jpg"
```

### Get All Posts
```bash
curl http://localhost:5000/api/v1/post/allpost \
  -b cookies.txt
```

### Like Post
```bash
curl -X POST http://localhost:5000/api/v1/post/507f1f77bcf86cd799439011/like \
  -b cookies.txt
```

---

## 📂 File Structure Quick Reference

```
backend/
  controllers/
    user.controller.js       Register, Login, Profile
    post.controller.js       CRUD posts
    story.controller.js      CRUD stories
    reel.controller.js       CRUD reels
    message.controller.js    Send/receive messages
    notification.controller.js  Notifications
    followRequest.controller.js Follow requests
    explore.controller.js    Search & explore
  
  models/
    user.model.js           User schema
    post.model.js           Post schema
    story.model.js          Story schema (TTL)
    reel.model.js           Reel schema
    message.model.js        Message schema
    notification.model.js   Notification schema
    followRequest.model.js  Follow request schema
    reelComment.model.js    Reel comment schema
    savedPost.model.js      Saved post schema
    conversation.model.js   Conversation schema
  
  routes/
    user.route.js           User endpoints
    post.route.js           Post endpoints
    story.route.js          Story endpoints
    reel.route.js           Reel endpoints
    message.route.js        Message endpoints
    notification.route.js   Notification endpoints
    followRequest.route.js  Follow request endpoints
    explore.route.js        Explore endpoints
    search.route.js         Search endpoints
  
  middlewares/
    isAuthenticated.js      JWT verification
    multer.js               File upload
  
  socket/
    socket.js               Socket.io events
  
  utils/
    cloudinary.js           Image/video upload
    datauri.js              File conversion
    db.js                   Database connection
  
  index.js                  Server entry point
  package.json              Dependencies

frontend/
  src/
    components/
      Home.jsx              Main feed
      Profile.jsx           User profile
      Stories.jsx           Story viewer
      Reels.jsx             Reel player
      Explore.jsx           Explore & search
      Messages.jsx          Messaging
      Notifications.jsx     Notification center
      Settings.jsx          Account settings
      CreatePost.jsx        Post creation
      Post.jsx              Post display
      Comment.jsx           Comment display
      ChatPage.jsx          Chat interface
      Login.jsx             Login page
      Signup.jsx            Register page
      ui/                   shadcn/ui components
    
    hooks/
      useGetUserProfile.jsx      Get user profile
      useGetAllPost.jsx          Get posts
      useGetFollowingStories.jsx Get stories
      useGetReels.jsx            Get reels
      useGetNotifications.jsx    Get notifications
      useGetRTM.jsx              Real-time messages
      useGetSuggestedUsers.jsx   Get suggestions
    
    redux/
      store.js              Redux store config
      authSlice.js          User authentication
      postSlice.js          Posts state
      chatSlice.js          Messages state
      storySlice.js         Stories state
      reelSlice.js          Reels state
      notificationSlice.js  Notifications state
      followSlice.js        Follow requests state
      rtnSlice.js           Real-time notifications
    
    api/
      api.js                40+ API functions
    
    lib/
      utils.js              Utility functions
    
    socket.js               Socket.io client
    App.jsx                 Main app component
    main.jsx                Entry point
```

---

## 💾 Database Schema Quick Reference

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  profilePicture: String,
  bio: String,
  gender: String,
  followers: [ObjectId],
  following: [ObjectId],
  posts: [ObjectId],
  stories: [ObjectId],
  reels: [ObjectId],
  isPrivate: Boolean,
  isVerified: Boolean,
  blockedUsers: [ObjectId],
  followRequests: [ObjectId],
  accountSwitches: [{accountName, accountType, createdAt}],
  website: String,
  createdAt: Date
}
```

### Post
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
  savedCount: Number,
  createdAt: Date
}
```

### Story
```javascript
{
  author: ObjectId,
  image: String,
  text: String,
  views: [ObjectId],
  expiresAt: Date (auto-delete after 24h)
}
```

### Message
```javascript
{
  senderId: ObjectId,
  receiverId: ObjectId,
  message: String,
  mediaType: String (text|image|video|reel|emoji),
  mediaUrl: String,
  emoji: String,
  isRead: Boolean,
  deletedFor: [ObjectId],
  createdAt: Date
}
```

### Notification
```javascript
{
  recipient: ObjectId,
  sender: ObjectId,
  type: String (like|comment|follow|follow_request|mention|message),
  post: ObjectId,
  reel: ObjectId,
  text: String,
  isRead: Boolean,
  createdAt: Date
}
```

---

## 🎨 Redux Quick Reference

### Store Structure
```javascript
{
  auth: { user, loading, error },
  post: { posts, loading, error },
  chat: { messages, onlineUsers, loading },
  story: { stories, currentStory, loading },
  reel: { reels, currentReel, loading },
  notification: { notifications, unreadCount },
  follow: { followRequests, loading },
  rtn: { realTimeNotifications }
}
```

### Dispatching Actions
```javascript
// In React component
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '../redux/authSlice'

const MyComponent = () => {
  const dispatch = useDispatch()
  const user = useSelector(store => store.auth.user)
  
  const login = () => {
    dispatch(setAuthUser(userData))
  }
}
```

### Common Actions
```javascript
// Auth
dispatch(setAuthUser(user))
dispatch(logoutUser())

// Posts
dispatch(setPosts(posts))
dispatch(createPost(post))
dispatch(deletePost(postId))

// Stories
dispatch(setStories(stories))
dispatch(setCurrentStory(story))

// Reels
dispatch(setReels(reels))
dispatch(likeReel(reelId))

// Notifications
dispatch(setNotifications(notifications))
dispatch(markAsRead(notificationId))

// Follow
dispatch(setFollowRequests(requests))
dispatch(acceptRequest(requestId))
```

---

## 🔐 Authentication Flow

### Register
```
User enters credentials
↓
POST /user/register (backend validates)
↓
Password hashed with bcrypt
↓
User created in database
↓
JWT token generated
↓
Redirect to login
```

### Login
```
User enters email/password
↓
POST /user/login (backend validates)
↓
Password compared with bcrypt
↓
JWT token generated
↓
Token stored in secure cookie
↓
Redux updated with user data
↓
Redirect to home
```

### Protected Routes
```
Component requests data
↓
Middleware checks cookie for JWT
↓
JWT verified with SECRET_KEY
↓
User ID extracted from token
↓
Route allowed with auth
↓
Or redirect to login
```

---

## 🔌 Socket.io Events

### Client Events (Frontend → Backend)
```javascript
socket.emit('typing', { receiverId, username })
socket.emit('stopTyping', { receiverId })
socket.emit('newMessage', { message })
socket.emit('storyViewed', { storyId, authorId })
socket.emit('reelLiked', { reelId, userId })
socket.emit('reelCommented', { reelId, commentText })
socket.emit('followRequested', { userId })
socket.emit('disconnect', (reason) => {})
```

### Server Events (Backend → Frontend)
```javascript
socket.on('newMessage', (message) => {
  // Update chat in real-time
})

socket.on('notification', (notification) => {
  // Add notification to bell icon
})

socket.on('userTyping', ({ username }) => {
  // Show "username is typing..."
})

socket.on('userStoppedTyping', () => {
  // Hide typing indicator
})

socket.on('getOnlineUsers', (onlineUsers) => {
  // Update online status
})

socket.on('storyViewed', ({ storyId, viewCount }) => {
  // Update story view count
})
```

---

## 🐛 Debugging Tips

### Check Backend Logs
```bash
# Terminal where npm run dev is running
# Look for errors or INFO messages
```

### Check Frontend Console
```bash
# Browser: F12 → Console tab
# Look for red error messages
console.log('Debug:', variable)
```

### Check Redux State
```javascript
// Browser: F12 → Redux tab (if Redux DevTools extension installed)
// See state, actions, and action history
```

### Check Network Requests
```bash
# Browser: F12 → Network tab
# See all API calls, responses, and headers
```

### Test API Manually
```bash
curl http://localhost:5000/api/v1/user/logout
# Should return success: true
```

### Check Database
```bash
mongosh
use instaclone
db.users.countDocuments()  # See number of users
db.posts.find()            # See all posts
```

---

## 📱 File Upload Guidelines

### Image Upload
```javascript
// Max size: 50MB
// Allowed types: JPEG, PNG, WebP, GIF
// Goes to Cloudinary
// Returns secure URL
```

### Video Upload (Reels)
```javascript
// Max size: 100MB
// Allowed types: MP4, WebM
// Goes to Cloudinary
// Returns secure URL
```

### Setup
```javascript
// Backend: middleware/multer.js
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 50*1024*1024 } })

// Routes: routes/post.route.js
router.post('/addpost', isAuthenticated, upload.single('image'), addNewPost)
```

---

## 🎯 Feature Implementation Checklist

### Adding a New Feature

- [ ] 1. Design database schema (models/)
- [ ] 2. Create controller functions (controllers/)
- [ ] 3. Add routes and endpoints (routes/)
- [ ] 4. Create Redux slice (redux/)
- [ ] 5. Build React components (components/)
- [ ] 6. Add API functions (api/api.js)
- [ ] 7. Update custom hooks if needed (hooks/)
- [ ] 8. Add Socket.io events if real-time (socket/)
- [ ] 9. Test with curl/Postman
- [ ] 10. Test in browser
- [ ] 11. Update documentation

---

## 🚀 Deployment Quick Reference

### Deploy Backend to Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set MONGO_DB_URI=your_uri
heroku config:set SECRET_KEY=your_key
heroku open
```

### Deploy Frontend to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts
# Add VITE_BACKEND_API env variable
```

### Test Production
```bash
# Backend health check
curl https://your-backend-url/health

# Frontend
https://your-frontend-url
# Login and test
```

---

## 📚 Documentation Files Map

| Need Help With | Read File |
|---|---|
| Getting started | SETUP.md |
| All API endpoints | API_DOCUMENTATION.md |
| How features work | IMPLEMENTATION_GUIDE.md |
| Deployment | DEPLOYMENT.md |
| Testing | TESTING.md |
| Issues | TROUBLESHOOTING.md |
| What changed | CHANGES.md |
| Overview | README_COMPLETE.md |
| This guide | QUICK_REFERENCE.md |

---

## 💡 Pro Tips

1. **Use Redux DevTools** - Install browser extension to debug Redux state
2. **Use Network Tab** - F12 → Network to see API calls and responses
3. **Save Postman Requests** - Create collection for manual API testing
4. **Use MongoDB Compass** - GUI for MongoDB to view/edit data
5. **Git Commit Often** - Useful checkpoints for rollback
6. **Test in Incognito** - Avoid cache issues when testing
7. **Check ENV Variables** - 80% of issues are wrong environment variables
8. **Read Error Messages** - They tell you exactly what's wrong
9. **Use Console.log** - Debug by logging variables
10. **Keep Docs Updated** - Document your changes

---

## 🆘 Emergency Fixes

### App won't start
```bash
# Kill all node processes
killall node  # Mac/Linux
taskkill /F /IM node.exe  # Windows

# Reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### MongoDB not responding
```bash
mongosh
# If connects, database is fine
# If not, check:
# 1. MONGO_DB_URI in .env
# 2. IP whitelist in MongoDB Atlas
# 3. Username/password
```

### Cloudinary upload failing
```bash
# Check .env has:
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Test credentials at https://cloudinary.com/console
```

### CORS errors
```bash
# Backend must allow frontend origin
# In backend/index.js:
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

---

**Version**: 1.0.0  
**Last Updated**: November 2024  
**Quick Reference Edition**

Print this for quick reference while coding! 📋
