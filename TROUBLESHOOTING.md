# Troubleshooting Guide

Common issues and solutions for the Instagram Clone application.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Backend Issues](#backend-issues)
3. [Frontend Issues](#frontend-issues)
4. [Database Issues](#database-issues)
5. [Real-time Issues](#real-time-issues)
6. [Authentication Issues](#authentication-issues)
7. [File Upload Issues](#file-upload-issues)
8. [Performance Issues](#performance-issues)
9. [Common Error Messages](#common-error-messages)
10. [Getting Help](#getting-help)

---

## Installation Issues

### Issue: `npm install` fails with permission errors

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /usr/local/lib/node_modules
```

**Solutions:**

**Option 1: Fix npm permissions (Recommended)**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Option 2: Use sudo (Not recommended)**
```bash
sudo npm install
```

**Option 3: Use nvm (Best practice)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node
nvm install 18
nvm use 18

# Now npm install should work
npm install
```

---

### Issue: Node version mismatch

**Symptoms:**
```
Engine "node" does not satisfy the defined range
```

**Solution:**
```bash
# Check current version
node --version

# Install correct version (18+)
nvm install 18
nvm use 18

# Verify
node --version  # Should be v18.x.x
npm --version   # Should be 9+
```

---

### Issue: Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**Windows:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process (replace PID)
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## Backend Issues

### Issue: Cannot find module errors

**Symptoms:**
```
Cannot find module 'express'
Cannot find module '@hapi/joi'
```

**Solutions:**

```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

# For Windows, use:
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

### Issue: `.env` file not being read

**Symptoms:**
```
Cannot connect to MongoDB
Cloudinary API key is undefined
```

**Solutions:**

```bash
# Make sure .env file exists in backend/
ls backend/.env

# Verify file contents
cat backend/.env

# Reinstall dotenv (if not installed)
cd backend
npm install dotenv

# Update index.js to load env variables first
# Add at the very top of backend/index.js:
require('dotenv').config()
```

**Updated backend/index.js (Top of file):**
```javascript
require('dotenv').config()
const express = require('express')
const cors = require('cors')
// ... rest of imports
```

---

### Issue: MongoDB connection timeout

**Symptoms:**
```
MongooseError: connection timeout
MongooseError: connection refused
```

**Solutions:**

**Check Connection String:**
```javascript
// Verify MONGO_DB_URI format
mongodb+srv://username:password@cluster.mongodb.net/dbname
```

**Common Issues:**
- Special characters in password not URL-encoded
- Username/password incorrect
- IP not whitelisted in MongoDB Atlas

**Fix:**
```bash
# Test connection manually
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/dbname"

# If fails, check:
# 1. Username/password at https://cloud.mongodb.com/
# 2. IP whitelist: Network Access → Add IP Address (0.0.0.0/0 for dev)
# 3. Password special characters: URL-encode them
```

**URL Encode Special Characters:**
```
@ → %40
# → %23
$ → %24
: → %3A
```

---

### Issue: CORS error - Frontend cannot connect to backend

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/v1/user/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**

**Update backend/index.js:**
```javascript
const cors = require('cors')

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://your-frontend-url.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

**Or in .env:**
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**Update backend/index.js to use env:**
```javascript
const cors = require('cors')

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

---

### Issue: Cannot upload files to Cloudinary

**Symptoms:**
```
Error: Invalid file format
Error: Unauthorized
413 Payload Too Large
```

**Solutions:**

**Check Cloudinary Credentials:**
```bash
# Verify in .env
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Get them from:
# 1. Visit https://cloudinary.com/console
# 2. Copy Cloud Name, API Key, API Secret
# 3. Add to .env
```

**File Size Limit:**
```javascript
// In backend/middlewares/multer.js
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file format'), false)
    }
  }
})

module.exports = upload
```

---

### Issue: JWT token errors

**Symptoms:**
```
JsonWebTokenError: invalid token
TokenExpiredError: jwt expired
```

**Solutions:**

**Check SECRET_KEY:**
```bash
# Must be set in .env
echo $SECRET_KEY  # Mac/Linux
echo %SECRET_KEY%  # Windows

# Generate new SECRET_KEY if missing
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Update .env:**
```env
SECRET_KEY=your-generated-long-secret-key-min-32-chars
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
```

**Verify in middleware:**
```javascript
// backend/middlewares/isAuthenticated.js
const jwt = require('jsonwebtoken')

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ 
        message: 'User not authenticated', 
        success: false 
      })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.id = decoded.id
    next()
  } catch (error) {
    console.error('Auth Error:', error)
    return res.status(401).json({ 
      message: 'Invalid token', 
      success: false 
    })
  }
}

module.exports = isAuthenticated
```

---

## Frontend Issues

### Issue: Blank white screen

**Symptoms:**
- Frontend loads but shows nothing
- No errors in console

**Solutions:**

**Step 1: Check browser console**
```
Right-click → Inspect → Console tab
```

**Step 2: Check for errors**
Look for red error messages

**Step 3: Verify React is working**
```javascript
// Add to frontend/src/main.jsx
console.log('React app loading...')
```

**Step 4: Check build**
```bash
cd frontend
npm run build
# Check for errors in output
```

**Step 5: Clear cache and rebuild**
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run dev
```

---

### Issue: API calls failing

**Symptoms:**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
POST http://localhost:5000/api/v1/user/login 404
```

**Solutions:**

**Check Backend Running:**
```bash
# Terminal 1: Start backend
cd backend
npm run dev
# Should see: Server running on port 5000

# Terminal 2: Test endpoint
curl http://localhost:5000/api/v1/user/logout
```

**Check API URL:**
```javascript
// frontend/src/api/api.js
const API_URL = import.meta.env.VITE_BACKEND_API || 'http://localhost:5000/api/v1'

console.log('API URL:', API_URL)

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})
```

**Verify Environment Variables:**
```bash
# frontend/.env
VITE_BACKEND_API=http://localhost:5000/api/v1
VITE_SOCKET_IO_URL=http://localhost:5000
```

**Check CORS:**
```bash
# Backend should allow your frontend origin
# See Backend Issues → CORS error section
```

---

### Issue: Redux state not updating

**Symptoms:**
- Actions dispatched but state doesn't change
- Components not re-rendering
- Selector returns undefined

**Solutions:**

**Check Redux DevTools:**
```javascript
// Install Redux DevTools browser extension
// Then check: Right-click → Inspect → Redux tab
// Verify actions are being dispatched
```

**Verify Store Setup:**
```javascript
// frontend/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import chatSlice from './chatSlice'
import postSlice from './postSlice'
import storySlice from './storySlice'
import reelSlice from './reelSlice'
import notificationSlice from './notificationSlice'
import followSlice from './followSlice'
import rtnSlice from './rtnSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
    post: postSlice,
    story: storySlice,
    reel: reelSlice,
    notification: notificationSlice,
    follow: followSlice,
    rtn: rtnSlice
  }
})

export default store
```

**Check Slice Structure:**
```javascript
// frontend/src/redux/storySlice.js
import { createSlice } from '@reduxjs/toolkit'

const storySlice = createSlice({
  name: 'story',
  initialState: {
    stories: [],
    loading: false,
    error: null
  },
  reducers: {
    setStories(state, action) {
      state.stories = action.payload
    }
    // ... other reducers
  }
})

export const { setStories } = storySlice.actions
export default storySlice.reducer
```

---

### Issue: Socket.io not connecting

**Symptoms:**
```
WebSocket connection to 'ws://localhost:5000/...' failed
Messages not updating in real-time
```

**Solutions:**

**Check Socket.io Configuration:**
```javascript
// frontend/src/socket.js
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_IO_URL || 'http://localhost:5000'

console.log('Connecting to socket:', SOCKET_URL)

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  withCredentials: true
})

socket.on('connect', () => {
  console.log('Socket connected:', socket.id)
})

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason)
})

export default socket
```

**Update .env:**
```env
VITE_SOCKET_IO_URL=http://localhost:5000
```

**Check Backend Socket Setup:**
```javascript
// backend/socket/socket.js
const { Server } = require('socket.io')

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId]
}

const userSocketMap = {}

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS_ORIGIN?.split(',') || '*',
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id)
  
  const userId = socket.handshake.query.userId
  if (userId) {
    userSocketMap[userId] = socket.id
  }
  
  io.emit('getOnlineUsers', Object.keys(userSocketMap))
  
  socket.on('disconnect', () => {
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

module.exports = { io, getReceiverSocketId }
```

---

## Database Issues

### Issue: Duplicate key error

**Symptoms:**
```
MongoServerError: E11000 duplicate key error collection
```

**Solution:**

```bash
# Remove duplicate documents
mongosh

use instaclone

# Find duplicates
db.users.find({ email: "duplicate@example.com" })

# Remove duplicates (keep one)
db.users.deleteOne({ email: "duplicate@example.com" })

# Rebuild indexes
db.users.dropIndexes()
db.users.createIndex({ email: 1 }, { unique: true })
```

---

### Issue: Data not persisting

**Symptoms:**
```
Data saved but doesn't appear after refresh
Data disappears after restart
```

**Solutions:**

**Check MongoDB Connection:**
```bash
# Verify connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/instaclone"

# Check data
db.users.find()

# If empty, database not connected properly
```

**Verify Insert Operations:**
```javascript
// In controller, add console.log
console.log('Saving user:', user)
const savedUser = await user.save()
console.log('Saved user:', savedUser)
```

---

### Issue: Memory leak in database queries

**Symptoms:**
```
Increasing memory usage over time
Application slows down
```

**Solutions:**

**Close connections properly:**
```javascript
// Make sure to use async/await correctly
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('posts')
      .populate('followers')
      .populate('following')
    
    // Don't leak cursor
    res.status(200).json({ success: true, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', success: false })
  }
}
```

**Limit query results:**
```javascript
// Don't load all data at once
const getPosts = async (req, res) => {
  const page = req.query.page || 1
  const limit = 10
  
  const posts = await Post.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
  
  res.status(200).json({ success: true, posts })
}
```

---

## Real-time Issues

### Issue: Messages not sending

**Symptoms:**
```
Message sent but doesn't appear
"Sending..." stuck indefinitely
```

**Solutions:**

**Check Socket Connection:**
```javascript
// frontend/src/socket.js
socket.on('connect', () => {
  console.log('Socket connected:', socket.id)
})

socket.on('newMessage', (message) => {
  console.log('New message received:', message)
  // Update Redux here
})
```

**Verify Message Route:**
```javascript
// backend/routes/message.route.js
router.post('/send/:id', isAuthenticated, upload.single('media'), sendMessage)
```

**Check Middleware:**
```javascript
// Ensure isAuthenticated middleware runs before sending
const sendMessage = async (req, res) => {
  try {
    const senderId = req.id // From isAuthenticated middleware
    const receiverId = req.params.id
    
    console.log('Sending message:', { senderId, receiverId })
    
    // Save and emit
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: req.body.textMessage
    })
    
    const receverSocketId = getReceiverSocketId(receiverId)
    if (receverSocketId) {
      io.to(receverSocketId).emit('newMessage', newMessage)
    }
  } catch (error) {
    console.error(error)
  }
}
```

---

### Issue: Stories not showing

**Symptoms:**
```
Stories page blank
No error in console
```

**Solutions:**

**Check Custom Hook:**
```javascript
// frontend/src/hooks/useGetFollowingStories.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setStories } from '../redux/storySlice'

const useGetFollowingStories = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/story/following/all`,
          { withCredentials: true }
        )
        
        if (res.data.success) {
          console.log('Stories loaded:', res.data.storyGroups)
          dispatch(setStories(res.data.storyGroups))
        }
      } catch (error) {
        console.error('Failed to fetch stories:', error)
      }
    }
    
    fetchStories()
  }, [dispatch])
}

