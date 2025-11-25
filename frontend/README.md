# 📸 InstaClone - Instagram Clone Application

A full-featured Instagram clone built with modern web technologies, featuring posts, reels, stories, messaging, and real-time notifications.

## 🌟 Features

### Core Features
- **Posts** - Create, edit, delete, like, comment, and bookmark posts with image uploads
- **Reels** - Full-screen vertical video player with auto-advance, like, comment, and share functionality
- **Stories** - Share temporary stories visible for 24 hours
- **Direct Messages** - Real-time messaging with Socket.io
- **Notifications** - Real-time notifications for likes, comments, follows
- **User Profiles** - Customizable profiles with bio, profile picture, and follow management
- **Explore** - Discover trending posts, reels, and users
- **Search** - Search for posts, users, and hashtags

### User Management
- User authentication with JWT tokens
- Follow/unfollow system with follow requests
- Private/public account toggling
- User blocking functionality
- Account settings and privacy controls

### Social Features
- Like posts and reels
- Comment on posts and reels
- Save/bookmark posts
- Tag users in posts
- Location tagging
- Follow/unfollow users
- Real-time notifications

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Vite 7.2.4** - Build tool
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Node.js + Express.js** - Server framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication
- **Cloudinary** - Image hosting and optimization
- **Multer** - File upload middleware
- **Sharp** - Image optimization

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd instaclone-main
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file with the following variables
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/instaclone
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
EOF

# Start the backend server
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5175` (or next available port)

## 📁 Project Structure

```
instaclone-main/
├── backend/
│   ├── controllers/        # Request handlers
│   ├── models/            # Database schemas
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middleware
│   ├── utils/             # Utility functions
│   ├── socket/            # Socket.io setup
│   └── index.js           # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/           # API calls
    │   ├── components/    # React components
    │   ├── hooks/         # Custom hooks
    │   ├── lib/           # Utilities
    │   ├── redux/         # Redux slices
    │   ├── assets/        # Static assets
    │   ├── App.jsx        # Main app
    │   └── main.jsx       # Entry point
    └── package.json
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - Login user
- `GET /api/v1/user/logout` - Logout user

### Posts
- `POST /api/v1/post/addpost` - Create post
- `GET /api/v1/post` - Get all posts
- `GET /api/v1/post/:id` - Get single post
- `DELETE /api/v1/post/delete/:id` - Delete post
- `GET /api/v1/post/:id/like` - Like post
- `GET /api/v1/post/:id/dislike` - Unlike post
- `POST /api/v1/post/:id/comment` - Add comment
- `GET /api/v1/post/:id/bookmark` - Bookmark post

### Reels
- `POST /api/v1/reel` - Create reel
- `GET /api/v1/reel` - Get all reels
- `GET /api/v1/reel/:id` - Get single reel
- `DELETE /api/v1/reel/delete/:id` - Delete reel

### Users
- `GET /api/v1/user/:id` - Get user profile
- `PUT /api/v1/user/edit/:id` - Update user profile
- `POST /api/v1/user/followorunfollow/:id` - Follow/unfollow user
- `GET /api/v1/user/privacy/toggle` - Toggle private account

### Messages
- `POST /api/v1/message/send/:id` - Send message
- `GET /api/v1/message/get/:id` - Get messages with user

## 🔑 Key Features Explained

### Posts
- Users can create posts with image uploads
- Add captions, tag users, and add location information
- Like, comment, and bookmark posts
- Edit or delete own posts
- View post details on dedicated page

### Reels
- Full-screen vertical video player
- Auto-advance every 5 seconds
- Like, comment, and save reels
- Keyboard navigation (arrow keys)
- Mouse wheel and touch swipe support
- Volume control and progress tracking

### Stories
- Share temporary stories (24-hour visibility)
- View stories from followed users
- Stories appear in timeline

### Direct Messages
- Real-time messaging using Socket.io
- Message history
- See online/offline status
- Typing indicators

### Notifications
- Real-time notifications for:
  - New likes
  - New comments
  - New followers
  - Follow requests (if private account)
  - Direct messages

## 🎨 UI/UX Features

- **Light Theme** - Clean, white backgrounds with proper contrast
- **Responsive Design** - Mobile-first approach, optimized for all screen sizes
- **Real-time Updates** - Socket.io integration for live notifications
- **Loading States** - Visual feedback for async operations
- **Error Handling** - User-friendly error messages with toast notifications
- **Human-readable Timestamps** - "2h ago" format for better UX
- **Image Optimization** - Cloudinary integration for fast loading

## 🔐 Security Features

- JWT-based authentication
- Password hashing
- CORS enabled
- Authenticated middleware on protected routes
- Input validation on backend
- Secure cookie handling

## 🚢 Deployment

### Backend Deployment (Heroku/Railway)
```bash
cd backend
# Configure environment variables in hosting platform
# Push to git repository
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy build folder to Vercel or Netlify
```

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5175 (frontend)
lsof -ti:5175 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running locally or check cloud connection string
- Verify `MONGODB_URI` in `.env` file

### Cloudinary Upload Issues
- Verify API credentials in `.env`
- Check Cloudinary account settings
- Ensure folder permissions are set correctly

### Socket.io Connection Issues
- Backend and frontend must have matching Socket.io versions
- Check firewall settings for WebSocket connections
- Verify CORS settings on backend

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Author

Built as a full-featured Instagram clone demonstration project.

## 🙏 Acknowledgments

- React community for amazing tools and libraries
- Tailwind CSS for utility-first CSS framework
- shadcn/ui for beautiful component library
- Cloudinary for image optimization

## 📞 Support

For issues, feature requests, or questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Provide screenshots or error logs when possible

---

**Happy coding! 🚀**

