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

    const currentUser = await User.findById(req.user._id);
    const isOwnProfile = user._id.toString() === req.user._id.toString();
    const isFollowing = currentUser.following.includes(user._id);
    const hasRequestedFollow = currentUser.followRequestsSent.includes(user._id);
    const hasFollowRequestFromUser = currentUser.followRequestsReceived.includes(user._id);

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      isPrivate: user.isPrivate,
      followers: user.followers.length,
      following: user.following.length,
      posts: user.posts,
      isOwnProfile,
      isFollowing,
      hasRequestedFollow,
      hasFollowRequestFromUser,
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

// @desc    Follow/Unfollow user or Send/Cancel follow request
// @route   POST /api/users/:id/follow
// @access  Private
const toggleFollow = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const isFollowing = currentUser.following.includes(userToFollow._id);
    const hasRequestedFollow = currentUser.followRequestsSent.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      );
      
      await currentUser.save();
      await userToFollow.save();
      
      return res.json({ status: 'not_following', isFollowing: false, isRequested: false });
    } else if (hasRequestedFollow) {
      // Cancel follow request
      currentUser.followRequestsSent = currentUser.followRequestsSent.filter(
        id => id.toString() !== userToFollow._id.toString()
      );
      userToFollow.followRequestsReceived = userToFollow.followRequestsReceived.filter(
        id => id.toString() !== currentUser._id.toString()
      );
      
      await currentUser.save();
      await userToFollow.save();
      
      return res.json({ status: 'request_cancelled', isFollowing: false, isRequested: false });
    } else {
      // Send follow request or follow directly
      if (userToFollow.isPrivate) {
        // Send follow request
        currentUser.followRequestsSent.push(userToFollow._id);
        userToFollow.followRequestsReceived.push(currentUser._id);
        
        await currentUser.save();
        await userToFollow.save();
        
        return res.json({ status: 'requested', isFollowing: false, isRequested: true });
      } else {
        // Follow directly (public account)
        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);
        
        await currentUser.save();
        await userToFollow.save();
        
        return res.json({ status: 'following', isFollowing: true, isRequested: false });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept follow request
// @route   POST /api/users/:id/accept
// @access  Private
const acceptFollowRequest = async (req, res) => {
  try {
    const requester = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!requester) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasRequest = currentUser.followRequestsReceived.includes(requester._id);
    
    if (!hasRequest) {
      return res.status(400).json({ message: 'No follow request from this user' });
    }

    // Remove from requests
    currentUser.followRequestsReceived = currentUser.followRequestsReceived.filter(
      id => id.toString() !== requester._id.toString()
    );
    requester.followRequestsSent = requester.followRequestsSent.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    // Add to followers/following
    currentUser.followers.push(requester._id);
    requester.following.push(currentUser._id);

    await currentUser.save();
    await requester.save();

    res.json({ message: 'Follow request accepted', isFollowing: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject follow request
// @route   POST /api/users/:id/reject
// @access  Private
const rejectFollowRequest = async (req, res) => {
  try {
    const requester = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!requester) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasRequest = currentUser.followRequestsReceived.includes(requester._id);
    
    if (!hasRequest) {
      return res.status(400).json({ message: 'No follow request from this user' });
    }

    // Remove from requests
    currentUser.followRequestsReceived = currentUser.followRequestsReceived.filter(
      id => id.toString() !== requester._id.toString()
    );
    requester.followRequestsSent = requester.followRequestsSent.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await requester.save();

    res.json({ message: 'Follow request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get follow requests
// @route   GET /api/users/follow-requests
// @access  Private
const getFollowRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id)
      .populate('followRequestsReceived', 'username profilePicture bio');

    res.json({
      requests: currentUser.followRequestsReceived.map(user => ({
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateProfile, toggleFollow, acceptFollowRequest, rejectFollowRequest, getFollowRequests };
