import express from 'express';
import { login, register, getProfile, getWardens } from '../controllers/authController';
import { authenticateJWT, isChiefWarden } from '../middleware/auth';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/profile
router.get('/profile', authenticateJWT, catchAsync(getProfile));

// @route   GET /api/auth/wardens
router.get('/wardens', authenticateJWT, isChiefWarden, catchAsync(getWardens));

export default router;
