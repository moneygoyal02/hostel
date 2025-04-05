import { Request, Response, NextFunction, RequestHandler } from 'express';

// Utility to catch async errors in route handlers
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 