import cloudinary from '../config/cloudinary';
import fs from 'fs';

/**
 * Upload a file to Cloudinary
 * @param filePath Path to file on local storage
 * @param folder Cloudinary folder to store the image in
 * @returns Cloudinary upload result
 */
export const uploadToCloudinary = async (filePath: string, folder: string = 'hostel-app') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto'
    });
    
    // Delete the temp file after upload
    fs.unlinkSync(filePath);
    
    return result;
  } catch (error) {
    // Delete the temp file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param publicId Public ID of the image to delete
 * @returns Cloudinary delete result
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes multiple files from Cloudinary
 * @param publicIds Array of public IDs to delete
 * @returns Deletion results
 */
export const deleteMultipleFromCloudinary = async (publicIds: string[]) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting multiple files from Cloudinary:', error);
    throw error;
  }
}; 