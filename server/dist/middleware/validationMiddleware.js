"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSrchBooksInLibrary = exports.validateGetMonthlyKeywords = exports.validateGetPopularBooks = exports.validateSearchLibrariesByBook = exports.validateGetUsageAnalysis = exports.validateCheckBookExistence = exports.validateSearchLibrariesByKeyword = exports.validateSearchLibraries = exports.validateKyoboBookInfo = exports.validateNaverBookSearch = void 0;
const express_validator_1 = require("express-validator");
const apiErrors_1 = require("../errors/apiErrors");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push(err.msg));
    throw new apiErrors_1.ApiError(`Validation Error: ${extractedErrors.join(', ')}`, 400);
};
exports.validateNaverBookSearch = [
    (0, express_validator_1.query)('keyword').notEmpty().withMessage('keyword is required'),
    (0, express_validator_1.query)('display').notEmpty().withMessage('display is required').isInt({ gt: 0 }).withMessage('display must be a positive integer'),
    (0, express_validator_1.query)('start').notEmpty().withMessage('start is required').isInt({ gt: 0 }).withMessage('start must be a positive integer'),
    (0, express_validator_1.query)('sort').notEmpty().withMessage('sort is required').isIn(['sim', 'date']).withMessage('sort must be either "sim" or "date"'),
    validate,
];
exports.validateKyoboBookInfo = [
    (0, express_validator_1.query)('isbn').notEmpty().withMessage('isbn is required'),
    validate,
];
exports.validateSearchLibraries = [
    (0, express_validator_1.query)('dtl_region').notEmpty().withMessage('dtl_region is required'),
    (0, express_validator_1.query)('page').notEmpty().withMessage('page is required').isInt({ gt: 0 }).withMessage('page must be a positive integer'),
    (0, express_validator_1.query)('pageSize').notEmpty().withMessage('pageSize is required').isInt({ gt: 0 }).withMessage('pageSize must be a positive integer'),
    validate,
];
exports.validateSearchLibrariesByKeyword = [
    (0, express_validator_1.query)('keyword').notEmpty().withMessage('keyword is required'),
    (0, express_validator_1.query)('page').notEmpty().withMessage('page is required').isInt({ gt: 0 }).withMessage('page must be a positive integer'),
    (0, express_validator_1.query)('pageSize').notEmpty().withMessage('pageSize is required').isInt({ gt: 0 }).withMessage('pageSize must be a positive integer'),
    validate,
];
exports.validateCheckBookExistence = [
    (0, express_validator_1.query)('isbn13').notEmpty().withMessage('isbn13 is required'),
    (0, express_validator_1.query)('libCode').notEmpty().withMessage('libCode is required'),
    validate,
];
exports.validateGetUsageAnalysis = [
    (0, express_validator_1.query)('isbn13').notEmpty().withMessage('isbn13 is required'),
    validate,
];
exports.validateSearchLibrariesByBook = [
    (0, express_validator_1.query)('isbn').notEmpty().withMessage('isbn is required'),
    (0, express_validator_1.query)('region').notEmpty().withMessage('region is required'),
    (0, express_validator_1.query)('dtl_region').notEmpty().withMessage('dtl_region is required'),
    validate,
];
exports.validateGetPopularBooks = [
    (0, express_validator_1.query)('startDt').notEmpty().withMessage('startDt is required'),
    (0, express_validator_1.query)('endDt').notEmpty().withMessage('endDt is required'),
    (0, express_validator_1.query)('pageNo').notEmpty().withMessage('pageNo is required').isInt({ gt: 0 }).withMessage('pageNo must be a positive integer'),
    (0, express_validator_1.query)('pageSize').notEmpty().withMessage('pageSize is required').isInt({ gt: 0 }).withMessage('pageSize must be a positive integer'),
    validate,
];
exports.validateGetMonthlyKeywords = [
    (0, express_validator_1.query)('month').notEmpty().withMessage('month is required').matches(/^\d{4}-(0[1-9]|1[0-2])$/).withMessage('month must be in YYYY-MM format'),
    validate,
];
exports.validateSrchBooksInLibrary = [
    (0, express_validator_1.query)('libCode').notEmpty().withMessage('libCode is required'),
    (0, express_validator_1.query)('keyword').notEmpty().withMessage('keyword is required'),
    (0, express_validator_1.query)('pageNo').notEmpty().withMessage('pageNo is required').isInt({ gt: 0 }).withMessage('pageNo must be a positive integer'),
    (0, express_validator_1.query)('pageSize').notEmpty().withMessage('pageSize is required').isInt({ gt: 0 }).withMessage('pageSize must be a positive integer'),
    validate,
];
