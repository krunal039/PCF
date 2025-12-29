import { ErrorCategory, ErrorContext, ErrorInfo } from "./ErrorTypes";
import { ErrorFormatter } from "./ErrorFormatter";
import { ErrorReporter } from "./ErrorReporter";
import { Logger } from "../logging/Logger";

/**
 * Enhanced Error Handler with categorization and reporting
 */
export class ErrorHandler {
  private static logger: Logger = Logger.getInstance("ErrorHandler");

  /**
   * Categorize error
   */
  static categorize(error: any, context?: ErrorContext): ErrorCategory {
    // Network errors
    if (this.isNetworkError(error)) {
      return ErrorCategory.NETWORK;
    }

    // Authentication errors
    if (this.isAuthenticationError(error)) {
      return ErrorCategory.AUTHENTICATION;
    }

    // Authorization errors
    if (this.isAuthorizationError(error)) {
      return ErrorCategory.AUTHORIZATION;
    }

    // Validation errors
    if (this.isValidationError(error)) {
      return ErrorCategory.VALIDATION;
    }

    // Business errors (4xx client errors that aren't auth/validation)
    if (this.isBusinessError(error)) {
      return ErrorCategory.BUSINESS;
    }

    // System errors (5xx server errors)
    if (this.isSystemError(error)) {
      return ErrorCategory.SYSTEM;
    }

    return ErrorCategory.UNKNOWN;
  }

  /**
   * Parse error and create ErrorInfo
   */
  static parse(error: any, context?: ErrorContext): ErrorInfo {
    const category = this.categorize(error, context);
    const message = this.extractMessage(error);
    const statusCode = this.extractStatusCode(error);
    const errorCode = this.extractErrorCode(error);

    const errorInfo: ErrorInfo = {
      category,
      message,
      originalError: error,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
      },
      statusCode,
      errorCode,
      shouldRetry: this.shouldRetry(error),
      retryAfter: this.getRetryAfter(error),
    };

    return errorInfo;
  }

  /**
   * Format error message for user
   */
  static getUserMessage(error: any, context?: ErrorContext): string {
    const errorInfo = this.parse(error, context);
    return ErrorFormatter.formatUserMessage(errorInfo);
  }

  /**
   * Format error message for logging
   */
  static getLogMessage(error: any, context?: ErrorContext): string {
    const errorInfo = this.parse(error, context);
    return ErrorFormatter.formatLogMessage(errorInfo);
  }

  /**
   * Report error
   */
  static async report(error: any, context?: ErrorContext): Promise<void> {
    const errorInfo = this.parse(error, context);
    await ErrorReporter.report(errorInfo);
  }

  /**
   * Check if error should be retried
   */
  static shouldRetry(error: any): boolean {
    const category = this.categorize(error);

    // Retry network errors and system errors (5xx)
    if (
      category === ErrorCategory.NETWORK ||
      category === ErrorCategory.SYSTEM
    ) {
      return true;
    }

    // Retry 429 (Too Many Requests)
    const statusCode = this.extractStatusCode(error);
    if (statusCode === 429) {
      return true;
    }

    return false;
  }

  /**
   * Get retry after delay in milliseconds
   */
  static getRetryAfter(error: any): number | undefined {
    const statusCode = this.extractStatusCode(error);

    if (statusCode === 429) {
      // Check for Retry-After header
      const retryAfter =
        error?.response?.headers?.["retry-after"] ||
        error?.headers?.["retry-after"];
      if (retryAfter) {
        return parseInt(retryAfter) * 1000; // Convert to milliseconds
      }
      return 1000; // Default 1 second for rate limiting
    }

    // Exponential backoff for network/system errors
    const category = this.categorize(error);
    if (
      category === ErrorCategory.NETWORK ||
      category === ErrorCategory.SYSTEM
    ) {
      return 1000; // Start with 1 second
    }

    return undefined;
  }

  /**
   * Check if error is network error
   */
  private static isNetworkError(error: any): boolean {
    if (!error) return false;

    const message = (error.message || "").toLowerCase();
    const code = (error.code || "").toLowerCase();

    return (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection") ||
      message.includes("timeout") ||
      code === "econnrefused" ||
      code === "enetunreach" ||
      code === "etimedout" ||
      error.name === "NetworkError" ||
      (error.name === "TypeError" && message.includes("fetch"))
    );
  }

  /**
   * Check if error is authentication error
   */
  private static isAuthenticationError(error: any): boolean {
    const statusCode = this.extractStatusCode(error);
    return (
      statusCode === 401 ||
      error?.code === "UNAUTHORIZED" ||
      error?.name === "UnauthorizedError"
    );
  }

  /**
   * Check if error is authorization error
   */
  private static isAuthorizationError(error: any): boolean {
    const statusCode = this.extractStatusCode(error);
    return (
      statusCode === 403 ||
      error?.code === "FORBIDDEN" ||
      error?.name === "ForbiddenError"
    );
  }

  /**
   * Check if error is validation error
   */
  private static isValidationError(error: any): boolean {
    const statusCode = this.extractStatusCode(error);
    return (
      statusCode === 400 ||
      error?.code === "VALIDATION_ERROR" ||
      error?.name === "ValidationError" ||
      (error?.error?.code && error.error.code.includes("Validation"))
    );
  }

  /**
   * Check if error is business error
   */
  private static isBusinessError(error: any): boolean {
    const statusCode = this.extractStatusCode(error);
    return (
      statusCode >= 400 &&
      statusCode < 500 &&
      statusCode !== 401 &&
      statusCode !== 403 &&
      statusCode !== 400
    );
  }

  /**
   * Check if error is system error
   */
  private static isSystemError(error: any): boolean {
    const statusCode = this.extractStatusCode(error);
    return statusCode >= 500 && statusCode < 600;
  }

  /**
   * Extract message from error
   */
  private static extractMessage(error: any): string {
    if (!error) return "An unknown error occurred";

    // Web API error format
    if (error?.error?.message) {
      return error.error.message;
    }

    // Standard error message
    if (error?.message) {
      return error.message;
    }

    // String error
    if (typeof error === "string") {
      return error;
    }

    // Try to stringify
    try {
      return JSON.stringify(error);
    } catch {
      return "An unknown error occurred";
    }
  }

  /**
   * Extract status code from error
   */
  private static extractStatusCode(error: any): number | undefined {
    return (
      error?.status ||
      error?.statusCode ||
      error?.response?.status ||
      error?.response?.statusCode
    );
  }

  /**
   * Extract error code from error
   */
  private static extractErrorCode(error: any): string | undefined {
    return (
      error?.code || error?.error?.code || error?.response?.data?.error?.code
    );
  }
}