export default useGetFollowingStories
```

**Check Backend Endpoint:**
```bash
# Test endpoint manually
curl http://localhost:5000/api/v1/story/following/all \
  -H "Cookie: token=your_token"
```

---

## Authentication Issues

### Issue: Login fails

**Symptoms:**
```
Login button doesn't respond
"Invalid email or password"
"User not found"
```

**Solutions:**

**Verify User Exists:**
```bash
mongosh
use instaclone
db.users.find({ email: "test@example.com" })
```

**Test Login Endpoint:**
```bash
curl -X POST http://localhost:5000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Check Password Hashing:**
```javascript
// backend/controllers/user.controller.js
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(401).json({
        message: 'Email and password required',
        success: false
      })
    }

    let user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
        success: false
      })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.',
        success: false
      })
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE
    })

    return res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', success: false })
  }
}
```

---

### Issue: Logged in user disappears on refresh

**Symptoms:**
```
Logged in, page refreshes, logged out
User data not persisting
```

**Solutions:**

**Add Getme Endpoint:**
```javascript
// backend/routes/user.route.js
router.get('/profile', isAuthenticated, getMyProfile)

// backend/controllers/user.controller.js
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id)
      .populate('posts')
      .populate('followers')
      .populate('following')
      .populate('stories')
      .populate('reels')
    
    return res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', success: false })
  }
}
```

