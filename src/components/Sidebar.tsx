import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Trophy,
  Coins,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout, admin } = useAuth();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'User Management' },
    { path: '/tournaments', icon: Trophy, label: 'Tournaments' },
    { path: '/wallet', icon: Coins, label: 'Coin Wallet' },
    { path: '/reports', icon: TrendingUp, label: 'Reports' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const overlayVariants = {
    open: { opacity: 1, transition: { duration: 0.3 } },
    closed: { opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }
    })
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className="lg:hidden fixed top-5 left-5 z-50 p-4 rounded-2xl"
        style={{
          background: 'rgba(11, 11, 15, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          boxShadow: isOpen 
            ? '0 0 25px rgba(138, 43, 226, 0.4), inset 0 0 25px rgba(138, 43, 226, 0.1)' 
            : '0 0 25px rgba(0, 229, 255, 0.4), inset 0 0 25px rgba(0, 229, 255, 0.1)'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="text-purple-400" size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="text-cyan-400" size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed lg:static inset-y-0 left-0 z-40 w-96 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0, 229, 255, 0.15)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5), inset -1px 0 1px rgba(0, 229, 255, 0.1)'
        }}
      >
        {/* Animated Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(0, 229, 255, 0.03) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(138, 43, 226, 0.03) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(0, 229, 255, 0.03) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          />
        </div>

        <div className="relative flex flex-col h-full">
          {/* Logo Section */}
          <motion.div 
            className="p-8 border-b"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              borderColor: 'rgba(0, 229, 255, 0.15)'
            }}
          >
            <div className="flex items-center justify-center">
              <div>
                <motion.h1 
                  className="text-5xl font-black tracking-tight mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  ArenaX
                </motion.h1>
                <p className="text-sm font-medium text-gray-400 tracking-wide text-center">Admin Panel</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2.5 overflow-y-auto">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      isActive ? 'active-link' : 'inactive-link'
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(138, 43, 226, 0.15) 100%)'
                      : 'rgba(11, 11, 15, 0.4)',
                    backdropFilter: 'blur(20px)',
                    border: isActive
                      ? '1px solid rgba(0, 229, 255, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: isActive
                      ? '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.1)'
                      : 'none'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r-full"
                          style={{
                            background: 'linear-gradient(180deg, #00E5FF 0%, #8A2BE2 100%)',
                            boxShadow: '0 0 10px rgba(0, 229, 255, 0.8)'
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}

                      <item.icon
                        size={24}
                        className={`relative z-10 transition-colors duration-300 ${
                          isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-300'
                        }`}
                        strokeWidth={2.5}
                      />

                      <span
                        className={`font-semibold text-base transition-colors duration-300 flex-1 text-left relative z-10 ${
                          isActive ? 'text-white' : 'text-gray-300 group-hover:text-gray-100'
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* User Section */}
          <div 
            className="p-6 border-t"
            style={{
              borderColor: 'rgba(0, 229, 255, 0.15)'
            }}
          >
            <motion.div 
              className="p-5 rounded-2xl relative overflow-hidden group cursor-pointer mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              style={{
                background: 'rgba(11, 11, 15, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <p className="text-sm text-gray-400 mb-2">Logged in as</p>
                <p className="text-lg text-white font-bold">{admin?.username}</p>
                <p className="text-sm font-medium text-purple-400 mt-1">{admin?.role}</p>
              </div>
            </motion.div>
            
            <motion.button 
              onClick={logout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.3)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <LogOut size={24} className="text-red-400 group-hover:text-red-300 transition-colors" strokeWidth={2.5} />
              </motion.div>
              <span className="font-semibold text-base text-red-400 group-hover:text-red-300 transition-colors">
                Logout
              </span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      <style>{`
        .inactive-link:hover {
          background: rgba(11, 11, 15, 0.8) !important;
          border: 1px solid rgba(0, 229, 255, 0.3) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }

        /* Custom Scrollbar */
        nav::-webkit-scrollbar {
          width: 8px;
        }
        
        nav::-webkit-scrollbar-track {
          background: rgba(11, 11, 15, 0.3);
          border-radius: 4px;
          margin: 8px 0;
        }
        
        nav::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00E5FF 0%, #8A2BE2 100%);
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        nav::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00E5FF 20%, #8A2BE2 80%);
          box-shadow: 0 0 6px rgba(0, 229, 255, 0.5);
        }

        /* Smooth scrolling */
        nav {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default Sidebar;