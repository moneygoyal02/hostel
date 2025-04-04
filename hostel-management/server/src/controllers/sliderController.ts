import { Request, Response } from 'express';
import SliderImage, { ISliderImage } from '../models/SliderImage';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all slider images
// @route   GET /api/slider-images
// @access  Public
export const getSliderImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const images = await SliderImage.find().sort({ order: 1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching slider images:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a slider image by ID
// @route   GET /api/slider-images/:id
// @access  Public
export const getSliderImageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const image = await SliderImage.findById(req.params.id);
    if (!image) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }
    res.json(image);
  } catch (error) {
    console.error('Error fetching slider image:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new slider image
// @route   POST /api/slider-images
// @access  Private (Admin only)
export const createSliderImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, caption, order } = req.body;

    if (!image) {
      res.status(400).json({ message: 'Image is required' });
      return;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'hostel-management/slider',
      use_filename: true,
      unique_filename: true
    });

    const newImage = await SliderImage.create({
      url: result.secure_url,
      publicId: result.public_id,
      caption: caption || '',
      order: order || 0
    });

    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error creating slider image:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a slider image
// @route   PUT /api/slider-images/:id
// @access  Private (Admin only)
export const updateSliderImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { caption, order } = req.body;
    const imageId = req.params.id;

    const image = await SliderImage.findById(imageId);
    if (!image) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    if (caption !== undefined) {
      image.caption = caption;
    }

    if (order !== undefined) {
      image.order = order;
    }

    const updatedImage = await image.save();
    res.json(updatedImage);
  } catch (error) {
    console.error('Error updating slider image:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a slider image
// @route   DELETE /api/slider-images/:id
// @access  Private (Admin only)
export const deleteSliderImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const image = await SliderImage.findById(req.params.id);
    if (!image) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Delete from database
    await image.deleteOne();

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider image:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 