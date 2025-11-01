import React, { useState } from 'react';
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
  X,
  Zap,
  ChevronRight,
  Search,
  Moon
} from 'lucide-react';

// Mock Auth Context
const useAuth = () => ({
  admin: { username: 'Admin User', role: 'Super Admin' },
  logout: () => console.log('Logging out...')
});

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('/');
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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
      
      {/* Ambient light effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.03, 0.06, 0.03],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
          }}
        />
        <motion.div
          animate={{
            opacity: [0.03, 0.06, 0.03],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Grid overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Mobile overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />

              {/* Sidebar */}
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed lg:sticky top-0 left-0 z-50 w-72 h-screen bg-zinc-950/50 backdrop-blur-xl border-r border-white/5"
              >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 blur-lg opacity-50" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-white">ArenaX</h1>
                      <p className="text-[10px] text-zinc-500 -mt-0.5">Admin Panel</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>

                {/* Search */}
                <div className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:bg-white/10 focus:border-white/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <nav className="px-3 pb-4 space-y-1 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                  {navItems.map((item, index) => {
                    const isActive = activeTab === item.path;
                    return (
                      <motion.button
                        key={item.path}
                        onClick={() => {
                          setActiveTab(item.path);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all relative group ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-600/10 rounded-lg border border-white/10"
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          />
                        )}
                        <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-blue-400' : ''}`} strokeWidth={2} />
                        <span className="text-sm font-medium relative z-10 flex-1 text-left">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-blue-400 relative z-10" strokeWidth={2} />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>

                {/* User section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                        {admin?.username?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{admin?.username}</p>
                        <p className="text-xs text-zinc-500 truncate">{admin?.role}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all group"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 relative">
          {/* Header */}
          <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-black/50 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-zinc-400" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {navItems.find(item => item.path === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-xs text-zinc-500">Welcome back, {admin?.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-zinc-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Moon className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </header>

          {/* Content area */}
          <div className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Example dashboard cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                  { label: 'Total Users', value: '12,453', change: '+12%', icon: Users, color: 'blue' },
                  { label: 'Active Tournaments', value: '24', change: '+3', icon: Trophy, color: 'violet' },
                  { label: 'Total Revenue', value: '$54,892', change: '+18%', icon: Coins, color: 'emerald' },
                  { label: 'Growth Rate', value: '23.5%', change: '+5%', icon: TrendingUp, color: 'orange' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-400`} strokeWidth={2} />
                      </div>
                      <span className={`text-xs font-medium text-${stat.color}-400 bg-${stat.color}-500/10 px-2 py-1 rounded-full`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                    <p className="text-sm text-zinc-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Example content section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">New user registration</p>
                          <p className="text-xs text-zinc-500">2 minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {['Create Tournament', 'Add User', 'Send Notification', 'Generate Report'].map((action, i) => (
                      <button
                        key={i}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-white text-left transition-all border border-white/5 hover:border-white/10"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }

        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        ::selection {
          background-color: rgba(59, 130, 246, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Layout;