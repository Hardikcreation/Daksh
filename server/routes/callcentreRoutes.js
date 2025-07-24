import express from 'express';
import {
  loginCallCentre,
  getAllQueries,
  updateQueryStatus
} from '../controllers/callCentreController.js';

const router = express.Router();

// Login for Call Centre
router.post('/login', loginCallCentre);

// Fetch All Support Queries
router.get('/queries', getAllQueries);

// Update Query Status (e.g., mark as solved)
router.patch('/queries/:id', updateQueryStatus);

export default router;
