import express from 'express';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({
        success: true,
        users: [],
        hashtags: [],
        posts: []
      });
    }

    // 1️⃣ Search Users
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
      ]
    }).select('username profilePicture');

    // 2️⃣ Search Hashtags in captions
    const postsWithHashtags = await Post.find({
      caption: { $regex: `#${q}`, $options: 'i' }
    });

    const hashtagSet = new Set();
    postsWithHashtags.forEach(post => {
      const hashtags = (post.caption || "").match(/#\w+/g) || [];
      hashtags.forEach(tag => {
        if (tag.toLowerCase().includes(q.toLowerCase())) {
          hashtagSet.add(tag);
        }
      });
    });

    const hashtags = Array.from(hashtagSet).map(name => ({
      name,
      postCount: postsWithHashtags.filter(post => 
        post.caption.includes(name)
      ).length
    }));

    // 3️⃣ Search Posts
    const posts = await Post.find({
      caption: { $regex: q, $options: 'i' }
    })
    .populate('author', 'username profilePicture')   // FIXED
    .select('image caption likes comments')           // FIXED
    .limit(9);

    res.json({
      success: true,
      users,
      hashtags,
      posts
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

export default router;
