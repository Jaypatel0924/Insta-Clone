const express = require('express');
const { getStories, createStory, addStoryView, deleteStory } = require('../controllers/storyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getStories);
router.post('/', protect, createStory);
router.post('/:id/view', protect, addStoryView);
router.delete('/:id', protect, deleteStory);

module.exports = router;