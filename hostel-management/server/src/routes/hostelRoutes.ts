import express from 'express';
import * as hostelController from '../controllers/hostelController';
import { authenticateJWT, isWarden, isChiefWarden, isHostelWarden } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

// Specific routes need to come before parametric routes
router.get('/warden', authenticateJWT, isWarden, catchAsync(hostelController.getWardenHostel));

// Routes for chief warden to manage all hostels
router.get('/all', authenticateJWT, isChiefWarden, catchAsync(hostelController.getAllHostels));

// Public route for getting hostel details
router.get('/:hostelType/:hostelId', catchAsync(hostelController.getHostelDetails));

// Protected routes for hostel management
router.put('/:hostelId', authenticateJWT, isHostelWarden, upload.single('wardenPhoto'), catchAsync(hostelController.updateHostelDetails));

// Staff management
router.get('/:hostelId/staff', authenticateJWT, isHostelWarden, catchAsync(hostelController.getStaffMembers));
router.post('/:hostelId/staff', authenticateJWT, isHostelWarden, upload.single('photo'), catchAsync(hostelController.addStaffMember));
router.put('/:hostelId/staff/:staffId', authenticateJWT, isHostelWarden, upload.single('photo'), catchAsync(hostelController.updateStaffMember));
router.delete('/:hostelId/staff/:staffId', authenticateJWT, isHostelWarden, catchAsync(hostelController.deleteStaffMember));

// Facilities management
router.get('/:hostelId/facilities', authenticateJWT, isHostelWarden, catchAsync(hostelController.getFacilities));
router.post('/:hostelId/facilities', authenticateJWT, isHostelWarden, catchAsync(hostelController.addFacility));
router.put('/:hostelId/facilities/:facilityId', authenticateJWT, isHostelWarden, catchAsync(hostelController.updateFacility));
router.delete('/:hostelId/facilities/:facilityId', authenticateJWT, isHostelWarden, catchAsync(hostelController.deleteFacility));

// Slider images
router.get('/:hostelId/slider', catchAsync(hostelController.getHostelSliderImages));
router.post('/:hostelId/slider', authenticateJWT, isHostelWarden, upload.single('image'), catchAsync(hostelController.addHostelSliderImage));
router.delete('/:hostelId/slider/:imageId', authenticateJWT, isHostelWarden, catchAsync(hostelController.deleteHostelSliderImage));

// Mess menu
router.get('/:hostelId/mess-menu', catchAsync(hostelController.getHostelMessMenu));
router.put('/:hostelId/mess-menu', authenticateJWT, isHostelWarden, catchAsync(hostelController.updateHostelMessMenu));

// Mess images
router.get('/:hostelId/mess-images', catchAsync(hostelController.getHostelMessImages));
router.post('/:hostelId/mess-images', authenticateJWT, isHostelWarden, upload.single('image'), catchAsync(hostelController.addHostelMessImage));
router.delete('/:hostelId/mess-images/:imageId', authenticateJWT, isHostelWarden, catchAsync(hostelController.deleteHostelMessImage));

// Gallery images
router.get('/:hostelId/gallery', catchAsync(hostelController.getHostelGalleryImages));
router.post('/:hostelId/gallery', authenticateJWT, isHostelWarden, upload.single('image'), catchAsync(hostelController.addHostelGalleryImage));
router.delete('/:hostelId/gallery/:imageId', authenticateJWT, isHostelWarden, catchAsync(hostelController.deleteHostelGalleryImage));

export default router; 