import express from 'express';
import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournamentStatus,
  verifyParticipantResult,
  getTournamentStats,
  deleteTournament
} from '../controllers/tournamentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/', getAllTournaments);
router.post('/', createTournament);
router.get('/stats', getTournamentStats);
router.get('/:id', getTournamentById);
router.put('/:id/status', updateTournamentStatus);
router.post('/verify-result', verifyParticipantResult);
router.delete('/:id', deleteTournament);

export default router;
