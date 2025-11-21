const Reel = require('../models/Reel');
const User = require('../models/User');

// @desc    Get reels feed
// @route   GET /api/reels
// @access  Private
const getReels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user._id);

    // Get all public reels + private reels from following users
    const publicReels = await Reel.find()
      .populate({
        path: 'user',
        select: 'username profilePicture isPrivate',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter based on privacy settings
    const filteredReels = publicReels.filter(reel => {
      if (!reel.user.isPrivate) {
        return true; // Show all public account reels
      }
      // For private accounts, only show if user is following
      return currentUser.following.includes(reel.user._id) || 
             reel.user._id.toString() === req.user._id.toString();
    });

    const formattedReels = filteredReels.map(reel => ({
      id: reel._id,
      userId: reel.user._id,
      username: reel.user.username,
      userAvatar: reel.user.profilePicture,
      video: reel.video,
      thumbnail: reel.thumbnail,
      caption: reel.caption,
      hashtags: reel.hashtags,
      likes: reel.likes.length,
      comments: reel.comments.length,
      isLiked: reel.likes.includes(req.user._id),
      createdAt: reel.createdAt,
    }));

    res.json(formattedReels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create reel
// @route   POST /api/reels
// @access  Private
const createReel = async (req, res) => {
  try {
    const { video, thumbnail, caption } = req.body;

    const hashtags = caption.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];

    const reel = await Reel.create({
      user: req.user._id,
      video,
      thumbnail,
      caption,
      hashtags,
    });

    const populatedReel = await Reel.findById(reel._id).populate('user', 'username profilePicture');

    res.status(201).json({
      id: populatedReel._id,
      userId: populatedReel.user._id,
      username: populatedReel.user.username,
      userAvatar: populatedReel.user.profilePicture,
      video: populatedReel.video,
      thumbnail: populatedReel.thumbnail,
      caption: populatedReel.caption,
      hashtags: populatedReel.hashtags,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: populatedReel.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle like reel
// @route   POST /api/reels/:id/like
// @access  Private
const toggleLikeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    const isLiked = reel.likes.includes(req.user._id);

    if (isLiked) {
      reel.likes = reel.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      reel.likes.push(req.user._id);
    }

    await reel.save();

    res.json({
      isLiked: !isLiked,
      likes: reel.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to reel
// @route   POST /api/reels/:id/comments
// @access  Private
const addReelComment = async (req, res) => {
  try {
    const { text } = req.body;
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    reel.comments.push({
      user: req.user._id,
      text,
    });

    await reel.save();

    res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete reel
// @route   DELETE /api/reels/:id
// @access  Private
const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    if (reel.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await reel.deleteOne();
    res.json({ message: 'Reel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReels, createReel, toggleLikeReel, addReelComment, deleteReel };