**Call on App Load:**
```javascript
// frontend/src/App.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setAuthUser } from './redux/authSlice'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector(store => store.auth)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/user/profile`,
          { withCredentials: true }
        )
        
        if (res.data.success) {
          dispatch(setAuthUser(res.data.user))
        }
      } catch (error) {
        console.log('Not authenticated')
      }
    }

    fetchUser()
  }, [dispatch])

  return (
    // App content
  )
}

export default App
```

---

## File Upload Issues

### Issue: Images not uploading

**Symptoms:**
```
Upload button stuck on "Uploading..."
No image appears after upload
```

**Solutions:**

**Check Multer Configuration:**
```javascript
// backend/middlewares/multer.js
const multer = require('multer')
const path = require('path')

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Invalid file format. Only JPEG, PNG, WebP allowed.'))
    }
    
    cb(null, true)
  }
})

module.exports = upload
```

**Check Cloudinary Upload:**
```javascript
// backend/utils/cloudinary.js
const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (fileBuffer, folder = 'instaclone') => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream({
      folder: folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    }, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
    
    upload.end(fileBuffer)
  })
}

module.exports = { uploadOnCloudinary }
```

**Check Form Submission:**
```javascript
// frontend/src/components/CreatePost.jsx
const [image, setImage] = useState(null)

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    // Validate file
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPEG, PNG, WebP allowed')
      return
    }
    
    if (file.size > 50 * 1024 * 1024) {
      alert('File too large (max 50MB)')
      return
    }
    
    setImage(file)
  }
}

