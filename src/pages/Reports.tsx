import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { transactionAPI } from '../services/api';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const Reports: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      const response = await transactionAPI.getStats(period);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare pie chart data from daily transactions
  const preparePieData = () => {
    if (!stats || !stats.dailyTransactions) return null;

    const totalCredited = stats.dailyTransactions.reduce((sum: number, item: any) => sum + (item.credited || 0), 0);
    const totalDebited = stats.dailyTransactions.reduce((sum: number, item: any) => sum + (item.debited || 0), 0);

    return {
      labels: ['Credited', 'Debited'],
      datasets: [
        {
          label: 'Transaction Flow',
          data: [totalCredited, totalDebited],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 2,
          hoverOffset: 15,
        },
      ],
    };
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9CA3AF',
          padding: 20,
          font: {
            size: 14,
            weight: '600' as const,
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
            return `${label}: ${value.toLocaleString()} AX Coins (${percentage}%)`;
          }
        }
      },
    },
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

  const pieData = preparePieData();

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
          className="flex items-center justify-between"
        >
          <div>
            <motion.h1 
              className="text-5xl font-black tracking-tight mb-2"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Reports & Analytics
            </motion.h1>
            <p className="text-gray-400 font-medium">Financial reports and platform insights</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center space-x-2"
            style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)'
            }}
          >
            <Download size={20} />
            <span>Export Report</span>
          </motion.button>
        </motion.div>

        {/* Period Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex space-x-4"
        >
          {['day', 'week', 'month', 'year'].map((p) => (
            <motion.button
              key={p}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                period === p
                  ? 'text-white'
                  : 'text-gray-400'
              }`}
              style={
                period === p
                  ? {
                      background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                      boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
                    }
                  : {
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)'
                    }
              }
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-2xl overflow-hidden relative p-6"
                style={{
                  background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                  }}
                />
                <p className="text-gray-400 text-sm mb-2 font-medium">Total Credited</p>
                <p className="text-4xl font-black text-green-400 mb-1">{stats.totalCredited.toLocaleString()}</p>
                <p className="text-gray-500 text-sm font-medium">AX Coins</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="rounded-2xl overflow-hidden relative p-6"
                style={{
                  background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                  }}
                />
                <p className="text-gray-400 text-sm mb-2 font-medium">Total Debited</p>
                <p className="text-4xl font-black text-red-400 mb-1">{stats.totalDebited.toLocaleString()}</p>
                <p className="text-gray-500 text-sm font-medium">AX Coins</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="rounded-2xl overflow-hidden relative p-6"
                style={{
                  background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${stats.netFlow >= 0 ? 'rgba(0, 229, 255, 0.2)' : 'rgba(251, 146, 60, 0.2)'}`,
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px ${stats.netFlow >= 0 ? 'rgba(0, 229, 255, 0.15)' : 'rgba(251, 146, 60, 0.15)'}, inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: stats.netFlow >= 0 
                      ? 'linear-gradient(90deg, #00E5FF 0%, #0095FF 100%)'
                      : 'linear-gradient(90deg, #FB923C 0%, #F97316 100%)',
                    boxShadow: `0 0 20px ${stats.netFlow >= 0 ? 'rgba(0, 229, 255, 0.5)' : 'rgba(251, 146, 60, 0.5)'}`
                  }}
                />
                <p className="text-gray-400 text-sm mb-2 font-medium">Net Flow</p>
                <p className={`text-4xl font-black mb-1 ${stats.netFlow >= 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
                  {stats.netFlow.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm font-medium">AX Coins</p>
              </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
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
                  <h3 className="text-xl font-bold text-white mb-6">Transaction Distribution</h3>
                  <div className="flex items-center justify-center" style={{ height: '350px' }}>
                    {pieData && <Pie data={pieData} options={pieOptions} />}
                  </div>
                </div>
              </motion.div>

              {/* Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
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
                  <h3 className="text-xl font-bold text-white mb-6">Daily Transaction Flow</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={stats.dailyTransactions}>
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
                      <Legend />
                      <Bar dataKey="credited" fill="#10B981" radius={[8, 8, 0, 0]} name="Credited" />
                      <Bar dataKey="debited" fill="#EF4444" radius={[8, 8, 0, 0]} name="Debited" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </>
        )}
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

export default Reports;