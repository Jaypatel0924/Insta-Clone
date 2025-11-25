# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All endpoints (except login/register) require a JWT token in cookies.

---

## User Endpoints

### Register User
```
POST /user/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response: 201
{
  "message": "Account created successfully.",
  "success": true
}
```

### Login User
```
POST /user/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response: 200
{
  "message": "Welcome back {username}",
  "success": true,
  "user": {
    "_id": "ObjectId",
    "username": "string",
    "email": "string",
    "profilePicture": "string",
    "bio": "string",
    "followers": ["ObjectId"],
    "following": ["ObjectId"],
    "posts": ["ObjectId"]
  }
}
```

### Logout User
```
GET /user/logout

Response: 200
{
  "message": "Logged out successfully.",
  "success": true
}
```

### Get User Profile
```
GET /user/:id/profile

Response: 200
{
  "success": true,
  "user": {
    "_id": "ObjectId",
    "username": "string",
    "email": "string",
    "bio": "string",
    "profilePicture": "string",
    "followers": ["ObjectId"],
    "following": ["ObjectId"],
    "posts": ["ObjectId"],
    "stories": ["ObjectId"],
    "reels": ["ObjectId"],
    "isPrivate": boolean
  }
}
```

### Edit Profile
```
POST /user/profile/edit
Content-Type: multipart/form-data

{
  "bio": "string",
  "gender": "male|female",
  "profilePhoto": "file"
}

Response: 200
{
  "message": "Profile updated.",
  "success": true,
  "user": { ...user object }
}
```

### Get Suggested Users
```
GET /user/suggested

Response: 200
{
  "success": true,
  "users": [
    {
      "_id": "ObjectId",
      "username": "string",
      "profilePicture": "string",
      "bio": "string"
    }
  ]
}
```

### Follow/Unfollow User
```
POST /user/followorunfollow/:id

Response: 200
{
  "message": "Followed successfully",
  "success": true,
  "user": { ...updated user },
  "action": "follow|unfollow"
}
```

### Toggle Private Account
```
PUT /user/privacy/toggle

Response: 200
{
  "message": "Account is now private",
  "success": true,
  "user": { ...user object }
}
```

### Block User
```
POST /user/block/:id

Response: 200
{
  "message": "User blocked",
  "success": true,
  "user": { ...user object }
}
```

### Add Account Switch
```
POST /user/account/switch/add
Content-Type: application/json

{
  "accountName": "string",
  "accountType": "personal|business|creator"
}

Response: 201
{
  "message": "Account added",
  "success": true,
  "user": { ...user object }
}
```

### Get Account Switches
```
GET /user/account/switches

Response: 200
{
  "success": true,
  "accountSwitches": [
    {
      "accountName": "string",
      "accountType": "string",
      "createdAt": "ISO 8601 date"
    }
  ]
}
```

---

## Post Endpoints

### Create Post
```
POST /post/addpost
Content-Type: multipart/form-data

{
  "caption": "string",
  "image": "file",
  "location": {"placeName": "string", "latitude": number, "longitude": number},
  "taggedUsers": ["ObjectId"],
  "mentions": ["ObjectId"]
}

Response: 201
{
  "message": "New post added",
  "success": true,
  "post": { ...post object }
}
```

### Get All Posts
```
GET /post/allpost

Response: 200
{
  "success": true,
  "posts": [
    {
      "_id": "ObjectId",
      "caption": "string",
      "image": "string",
      "author": { ...user object },
      "likes": ["ObjectId"],
      "comments": ["ObjectId"],
      "location": { ...location },
      "taggedUsers": ["ObjectId"],
      "mentions": ["ObjectId"]
    }
  ]
}
```

### Like Post
```
POST /post/:id/like

Response: 200
{
  "message": "Post liked",
  "success": true
}
```

### Dislike Post
```
POST /post/:id/dislike

Response: 200
{
  "message": "Post disliked",
  "success": true
}
```

### Add Comment
```
POST /post/:id/comment
Content-Type: application/json

{
  "text": "string"
}

Response: 201
{
  "message": "Comment Added",
  "success": true,
  "comment": {
    "_id": "ObjectId",
    "text": "string",
    "author": { ...user object },
    "post": "ObjectId"
  }
}
```

### Get Post Comments
```
GET /post/:id/getcomments

Response: 200
{
  "success": true,
  "comments": [ ...comments array ]
}
```

### Delete Post
```
DELETE /post/:id

Response: 200
{
  "message": "Post deleted",
  "success": true
}
```

### Bookmark Post
```
POST /post/:id/bookmark

Response: 200
{
  "type": "saved|unsaved",
  "message": "Post bookmarked",
  "success": true
}
```

