import { Request, Response, NextFunction } from 'express';

// Define a type for async controller functions
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * A higher-order function to wrap async route handlers and catch errors.
 * This avoids repeating try-catch blocks in every async controller.
 * @param fn The async controller function to wrap.
 * @returns A new function that handles promise rejections and passes them to Express's error handler.
 */
export const asyncHandler = (fn: AsyncController) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};
