import { create } from 'zustand';

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  images: string[];
  caption: string;
  hashtags: string[];
  location?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

interface PostState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (id, updates) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, ...updates } : post
      ),
    })),
  toggleLike: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      ),
    })),
  toggleSave: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, isSaved: !post.isSaved } : post
      ),
    })),
}));
