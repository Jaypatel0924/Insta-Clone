import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true
});

// ==================== STORY APIs ====================
export const createStory = (formData) => API.post('/story/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getStoriesByUser = (userId) => API.get(`/story/${userId}`);
export const getAllFollowingStories = () => API.get('/story/following/all');
export const viewStory = (storyId) => API.put(`/story/view/${storyId}`);
export const deleteStory = (storyId) => API.delete(`/story/delete/${storyId}`);

// ==================== REEL APIs ====================
export const createReel = (formData) => API.post('/reel/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getReels = () => API.get('/reel');
export const getUserReels = (userId) => API.get(`/reel/user/${userId}`);
export const likeReel = (reelId) => API.post(`/reel/${reelId}/like`);
export const addReelComment = (reelId, text) => API.post(`/reel/${reelId}/comment`, { text });
export const getReelComments = (reelId) => API.get(`/reel/${reelId}/comments`);
export const deleteReel = (reelId) => API.delete(`/reel/${reelId}/delete`);
export const shareReel = (reelId) => API.post(`/reel/${reelId}/share`);
export const incrementReelView = (reelId) => API.post(`/reel/${reelId}/view`);

// ==================== FOLLOW REQUEST APIs ====================
export const sendFollowRequest = (userId) => API.post(`/follow-request/send/${userId}`);
export const getFollowRequests = () => API.get('/follow-request');
export const acceptFollowRequest = (requestId) => API.put(`/follow-request/accept/${requestId}`);
export const rejectFollowRequest = (requestId) => API.put(`/follow-request/reject/${requestId}`);
export const cancelFollowRequest = (userId) => API.delete(`/follow-request/cancel/${userId}`);

// ==================== NOTIFICATION APIs ====================
export const getNotifications = () => API.get('/notification');
export const markNotificationAsRead = (notificationId) => API.put(`/notification/${notificationId}/read`);
export const markAllNotificationsAsRead = () => API.put('/notification/read/all');
export const deleteNotification = (notificationId) => API.delete(`/notification/${notificationId}`);
export const getUnreadNotificationsCount = () => API.get('/notification/unread/count');

// ==================== EXPLORE APIs ====================
export const getExplorePosts = (page = 1) => API.get(`/explore/posts?page=${page}`);
export const getExploreReels = (page = 1) => API.get(`/explore/reels?page=${page}`);
export const getTrendingPosts = () => API.get('/explore/trending/posts');
export const getTrendingReels = () => API.get('/explore/trending/reels');
export const getExploreUsers = () => API.get('/explore/users');
export const searchUsers = (query) => API.get(`/explore/search/users?q=${query}`);
export const searchPosts = (query) => API.get(`/explore/search/posts?q=${query}`);
export const searchHashtags = (query) => API.get(`/explore/search/hashtags?q=${query}`);

// ==================== MESSAGE APIs ====================
export const sendMessage = (receiverId, message, mediaType, mediaFile, emoji) => {
    const formData = new FormData();
    formData.append('textMessage', message);
    formData.append('mediaType', mediaType || 'text');
    formData.append('emoji', emoji || '');
    if (mediaFile) {
        formData.append('media', mediaFile);
    }
    
    return API.post(`/message/send/${receiverId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const getMessages = (userId) => API.get(`/message/all/${userId}`);
export const deleteMessage = (messageId) => API.delete(`/message/delete/${messageId}`);
export const markMessagesAsRead = (conversationId) => API.post('/message/read', { conversationId });

// ==================== USER APIs ====================
export const togglePrivateAccount = () => API.put('/user/privacy/toggle');
export const blockUser = (userId) => API.post(`/user/block/${userId}`);
export const addAccountSwitch = (accountName, accountType) => 
    API.post('/user/account/switch/add', { accountName, accountType });
export const getAccountSwitches = () => API.get('/user/account/switches');

// ==================== POST APIs (with new location & tagging) ====================
export const addNewPost = (caption, image, location, taggedUsers, mentions) => {
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);
    if (location) {
        formData.append('location', JSON.stringify(location));
    }
    if (taggedUsers && taggedUsers.length > 0) {
        formData.append('taggedUsers', JSON.stringify(taggedUsers));
    }
    if (mentions && mentions.length > 0) {
        formData.append('mentions', JSON.stringify(mentions));
    }

    return API.post('/post/addpost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export default API;
