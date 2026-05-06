import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

const Navbar = ({ setSidebarOpen }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-80 group focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all">
          <Search size={18} className="text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search reports or locations..." 
            className="bg-transparent border-none focus:outline-none text-sm text-gray-700 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
            <p className="text-xs font-medium text-gray-500 mt-1 capitalize">{user.role}</p>
          </div>
          <div className="bg-blue-100 p-2 rounded-xl text-blue-600 border border-blue-200">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
