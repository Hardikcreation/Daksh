// routes/helpRoutes.js
import express from 'express';
import { submitHelpRequest } from '../controllers/helpController.js';

const router = express.Router();
router.post('/submit', submitHelpRequest);

export default router;
