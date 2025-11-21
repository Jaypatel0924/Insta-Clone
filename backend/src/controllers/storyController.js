const Story = require('../models/Story');
const User = require('../models/User');

// @desc    Get stories from following users
// @route   GET /api/stories
// @access  Private
const getStories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followingIds = user.following;

    const stories = await Story.find({
      user: { $in: [...followingIds, req.user._id] },
      expiresAt: { $gt: new Date() },
    })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });

    // Group stories by user
    const groupedStories = {};
    stories.forEach(story => {
      const userId = story.user._id.toString();
      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          userId: story.user._id,
          username: story.user.username,
          avatar: story.user.profilePicture,
          stories: [],
        };
      }
      groupedStories[userId].stories.push({
        id: story._id,
        image: story.image,
        caption: story.caption,
        views: story.views.length,
        hasViewed: story.views.includes(req.user._id),
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
      });
    });

    res.json(Object.values(groupedStories));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create story
// @route   POST /api/stories
// @access  Private
const createStory = async (req, res) => {
  try {
    const { image, caption } = req.body;

    const story = await Story.create({
      user: req.user._id,
      image,
      caption,
    });

    const populatedStory = await Story.findById(story._id).populate('user', 'username profilePicture');

    res.status(201).json({
      id: populatedStory._id,
      userId: populatedStory.user._id,
      username: populatedStory.user.username,
      avatar: populatedStory.user.profilePicture,
      image: populatedStory.image,
      caption: populatedStory.caption,
      views: 0,
      createdAt: populatedStory.createdAt,
      expiresAt: populatedStory.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add story view
// @route   POST /api/stories/:id/view
// @access  Private
const addStoryView = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (!story.views.includes(req.user._id)) {
      story.views.push(req.user._id);
      await story.save();
    }

    res.json({ views: story.views.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await story.deleteOne();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStories, createStory, addStoryView, deleteStory };
