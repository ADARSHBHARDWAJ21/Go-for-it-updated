import { LogOutIcon } from 'lucide-react';
import React from 'react';
import { useAuth } from '../components/context/AuthContext'; // 1. Import useAuth

const Logout = () => {
    const { logout } = useAuth(); // 2. Get the central logout function from context

    function onLogout() {
        logout(); // 3. Call the central logout function
        window.location.href = '/'; // Redirect to homepage
    }

    return (
        <div className="absolute bottom-0 left-0 w-full p-6">
            <button
                style={{ position: 'relative', right: "1vw" }}
                onClick={onLogout}
                className="w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-400 bg-gray-900 hover:bg-red-800/20 hover:text-red-300 border border-red-900/50"
            >
                <LogOutIcon />
                <span className="font-semibold">Log Out</span>
            </button>
        </div>
    );
};

export default Logout;