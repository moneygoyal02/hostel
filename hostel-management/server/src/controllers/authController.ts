import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Hostel, { IHostel } from '../models/Hostel';
import { CustomRequest } from '../middleware/auth';
import mongoose, { Types } from 'mongoose';

// Generate JWT
const generateToken = (id: string, role: string, hostelId?: string) => {
  return jwt.sign({ id, role, hostelId }, process.env.JWT_SECRET as string, {
    expiresIn: '30d'
  });
};

// Define HostelInfo interface
interface HostelInfo {
  code: string;
  name: string;
  type: 'boys' | 'girls';
}

// Map of hostel codes to warden emails with explicit type
const hostelEmailMap: {[key: string]: HostelInfo} = {
  // Boys' Hostels
  'hwb1@nitj.ac.in': { code: 'BH1', name: 'Boys Hostel 1', type: 'boys' },
  'hwb2@nitj.ac.in': { code: 'BH2', name: 'Boys Hostel 2', type: 'boys' },
  'hwb3@nitj.ac.in': { code: 'BH3', name: 'Boys Hostel 3', type: 'boys' },
  'hwb4@nitj.ac.in': { code: 'BH4', name: 'Boys Hostel 4', type: 'boys' },
  'hwb5@nitj.ac.in': { code: 'BH5', name: 'Boys Hostel 5', type: 'boys' },
  'hwb6@nitj.ac.in': { code: 'BH6', name: 'Boys Hostel 6', type: 'boys' },
  'hwb7@nitj.ac.in': { code: 'BH7', name: 'Boys Hostel 7', type: 'boys' },
  'mhba@nitj.ac.in': { code: 'MBH-A', name: 'Mega Boys Hostel: Block A', type: 'boys' },
  'mhbb@nitj.ac.in': { code: 'MBH-B', name: 'Mega Boys Hostel: Block B', type: 'boys' },
  'mhbf@nitj.ac.in': { code: 'MBH-F', name: 'Mega Boys Hostel: Block F', type: 'boys' },
  
  // Girls' Hostels
  'ohwg1@nitj.ac.in': { code: 'GH1', name: 'Girls Hostel 1', type: 'girls' },
  'ohwg2@nitj.ac.in': { code: 'GH2', name: 'Girls Hostel 2', type: 'girls' },
  'mhg@nitj.ac.in': { code: 'MGH', name: 'Mega Girls Hostel', type: 'girls' },
};

// Type guard to check if value is an ObjectId
function isObjectId(value: any): value is mongoose.Types.ObjectId {
  return value && typeof value === 'object' && value._bsontype === 'ObjectID';
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Handle chief warden registration specifically
    if (email.toLowerCase() === 'chief.warden@nitj.ac.in') {
      // Create the chief warden user
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: 'chiefWarden'
      });

      if (user) {
        const userId = user._id as Types.ObjectId; // Type assertion
        res.status(201).json({
          _id: userId,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(userId.toString(), user.role)
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
      return;
    }

    // For warden registration, validate email against the hostel map
    const emailLowerCase = email.toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(hostelEmailMap, emailLowerCase)) {
      res.status(400).json({ 
        message: 'Invalid email. Please use a designated hostel warden email' 
      });
      return;
    }
    
    const hostelInfo = hostelEmailMap[emailLowerCase];

    // Create the warden user
    const user = await User.create({
      name,
      email: emailLowerCase,
      password,
      role: 'warden'
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid user data' });
      return;
    }

    const userId = user._id as Types.ObjectId; // Type assertion

    // Find or create the associated hostel
    let hostel = await Hostel.findOne({ code: hostelInfo.code });

    if (hostel) {
      // Update existing hostel with the new warden
      hostel = await Hostel.findByIdAndUpdate(
        hostel._id,
        {
          wardenId: userId,
          wardenEmail: emailLowerCase,
          wardenName: name
        },
        { new: true }
      );
    } else {
      // Create a new hostel if it doesn't exist
      hostel = await Hostel.create({
        name: hostelInfo.name,
        code: hostelInfo.code,
        type: hostelInfo.type,
        about: `${hostelInfo.name} at NIT Jalandhar provides comfortable accommodation for students.`,
        wardenId: userId,
        wardenEmail: emailLowerCase,
        wardenName: name,
        wardenMessage: 'Welcome to our hostel. We strive to provide a safe and comfortable environment for all students.',
        facilities: [],
        sliderImages: [],
        messImages: [],
        galleryImages: [],
        messMenu: [],
        staff: []
      });
    }

    // Update the user with hostel reference 
    if (hostel) {
      const hostelId = hostel._id as Types.ObjectId; // Type assertion
      await User.findByIdAndUpdate(userId, { hostelId: hostelId });

      // Return the user info with token
      res.status(201).json({
        _id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        hostelId: hostelId,
        token: generateToken(userId.toString(), user.role, hostelId.toString())
      });
    } else {
      // Return the user info without hostel reference
      res.status(201).json({
        _id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(userId.toString(), user.role)
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    return;
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const userId = user._id as Types.ObjectId; // Type assertion

    // For wardens, get their hostel details
    let hostelId = null;
    if (user.role === 'warden') {
      if (user.hostelId) {
        // If hostelId is already stored on the user
        hostelId = user.hostelId as Types.ObjectId; // Type assertion
      } else {
        // Find hostel by warden email
        const hostel = await Hostel.findOne({ wardenEmail: user.email });
        if (hostel) {
          const hostelObjectId = hostel._id as Types.ObjectId; // Type assertion
          // Update user with hostel reference if not already set
          await User.findByIdAndUpdate(userId, { hostelId: hostelObjectId });
          hostelId = hostelObjectId;
        }
      }
    }

    // Generate response
    res.status(200).json({
      _id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
      hostelId: hostelId,
      token: generateToken(
        userId.toString(), 
        user.role, 
        hostelId ? hostelId.toString() : undefined
      )
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    return;
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: IUser | null = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    return;
  }
};

// Add this function to find the hostel by warden email
export const getWardenHostel = async (req: CustomRequest, res: Response) => {
  try {
    // Handle both formats of id (depending on JWT payload)
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Find the user to get their email
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the hostel where this user is a warden
    const hostel = await Hostel.findOne({ wardenEmail: user.email });
    
    if (!hostel) {
      return res.status(404).json({ message: 'No hostel assigned to this warden' });
    }
    
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

// @desc    Get all wardens (for chief warden)
// @route   GET /api/auth/wardens
// @access  Private/ChiefWarden
export const getWardens = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Find all users with role 'warden'
    const wardens = await User.find({ role: 'warden' }).select('-password');
    
    // Get the hostel details for each warden
    const wardensWithHostels = await Promise.all(
      wardens.map(async (warden) => {
        const hostel = await Hostel.findOne({ wardenEmail: warden.email })
          .select('_id name code type');
          
        return {
          _id: warden._id,
          name: warden.name,
          email: warden.email,
          hostel: hostel || null
        };
      })
    );
    
    res.status(200).json({
      success: true,
      wardens: wardensWithHostels
    });
  } catch (error) {
    console.error('Error getting wardens:', error);
    res.status(500).json({ message: 'Server error', error });
    return;
  }
};
