const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('posts');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers.length,
      following: user.following.length,
      posts: user.posts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { username, bio, profilePicture } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers.length,
      following: user.following.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow/Unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
const toggleFollow = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      );
    } else {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ isFollowing: !isFollowing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateProfile, toggleFollow };
