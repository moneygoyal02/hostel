import { Request, Response } from 'express';
import Hostel from '../models/Hostel';
import { CustomRequest } from '../middleware/auth';
import mongoose from 'mongoose';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import User from '../models/User';

// Get hostel details by type and id
export const getHostelDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hostelType, hostelId } = req.params;
    
    console.log(`Looking for hostel with type: ${hostelType}, code: ${hostelId}`);
    
    // First try to find by code
    let hostel = await Hostel.findOne({ code: hostelId });
    
    // If not found by code, try to find by _id
    if (!hostel) {
      try {
        // Check if hostelId is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(hostelId)) {
          hostel = await Hostel.findById(hostelId);
        }
      } catch (error) {
        console.error('Error finding hostel by ID:', error);
      }
    }
    
    if (!hostel) {
      console.log('Hostel not found');
      res.status(404).json({ message: 'Hostel not found' });
      return;
    }
    
    console.log(`Found hostel: ${hostel.name}`);
    res.status(200).json({ hostel });
  } catch (error) {
    console.error('Error fetching hostel details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all hostels (for admin/chief warden)
export const getAllHostels = async (req: Request, res: Response): Promise<void> => {
  try {
    const hostels = await Hostel.find().select('name code type wardenName');
    res.status(200).json({ hostels });
  } catch (error) {
    console.error('Error fetching all hostels:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update hostel details
export const updateHostelDetails = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.id;
    
    // Verify if the user is the warden of this hostel
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      res.status(404).json({ message: 'Hostel not found' });
      return;
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
      return;
    }
    
    // Fields that can be updated
    const updateableFields = [
      'name', 'about', 'wardenName', 'wardenMessage', 'wardenEmail'
    ];
    
    const updateData: any = {};
    
    // Add only valid fields to the update data
    updateableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    // Handle warden photo upload if provided
    if (req.file) {
      // Delete existing photo if there is one
      if (hostel.wardenPhoto) {
        const publicId = hostel.wardenPhoto.split('/').pop()?.split('.')[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
      
      // Upload new photo
      const uploadResult = await uploadToCloudinary(req.file.path, 'hostel-wardens');
      updateData.wardenPhoto = uploadResult.secure_url;
    }
    
    // Update hostel
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      { $set: updateData },
      { new: true }
    );
    
    res.status(200).json({ 
      message: 'Hostel details updated successfully',
      hostel: updatedHostel 
    });
  } catch (error) {
    console.error('Error updating hostel details:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add staff member
export const addStaffMember = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      res.status(404).json({ message: 'Hostel not found' });
      return;
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
      return;
    }
    
    const { name, role, email, phone } = req.body;
    
    if (!name || !role) {
      res.status(400).json({ message: 'Name and role are required' });
      return;
    }
    
    const staffMember: any = {
      name,
      role,
      email,
      phone
    };
    
    // Handle staff photo upload if provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, 'hostel-staff');
      staffMember.photo = uploadResult.secure_url;
    }
    
    // Add staff member
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      { $push: { staff: staffMember } },
      { new: true }
    );
    
    res.status(201).json({
      message: 'Staff member added successfully',
      hostel: updatedHostel
    });
  } catch (error) {
    console.error('Error adding staff member:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update staff member
export const updateStaffMember = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId, staffId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    // Find the staff member
    const staffMember = hostel.staff.id(staffId);
    
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Update fields if provided
    if (req.body.name) staffMember.name = req.body.name;
    if (req.body.role) staffMember.role = req.body.role;
    if (req.body.email) staffMember.email = req.body.email;
    if (req.body.phone) staffMember.phone = req.body.phone;
    
    // Handle photo upload if provided
    if (req.file) {
      // Delete existing photo if there is one
      if (staffMember.photo) {
        const publicId = staffMember.photo.split('/').pop()?.split('.')[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
      
      const uploadResult = await uploadToCloudinary(req.file.path, 'hostel-staff');
      staffMember.photo = uploadResult.secure_url;
    }
    
    await hostel.save();
    
    res.status(200).json({
      message: 'Staff member updated successfully',
      hostel
    });
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete staff member
export const deleteStaffMember = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId, staffId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    // Find the staff member
    const staffMember = hostel.staff.id(staffId);
    
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Delete photo from Cloudinary if exists
    if (staffMember.photo) {
      const publicId = staffMember.photo.split('/').pop()?.split('.')[0];
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }
    
    // Remove the staff member
    hostel.staff.pull({ _id: staffId });
    await hostel.save();
    
    res.status(200).json({
      message: 'Staff member deleted successfully',
      hostel
    });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Facility Management
export const addFacility = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    const { name, description, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Facility name is required' });
    }
    
    // Add facility
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      { $push: { facilities: { name, description, icon } } },
      { new: true }
    );
    
    res.status(201).json({
      message: 'Facility added successfully',
      hostel: updatedHostel
    });
  } catch (error) {
    console.error('Error adding facility:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update facility
export const updateFacility = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId, facilityId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    // Find the facility
    const facility = hostel.facilities.id(facilityId);
    
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    
    // Update fields if provided
    if (req.body.name) facility.name = req.body.name;
    if (req.body.description) facility.description = req.body.description;
    if (req.body.icon) facility.icon = req.body.icon;
    
    await hostel.save();
    
    res.status(200).json({
      message: 'Facility updated successfully',
      hostel
    });
  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete facility
export const deleteFacility = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId, facilityId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    // Find the facility
    const facility = hostel.facilities.id(facilityId);
    
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    
    // Remove the facility
    hostel.facilities.pull({ _id: facilityId });
    await hostel.save();
    
    res.status(200).json({
      message: 'Facility deleted successfully',
      hostel
    });
  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Image Management
// Get hostel slider images
export const getHostelSliderImages = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    res.status(200).json({ 
      images: hostel.sliderImages.sort((a, b) => a.order - b.order) 
    });
  } catch (error) {
    console.error('Error fetching hostel slider images:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add hostel slider image
export const addHostelSliderImage = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.id;
    
    console.log(`Adding slider image to hostel: ${hostelId}`);
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      console.log(`Hostel not found with ID: ${hostelId}`);
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      console.log(`User ${userId} is not the warden of hostel ${hostelId}`);
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    if (!req.file) {
      console.log('No image file provided');
      return res.status(400).json({ message: 'No image provided' });
    }
    
    console.log(`File received: ${req.file.originalname}, path: ${req.file.path}`);
    
    const { caption, order } = req.body;
    
    // Upload image to Cloudinary
    console.log('Uploading to Cloudinary...');
    const uploadResult = await uploadToCloudinary(req.file.path, 'hostel-sliders');
    console.log(`Upload successful: ${uploadResult.secure_url}`);
    
    // Add image to hostel
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      { 
        $push: { 
          sliderImages: {
            url: uploadResult.secure_url,
            caption,
            order: order || hostel.sliderImages.length,
            publicId: uploadResult.public_id
          } 
        } 
      },
      { new: true }
    );
    
    console.log('Slider image added successfully');
    res.status(201).json({
      message: 'Slider image added successfully',
      hostel: updatedHostel
    });
  } catch (error) {
    console.error('Error adding slider image:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete hostel slider image
export const deleteHostelSliderImage = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId, imageId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    // Find the image
    const image = hostel.sliderImages.id(imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      await deleteFromCloudinary(image.publicId);
    }
    
    // Remove the image
    hostel.sliderImages.pull({ _id: imageId });
    await hostel.save();
    
    res.status(200).json({
      message: 'Slider image deleted successfully',
      hostel
    });
  } catch (error) {
    console.error('Error deleting slider image:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mess Menu Management
// Get hostel mess menu
export const getHostelMessMenu = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Sort mess menu by day
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedMenu = [...hostel.messMenu].sort((a, b) => 
      daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
    );
    
    res.status(200).json({ messMenu: sortedMenu });
  } catch (error) {
    console.error('Error fetching hostel mess menu:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update hostel mess menu
export const updateHostelMessMenu = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    const { day, breakfast, lunch, snacks, dinner } = req.body;
    
    if (!day || !breakfast || !lunch || !snacks || !dinner) {
      return res.status(400).json({ 
        message: 'Day, breakfast, lunch, snacks, and dinner are required' 
      });
    }
    
    // Check if the day is valid
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ message: 'Invalid day' });
    }
    
    // Check if mess menu for this day already exists
    const existingMenuIndex = hostel.messMenu.findIndex(menu => menu.day === day);
    
    if (existingMenuIndex !== -1) {
      // Update existing menu
      hostel.messMenu[existingMenuIndex].breakfast = breakfast;
      hostel.messMenu[existingMenuIndex].lunch = lunch;
      hostel.messMenu[existingMenuIndex].snacks = snacks;
      hostel.messMenu[existingMenuIndex].dinner = dinner;
    } else {
      // Add new menu using findByIdAndUpdate instead of direct push
      await Hostel.findByIdAndUpdate(
        hostelId,
        { 
          $push: { 
            messMenu: {
              day,
              breakfast,
              lunch, 
              snacks,
              dinner
            } 
          } 
        }
      );
    }
    
    if (existingMenuIndex !== -1) {
      await hostel.save();
    }
    
    // Fetch updated hostel
    const updatedHostel = await Hostel.findById(hostelId);
    
    res.status(200).json({
      message: 'Mess menu updated successfully',
      hostel: updatedHostel
    });
  } catch (error) {
    console.error('Error updating mess menu:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mess Images Management
// Get hostel mess images
export const getHostelMessImages = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    res.status(200).json({ 
      images: hostel.messImages.sort((a, b) => a.order - b.order) 
    });
  } catch (error) {
    console.error('Error fetching hostel mess images:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add hostel mess image
export const addHostelMessImage = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.id;
    
    console.log(`Adding mess image to hostel: ${hostelId}`);
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      console.log(`Hostel not found with ID: ${hostelId}`);
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      console.log(`User ${userId} is not the warden of hostel ${hostelId}`);
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    if (!req.file) {
      console.log('No image file provided');
      return res.status(400).json({ message: 'No image provided' });
    }
    
    console.log(`File received: ${req.file.originalname}, path: ${req.file.path}`);
    
    const { caption } = req.body;
    
    // Upload image to Cloudinary
    console.log('Uploading to Cloudinary...');
    const uploadResult = await uploadToCloudinary(req.file.path, 'hostel-mess');
    console.log(`Upload successful: ${uploadResult.secure_url}`);
    
    // Add image to hostel
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      { 
        $push: { 
          messImages: {
            url: uploadResult.secure_url,
            caption,
            publicId: uploadResult.public_id
          } 
        } 
      },
      { new: true }
    );
    
    console.log('Mess image added successfully');
    res.status(201).json({
      message: 'Mess image added successfully',
      hostel: updatedHostel
    });
  } catch (error) {
    console.error('Error adding mess image:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete hostel mess image
export const deleteHostelMessImage = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId, imageId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    // Find the image
    const image = hostel.messImages.id(imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      await deleteFromCloudinary(image.publicId);
    }
    
    // Remove the image
    hostel.messImages.pull({ _id: imageId });
    await hostel.save();
    
    res.status(200).json({
      message: 'Mess image deleted successfully',
      hostel
    });
  } catch (error) {
    console.error('Error deleting mess image:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Gallery Images Management
// Get hostel gallery images
export const getHostelGalleryImages = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    res.status(200).json({ 
      images: hostel.galleryImages.sort((a, b) => a.order - b.order) 
    });
  } catch (error) {
    console.error('Error fetching hostel gallery images:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add hostel gallery image
export const addHostelGalleryImage = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user?.id;
    
    console.log(`Adding gallery image to hostel: ${hostelId}`);
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      console.log(`Hostel not found with ID: ${hostelId}`);
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      console.log(`User ${userId} is not the warden of hostel ${hostelId}`);
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    if (!req.file) {
      console.log('No image file provided');
      return res.status(400).json({ message: 'No image provided' });
    }
    
    console.log(`File received: ${req.file.originalname}, path: ${req.file.path}`);
    
    const { caption, category } = req.body;
    
    // Validate category
    const validCategories = ['general', 'events', 'facilities', 'other'];
    if (category && !validCategories.includes(category)) {
      console.log(`Invalid category: ${category}`);
      return res.status(400).json({ 
        message: 'Invalid category. Must be one of: general, events, facilities, other'
      });
    }
    
    // Upload image to Cloudinary
    console.log('Uploading to Cloudinary...');
    const uploadResult = await uploadToCloudinary(req.file.path, 'hostel-gallery');
    console.log(`Upload successful: ${uploadResult.secure_url}`);
    
    // Add image to hostel
    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      { 
        $push: { 
          galleryImages: {
            url: uploadResult.secure_url,
            caption,
            category: category || 'general',
            publicId: uploadResult.public_id
          } 
        } 
      },
      { new: true }
    );
    
    console.log('Gallery image added successfully');
    res.status(201).json({
      message: 'Gallery image added successfully',
      hostel: updatedHostel
    });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete hostel gallery image
export const deleteHostelGalleryImage = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId, imageId } = req.params;
    const userId = req.user?.id;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    // Find the image
    const image = hostel.galleryImages.id(imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      await deleteFromCloudinary(image.publicId);
    }
    
    // Remove the image
    hostel.galleryImages.pull({ _id: imageId });
    await hostel.save();
    
    res.status(200).json({
      message: 'Gallery image deleted successfully',
      hostel
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get hostel for the logged in warden
export const getWardenHostel = async (req: CustomRequest, res: Response) => {
  try {
    // Handle both formats of id (depending on JWT payload)
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    console.log(`Looking for hostel with wardenId: ${userId}`);
    
    // Find the hostel where this user is a warden
    let hostel = await Hostel.findOne({ wardenId: userId });
    
    // If not found by wardenId, try to find by user's hostelId
    if (!hostel && req.user?.hostelId) {
      try {
        hostel = await Hostel.findById(req.user.hostelId);
      } catch (error) {
        console.error('Error finding hostel by user.hostelId:', error);
      }
    }
    
    // If still not found, try to find by user's email
    if (!hostel) {
      try {
        // Find the user to get their email
        const user = await User.findById(userId);
        if (user) {
          console.log(`Looking for hostel with wardenEmail: ${user.email}`);
          hostel = await Hostel.findOne({ wardenEmail: user.email });
        }
      } catch (error) {
        console.error('Error finding hostel by user email:', error);
      }
    }
    
    if (!hostel) {
      console.log('No hostel assigned to this warden');
      return res.status(404).json({ message: 'No hostel assigned to this warden' });
    }
    
    console.log(`Found hostel: ${hostel.name}`);
    res.status(200).json({
      message: 'Hostel found',
      hostel: {
        _id: hostel._id,
        name: hostel.name,
        code: hostel.code,
        type: hostel.type,
        about: hostel.about,
        wardenId: hostel.wardenId,
        wardenEmail: hostel.wardenEmail,
        wardenName: hostel.wardenName,
        wardenMessage: hostel.wardenMessage,
        wardenPhoto: hostel.wardenPhoto
      }
    });
  } catch (error) {
    console.error('Error getting warden hostel:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get staff members of a hostel
export const getStaffMembers = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    res.status(200).json(hostel.staff);
  } catch (error) {
    console.error('Error getting staff members:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get facilities of a hostel
export const getFacilities = async (req: Request, res: Response) => {
  try {
    const { hostelId } = req.params;
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    res.status(200).json(hostel.facilities);
  } catch (error) {
    console.error('Error getting facilities:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update specific mess menu item
export const updateSpecificMessMenu = async (req: CustomRequest, res: Response) => {
  try {
    const { hostelId, menuId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const hostel = await Hostel.findById(hostelId);
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    // Check if the user is the warden of this hostel
    if (hostel.wardenId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You are not the warden of this hostel' });
    }
    
    const { day, breakfast, lunch, snacks, dinner } = req.body;
    
    if (!day || !breakfast || !lunch || !snacks || !dinner) {
      return res.status(400).json({ 
        message: 'Day, breakfast, lunch, snacks, and dinner are required' 
      });
    }
    
    // Find the menu item by ID
    const menuItem = hostel.messMenu.id(menuId);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Update menu item
    menuItem.day = day;
    menuItem.breakfast = breakfast;
    menuItem.lunch = lunch;
    menuItem.snacks = snacks;
    menuItem.dinner = dinner;
    
    await hostel.save();
    
    res.status(200).json({
      message: 'Mess menu updated successfully',
      hostel
    });
  } catch (error) {
    console.error('Error updating mess menu:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}; 