"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiErrors_1 = require("../errors/apiErrors");
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    if (err instanceof apiErrors_1.ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else {
        console.error('UNEXPECTED ERROR: 💥', err);
    }
    if (process.env.NODE_ENV === 'production' && !(err instanceof apiErrors_1.ApiError)) {
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
