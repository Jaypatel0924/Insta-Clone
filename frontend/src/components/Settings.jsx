import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser, setAuthUser } from '../redux/authSlice';
import { toast } from 'sonner';
import { Lock, LogOut, Plus, Trash2, Shield } from 'lucide-react';

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const [accountSwitches, setAccountSwitches] = useState([]);
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountType, setNewAccountType] = useState('personal');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAccountSwitches();
    }, []);

    const fetchAccountSwitches = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/user/account/switches', {
                withCredentials: true
            });
            if (res.data.success) {
                setAccountSwitches(res.data.accountSwitches);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load accounts');
        }
    };

    const handleTogglePrivate = async () => {
        try {
            setLoading(true);
            const res = await axios.put('http://localhost:5000/api/v1/user/privacy/toggle', {}, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to toggle privacy');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = async () => {
        if (!newAccountName.trim()) {
            toast.error('Please enter an account name');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                'http://localhost:5000/api/v1/user/account/switch/add',
                { accountName: newAccountName, accountType: newAccountType },
                { withCredentials: true }
            );
            if (res.data.success) {
                setAccountSwitches(res.data.user.accountSwitches);
                setNewAccountName('');
                setShowAddAccount(false);
                toast.success('Account added successfully');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to add account');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/v1/user/logout', {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                navigate('/login');
                toast.success('Logged out successfully');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to logout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {/* Header */}
            <div className="border-b pb-4 mb-6">
                <h2 className="font-bold text-2xl">Settings & Privacy</h2>
            </div>

            {/* Privacy Section */}
            <div className="bg-white border rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Shield size={24} className="text-blue-500" />
                        <div>
                            <h3 className="font-semibold">Account Privacy</h3>
                            <p className="text-sm text-gray-500">
                                {user?.isPrivate ? 'Private Account' : 'Public Account'}
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={user?.isPrivate || false}
                            onChange={handleTogglePrivate}
                            disabled={loading}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <p className="text-sm text-gray-600">
                    {user?.isPrivate
                        ? 'Only approved followers can see your posts and stories.'
                        : 'Your posts and stories are visible to everyone.'}
                </p>
            </div>

            {/* Account Switches */}
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Lock size={20} /> Account Switches
                </h3>

                {/* Add New Account */}
                {!showAddAccount ? (
                    <button
                        onClick={() => setShowAddAccount(true)}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2 text-gray-700 hover:text-blue-500"
                    >
                        <Plus size={20} />
                        Add Another Account
                    </button>
                ) : (
                    <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                        <input
                            type="text"
                            placeholder="Account name or label"
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-3"
                        />
                        <select
                            value={newAccountType}
                            onChange={(e) => setNewAccountType(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-3"
                        >
                            <option value="personal">Personal</option>
                            <option value="business">Business</option>
                            <option value="creator">Creator</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddAccount}
                                disabled={loading}
                                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                {loading ? 'Adding...' : 'Add Account'}
                            </button>
                            <button
                                onClick={() => setShowAddAccount(false)}
                                className="flex-1 border rounded py-2 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Account List */}
                <div className="space-y-2 mt-4">
                    {accountSwitches.map((account, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                        >
                            <div>
                                <p className="font-semibold text-sm">{account.accountName}</p>
                                <p className="text-xs text-gray-500 capitalize">{account.accountType} Account</p>
                            </div>
                            <button className="text-gray-400 hover:text-red-500 transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Security</h3>
                <div className="space-y-3">
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition">
                        <p className="font-semibold text-sm">Change Password</p>
                        <p className="text-xs text-gray-500">Update your password regularly</p>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition">
                        <p className="font-semibold text-sm">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security</p>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition">
                        <p className="font-semibold text-sm">Active Sessions</p>
                        <p className="text-xs text-gray-500">See where you're logged in</p>
                    </button>
                </div>
            </div>

            {/* Blocked Users */}
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Blocked Accounts</h3>
                <p className="text-sm text-gray-600 mb-4">
                    You have blocked {user?.blockedUsers?.length || 0} accounts
                </p>
                <button className="text-blue-500 hover:text-blue-600 text-sm font-semibold">
                    Manage Blocked Accounts
                </button>
            </div>

            {/* Help & Support */}
            <div className="bg-white border rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Help & Support</h3>
                <div className="space-y-3">
                    <a href="#" className="block text-blue-500 hover:text-blue-600 text-sm">
                        Help Center
                    </a>
                    <a href="#" className="block text-blue-500 hover:text-blue-600 text-sm">
                        Report a Problem
                    </a>
                    <a href="#" className="block text-blue-500 hover:text-blue-600 text-sm">
                        Terms of Service
                    </a>
                    <a href="#" className="block text-blue-500 hover:text-blue-600 text-sm">
                        Privacy Policy
                    </a>
                </div>
            </div>

            {/* Logout */}
            <button 
                onClick={handleLogout}
                disabled={loading}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <LogOut size={20} />
                {loading ? 'Logging out...' : 'Logout'}
            </button>
        </div>
    );
};

export default Settings;
