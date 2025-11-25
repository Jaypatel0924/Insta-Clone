import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setFollowingStories } from '../redux/storySlice';

export const useGetFollowingStories = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/story/following/all', {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setFollowingStories(res.data.storyGroups));
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    // Token expired or invalid - don't keep retrying
                    console.warn('Auth token invalid, skipping story fetch');
                } else {
                    console.error('Error fetching stories:', error.message);
                }
            }
        };

        if (user) {
            // Fetch immediately on load
            fetchStories();
            
            // Refresh stories every 30 seconds (less frequent to avoid 401 spam)
            const interval = setInterval(fetchStories, 30000);
            
            return () => clearInterval(interval);
        }
    }, [dispatch, user]);
};

export default useGetFollowingStories;
