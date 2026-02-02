
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

interface UserDropdownProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        window.location.reload(); // Ensure state is cleared completely
    };

    const handleSwitchAccount = () => {
        // For now, logout to switch. In future, could show list of saved sessions.
        handleLogout();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={toggleDropdown}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-100 ${isOpen ? 'bg-white shadow-md' : 'hover:bg-gray-100'}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        user.name.charAt(0).toUpperCase()
                    )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{user.name}</p>
                    <p className="text-[10px] font-semibold text-gray-400 capitalize truncate">Free Plan</p>
                </div>
                <div className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute bottom-full left-0 w-64 mb-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
                    {/* User Header in Dropdown */}
                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 font-medium truncate">{user.email}</p>
                    </div>

                    {/* Actions */}
                    <div className="p-2 space-y-1">
                        <div className="px-3 py-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Switch Account</p>

                            {/* Current Account */}
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-50/50 text-blue-700 mb-1">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-xs font-bold flex-1 text-left">{user.name}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>

                            {/* Add Account Option (Mock) */}
                            <button onClick={handleSwitchAccount} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors group">
                                <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-gray-400 group-hover:text-gray-500">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                </div>
                                <span className="text-xs font-bold text-left">Add another account</span>
                            </button>
                        </div>

                        <div className="h-px bg-gray-100 my-1 mx-3"></div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
