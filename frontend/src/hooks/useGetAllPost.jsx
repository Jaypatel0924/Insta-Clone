import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/post/all', { withCredentials: true });
                if (res.data.success) { 
                    console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    console.warn('Auth token invalid, skipping post fetch');
                } else {
                    console.error('Error fetching posts:', error.message);
                }
            }
        }

        if (user) {
            fetchAllPost();
        }
    }, [dispatch, user]);
};

export default useGetAllPost;