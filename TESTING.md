# Testing Guide

## Manual Testing Procedures

### 1. Authentication Testing

#### Register New User
1. Navigate to signup page
2. Enter username, email, password
3. Click register
4. Expected: Success message and redirect to login

```bash
# Test via curl
curl -X POST http://localhost:3000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

#### Login
1. Enter email and password
2. Click login
3. Expected: Redirect to home page

```bash
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

---

### 2. Stories Testing

#### Create Story
1. Click on stories section
2. Upload image
3. Add optional text
4. Click post
5. Expected: Story appears in grid

```bash
# With curl (multipart form)
curl -X POST http://localhost:3000/api/v1/story/create \
  -H "Cookie: token=YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "text=My Story!"
```

#### View Story
1. Click on story in grid
2. Watch video/image
3. Expected: View count increments
4. Use arrows to navigate

#### Delete Story
1. Click on own story
2. Click delete button
3. Expected: Story removed

---

### 3. Reels Testing

#### Create Reel
1. Go to reels section
2. Upload video file
3. Add caption and music
4. Click post
5. Expected: Reel appears in feed

```bash
curl -X POST http://localhost:3000/api/v1/reel/create \
  -H "Cookie: token=YOUR_TOKEN" \
  -F "video=@/path/to/video.mp4" \
  -F "caption=My Reel" \
  -F "music=Song Name"
```

#### Interact with Reel
1. Like reel - click heart icon
2. Comment - add text and post
3. Share - click share button
4. Expected: All actions update count

#### View Trending Reels
1. Navigate to explore page
2. Click on trending tab
3. Expected: Most viewed/liked reels shown

---

### 4. Follow System Testing

#### Follow Public User
1. Go to explore users
2. Click follow button
3. Expected: Instant follow

```bash
curl -X POST http://localhost:3000/api/v1/follow-request/send/USER_ID \
  -H "Cookie: token=YOUR_TOKEN"
```

#### Follow Private User
1. Select private user
2. Click follow
3. Expected: Follow request sent
4. Owner sees notification

#### Accept Follow Request
1. Go to notifications
2. Click on follow request
3. Click accept
4. Expected: Follower added

---

### 5. Notifications Testing

#### Like Notification
1. User A likes User B's post
2. User B receives notification
3. Click notification
4. Expected: Opens post

```bash
curl http://localhost:3000/api/v1/notification \
  -H "Cookie: token=YOUR_TOKEN"
```

#### Mark As Read
1. Click on unread notification
2. Expected: Notification marked read
3. Unread count decreases

#### Delete Notification
1. Click trash icon on notification
2. Expected: Notification deleted

---

### 6. Messages Testing

#### Send Text Message
1. Go to chat/messages
2. Select recipient
3. Type message
4. Click send
5. Expected: Message appears instantly (with websocket)

```bash
curl -X POST http://localhost:3000/api/v1/message/send/RECIPIENT_ID \
  -H "Cookie: token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "textMessage": "Hello!",
    "mediaType": "text"
  }'
```

#### Send Image
1. Click attachment icon
2. Select image
3. Click send
4. Expected: Image loads in conversation

#### Send Emoji
1. Select emoji from picker
2. Send
3. Expected: Emoji displays in chat

#### Delete Message
1. Hover over message
2. Click delete
3. Expected: Message removed for sender

---

### 7. Explore Testing

#### Browse Posts
1. Go to explore
2. Scroll through posts grid
3. Click post
4. Expected: Opens post detail

```bash
curl http://localhost:3000/api/v1/explore/posts?page=1 \
  -H "Cookie: token=YOUR_TOKEN"
```

#### Search Users
1. Use search bar
2. Type username
3. Expected: Matching users appear

```bash
curl "http://localhost:3000/api/v1/explore/search/users?q=test" \
  -H "Cookie: token=YOUR_TOKEN"
```

#### Search Hashtags
1. Use search bar
2. Type #hashtag
3. Expected: Posts with hashtag shown

```bash
curl "http://localhost:3000/api/v1/explore/search/hashtags?q=photography" \
  -H "Cookie: token=YOUR_TOKEN"
```

---

### 8. Settings Testing

#### Toggle Private Account
1. Go to settings
2. Toggle account privacy switch
3. Expected: Account becomes private
4. Verify follow requests appear

```bash
curl -X PUT http://localhost:3000/api/v1/user/privacy/toggle \
  -H "Cookie: token=YOUR_TOKEN"
```

#### Add Account Switch
1. Click "Add Another Account"
2. Enter account name
3. Select account type
4. Click add
5. Expected: Account added to list

```bash
curl -X POST http://localhost:3000/api/v1/user/account/switch/add \
  -H "Cookie: token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountName": "Business Account",
    "accountType": "business"
  }'
```

#### Block User
1. Go to user's profile
2. Click "..." menu
3. Click block
4. Expected: User blocked, messages blocked

---

### 9. Post Testing

