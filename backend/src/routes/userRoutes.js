const express = require('express');
const { getUserProfile, updateProfile, toggleFollow, acceptFollowRequest, rejectFollowRequest, getFollowRequests } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/follow-requests', protect, getFollowRequests);
router.get('/:username', protect, getUserProfile);
router.put('/:id', protect, updateProfile);
router.post('/:id/follow', protect, toggleFollow);
router.post('/:id/accept', protect, acceptFollowRequest);
router.post('/:id/reject', protect, rejectFollowRequest);

module.exports = router;
