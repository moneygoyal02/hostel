import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Hostel from '../models/Hostel';

// Generate JWT
const generateToken = (id: string, role: string, hostelId?: string) => {
  return jwt.sign({ id, role, hostelId }, process.env.JWT_SECRET as string, {
    expiresIn: '30d'
  });
};

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

    // Email validation for specific hostel warden emails
    const validEmails = [
      'chief.warden@nitj.ac.in',
      'hwb1@nitj.ac.in', 'hwb2@nitj.ac.in', 'hwb3@nitj.ac.in', 'hwb4@nitj.ac.in',
      'hwb5@nitj.ac.in', 'hwb6@nitj.ac.in', 'hwb7@nitj.ac.in',
      'mgha@nitj.ac.in', 'mghb@nitj.ac.in', 'mhba@nitj.ac.in', 'mhbb@nitj.ac.in',
      'mhbf@nitj.ac.in', 'mhg@nitj.ac.in', 'ohwg1@nitj.ac.in', 'ohwg2@nitj.ac.in'
    ];

    if (!validEmails.includes(email.toLowerCase())) {
      res.status(400).json({ 
        message: 'Invalid email. Please use a designated hostel warden email' 
      });
      return;
    }

    // Create user
    const user: IUser = await User.create({
      name,
      email,
      password,
      role: role || 'warden'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(String(user._id), user.role)  // Updated conversion here
      });
      return;
    } else {
      res.status(400).json({ message: 'Invalid user data' });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
    return;
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Get hostel if user is a warden
    let hostelId;
    if (user.role === 'warden') {
      const hostel = await Hostel.findOne({ wardenId: user._id });
      if (hostel) {
        hostelId = hostel._id;
      }
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hostelId: hostelId || user.hostelId,
      token: generateToken(String(user._id), user.role, hostelId ? String(hostelId) : undefined) // Updated conversion here
    });
    return;
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
