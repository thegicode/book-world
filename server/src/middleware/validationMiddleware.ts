import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { ApiError } from '../errors/apiErrors';

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors: string[] = [];
    errors.array().map(err => extractedErrors.push(err.msg));

    throw new ApiError(`Validation Error: ${extractedErrors.join(', ')}`, 400);
};

export const validateNaverBookSearch = [
    query('keyword').notEmpty().withMessage('keyword is required'),
    query('display').notEmpty().withMessage('display is required').isInt({ gt: 0 }).withMessage('display must be a positive integer'),
    query('start').notEmpty().withMessage('start is required').isInt({ gt: 0 }).withMessage('start must be a positive integer'),
    query('sort').notEmpty().withMessage('sort is required').isIn(['sim', 'date']).withMessage('sort must be either "sim" or "date"'),
    validate,
];

export const validateKyoboBookInfo = [
    query('isbn').notEmpty().withMessage('isbn is required'),
    validate,
];

export const validateSearchLibraries = [
    query('dtl_region').notEmpty().withMessage('dtl_region is required'),
    query('page').notEmpty().withMessage('page is required').isInt({ gt: 0 }).withMessage('page must be a positive integer'),
    query('pageSize').notEmpty().withMessage('pageSize is required').isInt({ gt: 0 }).withMessage('pageSize must be a positive integer'),
    validate,
];

export const validateCheckBookExistence = [
    query('isbn13').notEmpty().withMessage('isbn13 is required'),
    query('libCode').notEmpty().withMessage('libCode is required'),
    validate,
];

export const validateGetUsageAnalysis = [
    query('isbn13').notEmpty().withMessage('isbn13 is required'),
    validate,
];

export const validateSearchLibrariesByBook = [
    query('isbn').notEmpty().withMessage('isbn is required'),
    query('region').notEmpty().withMessage('region is required'),
    query('dtl_region').notEmpty().withMessage('dtl_region is required'),
    validate,
];

export const validateGetPopularBooks = [
    query('startDt').notEmpty().withMessage('startDt is required'),
    query('endDt').notEmpty().withMessage('endDt is required'),
    query('pageNo').notEmpty().withMessage('pageNo is required').isInt({ gt: 0 }).withMessage('pageNo must be a positive integer'),
    query('pageSize').notEmpty().withMessage('pageSize is required').isInt({ gt: 0 }).withMessage('pageSize must be a positive integer'),
    // Optional parameters are not validated for existence, but can be validated for format if needed.
    validate,
];

export const validateGetMonthlyKeywords = [
    query('month').notEmpty().withMessage('month is required').matches(/^\d{4}-(0[1-9]|1[0-2])$/).withMessage('month must be in YYYY-MM format'),
    validate,
];
