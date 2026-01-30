"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryApiError = exports.KyoboApiError = exports.NaverApiError = exports.UpstreamApiError = exports.MissingParameterError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ApiError = ApiError;
class MissingParameterError extends ApiError {
    constructor(parameterName) {
        super(`Missing required query parameter: ${parameterName}`, 400);
    }
}
exports.MissingParameterError = MissingParameterError;
class UpstreamApiError extends ApiError {
    constructor(apiName, statusCode, statusText) {
        super(`${apiName} API request failed: ${statusText}`, statusCode);
    }
}
exports.UpstreamApiError = UpstreamApiError;
class NaverApiError extends UpstreamApiError {
    constructor(statusCode, statusText) {
        super("Naver", statusCode, statusText);
    }
}
exports.NaverApiError = NaverApiError;
class KyoboApiError extends UpstreamApiError {
    constructor(statusCode, statusText) {
        super("Kyobo", statusCode, statusText);
    }
}
exports.KyoboApiError = KyoboApiError;
class LibraryApiError extends UpstreamApiError {
    constructor(statusCode, statusText) {
        super("Library", statusCode, statusText);
    }
}
exports.LibraryApiError = LibraryApiError;
