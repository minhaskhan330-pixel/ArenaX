import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  blue: {
    gradient: 'linear-gradient(135deg, #00E5FF 0%, #0095FF 100%)',
    glow: 'rgba(0, 229, 255, 0.4)',
    border: 'rgba(0, 229, 255, 0.3)',
    bg: 'rgba(0, 229, 255, 0.05)'
  },
  green: {
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    glow: 'rgba(16, 185, 129, 0.4)',
    border: 'rgba(16, 185, 129, 0.3)',
    bg: 'rgba(16, 185, 129, 0.05)'
  },
  purple: {
    gradient: 'linear-gradient(135deg, #8A2BE2 0%, #6B21A8 100%)',
    glow: 'rgba(138, 43, 226, 0.4)',
    border: 'rgba(138, 43, 226, 0.3)',
    bg: 'rgba(138, 43, 226, 0.05)'
  },
  orange: {
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    glow: 'rgba(249, 115, 22, 0.4)',
    border: 'rgba(249, 115, 22, 0.3)',
    bg: 'rgba(249, 115, 22, 0.05)'
  },
  red: {
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    glow: 'rgba(239, 68, 68, 0.4)',
    border: 'rgba(239, 68, 68, 0.3)',
    bg: 'rgba(239, 68, 68, 0.05)'
  },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color }) => {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-2xl overflow-hidden relative group"
      style={{
        background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${colors.border}`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px ${colors.glow}15, inset 0 1px 0 rgba(255, 255, 255, 0.05)`
      }}
    >
      {/* Top Gradient Bar */}
      <div 
        className="h-1"
        style={{
          background: colors.gradient,
          boxShadow: `0 0 20px ${colors.glow}`
        }}
      />

      {/* Animated Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, ${colors.bg} 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 50%, ${colors.bg} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 50%, ${colors.bg} 0%, transparent 50%)`,
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-semibold mb-3 tracking-wide uppercase">{title}</p>
            <p className="text-4xl font-black text-white mb-2 tracking-tight">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-bold ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            )}
          </div>
          
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg"
            style={{
              background: colors.gradient,
              boxShadow: `0 0 30px ${colors.glow}, inset 0 0 20px rgba(255, 255, 255, 0.1)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Icon className="text-white relative z-10" size={32} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>

      {/* Bottom subtle accent */}
      <div 
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${colors.border} 50%, transparent 100%)`,
          opacity: 0.5
        }}
      />
    </motion.div>
  );
};

export default StatCard;