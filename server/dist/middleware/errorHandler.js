"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else {
        console.error('UNEXPECTED ERROR: 💥', err);
    }
    if (process.env.NODE_ENV === 'production' && !(err instanceof AppError_1.AppError)) {
        message = 'An unexpected error occurred. Please try again later.';
    }
    else {
        message = err.message;
    }
    res.status(statusCode).json({
        status: 'error',
        message: message,
    });
};
exports.errorHandler = errorHandler;
