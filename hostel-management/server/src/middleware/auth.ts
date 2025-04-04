import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      // Add user from payload
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

// Middleware to check if user is Chief Warden
export const chiefWardenOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'chiefWarden') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Chief Warden only' });
  }
};
