export class ApiError extends Error {
  /**
   * Represents an API error with a name, status code, and message.
   *
   * This error is thrown when the server encounters an issue that prevents it from fulfilling the request.
   *
   * Example:
   * throw new ApiError("UserNotFound", 400, "User not found");
   *
   * @param name - A unique identifier for the error type.
   * @param statusCode - The HTTP status code associated with the error.
   * @param message - A descriptive message providing more details about the error.
   */
  statusCode: number;

  constructor(name: string, statusCode: number, message?: string) {
    // Make message optional
    super(message);
    this.name = name;
    this.statusCode = statusCode;

    // Preserve the stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Formats the error response for consistent API error handling.
   *
   * @returns An object containing the error details.
   */
  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
