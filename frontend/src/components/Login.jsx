import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        
        if (!input.email || !input.password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success('Welcome back!');
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
            <div className='max-w-md w-full space-y-8'>
                {/* Login Card */}
                <div className='bg-white border border-gray-300 rounded-lg p-8'>
                    {/* Instagram Logo */}
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2'>
                            Instagram
                        </h1>
                        <p className='text-gray-500 text-sm'>
                            Log in to see photos and videos from your friends.
                        </p>
                    </div>

                    <form onSubmit={loginHandler} className='space-y-4'>
                        {/* Email Input */}
                        <div className='space-y-2'>
                            <Input
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="Email address"
                                className="h-12 bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className='space-y-2 relative'>
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={input.password}
                                onChange={changeEventHandler}
                                placeholder="Password"
                                className="h-12 bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            disabled={loading || !input.email || !input.password}
                            className="w-full h-12 bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">OR</span>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className='text-center'>
                        <button className="text-xs text-blue-900 font-semibold hover:text-blue-700">
                            Forgot password?
                        </button>
                    </div>
                </div>

                {/* Sign Up Redirect */}
                <div className='bg-white border border-gray-300 rounded-lg p-6 text-center'>
                    <p className='text-gray-700'>
                        Don't have an account?{' '}
                        <Link 
                            to="/signup" 
                            className="text-[#0095F6] font-semibold hover:text-[#1877F2]"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* App Download Links */}
                <div className='text-center space-y-4'>
                    <p className='text-sm text-gray-600'>Get the app.</p>
                    <div className='flex justify-center space-x-2'>
                        <button className='bg-transparent border-0'>
                            <div className='w-32 h-10 bg-gray-800 rounded flex items-center justify-center'>
                                <span className='text-white text-xs font-semibold'>App Store</span>
                            </div>
                        </button>
                        <button className='bg-transparent border-0'>
                            <div className='w-32 h-10 bg-gray-800 rounded flex items-center justify-center'>
                                <span className='text-white text-xs font-semibold'>Google Play</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer Links */}
                <div className='text-center space-y-4'>
                    <div className='flex flex-wrap justify-center gap-4 text-xs text-gray-500'>
                        <button className='hover:text-gray-700'>Meta</button>
                        <button className='hover:text-gray-700'>About</button>
                        <button className='hover:text-gray-700'>Blog</button>
                        <button className='hover:text-gray-700'>Jobs</button>
                        <button className='hover:text-gray-700'>Help</button>
                        <button className='hover:text-gray-700'>API</button>
                        <button className='hover:text-gray-700'>Privacy</button>
                        <button className='hover:text-gray-700'>Terms</button>
                        <button className='hover:text-gray-700'>Locations</button>
                        <button className='hover:text-gray-700'>Instagram Lite</button>
                        <button className='hover:text-gray-700'>Threads</button>
                        <button className='hover:text-gray-700'>Contact Uploading & Non-Users</button>
                        <button className='hover:text-gray-700'>Meta Verified</button>
                    </div>
                    <div className='text-xs text-gray-500'>
                        <select className='bg-transparent border-0 text-gray-500'>
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                        <span className='ml-2'>© 2024 Instagram from Meta</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login