---

## Story Endpoints

### Create Story
```
POST /story/create
Content-Type: multipart/form-data

{
  "image": "file",
  "text": "string (optional)"
}

Response: 201
{
  "message": "Story created successfully",
  "success": true,
  "story": {
    "_id": "ObjectId",
    "author": { ...user },
    "image": "string",
    "text": "string",
    "views": ["ObjectId"],
    "expiresAt": "ISO 8601"
  }
}
```

### Get Stories by User
```
GET /story/:id

Response: 200
{
  "success": true,
  "stories": [ ...stories array ]
}
```

### Get Following Stories
```
GET /story/following/all

Response: 200
{
  "success": true,
  "storyGroups": [
    {
      "author": { ...user },
      "stories": [ ...stories ]
    }
  ]
}
```

### View Story
```
PUT /story/view/:id

Response: 200
{
  "message": "Story viewed",
  "success": true,
  "story": { ...story object }
}
```

### Delete Story
```
DELETE /story/delete/:id

Response: 200
{
  "message": "Story deleted",
  "success": true
}
```

---

## Reel Endpoints

### Create Reel
```
POST /reel/create
Content-Type: multipart/form-data

{
  "video": "file",
  "caption": "string",
  "music": "string"
}

Response: 201
{
  "message": "Reel created successfully",
  "success": true,
  "reel": { ...reel object }
}
```

### Get All Reels
```
GET /reel

Response: 200
{
  "success": true,
  "reels": [ ...reels array ]
}
```

### Get User Reels
```
GET /reel/user/:id

Response: 200
{
  "success": true,
  "reels": [ ...reels array ]
}
```

### Like Reel
```
POST /reel/:id/like

Response: 200
{
  "message": "Reel liked",
  "success": true,
  "reel": { ...reel object }
}
```

### Add Reel Comment
```
POST /reel/:id/comment
Content-Type: application/json

{
  "text": "string"
}

Response: 201
{
  "message": "Comment added",
  "success": true,
  "comment": { ...comment object }
}
```

### Get Reel Comments
```
GET /reel/:id/comments

Response: 200
{
  "success": true,
  "comments": [ ...comments array ]
}
```

### Delete Reel
```
DELETE /reel/:id/delete

Response: 200
{
  "message": "Reel deleted",
  "success": true
}
```

### Share Reel
```
POST /reel/:id/share

Response: 200
{
  "message": "Reel shared",
  "success": true,
  "reel": { ...reel object }
}
```

### Increment Reel View
```
POST /reel/:id/view

Response: 200
{
  "message": "View count updated",
  "success": true,
  "reel": { ...reel object }
}
```

---

## Follow Request Endpoints

### Send Follow Request
```
POST /follow-request/send/:id

Response: 201
{
  "message": "Followed successfully|Follow request sent",
  "success": true,
  "followRequest": { ...request object }
}
```

### Get Follow Requests
```
GET /follow-request

Response: 200
{
  "success": true,
  "requests": [
    {
      "_id": "ObjectId",
      "sender": { ...user },
      "receiver": "ObjectId",
      "status": "pending|accepted|rejected"
    }
  ]
}
```

### Accept Follow Request
```
PUT /follow-request/accept/:id

Response: 200
{
  "message": "Follow request accepted",
  "success": true,
  "followRequest": { ...request object }
}
```

### Reject Follow Request
```
PUT /follow-request/reject/:id

Response: 200
{
  "message": "Follow request rejected",
  "success": true
}
```

### Cancel Follow Request
```
DELETE /follow-request/cancel/:id

Response: 200
{
  "message": "Follow request cancelled",
  "success": true
}
```

---

## Notification Endpoints

### Get Notifications
```
GET /notification

Response: 200
{
  "success": true,
  "notifications": [
    {
      "_id": "ObjectId",
      "recipient": "ObjectId",
      "sender": { ...user },
      "type": "like|comment|follow|follow_request",
      "post": "ObjectId",
      "reel": "ObjectId",
      "text": "string",
      "isRead": boolean,
      "createdAt": "ISO 8601"
    }
  ]
}
```

### Mark Notification as Read
```
PUT /notification/:id/read

Response: 200
{
  "success": true,
  "notification": { ...notification }
}
```

### Mark All Notifications as Read
```
PUT /notification/read/all

Response: 200
{
  "message": "All notifications marked as read",
  "success": true
}
```

### Delete Notification
```
DELETE /notification/:id

Response: 200
{
  "message": "Notification deleted",
  "success": true
}
```

### Get Unread Count
```
GET /notification/unread/count

Response: 200
{
  "success": true,
  "count": number
}
```

