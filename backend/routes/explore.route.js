import express from "express";
import { getExplorePosts, getExploreReels, getTrendingPosts, getTrendingReels, getExploreUsers, searchUsers, searchPosts, searchHashtags } from "../controllers/explore.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/posts').get(isAuthenticated, getExplorePosts);
router.route('/reels').get(isAuthenticated, getExploreReels);
router.route('/trending/posts').get(isAuthenticated, getTrendingPosts);
router.route('/trending/reels').get(isAuthenticated, getTrendingReels);
router.route('/users').get(isAuthenticated, getExploreUsers);
router.route('/search/users').get(isAuthenticated, searchUsers);
router.route('/search/posts').get(isAuthenticated, searchPosts);
router.route('/search/hashtags').get(isAuthenticated, searchHashtags);

export default router;
