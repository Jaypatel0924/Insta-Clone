import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setNotifications, setUnreadCount } from '../redux/notificationSlice';

export const useGetNotifications = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const [notificationsRes, unreadRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/v1/notification', {
                        withCredentials: true
                    }),
                    axios.get('http://localhost:5000/api/v1/notification/unread/count', {
                        withCredentials: true
                    })
                ]);
                
                if (notificationsRes.data.success) {
                    dispatch(setNotifications(notificationsRes.data.notifications));
                }
                if (unreadRes.data.success) {
                    dispatch(setUnreadCount(unreadRes.data.count));
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    console.warn('Auth token invalid, skipping notifications fetch');
                } else {
                    console.error('Error fetching notifications:', error.message);
                }
            }
        };

        if (user) {
            fetchNotifications();
        }
    }, [dispatch, user]);
};

export default useGetNotifications;
