import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setReels } from '../redux/reelSlice';

export const useGetReels = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/reel', {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setReels(res.data.reels));
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    console.warn('Auth token invalid, skipping reels fetch');
                } else {
                    console.error('Error fetching reels:', error.message);
                }
            }
        };

        if (user) {
            fetchReels();
        }
    }, [dispatch, user]);
};

export default useGetReels;
