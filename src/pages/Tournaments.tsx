import React, { useEffect, useState } from 'react';
import { Trophy, Search, Eye, CheckCircle, XCircle, Trash2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tournamentAPI } from '../services/api';
import {  Tournament, PrizeDistribution } from '../types';
import CreateTournamentModal from '../components/CreateTournamentModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Tournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, [statusFilter]);

  const fetchTournaments = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const response = await tournamentAPI.getAll(params);
      setTournaments(response.data.tournaments);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (tournamentId: string, status: string, rejectionReason?: string) => {
    try {
      await tournamentAPI.updateStatus(tournamentId, status, rejectionReason);
      fetchTournaments();
      setShowDetailsModal(false);
      setSelectedTournament(null);
    } catch (error) {
      console.error('Error updating tournament status:', error);
    }
  };

  const handleDelete = async () => {
    if (!tournamentToDelete) return;

    try {
      await tournamentAPI.delete(tournamentToDelete._id);
      fetchTournaments();
      setShowDeleteModal(false);
      setTournamentToDelete(null);
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  const handleCreateTournament = async (data: Tournament) => {
    try {
      await tournamentAPI.create(data);
      fetchTournaments();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  };

  const openDeleteModal = (tournament: Tournament) => {
    setTournamentToDelete(tournament);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; glow: string }> = {
      pending: { bg: 'rgba(251, 191, 36, 0.2)', text: '#FBBF24', glow: 'rgba(251, 191, 36, 0.5)' },
      approved: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10B981', glow: 'rgba(16, 185, 129, 0.5)' },
      live: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6', glow: 'rgba(59, 130, 246, 0.5)' },
      completed: { bg: 'rgba(156, 163, 175, 0.2)', text: '#9CA3AF', glow: 'rgba(156, 163, 175, 0.5)' },
      cancelled: { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)' },
      rejected: { bg: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)' },
    };

    const badge = badges[status] || badges.pending;
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

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px'
        }}
      />

      <div className="relative p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <motion.h1
                className="text-5xl font-black tracking-tight mb-2"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Tournament Management
              </motion.h1>
              <p className="text-gray-400 font-medium">Manage and approve tournaments</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #8A2BE2 100%)',
                boxShadow: '0 0 30px rgba(0, 229, 255, 0.4)',
              }}
            >
              <Plus size={20} />
              <span>Create Tournament</span>
            </motion.button>
          </div>
        </motion.div>

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
                  placeholder="Search tournaments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchTournaments()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(11, 11, 15, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl text-white focus:outline-none transition-all"
                style={{
                  background: 'rgba(11, 11, 15, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </motion.div>

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
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Tournament</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Entry Fee</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Prize Pool</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Participants</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Status</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-bold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {tournaments.map((tournament, index) => (
                    <motion.tr
                      key={tournament._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="transition-all"
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-bold">{tournament.title}</p>
                          <p className="text-gray-400 text-sm font-medium">{tournament.gameType}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-cyan-400 font-black text-lg">{tournament.entryFee} AX</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-green-400 font-black text-lg">{tournament.prizePool} AX</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-white font-bold">{tournament.currentParticipants}/{tournament.maxParticipants}</p>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(tournament.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedTournament(tournament);
                              setShowDetailsModal(true);
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
                          {tournament.status === 'pending' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusUpdate(tournament._id, 'approved')}
                                className="p-2 rounded-lg transition-all"
                                style={{
                                  background: 'rgba(16, 185, 129, 0.2)',
                                  color: '#10B981',
                                  border: '1px solid rgba(16, 185, 129, 0.4)'
                                }}
                                title="Approve"
                              >
                                <CheckCircle size={18} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  const reason = prompt('Enter rejection reason:');
                                  if (reason) handleStatusUpdate(tournament._id, 'rejected', reason);
                                }}
                                className="p-2 rounded-lg transition-all"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  color: '#EF4444',
                                  border: '1px solid rgba(239, 68, 68, 0.4)'
                                }}
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openDeleteModal(tournament)}
                            className="p-2 rounded-lg transition-all"
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#EF4444',
                              border: '1px solid rgba(239, 68, 68, 0.4)'
                            }}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </motion.button>
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

      <AnimatePresence>
        {showDetailsModal && selectedTournament && (
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
                  Tournament Details
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(11, 11, 15, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <p className="text-gray-400 text-sm font-medium mb-1">Title</p>
                  <p className="text-white font-bold text-lg">{selectedTournament.title}</p>
                </div>

                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(11, 11, 15, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <p className="text-gray-400 text-sm font-medium mb-1">Description</p>
                  <p className="text-white">{selectedTournament.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Game Type</p>
                    <p className="text-white font-bold text-lg">{selectedTournament.gameType}</p>
                  </div>

                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Status</p>
                    <div className="mt-2">{getStatusBadge(selectedTournament.status)}</div>
                  </div>

                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Entry Fee</p>
                    <p className="text-cyan-400 font-black text-xl">{selectedTournament.entryFee} AX</p>
                  </div>

                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Prize Pool</p>
                    <p className="text-green-400 font-black text-xl">{selectedTournament.prizePool} AX</p>
                  </div>

                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Participants</p>
                    <p className="text-white font-black text-xl">{selectedTournament.currentParticipants}/{selectedTournament.maxParticipants}</p>
                  </div>

                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(11, 11, 15, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <p className="text-gray-400 text-sm font-medium mb-1">Scheduled Date</p>
                    <p className="text-white font-bold">{new Date(selectedTournament.scheduledDate).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateTournamentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTournament}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        tournament={tournamentToDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setTournamentToDelete(null);
        }}
        onConfirm={handleDelete}
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

export default Tournaments;
