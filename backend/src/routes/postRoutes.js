const express = require('express');
const { getFeedPosts, createPost, toggleLike, toggleSave, addComment } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getFeedPosts);
router.post('/', protect, createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);
router.post('/:id/comments', protect, addComment);

module.exports = router;
