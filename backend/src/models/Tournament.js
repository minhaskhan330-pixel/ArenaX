import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: String,
  kills: { type: Number, default: 0 },
  finalRank: { type: Number, default: 0 },
  screenshot: String,
  coinsWon: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
});

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    required: true,
    enum: ['Free Fire', 'PUBG Mobile', 'Call of Duty Mobile', 'Valorant', 'Other']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entryFee: {
    type: Number,
    required: true,
    min: 0
  },
  prizePool: {
    type: Number,
    required: true,
    min: 0
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 2
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  participants: [participantSchema],
  prizeDistribution: [{
    rank: Number,
    coins: Number,
    percentage: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'live', 'completed', 'cancelled', 'rejected'],
    default: 'approved'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  actualStartTime: Date,
  actualEndTime: Date,
  roomDetails: {
    roomId: String,
    roomPassword: String
  },
  rules: {
    type: String,
    default: ''
  },
  bannerImage: String,
  rejectionReason: String,
  adminApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminApprovedAt: Date
}, {
  timestamps: true
});

tournamentSchema.index({ status: 1, scheduledDate: 1 });
tournamentSchema.index({ createdBy: 1 });

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;
