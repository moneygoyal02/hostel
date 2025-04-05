import mongoose from 'mongoose';
import Hostel from '../models/Hostel';
import User from '../models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Map of hostel codes to warden emails
const hostelWardenMap = [
  // Boys' Hostels
  { name: 'Boys Hostel 1', code: 'BH1', type: 'boys', email: 'hwb1@nitj.ac.in' },
  { name: 'Boys Hostel 2', code: 'BH2', type: 'boys', email: 'hwb2@nitj.ac.in' },
  { name: 'Boys Hostel 3', code: 'BH3', type: 'boys', email: 'hwb3@nitj.ac.in' },
  { name: 'Boys Hostel 4', code: 'BH4', type: 'boys', email: 'hwb4@nitj.ac.in' },
  { name: 'Boys Hostel 6', code: 'BH6', type: 'boys', email: 'hwb6@nitj.ac.in' },
  { name: 'Boys Hostel 7', code: 'BH7', type: 'boys', email: 'hwb7@nitj.ac.in' },
  { name: 'Mega Boys Hostel: Block A', code: 'MBH-A', type: 'boys', email: 'mhba@nitj.ac.in' },
  { name: 'Mega Boys Hostel: Block B', code: 'MBH-B', type: 'boys', email: 'mhbb@nitj.ac.in' },
  { name: 'Mega Boys Hostel: Block F', code: 'MBH-F', type: 'boys', email: 'mhbf@nitj.ac.in' },
  
  // Girls' Hostels
  { name: 'Girls Hostel 1', code: 'GH1', type: 'girls', email: 'ohwg1@nitj.ac.in' },
  { name: 'Girls Hostel 2', code: 'GH2', type: 'girls', email: 'ohwg2@nitj.ac.in' },
  { name: 'Mega Girls Hostel', code: 'MGH', type: 'girls', email: 'mhg@nitj.ac.in' },
  { name: 'Mega Girls Hostel: Phase 2', code: 'MGH-Phase2', type: 'girls', email: 'mhg@nitj.ac.in' },
];

// Default password for warden accounts (should be changed after first login)
const DEFAULT_PASSWORD = 'ChangeMe123!';

const seedHostels = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');
    
    // Create users for each warden if they don't exist
    for (const hostel of hostelWardenMap) {
      // Check if user exists
      let user = await User.findOne({ email: hostel.email });
      
      if (!user) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
        
        // Create new user
        user = await User.create({
          name: `Warden of ${hostel.name}`,
          email: hostel.email,
          password: hashedPassword,
          role: 'warden'
        });
        
        console.log(`Created warden user for ${hostel.name}`);
      }
      
      // Check if hostel exists
      const existingHostel = await Hostel.findOne({ code: hostel.code });
      
      if (!existingHostel) {
        // Create hostel
        await Hostel.create({
          name: hostel.name,
          code: hostel.code,
          type: hostel.type,
          about: `${hostel.name} at NIT Jalandhar provides comfortable accommodation for students.`,
          wardenId: user._id,
          wardenEmail: hostel.email,
          wardenName: user.name,
          wardenMessage: 'Welcome to our hostel. We strive to provide a safe and comfortable environment for all students.',
          facilities: [],
          sliderImages: [],
          messImages: [],
          galleryImages: [],
          messMenu: [],
          staff: []
        });
        
        console.log(`Created hostel: ${hostel.name}`);
      }
    }
    
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedHostels(); 