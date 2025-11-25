import express from "express";
import { sendFollowRequest, getFollowRequests, acceptFollowRequest, rejectFollowRequest, cancelFollowRequest } from "../controllers/followRequest.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendFollowRequest);
router.route('/').get(isAuthenticated, getFollowRequests);
router.route('/accept/:id').put(isAuthenticated, acceptFollowRequest);
router.route('/reject/:id').put(isAuthenticated, rejectFollowRequest);
router.route('/cancel/:id').delete(isAuthenticated, cancelFollowRequest);

export default router;
