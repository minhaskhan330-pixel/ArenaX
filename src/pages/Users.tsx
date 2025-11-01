import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Search, Eye, Ban, CheckCircle, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../services/api';
import { User } from '../types';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [coinData, setCoinData] = useState({
    amount: '',
    type: 'credit' as 'credit' | 'debit',
    description: '',
    paymentMethod: 'Admin',
    paymentReference: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [userTypeFilter]);

  const fetchUsers = async () => {
    try {
      const params: any = {};
      if (userTypeFilter !== 'all') params.userType = userTypeFilter;
      if (search) params.search = search;

      const response = await userAPI.getAll(params);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      await userAPI.updateStatus(userId, status);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleCoinAdjustment = async () => {
    if (!selectedUser || !coinData.amount || !coinData.description) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await userAPI.adjustCoins(selectedUser._id, {
        amount: parseInt(coinData.amount),
        type: coinData.type,
        description: coinData.description,
        paymentMethod: coinData.paymentMethod,
        paymentReference: coinData.paymentReference || undefined
      });

      setCoinData({
        amount: '',
        type: 'credit',
        description: '',
        paymentMethod: 'Admin',
        paymentReference: ''
      });
      setShowCoinModal(false);
      fetchUsers();
      alert('Coins adjusted successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error adjusting coins');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; glow: string }> = {
      active: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10B981', glow: 'rgba(16, 185, 129, 0.5)' },
      suspended: { bg: 'rgba(251, 191, 36, 0.2)', text: '#FBBF24', glow: 'rgba(251, 191, 36, 0.5)' },
      banned: { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)' },
    };

    const badge = badges[status] || badges.active;
    return (
      <span 
        className="px-3 py-1 rounded-full text-xs font-bold"
        style={{
          background: badge.bg,
          color: badge.text,
          border: `1px solid ${badge.text}40`,
          boxShadow: `0 0 10px ${badge.glow}`,
        }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, #0B0B0F 0%, #14141E 50%, #1A1A2E 100%)'
      }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
        
        <div className="relative flex items-center justify-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full"
            style={{
              border: '3px solid transparent',
              borderTopColor: '#00E5FF',
              borderRightColor: '#8A2BE2',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0B0B0F 0%, #14141E 50%, #1A1A2E 100%)'
    }}>
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, transparent 70%)'
          }}
        />

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px'
        }}
      />

      {/* Main Content */}
      <div className="relative p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-5xl font-black tracking-tight mb-2"
            style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            User Management
          </motion.h1>
          <p className="text-gray-400 font-medium">Manage users and their coin balances</p>
        </motion.div>

        {/* Search and Filter Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 229, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          <div 
            className="h-1"
            style={{
              background: 'linear-gradient(90deg, #00E5FF 0%, #8A2BE2 50%, #00E5FF 100%)',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
            }}
          />
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(11, 11, 15, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                style={{
                  background: 'rgba(11, 11, 15, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <option value="all">All Users</option>
                <option value="player">Players</option>
                <option value="organizer">Organizers</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(138, 43, 226, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(138, 43, 226, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          <div 
            className="h-1"
            style={{
              background: 'linear-gradient(90deg, #8A2BE2 0%, #00E5FF 50%, #8A2BE2 100%)',
              boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)'
            }}
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">User</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Type</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Coin Balance</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Total Earned</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Total Spent</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="transition-all"
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-bold">{user.username}</p>
                          <p className="text-gray-400 text-sm font-medium">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span 
                          className="px-3 py-1 rounded-lg text-xs font-bold"
                          style={{
                            background: user.role === 'player' 
                              ? 'rgba(0, 229, 255, 0.2)' 
                              : 'rgba(138, 43, 226, 0.2)',
                            color: user.role === 'player' ? '#00E5FF' : '#8A2BE2',
                            border: user.role === 'player' 
                              ? '1px solid rgba(0, 229, 255, 0.4)' 
                              : '1px solid rgba(138, 43, 226, 0.4)'
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-cyan-400 font-black text-lg">{user.coinBalance.toLocaleString()} AX</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-green-400 font-bold">{user.totalCoinsEarned.toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-red-400 font-bold">{user.totalCoinsSpent.toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(user.accountStatus)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                            className="p-2 rounded-lg transition-all"
                            style={{
                              background: 'rgba(0, 229, 255, 0.2)',
                              color: '#00E5FF',
                              border: '1px solid rgba(0, 229, 255, 0.4)'
                            }}
                            title="View Details"
                          >
                            <Eye size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowCoinModal(true);
                            }}
                            className="p-2 rounded-lg transition-all"
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10B981',
                              border: '1px solid rgba(16, 185, 129, 0.4)'
                            }}
                            title="Adjust Coins"
                          >
                            <Plus size={18} />
                          </motion.button>
                          {user.accountStatus === 'active' ? (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatusUpdate(user._id, 'suspended')}
                              className="p-2 rounded-lg transition-all"
                              style={{
                                background: 'rgba(251, 191, 36, 0.2)',
                                color: '#FBBF24',
                                border: '1px solid rgba(251, 191, 36, 0.4)'
                              }}
                              title="Suspend"
                            >
                              <Ban size={18} />
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatusUpdate(user._id, 'active')}
                              className="p-2 rounded-lg transition-all"
                              style={{
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#10B981',
                                border: '1px solid rgba(16, 185, 129, 0.4)'
                              }}
                              title="Activate"
                            >
                              <CheckCircle size={18} />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{
                background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 80px rgba(0, 229, 255, 0.2)'
              }}
            >
              <div 
                className="sticky top-0 p-6 flex items-center justify-between z-10"
                style={{
                  background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.98) 0%, rgba(20, 20, 30, 0.95) 100%)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 
                  className="text-3xl font-black"
                  style={{
                    background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  User Details
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Username</p>
                    <p className="text-white font-bold text-lg">{selectedUser.username}</p>
                  </div>
                  <div 
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Email</p>
                    <p className="text-white font-bold text-lg">{selectedUser.email}</p>
                  </div>
                  <div 
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Full Name</p>
                    <p className="text-white font-bold text-lg">{selectedUser.fullName}</p>
                  </div>
                  <div 
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Phone</p>
                    <p className="text-white font-bold text-lg">{selectedUser.phoneNumber || 'N/A'}</p>
                  </div>
                  <div 
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">User Type</p>
                    <p className="text-white font-bold text-lg capitalize">{selectedUser.userType}</p>
                  </div>
                  <div 
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Status</p>
                    <div className="mt-2">{getStatusBadge(selectedUser.accountStatus)}</div>
                  </div>
                </div>

                <div 
                  className="rounded-xl p-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 229, 255, 0.1)'
                  }}
                >
                  <h4 className="text-white font-black text-xl mb-4">Coin Information</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(11, 11, 15, 0.6)' }}>
                      <p className="text-gray-400 text-sm font-medium mb-2">Current Balance</p>
                      <p className="text-cyan-400 font-black text-2xl">{selectedUser.coinBalance.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(11, 11, 15, 0.6)' }}>
                      <p className="text-gray-400 text-sm font-medium mb-2">Total Earned</p>
                      <p className="text-green-400 font-black text-2xl">{selectedUser.totalCoinsEarned.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(11, 11, 15, 0.6)' }}>
                      <p className="text-gray-400 text-sm font-medium mb-2">Total Spent</p>
                      <p className="text-red-400 font-black text-2xl">{selectedUser.totalCoinsSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="rounded-xl p-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(0, 229, 255, 0.1) 100%)',
                    border: '1px solid rgba(138, 43, 226, 0.3)',
                    boxShadow: '0 0 30px rgba(138, 43, 226, 0.1)'
                  }}
                >
                  <h4 className="text-white font-black text-xl mb-4">Game Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(11, 11, 15, 0.6)' }}>
                      <p className="text-gray-400 text-sm font-medium mb-1">Tournaments Joined</p>
                      <p className="text-white font-black text-xl">{selectedUser.gameStats.totalKills}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coin Adjustment Modal */}
      <AnimatePresence>
        {showCoinModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl max-w-md w-full"
              style={{
                background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%)',
                border: '1px solid rgba(138, 43, 226, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 80px rgba(138, 43, 226, 0.2)'
              }}
            >
              <div 
                className="p-6"
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 
                  className="text-3xl font-black mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Adjust Coins
                </h3>
                <p className="text-gray-400 text-sm font-medium">
                  {selectedUser.username} - Current Balance: <span className="text-cyan-400 font-bold">{selectedUser.coinBalance} AX</span>
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Transaction Type</label>
                  <select
                    value={coinData.type}
                    onChange={(e) => setCoinData({ ...coinData, type: e.target.value as 'credit' | 'debit' })}
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <option value="credit">Credit (Add Coins)</option>
                    <option value="debit">Debit (Remove Coins)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Amount</label>
                  <input
                    type="number"
                    value={coinData.amount}
                    onChange={(e) => setCoinData({ ...coinData, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Description</label>
                  <textarea
                    value={coinData.description}
                    onChange={(e) => setCoinData({ ...coinData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    rows={3}
                    placeholder="Enter reason for adjustment"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Payment Method</label>
                  <select
                    value={coinData.paymentMethod}
                    onChange={(e) => setCoinData({ ...coinData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Easypaisa">Easypaisa</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Payment Reference (Optional)</label>
                  <input
                    type="text"
                    value={coinData.paymentReference}
                    onChange={(e) => setCoinData({ ...coinData, paymentReference: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    placeholder="Transaction ID or reference"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCoinAdjustment}
                    className="flex-1 py-3 text-white rounded-xl font-black transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                      boxShadow: '0 4px 20px rgba(0, 229, 255, 0.3)'
                    }}
                  >
                    Confirm
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCoinModal(false);
                      setCoinData({
                        amount: '',
                        type: 'credit',
                        description: '',
                        paymentMethod: 'Admin',
                        paymentReference: ''
                      });
                    }}
                    className="flex-1 py-3 text-white rounded-xl font-black transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        ::selection {
          background-color: rgba(0, 229, 255, 0.3);
          color: white;
        }

        ::-moz-selection {
          background-color: rgba(0, 229, 255, 0.3);
          color: white;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(11, 11, 15, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00E5FF 0%, #8A2BE2 100%);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00D4EE 0%, #7B1FD1 100%);
        }
      `}</style>
    </div>
  );
};

export default Users