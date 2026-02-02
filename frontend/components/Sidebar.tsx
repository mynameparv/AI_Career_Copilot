
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import UserDropdown from './UserDropdown';

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Get user from localStorage, fallback to default
  const user = JSON.parse(localStorage.getItem('userInfo') || '{"name": "John Doe", "email": "john@example.com"}');

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'AI Copilot', path: '/copilot', icon: '🤖' },
    { name: 'Projects', path: '/projects', icon: '🏗️' },
    { name: 'Job Tracker', path: '/tracker', icon: '🎯' },
    { name: 'Resume Assistant', path: '/resume', icon: '📄' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 h-screen sticky top-0 hidden md:flex flex-col bg-[#f7f7f5]">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>🚀</span> CareerPilot
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                ? 'bg-gray-200 text-gray-900 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <UserDropdown user={user} />
      </div>
    </aside>
  );
};

export default Sidebar;
