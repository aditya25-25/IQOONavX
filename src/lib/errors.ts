export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);

    if (
      'captureStackTrace' in Error &&
      typeof (Error as { captureStackTrace?: (target: object, constructorOpt?: Function) => void }).captureStackTrace === 'function'
    ) {
      (Error as { captureStackTrace: (target: object, constructorOpt?: Function) => void }).captureStackTrace(
        this,
        this.constructor
      );
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: any) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required. Invalid or missing authorization token.', details?: any) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to access this resource.', details?: any) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict occurred.', details?: any) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed for request parameters.', details?: any) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

export class ProviderError extends AppError {
  constructor(providerName: string, message = 'External provider service encountered an error.', details?: any) {
    super(`${providerName}: ${message}`, 502, 'PROVIDER_ERROR', details);
  }
}
