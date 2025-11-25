import express from "express";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register, togglePrivateAccount, blockUser, addAccountSwitch, getAccountSwitches, searchUsers, getFollowingUsers } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/search').get(isAuthenticated, searchUsers);
router.route('/following').get(isAuthenticated, getFollowingUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/privacy/toggle').put(isAuthenticated, togglePrivateAccount);
router.route('/block/:id').post(isAuthenticated, blockUser);
router.route('/account/switch/add').post(isAuthenticated, addAccountSwitch);
router.route('/account/switches').get(isAuthenticated, getAccountSwitches);

export default router;