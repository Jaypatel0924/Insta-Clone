const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get feed posts
// @route   GET /api/posts
// @access  Private
const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id);
    const followingIds = user.following;

    const posts = await Post.find({
      user: { $in: [...followingIds, req.user._id] },
    })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedPosts = posts.map(post => ({
      id: post._id,
      userId: post.user._id,
      username: post.user.username,
      userAvatar: post.user.profilePicture,
      images: post.images,
      caption: post.caption,
      hashtags: post.hashtags,
      location: post.location,
      likes: post.likes.length,
      comments: post.comments.length,
      isLiked: post.likes.includes(req.user._id),
      isSaved: user.savedPosts.includes(post._id),
      createdAt: post.createdAt,
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { images, caption, location } = req.body;

    const hashtags = caption.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];

    const post = await Post.create({
      user: req.user._id,
      images,
      caption,
      hashtags,
      location,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: post._id },
    });

    const populatedPost = await Post.findById(post._id).populate('user', 'username profilePicture');

    res.status(201).json({
      id: populatedPost._id,
      userId: populatedPost.user._id,
      username: populatedPost.user.username,
      userAvatar: populatedPost.user.profilePicture,
      images: populatedPost.images,
      caption: populatedPost.caption,
      hashtags: populatedPost.hashtags,
      location: populatedPost.location,
      likes: 0,
      comments: 0,
      isLiked: false,
      isSaved: false,
      createdAt: populatedPost.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      isLiked: !isLiked,
      likes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle save post
// @route   POST /api/posts/:id/save
// @access  Private
const toggleSave = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isSaved = user.savedPosts.includes(req.params.id);

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== req.params.id);
    } else {
      user.savedPosts.push(req.params.id);
    }

    await user.save();

    res.json({ isSaved: !isSaved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();

    res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFeedPosts, createPost, toggleLike, toggleSave, addComment };
