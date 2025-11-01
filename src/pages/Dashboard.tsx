import React, { useEffect, useState } from 'react';
import { Users, Trophy, Coins, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import StatCard from '../components/StatCard';
import { dashboardAPI } from '../services/api';
import { DashboardStats } from '../types';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare doughnut chart data from user growth data
  const prepareDoughnutData = () => {
    if (!stats || !stats.charts.userGrowth) return null;

    const labels = stats.charts.userGrowth.map(item => item._id);
    const data = stats.charts.userGrowth.map(item => item.count);

    // Generate gradient colors
    const colors = stats.charts.userGrowth.map((_, index) => {
      const hue = (index * 360) / stats.charts.userGrowth.length;
      return `hsl(${hue}, 70%, 60%)`;
    });

    return {
      labels: labels,
      datasets: [
        {
          label: 'Users',
          data: data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('60%', '70%')),
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9CA3AF',
          padding: 15,
          font: {
            size: 12,
            weight: '500' as const,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(11, 11, 15, 0.95)',
        titleColor: '#E5E7EB',
        bodyColor: '#9CA3AF',
        borderColor: 'rgba(0, 229, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} users (${percentage}%)`;
          }
        }
      },
    },
    cutout: '65%',
    animation: {
      animateRotate: true,
      animateScale: true,
    },
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

  if (!stats) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{
        background: 'linear-gradient(180deg, #0B0B0F 0%, #14141E 50%, #1A1A2E 100%)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-gray-400 text-lg">Failed to load dashboard data</p>
        </motion.div>
      </div>
    );
  }

  const doughnutData = prepareDoughnutData();

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
            Dashboard
          </motion.h1>
          <p className="text-gray-400 font-medium">Welcome to ArenaX Admin Panel</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.overview.totalUsers}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={stats.overview.activeUsers}
            icon={Users}
            color="green"
          />
          <StatCard
            title="Total Tournaments"
            value={stats.overview.totalTournaments}
            icon={Trophy}
            color="purple"
          />
          <StatCard
            title="Live Tournaments"
            value={stats.overview.liveTournaments}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Pending Approval"
            value={stats.overview.pendingTournaments}
            icon={Clock}
            color="red"
          />
          <StatCard
            title="Coins in Circulation"
            value={stats.overview.totalCoinsInCirculation.toLocaleString()}
            icon={Coins}
            color="blue"
          />
          <StatCard
            title="Total Revenue (PKR)"
            value={`₨${stats.overview.totalRevenuePKR.toLocaleString()}`}
            icon={DollarSign}
            color="green"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
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
              <h3 className="text-xl font-bold text-white mb-6">User Growth (Last 30 Days)</h3>
              <div className="flex items-center justify-center" style={{ height: '300px' }}>
                {doughnutData && <Doughnut data={doughnutData} options={doughnutOptions} />}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
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
              <h3 className="text-xl font-bold text-white mb-6">Coin Purchases (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.charts.coinPurchasesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="_id" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(11, 11, 15, 0.95)', 
                      border: '1px solid rgba(138, 43, 226, 0.3)', 
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                    }}
                    labelStyle={{ color: '#E5E7EB', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="totalCoins" fill="#8A2BE2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Coin Holders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
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
                background: 'linear-gradient(90deg, #00E5FF 0%, #0095FF 100%)',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
              }}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Top Coin Holders</h3>
              <div className="space-y-3">
                {stats.topCoinHolders.map((holder, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
                        style={{
                          background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                          boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-bold">{holder.username}</p>
                        <p className="text-gray-400 text-sm font-medium">{holder.userType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-black text-lg">{holder.coinBalance.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm font-medium">AX Coins</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
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
                background: 'linear-gradient(90deg, #8A2BE2 0%, #6B21A8 100%)',
                boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)'
              }}
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
              <div className="space-y-3">
                {stats.recentTransactions.slice(0, 5).map((transaction, index) => (
                  <motion.div
                    key={transaction._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div>
                      <p className="text-white font-bold text-sm">{transaction.description}</p>
                      <p className="text-gray-400 text-xs font-medium mt-1">{transaction.userId.username}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-lg ${transaction.transactionType === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.transactionType === 'credit' ? '+' : '-'}{transaction.amount}
                      </p>
                      <p className="text-gray-400 text-xs font-medium mt-1">{transaction.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
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
      `}</style>
    </div>
  );
};

export default Dashboard;