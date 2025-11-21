const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get conversations
// @route   GET /api/messages
// @access  Private
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture')
      .sort({ createdAt: -1 });

    const conversations = {};
    
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user._id.toString() 
        ? msg.receiver 
        : msg.sender;
      
      const userId = otherUser._id.toString();
      
      if (!conversations[userId]) {
        conversations[userId] = {
          id: userId,
          username: otherUser.username,
          avatar: otherUser.profilePicture,
          lastMessage: msg.text,
          timestamp: msg.createdAt,
          unread: !msg.seen && msg.receiver._id.toString() === req.user._id.toString(),
        };
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages with user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 });

    // Mark messages as seen
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, seen: false },
      { seen: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, image } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
      image,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage };
