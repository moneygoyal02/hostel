import express from 'express';
import {
  getSliderImages,
  getSliderImageById,
  createSliderImage,
  updateSliderImage,
  deleteSliderImage
} from '../controllers/sliderController';
import { protect, chiefWardenOnly } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getSliderImages);
router.get('/:id', getSliderImageById);

// Protected routes (admin only)
router.post('/', protect, chiefWardenOnly, createSliderImage);
router.put('/:id', protect, chiefWardenOnly, updateSliderImage);
router.delete('/:id', protect, chiefWardenOnly, deleteSliderImage);

export default router; 