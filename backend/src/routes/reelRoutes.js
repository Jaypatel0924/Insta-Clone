const express = require('express');
const { getReels, createReel, toggleLikeReel, addReelComment, deleteReel } = require('../controllers/reelController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getReels);
router.post('/', protect, createReel);
router.post('/:id/like', protect, toggleLikeReel);
router.post('/:id/comments', protect, addReelComment);
router.delete('/:id', protect, deleteReel);

module.exports = router;
