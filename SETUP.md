# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account
- Git

## Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/instagramclone?retryWrites=true&w=majority
SECRET_KEY=your_super_secret_jwt_key_min_32_chars
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EOF

# Start the backend server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Troubleshooting

### If you get "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### If backend won't start
```bash
# Check if port 3000 is in use
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000

# Change PORT in .env if needed
```

### If frontend won't connect to backend
```bash
# Make sure both servers are running
# Check CORS settings in backend/index.js
# Verify backend URL in frontend API calls
```

## API Testing with Curl

```bash
# Register new user
curl -X POST http://localhost:3000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@gmail.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"password123"}'

# Get user profile
curl http://localhost:3000/api/v1/user/USER_ID/profile \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

## Project Structure

```
instaclone/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Route handlers
│   ├── routes/          # API endpoints
│   ├── middlewares/     # Auth & upload
│   ├── socket/          # WebSocket setup
│   ├── utils/           # Helper functions
│   └── index.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── redux/       # State management
│   │   ├── hooks/       # Custom hooks
│   │   ├── api/         # API calls
│   │   └── App.jsx      # Main app
│   └── package.json
└── IMPLEMENTATION_GUIDE.md
```

## Default Test Account (After Setup)

```
Email: test@example.com
Password: Test@123
```

## Features Checklist

- ✅ User authentication
- ✅ Follow/Unfollow system
- ✅ Stories (create, view, delete)
- ✅ Reels (create, like, comment)
- ✅ Posts (create, like, comment, save)
- ✅ Messages (text, images, videos, emojis)
- ✅ Notifications
- ✅ Explore page
- ✅ Search (users, posts, hashtags)
- ✅ Private/Public accounts
- ✅ Follow requests
- ✅ Real-time updates

## Next Steps

1. Set up MongoDB connection
2. Configure Cloudinary
3. Create test accounts
4. Explore all features
5. Customize styling
6. Deploy to production

## Production Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Create Procfile
echo "web: node backend/index.js" > Procfile

# Push to repository
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build frontend
cd frontend
npm run build

# Deploy using Vercel
vercel
```

## Performance Tips

1. Enable image optimization in Cloudinary
2. Use lazy loading for posts
3. Implement pagination for feeds
4. Cache Redux state
5. Use React.memo for components
6. Debounce search input

## Security Checklist

- [ ] Change SECRET_KEY
- [ ] Use strong MongoDB password
- [ ] Enable HTTPS in production
- [ ] Set secure cookie flags
- [ ] Validate all inputs
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Implement CSRF protection

## Support & Contributing

For bugs and feature requests, create an issue.
For contributions, fork and create a pull request.

Enjoy building! 🎉
