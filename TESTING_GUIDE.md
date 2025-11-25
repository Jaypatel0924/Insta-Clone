# Quick Testing Guide - Frontend Fixes

## How to Test Each Feature

### 1. Create Post (with Tags & Location)
1. Click "+" button or New Post
2. Select "Post" from content type selector
3. Choose an image
4. Add caption
5. **Test Location**:
   - Click "Add location"
   - Type a place name (e.g., "New York")
   - Select from results
   - See location tag appear below caption
6. **Test Emoji**:
   - Click emoji icon
   - Select emoji → appears in caption
7. **Test Tags**:
   - Click "Tag people"
   - Search for a user
   - Click user → "@username" added to caption
   - User tag appears as colored pill below
8. Click "Share" to post

**Expected Result**: Post created with location, tags, and caption visible

---

### 2. Create Reel (30+ seconds)
1. Click "+" button or New Post
2. Select "Reel (30s+)" button
3. **Test Duration Validation**:
   - Try selecting a 15-second video
   - Should see error: "Reel must be at least 30 seconds"
   - Select 30+ second video
4. Add caption (optional)
5. Click "Share"

**Expected Result**: Reel uploaded with 30+ second video. Error if less than 30s.

---

### 3. Create Story
1. Click "+" button or New Post
2. Select "Story" button
3. Choose image or video (up to 2 minutes)
4. Add text (optional)
5. Click "Share"

**Expected Result**: Story created instantly, appears in your story on profile

---

### 4. View Profile Tabs
**Go to any profile**:
1. **Posts Tab** (default):
   - Shows all user's posts in grid
   - Hover shows likes/comments count
   - Click to view post details

2. **Saved Tab** (your profile only):
   - Shows bookmarked/saved posts
   - Only visible if viewing own profile
   - Click to view saved post

3. **Reels Tab**:
   - Shows all user's uploaded reels
   - Displays reel thumbnail
   - Play icon visible on hover
   - Click to play reel

4. **Tagged Tab**:
   - Shows posts where user is tagged
   - Only visible if other users tagged you
   - Works on any profile

---

### 5. Archive Feature
1. On your own profile
2. Click "View archive" button
3. Dialog opens showing archived posts
4. (Backend not yet connected - shows "No archived posts")

**Expected Result**: Dialog displays properly, shows empty state

---

### 6. Account Menu
1. On your own profile
2. Click Settings (⚙️) button in top right
3. Dialog opens with two options:
   - "Switch accounts"
   - "Logout" (red text)

**Expected Result**: Menu displays with both options

---

### 7. Fix: Empty Src Warning
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Navigate to Reels page
4. **Should NOT see**:
   - ❌ "Empty string ("") was passed to the src attribute"
   - ❌ "Objects are not valid as a React child"

5. If user has no profile picture:
   - Should show fallback (first letter of username)
   - NOT an empty image placeholder

**Expected Result**: No console warnings, proper fallback displays

---

## Common Test Scenarios

### Scenario 1: Create Complete Post
```
1. Post tab selected
2. Upload image
3. Add caption: "Beautiful sunset! 🌅"
4. Add location: "Santa Monica Beach"
5. Tag friends: @john, @sarah
6. Click Share
Result: Post appears in feed with all details
```

### Scenario 2: Create Reel
```
1. Reel tab selected
2. Upload 45-second video
3. Add caption: "Amazing trick! 🎥"
4. Click Share
Result: Reel appears in reels section with video playing
```

### Scenario 3: View Tagged Posts
```
1. Go to your profile
2. Click "TAGGED" tab
3. See posts where friends tagged you
4. Click any to view
Result: Shows all posts where you're mentioned
```

### Scenario 4: View Saved Posts
```
1. Go to your profile
2. Click "SAVED" tab
3. See all bookmarked posts
4. Click "Save" on any post from feed
5. Post appears in SAVED tab
Result: Bookmarked posts persist and display
```

---

## Error Messages to Expect (Normal)

### When Uploading:
- ❌ "Please select an image first" → Select image before sharing
- ❌ "Image size should be less than 10MB" → File too large
- ❌ "Please select a video file" → Wrong file type for reel/story
- ❌ "Video size should be less than 100MB" → Video file too large
- ❌ "Reel must be at least 30 seconds" → Video duration too short
- ❌ "Story must be less than 2 minutes" → Video duration too long

### When Searching:
- ❌ "No users found" → Search term doesn't match anyone
- ❌ "No locations found" → Location doesn't exist
- ❌ "Searching users..." → Loading results (brief message)

---

## Files to Check in VS Code

### Frontend Components:
```
frontend/src/components/
├── CreatePost.jsx  ← Main creation feature
├── Profile.jsx     ← Profile tabs & menus
├── Reels.jsx       ← Reel display & warnings
└── StoriesFeed.jsx ← Story viewer
```

### Backend Controllers:
```
backend/controllers/
├── story.controller.js  ← Story upload
├── user.controller.js   ← Profile data
└── reel.controller.js   ← Reel management
```

---

## Troubleshooting

**Issue**: Posts won't save location
- Check: Selected location appears below caption?
- Fix: Ensure location search results appear before clicking Share

**Issue**: Tags not appearing
- Check: User appears in search results?
- Check: User name shows in pills below caption?
- Fix: Click "Tag people" again, search, and click user

**Issue**: Reel upload fails
- Check: Video is 30+ seconds? (Not 29 seconds!)
- Check: Video format supported? (MP4, MOV, WebM)
- Check: File size < 100MB?
- Fix: Try converting video format or splitting if over 100MB

**Issue**: Profile tabs showing "No posts"
- Check: Do you have any posts/reels created?
- Fix: Create a post or reel first, refresh profile

**Issue**: Console shows src warning
- Check: User has profile picture?
- Fix: Upload profile picture in profile edit
- Note: Should show initial/fallback if missing

---

## API Testing (Optional)

### Test Tag & Location in Post:
```bash
curl -X POST http://localhost:5000/api/v1/post/addpost \
  -F "caption=Test post" \
  -F "image=@photo.jpg" \
  -F 'location={"placeName":"NYC","latitude":null,"longitude":null}' \
  -F 'taggedUsers=["userid1","userid2"]'
```

### Test Story Creation:
```bash
curl -X POST http://localhost:5000/api/v1/story/create \
  -F "file=@video.mp4" \
  -F "text=My story"
```

### Test Reel Creation:
```bash
curl -X POST http://localhost:5000/api/v1/reel/create \
  -F "video=@reel.mp4" \
  -F "caption=Cool reel"
```

---

## Success Indicators ✅

- [x] No empty src warnings in console
- [x] Posts save with location and tags
- [x] Reels must be 30+ seconds
- [x] Stories can be image or video
- [x] Profile shows all 4 tabs
- [x] Saved tab shows bookmarks
- [x] Tagged tab shows your tags
- [x] Reels tab shows your videos
- [x] Account menu accessible
- [x] Archive dialog opens

---

## Performance Notes

- Location search: 500ms debounce (prevents excessive API calls)
- Video upload: Max 100MB (Cloudinary limit)
- User search: API fallback to mock data if server down
- Profile loading: Populates posts, reels, bookmarks on load

---

**Last Updated**: November 23, 2025
**Status**: Ready for QA Testing
