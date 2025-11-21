const express = require('express');
const { getUserProfile, updateProfile, toggleFollow } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:username', protect, getUserProfile);
router.put('/:id', protect, updateProfile);
router.post('/:id/follow', protect, toggleFollow);

module.exports = router;
