import express from "express";
import { createStory, getStoriesByUser, getAllFollowingStories, viewStory, deleteStory } from "../controllers/story.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/create').post(isAuthenticated, upload.single('file'), createStory);
router.route('/:id').get(isAuthenticated, getStoriesByUser);
router.route('/view/:id').put(isAuthenticated, viewStory);
router.route('/delete/:id').delete(isAuthenticated, deleteStory);
router.route('/following/all').get(isAuthenticated, getAllFollowingStories);

export default router;
