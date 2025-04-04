import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error instanceof Error ? error.message : String(error)}`);
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('Running in development mode without database connection. Some features will not work.');
      return false;
    } else {
      console.error('Application requires database connection in production mode.');
      process.exit(1);
    }
  }
};

export default connectDB; 