import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Define user interface
interface UserPayload {
  id: string;
  role: string;
  hostelId?: string;
}

// Define custom request interface
export interface CustomRequest extends Request {
  user?: UserPayload;
}

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Authenticate JWT token
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
      }
      
      (req as CustomRequest).user = user as UserPayload;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authentication token required' });
  }
};

// Check if user is a warden
export const isWarden = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as CustomRequest).user;
  
  if (!user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }
  
  if (user.role === 'warden' || user.role === 'chiefWarden') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Warden access required' });
  }
};

// Check if user is a chief warden
export const isChiefWarden = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as CustomRequest).user;
  
  if (!user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }
  
  if (user.role === 'chiefWarden') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Chief Warden access required' });
  }
};

// Check if user is the warden of the specific hostel
export const isHostelWarden = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as CustomRequest).user;
  const { hostelId } = req.params;
  
  if (!user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }
  
  // Chief warden has access to all hostels
  if (user.role === 'chiefWarden') {
    next();
    return;
  }
  
  // For regular wardens, check if they are assigned to this hostel
  if (user.role === 'warden') {
    // Check if the hostelId in the token matches the requested hostel
    if (user.hostelId && user.hostelId === hostelId) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: You are not authorized to access this hostel' });
    }
  } else {
    res.status(403).json({ message: 'Access denied: Warden access required' });
  }
};

// Protect routes middleware
export const protectRoute: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;

      // Add user from payload
      (req as CustomRequest).user = decoded;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }
};

// Role-based authorization middleware
export const authorizeRoles = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as CustomRequest).user;
    
    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    if (roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ 
        message: `Access denied: ${user.role} role is not authorized to access this resource` 
      });
    }
  };
};

// Check if user is the owner of a hostel
export const isHostelOwner: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as CustomRequest).user;
  const { hostelId } = req.params;
  
  if (!user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }
  
  // If user is admin or chief warden, allow access
  if (user.role === 'admin' || user.role === 'chiefWarden') {
    next();
    return;
  }
  
  // If user is warden, check if they own this hostel
  if (user.role === 'warden' && user.hostelId && user.hostelId.toString() === hostelId) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: You are not authorized to manage this hostel' });
  }
};
