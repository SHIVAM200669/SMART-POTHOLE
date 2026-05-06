import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus, ClipboardList, BarChart3, LogOut, X, Drill, Users } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const menuItems = isAdmin 
    ? [
        { name: 'Admin Panel', path: '/admin', icon: LayoutDashboard },
        { name: 'Manage Workers', path: '/workers', icon: Users }
      ]
    : [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Report Pothole', path: '/dashboard?tab=report', icon: FilePlus },
        { name: 'My Reports', path: '/dashboard?tab=reports', icon: ClipboardList },
        { name: 'Analytics', path: '/dashboard?tab=analytics', icon: BarChart3 },
      ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navClasses = (path) => {
    const isActive = location.pathname + location.search === path || 
                     (path === '/dashboard' && location.pathname === '/dashboard' && !location.search);
    
    return `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
    }`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 transform
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-50">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                <Drill size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Smart<span className="text-blue-600">Pothole</span></span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={navClasses(item.path)}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-50">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
