import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';

const ProtectedRoutes = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check authentication status
        const checkAuth = () => {
            if (!user) {
                // Redirect to login with return url
                navigate('/login', { 
                    state: { 
                        from: location.pathname,
                        message: 'Please log in to access this page'
                    } 
                });
            }
            setIsChecking(false);
        };

        // Small delay to ensure Redux state is loaded
        const timer = setTimeout(checkAuth, 100);
        
        return () => clearTimeout(timer);
    }, [user, navigate, location]);

    // Show loading spinner while checking authentication
    if (isChecking) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <Shield className="h-4 w-4 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-600 font-medium">Checking authentication</p>
                        <p className="text-gray-400 text-sm">Please wait...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If user exists, render children
    if (user) {
        return <>{children}</>;
    }

    // Fallback - show nothing while redirecting
    return null;
}

export default ProtectedRoutes;