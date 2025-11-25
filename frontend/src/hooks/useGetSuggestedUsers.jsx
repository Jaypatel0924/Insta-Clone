import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/user/suggested', { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    console.warn('Auth token invalid, skipping suggested users fetch');
                } else {
                    console.error('Error fetching suggested users:', error.message);
                }
            }
        }

        if (user) {
            fetchSuggestedUsers();
        }
    }, [dispatch, user]);
};

export default useGetSuggestedUsers;