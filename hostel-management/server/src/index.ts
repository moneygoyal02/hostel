import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import fileUpload from 'express-fileupload';
import path from 'path';
import authRoutes from './routes/authRoutes';
import sliderRoutes from './routes/sliderRoutes';
import hostelRoutes from './routes/hostelRoutes';

// Load environment variables
dotenv.config();

// Connect to MongoDB
let dbConnected = false;
(async () => {
  dbConnected = await connectDB();
})();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '../tmp'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  abortOnLimit: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/slider-images', sliderRoutes);
app.use('/api/hostels', hostelRoutes);

// Database status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ 
    status: 'online', 
    database: dbConnected ? 'connected' : 'disconnected',
    message: dbConnected ? 'API is fully operational' : 'API running with limited functionality (database disconnected)'
  });
});

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hostel Management API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 