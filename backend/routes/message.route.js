import express from "express";
 import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { getMessage, sendMessage, deleteMessage, markMessagesAsRead } from "../controllers/message.controller.js";

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, upload.single('media'), sendMessage);
router.route('/all/:id').get(isAuthenticated, getMessage);
router.route('/delete/:id').delete(isAuthenticated, deleteMessage);
router.route('/read').post(isAuthenticated, markMessagesAsRead);
 
export default router;