---

## Explore Endpoints

### Get Explore Posts
```
GET /explore/posts?page=1

Response: 200
{
  "success": true,
  "posts": [ ...posts ],
  "totalPosts": number,
  "currentPage": 1,
  "totalPages": number
}
```

### Get Explore Reels
```
GET /explore/reels?page=1

Response: 200
{
  "success": true,
  "reels": [ ...reels ],
  "totalReels": number,
  "currentPage": 1,
  "totalPages": number
}
```

### Get Trending Posts
```
GET /explore/trending/posts

Response: 200
{
  "success": true,
  "posts": [ ...posts ]
}
```

### Get Trending Reels
```
GET /explore/trending/reels

Response: 200
{
  "success": true,
  "reels": [ ...reels ]
}
```

### Get Explore Users
```
GET /explore/users

Response: 200
{
  "success": true,
  "users": [ ...users ]
}
```

### Search Users
```
GET /explore/search/users?q=query

Response: 200
{
  "success": true,
  "users": [ ...users ]
}
```

### Search Posts
```
GET /explore/search/posts?q=query

Response: 200
{
  "success": true,
  "posts": [ ...posts ]
}
```

### Search Hashtags
```
GET /explore/search/hashtags?q=hashtag

Response: 200
{
  "success": true,
  "posts": [ ...posts ],
  "hashtag": "string",
  "count": number
}
```

---

## Message Endpoints

### Send Message
```
POST /message/send/:id
Content-Type: multipart/form-data

{
  "textMessage": "string",
  "mediaType": "text|image|video|reel|emoji",
  "media": "file (optional)",
  "emoji": "string (optional)"
}

Response: 201
{
  "success": true,
  "newMessage": {
    "_id": "ObjectId",
    "senderId": "ObjectId",
    "receiverId": "ObjectId",
    "message": "string",
    "mediaType": "string",
    "mediaUrl": "string",
    "emoji": "string",
    "isRead": false,
    "createdAt": "ISO 8601"
  }
}
```

### Get Messages
```
GET /message/all/:id

Response: 200
{
  "success": true,
  "messages": [ ...messages ]
}
```

### Delete Message
```
DELETE /message/delete/:id

Response: 200
{
  "message": "Message deleted",
  "success": true
}
```

### Mark Messages as Read
```
POST /message/read
Content-Type: application/json

{
  "conversationId": "ObjectId"
}

Response: 200
{
  "message": "Messages marked as read",
  "success": true
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error or missing required fields",
  "success": false
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required",
  "success": false
}
```

### 403 Forbidden
```json
{
  "message": "You don't have permission to perform this action",
  "success": false
}
```

### 404 Not Found
```json
{
  "message": "Resource not found",
  "success": false
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "success": false
}
```

---

## Rate Limiting

Currently not implemented but recommended for production:
- 100 requests per 15 minutes per IP
- 30 requests per 15 minutes per user for posting

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Token invalid/missing |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Pagination

For endpoints supporting pagination:

```
GET /endpoint?page=1&limit=10

Response includes:
{
  "data": [ ...items ],
  "currentPage": 1,
  "totalPages": 10,
  "totalItems": 100
}
```

---

## Sorting

Posts/Reels sorted by:
- `createdAt` - newest first (default)
- `likes` - most liked first
- `viewCount` - most viewed first

---

## Filtering

Posts can be filtered by:
- Author
- Date range
- Location
- Hashtags

---

## WebSocket Events

### Client → Server
```javascript
socket.emit('typing', { receiverId, username })
socket.emit('stopTyping', { receiverId })
socket.emit('newMessage', { message })
socket.emit('storyViewed', { storyId, authorId })
```

### Server → Client
```javascript
socket.on('newMessage', (message) => {})
socket.on('notification', (notification) => {})
socket.on('userTyping', (data) => {})
socket.on('userStoppedTyping', (data) => {})
socket.on('getOnlineUsers', (users) => {})
```

---

## Authentication Headers

All authenticated requests must include:
```
Cookie: token=JWT_TOKEN
```

Or as Bearer token:
```
Authorization: Bearer JWT_TOKEN
```

---

## Example Requests

### JavaScript/Fetch
```javascript
fetch('http://localhost:3000/api/v1/post/addpost', {
  method: 'POST',
  credentials: 'include',
  body: formData,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
```

### Axios
```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true
})

api.get('/user/:id/profile')
```

### cURL
```bash
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Pass123"}' \
  -c cookies.txt

curl http://localhost:3000/api/v1/notification \
  -b cookies.txt
```

---

**Last Updated:** November 2024
**Version:** 1.0.0
