import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .populate('sender', 'username profilePicture')
            .populate('post', 'image')
            .populate('reel', 'video');

        return res.status(200).json({
            notifications,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching notifications',
            success: false
        });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                message: 'Notification not found',
                success: false
            });
        }

        return res.status(200).json({
            notification,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error marking notification as read',
            success: false
        });
    }
};

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.id;
        
        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({
            message: 'All notifications marked as read',
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error marking notifications as read',
            success: false
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.id;
        const notificationId = req.params.id;

        const notification = await Notification.findById(notificationId);
        if (!notification || notification.recipient.toString() !== userId) {
            return res.status(403).json({
                message: 'Unauthorized',
                success: false
            });
        }

        await Notification.findByIdAndDelete(notificationId);

        return res.status(200).json({
            message: 'Notification deleted',
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error deleting notification',
            success: false
        });
    }
};

export const getUnreadNotificationsCount = async (req, res) => {
    try {
        const userId = req.id;
        const count = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        return res.status(200).json({
            count,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error fetching notification count',
            success: false
        });
    }
};
