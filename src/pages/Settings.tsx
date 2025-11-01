import React, { useEffect, useState } from 'react';
import { Save, DollarSign, CreditCard, Building2, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { settingsAPI } from '../services/api';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversionRate, setConversionRate] = useState('1');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getAll();
      setSettings(response.data.settings);
      const rateSetting = response.data.settings.find((s: any) => s.settingKey === 'coin_conversion_rate');
      if (rateSetting) setConversionRate(rateSetting.settingValue.toString());
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConversionRate = async () => {
    try {
      await settingsAPI.update('coin_conversion_rate', parseFloat(conversionRate), '1 AX Coin = PKR conversion rate');
      alert('Conversion rate updated successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error updating conversion rate:', error);
    }
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
            Settings
          </motion.h1>
          <p className="text-gray-400 font-medium">Configure platform settings</p>
        </motion.div>

        {/* Economy Settings */}
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
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="p-2 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
                }}
              >
                <DollarSign size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white">Economy Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-3">
                  Coin Conversion Rate (1 AX Coin = ? PKR)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <div 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)'
                      }}
                    >
                      <DollarSign className="text-white" size={18} />
                    </div>
                    <input
                      type="number"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(e.target.value)}
                      className="w-full pl-16 pr-4 py-4 rounded-xl text-white font-bold focus:outline-none transition-all"
                      style={{
                        background: 'rgba(11, 11, 15, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                      placeholder="1.0"
                      step="0.1"
                      onFocus={(e) => e.target.style.borderColor = '#00E5FF'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveConversionRate}
                    className="px-6 py-4 rounded-xl font-bold text-white transition-all flex items-center space-x-2"
                    style={{
                      background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                      boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)'
                    }}
                  >
                    <Save size={20} />
                    <span>Save</span>
                  </motion.button>
                </div>
                <motion.p 
                  className="text-sm mt-3 px-4 py-2 rounded-lg inline-block font-medium"
                  style={{
                    background: 'rgba(0, 229, 255, 0.1)',
                    color: '#00E5FF',
                    border: '1px solid rgba(0, 229, 255, 0.2)'
                  }}
                >
                  Current rate: 1 AX Coin = {conversionRate} PKR
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Gateway Settings */}
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
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="p-2 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #8A2BE2 0%, #00E5FF 100%)',
                  boxShadow: '0 0 20px rgba(138, 43, 226, 0.3)'
                }}
              >
                <CreditCard size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white">Payment Gateway Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl p-6 relative overflow-hidden"
                style={{
                  background: 'rgba(11, 11, 15, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                  }}
                />
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Smartphone size={20} className="text-green-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg">JazzCash</h4>
                </div>
                <p className="text-gray-400 text-sm mb-4">Configure JazzCash payment integration</p>
                <div className="mt-3">
                  <span 
                    className="px-3 py-1.5 rounded-lg text-xs font-bold inline-block"
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Active
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl p-6 relative overflow-hidden"
                style={{
                  background: 'rgba(11, 11, 15, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                  }}
                />
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Smartphone size={20} className="text-green-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg">Easypaisa</h4>
                </div>
                <p className="text-gray-400 text-sm mb-4">Configure Easypaisa payment integration</p>
                <div className="mt-3">
                  <span 
                    className="px-3 py-1.5 rounded-lg text-xs font-bold inline-block"
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Active
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl p-6 relative overflow-hidden"
                style={{
                  background: 'rgba(11, 11, 15, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                  }}
                />
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Building2 size={20} className="text-green-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg">Bank Transfer</h4>
                </div>
                <p className="text-gray-400 text-sm mb-4">Configure bank transfer details</p>
                <div className="mt-3">
                  <span 
                    className="px-3 py-1.5 rounded-lg text-xs font-bold inline-block"
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Active
                  </span>
                </div>
              </motion.div>
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

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default Settings;