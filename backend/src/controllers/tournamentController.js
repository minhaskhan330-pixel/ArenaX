import Tournament from '../models/Tournament.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getAllTournaments = async (req, res) => {
  try {
    const { status, gameType, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (gameType) query.gameType = gameType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const tournaments = await Tournament.find(query)
      .populate('createdBy', 'username email')
      .populate('adminApprovedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Tournament.countDocuments(query);

    res.json({
      success: true,
      tournaments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('createdBy', 'username email phoneNumber')
      .populate('participants.userId', 'username email')
      .populate('adminApprovedBy', 'username');

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    res.json({ success: true, tournament });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTournamentStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    tournament.status = status;
    if (status === 'approved') {
      tournament.adminApprovedBy = req.user._id;
      tournament.adminApprovedAt = new Date();
    }
    if (status === 'rejected' && rejectionReason) {
      tournament.rejectionReason = rejectionReason;
    }

    await tournament.save();

    res.json({
      success: true,
      message: `Tournament ${status}`,
      tournament
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyParticipantResult = async (req, res) => {
  try {
    const { tournamentId, participantId, kills, finalRank, status: resultStatus } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    const participant = tournament.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    participant.kills = kills;
    participant.finalRank = finalRank;
    participant.status = resultStatus;

    if (resultStatus === 'verified') {
      const prizeForRank = tournament.prizeDistribution.find(p => p.rank === finalRank);
      if (prizeForRank) {
        participant.coinsWon = prizeForRank.coins;

        const user = await User.findById(participant.userId);
        if (user) {
          const balanceBefore = user.coinBalance;
          user.coinBalance += prizeForRank.coins;
          user.totalCoinsEarned += prizeForRank.coins;
          user.gameStats.totalWins += finalRank === 1 ? 1 : 0;
          user.gameStats.totalKills += kills;
          await user.save();

          await Transaction.create({
            userId: user._id,
            transactionType: 'credit',
            amount: prizeForRank.coins,
            balanceBefore,
            balanceAfter: user.coinBalance,
            category: 'tournament_win',
            description: `Prize for rank ${finalRank} in ${tournament.title}`,
            relatedTournament: tournament._id,
            processedBy: req.user._id,
            status: 'completed'
          });
        }
      }
    }

    await tournament.save();

    res.json({
      success: true,
      message: 'Participant result updated',
      tournament
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTournamentStats = async (req, res) => {
  try {
    const totalTournaments = await Tournament.countDocuments();
    const pendingApproval = await Tournament.countDocuments({ status: 'pending' });
    const liveTournaments = await Tournament.countDocuments({ status: 'live' });
    const completedTournaments = await Tournament.countDocuments({ status: 'completed' });

    const totalPrizePool = await Tournament.aggregate([
      { $match: { status: { $in: ['approved', 'live', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$prizePool' } } }
    ]);

    const totalEntryFees = await Tournament.aggregate([
      { $match: { status: { $in: ['live', 'completed'] } } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$entryFee', '$currentParticipants'] } } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalTournaments,
        pendingApproval,
        liveTournaments,
        completedTournaments,
        totalPrizePool: totalPrizePool[0]?.total || 0,
        totalEntryFees: totalEntryFees[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTournament = async (req, res) => {
  try {
    const {
      title,
      description,
      gameType,
      entryFee,
      prizePool,
      maxParticipants,
      prizeDistribution,
      scheduledDate,
      roomDetails,
      rules,
      bannerImage
    } = req.body;

    const tournament = await Tournament.create({
      title,
      description,
      gameType,
      createdBy: req.user._id,
      entryFee,
      prizePool,
      maxParticipants,
      prizeDistribution,
      scheduledDate,
      roomDetails,
      rules,
      bannerImage,
      status: 'approved'
    });

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      tournament
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    await tournament.deleteOne();

    res.json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
