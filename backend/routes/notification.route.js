import express from "express";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, getUnreadNotificationsCount } from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/').get(isAuthenticated, getNotifications);
router.route('/unread/count').get(isAuthenticated, getUnreadNotificationsCount);
router.route('/:id/read').put(isAuthenticated, markNotificationAsRead);
router.route('/read/all').put(isAuthenticated, markAllNotificationsAsRead);
router.route('/:id').delete(isAuthenticated, deleteNotification);

export default router;
