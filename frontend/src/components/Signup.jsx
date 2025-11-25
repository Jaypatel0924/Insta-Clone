import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        fullName: ""
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });

        // Check password strength
        if (name === 'password') {
            let strength = 0;
            if (value.length >= 6) strength += 1;
            if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength += 1;
            if (value.match(/\d/)) strength += 1;
            if (value.match(/[^a-zA-Z\d]/)) strength += 1;
            setPasswordStrength(strength);
        }
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!input.username || !input.email || !input.password) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (input.username.length < 3) {
            toast.error('Username must be at least 3 characters long');
            return;
        }

        if (input.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/login");
                toast.success('Account created successfully! You can now log in.');
                setInput({
                    username: "",
                    email: "",
                    password: "",
                    fullName: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const passwordStrengthColors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-blue-500',
        'bg-green-500'
    ];

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
            <div className='max-w-md w-full space-y-8'>
                {/* Signup Card */}
                <div className='bg-white border border-gray-300 rounded-lg p-8'>
                    {/* Instagram Logo */}
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2'>
                            Instagram
                        </h1>
                        <p className='text-gray-500 text-sm'>
                            Sign up to see photos and videos from your friends.
                        </p>
                    </div>

                    <form onSubmit={signupHandler} className='space-y-4'>
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

                        {/* Full Name Input */}
                        <div className='space-y-2'>
                            <Input
                                type="text"
                                name="fullName"
                                value={input.fullName}
                                onChange={changeEventHandler}
                                placeholder="Full Name"
                                className="h-12 bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                            />
                        </div>

                        {/* Username Input */}
                        <div className='space-y-2'>
                            <Input
                                type="text"
                                name="username"
                                value={input.username}
                                onChange={changeEventHandler}
                                placeholder="Username"
                                className="h-12 bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                required
                                minLength={3}
                            />
                        </div>

                        {/* Password Input */}
                        <div className='space-y-2'>
                            <div className='relative'>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    placeholder="Password"
                                    className="h-12 bg-gray-50 border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 pr-10"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {input.password && (
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3, 4].map((index) => (
                                            <div
                                                key={index}
                                                className={`h-1 flex-1 rounded-full transition-all ${
                                                    index < passwordStrength 
                                                        ? passwordStrengthColors[passwordStrength - 1]
                                                        : 'bg-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {passwordStrength === 0 && 'Very weak'}
                                        {passwordStrength === 1 && 'Weak'}
                                        {passwordStrength === 2 && 'Fair'}
                                        {passwordStrength === 3 && 'Good'}
                                        {passwordStrength === 4 && 'Strong'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className='text-xs text-gray-500 text-center'>
                            <p>
                                By signing up, you agree to our{' '}
                                <Link to="/terms" className="text-gray-600 hover:text-gray-800">
                                    Terms
                                </Link>
                                ,{' '}
                                <Link to="/privacy" className="text-gray-600 hover:text-gray-800">
                                    Privacy Policy
                                </Link>
                                {' '}and{' '}
                                <Link to="/cookies" className="text-gray-600 hover:text-gray-800">
                                    Cookies Policy
                                </Link>
                                .
                            </p>
                        </div>

                        {/* Signup Button */}
                        <Button
                            type="submit"
                            disabled={loading || !input.email || !input.username || !input.password}
                            className="w-full h-12 bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Sign up'
                            )}
                        </Button>
                    </form>
                </div>

                {/* Login Redirect */}
                <div className='bg-white border border-gray-300 rounded-lg p-6 text-center'>
                    <p className='text-gray-700'>
                        Have an account?{' '}
                        <Link 
                            to="/login" 
                            className="text-[#0095F6] font-semibold hover:text-[#1877F2]"
                        >
                            Log in
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
                        {['Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy', 'Terms', 'Locations', 'Instagram Lite', 'Threads', 'Contact Uploading & Non-Users', 'Meta Verified'].map((item) => (
                            <button key={item} className='hover:text-gray-700'>
                                {item}
                            </button>
                        ))}
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

export default Signup