#### Create Post with Location
1. Create new post
2. Add image
3. Add caption
4. Click location button
5. Select location or enter coordinates
6. Click post
7. Expected: Post shows location

#### Tag Users
1. While creating post
2. Click tag button
3. Select users to tag
4. Expected: Users notified of tag

#### Mention Users
1. In caption, type @username
2. Select from dropdown
3. Post
4. Expected: User receives mention notification

---

### 10. Real-time Features Testing

#### Typing Indicator
1. User A opens chat with User B
2. User A starts typing
3. User B sees "User A is typing..."
4. User A stops typing
5. Expected: Indicator disappears

#### Online Status
1. User A is online
2. User B opens chat list
3. Expected: Green dot next to User A
4. User A goes offline
5. Expected: Dot disappears

#### Real-time Notifications
1. User A likes User B's post
2. User B receives notification instantly
3. Expected: No page refresh needed

---

## Browser DevTools Testing

### Network Tab
- Verify API calls succeed (200/201 status)
- Check request/response payloads
- Monitor WebSocket connection

### Console
- Check for JavaScript errors
- Monitor Redux state changes
- Verify socket.io events

### Application Tab
- Check localStorage for tokens
- Verify Redux persist working
- Check cookies set

---

## Performance Testing

### Load Testing
```bash
# Test API with load (using Apache Bench)
ab -n 100 -c 10 http://localhost:3000/api/v1/post

# Test with wrk
wrk -t4 -c100 -d30s http://localhost:3000/api/v1/post
```

### Image Optimization
- Verify images are compressed
- Check Cloudinary optimization
- Monitor bandwidth usage

---

## Error Handling Testing

### Test Scenarios
1. Missing required fields
   - POST without image → Error message
   - POST without caption → Allowed (optional)

2. Unauthorized access
   - Access without token → 401 error
   - Access other user's data → 403 error

3. Invalid data
   - Invalid email format → Validation error
   - Password too short → Validation error

4. Resource not found
   - GET non-existent post → 404 error
   - DELETE another user's post → 403 error

---

## Database Testing

### Check Collections
```javascript
// In MongoDB shell
db.users.count()
db.posts.count()
db.stories.count()
db.reels.count()
db.notifications.count()
```

### Verify Data Integrity
```javascript
// Check relationships
db.posts.aggregate([
  { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" } }
])

// Count indexes
db.posts.getIndexes()
```

---

## Mobile Testing

### Responsive Design
- Test on iPhone 12/14
- Test on Android devices
- Check touch interactions
- Verify video playback

### Network Conditions
- Test on 3G
- Test on 4G
- Test offline behavior
- Verify caching

---

## Security Testing

### CORS
- Request from different origin
- Verify credentials included
- Check allowed methods

### JWT Token
- Test with expired token
- Test with invalid token
- Test token refresh

### Input Validation
- Test SQL injection
- Test XSS payloads
- Test file upload exploits

---

## Test Data

### Sample Accounts
```
Account 1: public_user@test.com / Password123
Account 2: private_user@test.com / Password123
Account 3: test_user@test.com / Password123
```

### Sample Files
- Image: 800x800px, <5MB
- Video: MP4, <50MB, max 5 minutes
- Audio: MP3, <10MB

---

## Logging & Debugging

### Enable Debug Mode
```javascript
// In frontend
localStorage.setItem('debug', 'true')

// In backend
DEBUG=* npm run dev
```

### Monitor Socket.io
```javascript
// In browser console
io.on('*', (event, ...args) => {
  console.log('Socket event:', event, args)
})
```

### Check Redux State
```javascript
// In browser console
store.getState()
```

---

## Cleanup After Testing

1. Clear test data
```bash
# Clear database (development only)
db.dropDatabase()
```

2. Clear browser cache
- Clear localStorage
- Clear cookies
- Clear service workers

3. Stop servers
```bash
# Kill node processes
pkill -f "node"
```

---

## Test Report Template

```markdown
### Test: [Feature Name]
- Date: YYYY-MM-DD
- Tester: [Name]
- Status: PASS/FAIL

**Steps:**
1. Step 1
2. Step 2

**Expected:** Result
**Actual:** Result
**Notes:** Any issues found

**Screenshots:** Attach if needed
```

---

## Known Test Cases

### ✅ Passing
- User authentication
- Post creation
- Story viewing
- Message sending
- Notification retrieval

### ⚠️ To Verify
- Large file uploads
- Network latency scenarios
- High concurrent users
- Long session duration

---

## Automated Testing (Future)

```javascript
// Example Jest test
describe('Story API', () => {
  test('should create story', async () => {
    const res = await request(app)
      .post('/api/v1/story/create')
      .set('Cookie', `token=${token}`)
      .attach('image', 'test.jpg')
      .field('text', 'Test story')
    
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
  })
})
```

---

## Support

For testing issues or bugs found, please document with:
- Exact steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots or error logs
- Any console errors

---

**Happy Testing! 🧪**
