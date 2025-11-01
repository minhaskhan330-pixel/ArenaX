import React, { useEffect, useState } from 'react';
import { Coins, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { transactionAPI } from '../services/api';

const Wallet: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewRes, transactionsRes] = await Promise.all([
        transactionAPI.getWalletOverview(),
        transactionAPI.getAll({ limit: 50 })
      ]);
      setOverview(overviewRes.data.overview);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, gradient }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      <div 
        className="h-1"
        style={{
          background: gradient,
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
        }}
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 font-bold text-sm">{title}</p>
          <div 
            className="p-3 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <Icon size={24} className="text-white" />
          </div>
        </div>
        <p 
          className="text-4xl font-black"
          style={{
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );

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
            Coin Wallet Management
          </motion.h1>
          <p className="text-gray-400 font-medium">Monitor coin economy and transactions</p>
        </motion.div>

        {/* Stats Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Distributed"
              value={overview.totalCoinsDistributed.toLocaleString()}
              icon={TrendingUp}
              gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
            />
            <StatCard
              title="Total Spent"
              value={overview.totalCoinsSpent.toLocaleString()}
              icon={TrendingDown}
              gradient="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
            />
            <StatCard
              title="In Circulation"
              value={overview.totalCoinsInCirculation.toLocaleString()}
              icon={Coins}
              gradient="linear-gradient(135deg, #00E5FF 0%, #0EA5E9 100%)"
            />
            <StatCard
              title="Total Users"
              value={overview.totalUsers.toLocaleString()}
              icon={Users}
              gradient="linear-gradient(135deg, #8A2BE2 0%, #7C3AED 100%)"
            />
          </div>
        )}

        {/* Transactions Table */}
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
          <div className="p-6">
            <h3 className="text-2xl font-black text-white mb-6">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">User</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Type</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Amount</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Category</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Payment Method</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Description</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Processed By</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {transactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="transition-all"
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-white font-bold">{transaction.userId.username}</p>
                            <p className="text-gray-400 text-sm font-medium">{transaction.userId.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                              background: transaction.transactionType === 'credit' 
                                ? 'rgba(16, 185, 129, 0.2)' 
                                : 'rgba(239, 68, 68, 0.2)',
                              color: transaction.transactionType === 'credit' ? '#10B981' : '#EF4444',
                              border: transaction.transactionType === 'credit' 
                                ? '1px solid rgba(16, 185, 129, 0.4)' 
                                : '1px solid rgba(239, 68, 68, 0.4)',
                              boxShadow: transaction.transactionType === 'credit'
                                ? '0 0 10px rgba(16, 185, 129, 0.3)'
                                : '0 0 10px rgba(239, 68, 68, 0.3)'
                            }}
                          >
                            {transaction.transactionType.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p 
                            className="font-black text-lg"
                            style={{
                              color: transaction.transactionType === 'credit' ? '#10B981' : '#EF4444'
                            }}
                          >
                            {transaction.transactionType === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()} AX
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <span 
                            className="px-3 py-1 rounded-lg text-xs font-bold"
                            style={{
                              background: 'rgba(0, 229, 255, 0.2)',
                              color: '#00E5FF',
                              border: '1px solid rgba(0, 229, 255, 0.4)'
                            }}
                          >
                            {transaction.category.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-white font-bold">{transaction.paymentMethod || 'N/A'}</p>
                          {transaction.paymentReference && (
                            <p className="text-gray-400 text-xs font-medium mt-1">Ref: {transaction.paymentReference}</p>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-300 font-medium">{transaction.description}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-white font-bold">{transaction.processedBy?.username || 'System'}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-400 font-medium text-sm">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                          <p className="text-gray-500 text-xs font-medium">{new Date(transaction.createdAt).toLocaleTimeString()}</p>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

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

export default Wallet;