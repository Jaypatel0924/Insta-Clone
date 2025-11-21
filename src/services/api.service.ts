import api from '@/lib/api';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  signup: async (data: SignupData) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const postService = {
  getFeedPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  createPost: async (data: any) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  toggleLike: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  toggleSave: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/save`);
    return response.data;
  },

  addComment: async (postId: string, text: string) => {
    const response = await api.post(`/posts/${postId}/comments`, { text });
    return response.data;
  },
};

export const userService = {
  getUserProfile: async (username: string) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  updateProfile: async (userId: string, data: any) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  toggleFollow: async (userId: string) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },
};

export const messageService = {
  getConversations: async () => {
    const response = await api.get('/messages');
    return response.data;
  },

  getMessages: async (userId: string) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },

  sendMessage: async (data: any) => {
    const response = await api.post('/messages', data);
    return response.data;
  },
};

export const storyService = {
  getStories: async () => {
    const response = await api.get('/stories');
    return response.data;
  },

  createStory: async (data: { image: string; caption?: string }) => {
    const response = await api.post('/stories', data);
    return response.data;
  },

  addStoryView: async (storyId: string) => {
    const response = await api.post(`/stories/${storyId}/view`);
    return response.data;
  },

  deleteStory: async (storyId: string) => {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data;
  },
};

export const reelService = {
  getReels: async (page = 1, limit = 10) => {
    const response = await api.get(`/reels?page=${page}&limit=${limit}`);
    return response.data;
  },

  createReel: async (data: { video: string; thumbnail: string; caption?: string }) => {
    const response = await api.post('/reels', data);
    return response.data;
  },

  toggleLikeReel: async (reelId: string) => {
    const response = await api.post(`/reels/${reelId}/like`);
    return response.data;
  },

  addReelComment: async (reelId: string, text: string) => {
    const response = await api.post(`/reels/${reelId}/comments`, { text });
    return response.data;
  },

  deleteReel: async (reelId: string) => {
    const response = await api.delete(`/reels/${reelId}`);
    return response.data;
  },
};