import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
  });
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register({ 
          username: registerData.username, 
          email: registerData.email, 
          password: registerData.password,
          fullName: registerData.fullName,
          phoneNumber: registerData.phoneNumber
        });
        navigate('/dashboard');
      } else {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0B0B0F 0%, #14141E 50%, #1A1A2E 100%)'
    }}>
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
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

        {/* Animated Gradient Orbs */}
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

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.1) 0%, transparent 70%)'
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
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div 
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 229, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Top Gradient Bar */}
            <div 
              className="h-1"
              style={{
                background: 'linear-gradient(90deg, #00E5FF 0%, #8A2BE2 50%, #00E5FF 100%)',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
              }}
            />

            {/* Animated Background Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
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

            <div className="relative p-8">
              {/* Logo Section - Text Only */}
              <motion.div 
                className="flex flex-col items-center mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative mb-2">
                  <motion.h1 
                    className="text-6xl font-black tracking-tight relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                      background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    ArenaX
                  </motion.h1>
                </div>
                
                <motion.p 
                  className="text-gray-400 text-center font-medium text-sm tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Admin Panel Login
                </motion.p>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {isRegister ? (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      {/* Username */}
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Username</label>
                        <div className="relative group">
                          <User 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" 
                            size={20} 
                          />
                          <input
                            type="text"
                            name="username"
                            value={registerData.username}
                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
                            placeholder="adminuser"
                            style={{
                              background: 'rgba(11, 11, 15, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)'
                            }}
                            onFocus={(e) => {
                              e.target.style.border = '1px solid rgba(0, 229, 255, 0.5)';
                              e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.05)';
                            }}
                            onBlur={(e) => {
                              e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Full Name</label>
                        <div className="relative group">
                          <User 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" 
                            size={20} 
                          />
                          <input
                            type="text"
                            name="fullName"
                            value={registerData.fullName}
                            onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
                            placeholder="John Doe"
                            style={{
                              background: 'rgba(11, 11, 15, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)'
                            }}
                            onFocus={(e) => {
                              e.target.style.border = '1px solid rgba(0, 229, 255, 0.5)';
                              e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.05)';
                            }}
                            onBlur={(e) => {
                              e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
                        <div className="relative group">
                          <Mail 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" 
                            size={20} 
                          />
                          <input
                            type="email"
                            name="email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
                            placeholder="admin@arenax.com"
                            style={{
                              background: 'rgba(11, 11, 15, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)'
                            }}
                            onFocus={(e) => {
                              e.target.style.border = '1px solid rgba(0, 229, 255, 0.5)';
                              e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.05)';
                            }}
                            onBlur={(e) => {
                              e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Phone Number</label>
                        <div className="relative group">
                          <Phone 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" 
                            size={20} 
                          />
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={registerData.phoneNumber}
                            onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
                            placeholder="+92 300 1234567"
                            style={{
                              background: 'rgba(11, 11, 15, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)'
                            }}
                            onFocus={(e) => {
                              e.target.style.border = '1px solid rgba(0, 229, 255, 0.5)';
                              e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.05)';
                            }}
                            onBlur={(e) => {
                              e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
                        <div className="relative group">
                          <Lock 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" 
                            size={20} 
                          />
                          <input
                            type="password"
                            name="password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            required
                            minLength={6}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
                            placeholder="••••••••"
                            style={{
                              background: 'rgba(11, 11, 15, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)'
                            }}
                            onFocus={(e) => {
                              e.target.style.border = '1px solid rgba(0, 229, 255, 0.5)';
                              e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.05)';
                            }}
                            onBlur={(e) => {
                              e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      {/* Email */}
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
                        <div className="relative group">
                          <Mail 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" 
                            size={20} 
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
                            placeholder="admin@arenax.com"
                            style={{
                              background: 'rgba(11, 11, 15, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)'
                            }}
                            onFocus={(e) => {
                              e.target.style.border = '1px solid rgba(0, 229, 255, 0.5)';
                              e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.05)';
                            }}
                            onBlur={(e) => {
                              e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
                        <div className="relative group">
                          <Lock 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" 
                            size={20} 
                          />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
                            placeholder="••••••••"
                            style={{
                              background: 'rgba(11, 11, 15, 0.6)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)'
                            }}
                            onFocus={(e) => {
                              e.target.style.border = '1px solid rgba(0, 229, 255, 0.5)';
                              e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.05)';
                            }}
                            onBlur={(e) => {
                              e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3.5 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                    boxShadow: '0 0 30px rgba(0, 229, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {isRegister ? 'Creating account...' : 'Authenticating...'}
                      </>
                    ) : isRegister ? (
                      'Create Account'
                    ) : (
                      'Sign In'
                    )}
                  </span>
                </motion.button>

                {/* Toggle Button */}
                <motion.button
                  type="button"
                  onClick={() => { setIsRegister(!isRegister); setError(''); }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full text-gray-400 hover:text-cyan-400 text-sm font-medium transition-colors"
                >
                  {isRegister ? 'Have an account? Sign in' : "Don't have an account? Register"}
                </motion.button>
              </form>
            </div>

            <div 
              className="h-1"
              style={{
                background: 'rgba(11, 11, 15, 0.5)',
                borderTop: '1px solid rgba(0, 229, 255, 0.1)'
              }}
            />
          </div>
        </motion.div>
      </div>

      <style>{`
        /* Custom Selection Color */
        ::selection {
          background-color: rgba(0, 229, 255, 0.3);
          color: white;
        }

        ::-moz-selection {
          background-color: rgba(0, 229, 255, 0.3);
          color: white;
        }

        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Login;