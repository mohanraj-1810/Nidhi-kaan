export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static notFound(resource: string = 'Resource'): AppError {
    return new AppError(`${resource} not found`, 404);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  static internal(message: string = 'Internal server error'): AppError {
    return new AppError(message, 500, false);
  }
}