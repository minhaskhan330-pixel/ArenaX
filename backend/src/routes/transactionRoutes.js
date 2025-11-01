import express from 'express';
import {
  getAllTransactions,
  getTransactionStats,
  getWalletOverview
} from '../controllers/transactionController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/', getAllTransactions);
router.get('/stats', getTransactionStats);
router.get('/wallet/overview', getWalletOverview);

export default router;