const handlePost = async () => {
  try {
    const formData = new FormData()
    formData.append('caption', caption)
    if (image) {
      formData.append('image', image)
    }

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API}/post/addpost`,
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )

    if (res.data.success) {
      // Clear form
      setCaption('')
      setImage(null)
      // Show success message
    }
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Failed to create post: ' + error.message)
  }
}
```

---

## Performance Issues

### Issue: Slow page load

**Symptoms:**
```
Page takes >3 seconds to load
Components render slowly
```

**Solutions:**

**Lazy Load Components:**
```javascript
// frontend/src/App.jsx
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./components/Home'))
const Explore = lazy(() => import('./components/Explore'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </Suspense>
  )
}
```

**Optimize Images:**
```javascript
// Use Cloudinary transformation
<img 
  src={`${imageUrl}?w=400&h=400&c=fill&q=auto`}
  alt="Post"
/>
```

**Paginate Feed:**
```javascript
const [page, setPage] = useState(1)
const [posts, setPosts] = useState([])

const loadMore = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_API}/post/allpost?page=${page}`,
    { withCredentials: true }
  )
  
  setPosts([...posts, ...res.data.posts])
  setPage(page + 1)
}
```

**Use React.memo:**
```javascript
import { memo } from 'react'

const PostCard = memo(({ post }) => {
  return (
    <div>
      {/* Post content */}
    </div>
  )
})

