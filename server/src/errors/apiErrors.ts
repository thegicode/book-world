
export class ApiError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class MissingParameterError extends ApiError {
    constructor(parameterName: string) {
        super(`Missing required query parameter: ${parameterName}`, 400);
    }
}

export class UpstreamApiError extends ApiError {
    constructor(apiName: string, statusCode: number, statusText: string) {
        super(`${apiName} API request failed: ${statusText}`, statusCode);
    }
}

export class NaverApiError extends UpstreamApiError {
    constructor(statusCode: number, statusText: string) {
        super("Naver", statusCode, statusText);
    }
}

export class KyoboApiError extends UpstreamApiError {
    constructor(statusCode: number, statusText: string) {
        super("Kyobo", statusCode, statusText);
    }
}

export class LibraryApiError extends UpstreamApiError {
    constructor(statusCode: number, statusText: string) {
        super("Library", statusCode, statusText);
    }
}
