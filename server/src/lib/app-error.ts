export type ErrorCode =
  "VALIDATION_ERROR" | "STUDENT_NOT_FOUND" | "EMAIL_TAKEN" | "NOT_FOUND" | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly fields?: Record<string, string>;

  constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, fields?: Record<string, string>): AppError {
    return new AppError(400, "VALIDATION_ERROR", message, fields);
  }

  static notFound(message = "Resource not found.", code: ErrorCode = "NOT_FOUND"): AppError {
    return new AppError(404, code, message);
  }

  static studentNotFound(message = "Student not found."): AppError {
    return new AppError(404, "STUDENT_NOT_FOUND", message);
  }

  static emailTaken(message = "This email address is already in use."): AppError {
    return new AppError(409, "EMAIL_TAKEN", message, {
      email: "This email address is already registered.",
    });
  }

  static internal(message = "An unexpected error occurred."): AppError {
    return new AppError(500, "INTERNAL_ERROR", message);
  }
}
