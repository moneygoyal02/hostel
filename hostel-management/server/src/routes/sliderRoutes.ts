import express from 'express';
import { authenticateJWT, isChiefWarden } from '../middleware/auth';
import * as sliderController from '../controllers/sliderController';
import { upload } from '../middleware/upload';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

// Public routes to get slider images
router.get('/', catchAsync(sliderController.getSliderImages));

// Protected routes for chief warden only
router.post('/', authenticateJWT, isChiefWarden, upload.single('image'), catchAsync(sliderController.createSliderImage));
router.put('/:id', authenticateJWT, isChiefWarden, upload.single('image'), catchAsync(sliderController.updateSliderImage));
router.delete('/:id', authenticateJWT, isChiefWarden, catchAsync(sliderController.deleteSliderImage));
router.put('/reorder', authenticateJWT, isChiefWarden, catchAsync(sliderController.reorderSliderImages));

export default router; 