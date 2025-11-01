import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { Tournament, PrizeDistribution } from '../types';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Tournament) => Promise<void>;
}

const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Tournament>({
    title: '',
    description: '',
    gameType: 'Free Fire',
    entryFee: 0,
    prizePool: 0,
    maxParticipants: 0,
    prizeDistribution: [{ rank: 1, coins: 0, percentage: 0 }],
    scheduledDate: '',
    roomDetails: {
      roomId: '',
      roomPassword: '',
    },
    rules: '',
    bannerImage: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'entryFee' || name === 'prizePool' || name === 'maxParticipants'
        ? Number(value)
        : value,
    }));
  };

  const handleRoomDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      roomDetails: {
        ...prev.roomDetails,
        [name]: value,
      },
    }));
  };

  const addPrizeDistribution = () => {
    setFormData((prev) => ({
      ...prev,
      prizeDistribution: [
        ...prev.prizeDistribution,
        { rank: prev.prizeDistribution.length + 1, coins: 0, percentage: 0 },
      ],
    }));
  };

  const removePrizeDistribution = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prizeDistribution: prev.prizeDistribution.filter((_, i) => i !== index),
    }));
  };

  const updatePrizeDistribution = (index: number, field: keyof PrizeDistribution, value: number) => {
    setFormData((prev) => ({
      ...prev,
      prizeDistribution: prev.prizeDistribution.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        gameType: 'Free Fire',
        entryFee: 0,
        prizePool: 0,
        maxParticipants: 0,
        prizeDistribution: [{ rank: 1, coins: 0, percentage: 0 }],
        scheduledDate: '',
        roomDetails: {
          roomId: '',
          roomPassword: '',
        },
        rules: '',
        bannerImage: '',
      });
    } catch (error) {
      console.error('Error creating tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 80px rgba(0, 229, 255, 0.2)',
            }}
          >
            <div
              className="sticky top-0 p-6 flex items-center justify-between z-10"
              style={{
                background: 'linear-gradient(180deg, rgba(11, 11, 15, 0.98) 0%, rgba(20, 20, 30, 0.95) 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                className="text-3xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Create Tournament
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <X size={24} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm font-medium mb-2 block">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium mb-2 block">Game Type</label>
                  <select
                    name="gameType"
                    value={formData.gameType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <option value="Free Fire">Free Fire</option>
                    <option value="PUBG Mobile">PUBG Mobile</option>
                    <option value="Call of Duty Mobile">Call of Duty Mobile</option>
                    <option value="Valorant">Valorant</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all resize-none"
                  style={{
                    background: 'rgba(11, 11, 15, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-gray-400 text-sm font-medium mb-2 block">Entry Fee (AX)</label>
                  <input
                    type="number"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium mb-2 block">Prize Pool (AX)</label>
                  <input
                    type="number"
                    name="prizePool"
                    value={formData.prizePool}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium mb-2 block">Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    required
                    min="2"
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                  style={{
                    background: 'rgba(11, 11, 15, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm font-medium mb-2 block">Room ID</label>
                  <input
                    type="text"
                    name="roomId"
                    value={formData.roomDetails.roomId}
                    onChange={handleRoomDetailsChange}
                    required
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium mb-2 block">Room Password</label>
                  <input
                    type="text"
                    name="roomPassword"
                    value={formData.roomDetails.roomPassword}
                    onChange={handleRoomDetailsChange}
                    required
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Rules</label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all resize-none"
                  style={{
                    background: 'rgba(11, 11, 15, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Banner Image URL (Optional)</label>
                <input
                  type="url"
                  name="bannerImage"
                  value={formData.bannerImage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                  style={{
                    background: 'rgba(11, 11, 15, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <div
                className="p-6 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-black text-xl">Prize Distribution</h4>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addPrizeDistribution}
                    className="px-4 py-2 rounded-lg font-bold flex items-center space-x-2"
                    style={{
                      background: 'rgba(0, 229, 255, 0.2)',
                      color: '#00E5FF',
                      border: '1px solid rgba(0, 229, 255, 0.4)',
                    }}
                  >
                    <Plus size={16} />
                    <span>Add Rank</span>
                  </motion.button>
                </div>

                <div className="space-y-3">
                  {formData.prizeDistribution.map((prize, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-3 items-center p-4 rounded-lg"
                      style={{
                        background: 'rgba(11, 11, 15, 0.6)',
                      }}
                    >
                      <div>
                        <label className="text-gray-400 text-xs font-medium mb-1 block">Rank</label>
                        <input
                          type="number"
                          value={prize.rank}
                          onChange={(e) => updatePrizeDistribution(index, 'rank', Number(e.target.value))}
                          required
                          min="1"
                          className="w-full px-3 py-2 rounded-lg text-white focus:outline-none"
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs font-medium mb-1 block">Coins</label>
                        <input
                          type="number"
                          value={prize.coins}
                          onChange={(e) => updatePrizeDistribution(index, 'coins', Number(e.target.value))}
                          required
                          min="0"
                          className="w-full px-3 py-2 rounded-lg text-white focus:outline-none"
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-xs font-medium mb-1 block">Percentage</label>
                        <input
                          type="number"
                          value={prize.percentage}
                          onChange={(e) => updatePrizeDistribution(index, 'percentage', Number(e.target.value))}
                          required
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-full px-3 py-2 rounded-lg text-white focus:outline-none"
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        />
                      </div>

                      <div className="flex justify-center">
                        {formData.prizeDistribution.length > 1 && (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removePrizeDistribution(index)}
                            className="p-2 rounded-lg"
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#EF4444',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                            }}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-bold"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-bold"
                  style={{
                    background: loading
                      ? 'rgba(156, 163, 175, 0.5)'
                      : 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                    boxShadow: loading ? 'none' : '0 0 30px rgba(0, 229, 255, 0.4)',
                  }}
                >
                  {loading ? 'Creating...' : 'Create Tournament'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTournamentModal;
