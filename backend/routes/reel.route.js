import express from "express";
import { createReel, getReels, getUserReels, likeReel, addReelComment, getReelComments, deleteReel, shareReel, incrementReelView, bookmarkReel } from "../controllers/reel.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/create').post(isAuthenticated, upload.single('video'), createReel);
router.route('/').get(isAuthenticated, getReels);
router.route('/user/:id').get(isAuthenticated, getUserReels);
router.route('/:id/like').post(isAuthenticated, likeReel);
router.route('/:id/comment').post(isAuthenticated, addReelComment);
router.route('/:id/comments').get(isAuthenticated, getReelComments);
router.route('/:id/delete').delete(isAuthenticated, deleteReel);
router.route('/:id/share').post(isAuthenticated, shareReel);
router.route('/:id/view').post(isAuthenticated, incrementReelView);
router.route('/:id/bookmark').get(isAuthenticated, bookmarkReel);

export default router;
