import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setNotifications, markAsRead, deleteNotification } from '../redux/notificationSlice';
import { Heart, MessageCircle, UserPlus, Trash2 } from 'lucide-react';

const Notifications = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector(store => store.notification);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/v1/notification', {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setNotifications(res.data.notifications));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.put(`http://localhost:5000/api/v1/notification/${notificationId}/read`, {}, {
                withCredentials: true
            });
            dispatch(markAsRead(notificationId));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/notification/${notificationId}`, {
                withCredentials: true
            });
            dispatch(deleteNotification(notificationId));
        } catch (error) {
            console.log(error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <Heart size={20} className="text-red-500" />;
            case 'comment':
                return <MessageCircle size={20} className="text-blue-500" />;
            case 'follow':
            case 'follow_request':
                return <UserPlus size={20} className="text-green-500" />;
            default:
                return null;
        }
    };

    const getNotificationText = (notification) => {
        switch (notification.type) {
            case 'like':
                return `liked your post`;
            case 'comment':
                return `commented on your post`;
            case 'follow':
                return `followed you`;
            case 'follow_request':
                return `sent you a follow request`;
            case 'mention':
                return `mentioned you`;
            default:
                return '';
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading notifications...</div>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-xl">Notifications</h2>
                <button
                    onClick={fetchNotifications}
                    className="text-blue-500 hover:text-blue-600 text-sm font-semibold"
                >
                    Refresh
                </button>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    <p className="text-lg">No notifications yet</p>
                    <p className="text-sm">Start following people to get notifications</p>
                </div>
            ) : (
                <div className="divide-y">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-4 hover:bg-gray-50 transition flex items-start gap-3 cursor-pointer ${
                                !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                        >
                            {/* Avatar */}
                            <img
                                src={notification.sender?.profilePicture}
                                alt={notification.sender?.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-sm">{notification.sender?.username}</p>
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <p className="text-sm text-gray-600">
                                    {getNotificationText(notification)}
                                </p>
                                {notification.text && (
                                    <p className="text-sm text-gray-500 italic mt-1">"{notification.text}"</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Thumbnail + Delete Button */}
                            <div className="flex items-center gap-2">
                                {notification.post?.image && (
                                    <img
                                        src={notification.post.image}
                                        alt="post"
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                )}
                                {notification.reel?.video && (
                                    <div className="w-12 h-12 rounded bg-gray-300 flex items-center justify-center">
                                        <span className="text-xs">Video</span>
                                    </div>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(notification._id);
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Unread Indicator */}
                            {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
