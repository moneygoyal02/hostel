import express from 'express';
import { login, register, getProfile } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/profile
router.get('/profile', protect, getProfile);

export default router;
