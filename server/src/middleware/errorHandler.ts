import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = 'Something went wrong';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        // For developers, log the unexpected error
        console.error('UNEXPECTED ERROR: 💥', err);
    }
    
    // In production, you might not want to send the internal error message to the client
    if (process.env.NODE_ENV === 'production' && !(err instanceof AppError)) {
        message = 'An unexpected error occurred. Please try again later.';
    } else {
        message = err.message;
    }

    res.status(statusCode).json({
        status: 'error',
        message: message,
    });
};