export default PostCard
```

---

### Issue: High memory usage

**Symptoms:**
```
Browser tab uses 500MB+ RAM
Application crashes with "Out of memory"
```

**Solutions:**

**Check for Memory Leaks:**
```javascript
// Use DevTools → Memory tab → Take heap snapshot
// Look for detached nodes, unreleased listeners
```

**Clean up Listeners:**
```javascript
useEffect(() => {
  const handleScroll = () => {
    // Handle scroll
  }

  window.addEventListener('scroll', handleScroll)

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [])
```

**Cancel Pending Requests:**
```javascript
useEffect(() => {
  const controller = new AbortController()

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/data', {
        signal: controller.signal
      })
    } catch (error) {
      if (error.name !== 'CanceledError') {
        console.error(error)
      }
    }
  }

  fetchData()

  return () => controller.abort()
}, [])
```

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `ENOTFOUND` | DNS resolution failed | Check internet, domain name |
| `ECONNREFUSED` | Backend not running | Start backend: `npm run dev` |
| `ERR_BLOCKED_BY_CLIENT` | Ad blocker blocking request | Disable extension for this site |
| `401 Unauthorized` | Invalid token | Login again, clear cookies |
| `403 Forbidden` | No permission | Check user role/authorization |
| `413 Payload Too Large` | File too large | Increase limit or compress file |
| `422 Unprocessable Entity` | Invalid data format | Check field formats, types |
| `500 Internal Server Error` | Backend error | Check backend logs |
| `SELF_SIGNED_CERT` | SSL certificate issue | For dev: ignore, for prod: get real cert |

---

## Getting Help

### Check Logs

**Backend Logs:**
```bash
# Development
npm run dev  # Shows logs in terminal

# Production (Heroku)
heroku logs -t

# Production (PM2)
pm2 logs

# Production (Docker)
docker logs container_name
```

**Frontend Logs:**
```javascript
// Browser Console
F12 → Console tab

// See all app logs
console.log('Debug message')
console.error('Error message')
```

**Database Logs:**
```bash
# MongoDB
mongosh
db.getProfilingLevel()
db.setProfilingLevel(1)

# Check slow queries
db.system.profile.find().pretty()
```

### Common Debugging Steps

1. **Restart everything**
   ```bash
   # Kill backend
   npm run dev  # Ctrl+C
   
   # Kill frontend
   npm run dev  # Ctrl+C
   
   # Start fresh
   npm run dev
   ```

2. **Clear cache**
   ```bash
   # Browser: Ctrl+Shift+Delete
   # npm: npm cache clean --force
   # Build: rm -rf dist/
   ```

3. **Check environment variables**
   ```bash
   echo $VARIABLE_NAME
   ```

4. **Test API endpoints manually**
   ```bash
   curl http://localhost:5000/api/v1/user/logout
   ```

5. **Check browser DevTools**
   - Console: Errors/warnings
   - Network: Failed requests
   - Application: Cookies, Local Storage
   - Redux: State changes

### Get Community Help

- **GitHub Issues**: Describe problem with steps to reproduce
- **Stack Overflow**: Tag with `express`, `react`, `mongodb`
- **Discord Communities**: JavaScript, Node.js, React servers
- **Documentation**: Official docs for each library

---

**Last Updated:** November 2024
**Version:** 1.0.0
