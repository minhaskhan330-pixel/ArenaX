import React, { useEffect, useState } from 'react';
import { Bell, Plus, Send, Trash2, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationAPI } from '../services/api';

// Delete Modal Component
const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-md w-full rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(239, 68, 68, 0.2)'
          }}
        >
          <div 
            className="h-1"
            style={{
              background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 50%, #EF4444 100%)',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
            }}
          />
          
          <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white">Confirm Delete</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg transition-all"
              style={{
                background: 'rgba(156, 163, 175, 0.2)',
                border: '1px solid rgba(156, 163, 175, 0.3)',
                color: '#9CA3AF'
              }}
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="p-6 space-y-4">
            <div 
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
            >
              <p className="text-white font-bold text-lg mb-2">{title}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
            </div>

            <div className="flex space-x-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 py-3 rounded-xl font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
                }}
              >
                Delete
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-bold text-white transition-all"
                style={{
                  background: 'rgba(11, 11, 15, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<{ id: string; title: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    targetAudience: 'all',
    isScheduled: false,
    scheduledFor: ''
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await notificationAPI.create(formData);
      setShowModal(false);
      setFormData({
        title: '',
        message: '',
        type: 'announcement',
        targetAudience: 'all',
        isScheduled: false,
        scheduledFor: ''
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleSend = async (id: string) => {
    try {
      await notificationAPI.send(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setNotificationToDelete({ id, title });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (notificationToDelete) {
      try {
        await notificationAPI.delete(notificationToDelete.id);
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      } finally {
        setShowDeleteModal(false);
        setNotificationToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setNotificationToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return {
          bg: 'rgba(16, 185, 129, 0.2)',
          text: '#10B981',
          border: 'rgba(16, 185, 129, 0.3)',
          glow: 'rgba(16, 185, 129, 0.5)'
        };
      case 'scheduled':
        return {
          bg: 'rgba(251, 191, 36, 0.2)',
          text: '#FBBF24',
          border: 'rgba(251, 191, 36, 0.3)',
          glow: 'rgba(251, 191, 36, 0.5)'
        };
      default:
        return {
          bg: 'rgba(156, 163, 175, 0.2)',
          text: '#9CA3AF',
          border: 'rgba(156, 163, 175, 0.3)',
          glow: 'rgba(156, 163, 175, 0.5)'
        };
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
              Notifications
            </motion.h1>
            <p className="text-gray-400 font-medium">Broadcast messages to users</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center space-x-2"
            style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)'
            }}
          >
            <Plus size={20} />
            <span>Create Notification</span>
          </motion.button>
        </motion.div>

        {/* Notifications List */}
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
            <div className="space-y-4">
              <AnimatePresence>
                {notifications.map((notification, index) => {
                  const statusColors = getStatusColor(notification.status);
                  return (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="rounded-xl p-5 flex items-start justify-between"
                      style={{
                        background: 'rgba(11, 11, 15, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{
                              background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                              boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
                            }}
                          >
                            <Bell size={16} className="text-white" />
                          </div>
                          <h4 className="text-white font-bold text-lg">{notification.title}</h4>
                          <span 
                            className="px-3 py-1 rounded-lg text-xs font-bold"
                            style={{
                              backgroundColor: statusColors.bg,
                              color: statusColors.text,
                              border: `1px solid ${statusColors.border}`,
                              boxShadow: `0 0 10px ${statusColors.glow}`
                            }}
                          >
                            {notification.status}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3 leading-relaxed">{notification.message}</p>
                        <div className="flex items-center space-x-6 text-xs font-medium">
                          <span className="text-cyan-400">Type: {notification.type}</span>
                          <span className="text-purple-400">Audience: {notification.targetAudience}</span>
                          <span className="text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {notification.status === 'draft' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSend(notification._id)}
                            className="p-2 rounded-lg transition-all"
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              color: '#10B981'
                            }}
                            title="Send"
                          >
                            <Send size={18} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(notification._id, notification.title)}
                          className="p-2 rounded-lg transition-all"
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#EF4444'
                          }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Notification Modal */}
      <AnimatePresence>
        {showModal && (
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 229, 255, 0.15)'
              }}
            >
              <div 
                className="h-1"
                style={{
                  background: 'linear-gradient(90deg, #00E5FF 0%, #8A2BE2 50%, #00E5FF 100%)',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
                }}
              />
              
              <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Create Notification</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444'
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00E5FF'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none transition-all resize-none"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    rows={4}
                    onFocus={(e) => e.target.style.borderColor = '#00E5FF'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none transition-all"
                      style={{
                        background: 'rgba(11, 11, 15, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#00E5FF'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    >
                      <option value="announcement">Announcement</option>
                      <option value="tournament">Tournament</option>
                      <option value="reward">Reward</option>
                      <option value="system">System</option>
                      <option value="warning">Warning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2">Audience</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none transition-all"
                      style={{
                        background: 'rgba(11, 11, 15, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#00E5FF'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                    >
                      <option value="all">All Users</option>
                      <option value="players">Players Only</option>
                      <option value="organizers">Organizers Only</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    className="flex-1 py-3 rounded-xl font-bold text-white transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                      boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)'
                    }}
                  >
                    Create
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-white transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
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

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={notificationToDelete?.title || ''}
        message="Are you sure you want to delete this notification? This action cannot be undone."
      />

      <style>{`
        ::selection {
          background-color: rgba(0, 229, 255, 0.3);
          color: white;
        }

        ::-moz-selection {
          background-color: rgba(0, 229, 255, 0.3);
          color: white;
        }

        select option {
          background: #0B0B0F;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Notifications;