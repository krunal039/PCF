import { ErrorInfo, ErrorCategory } from "./ErrorTypes";

/**
 * Error formatter for formatting error messages
 */
export class ErrorFormatter {
  /**
   * Format error for user display
   */
  static formatUserMessage(errorInfo: ErrorInfo): string {
    if (errorInfo.userMessage) {
      return errorInfo.userMessage;
    }

    switch (errorInfo.category) {
      case ErrorCategory.NETWORK:
        return "Network error. Please check your connection and try again.";

      case ErrorCategory.AUTHENTICATION:
        return "Authentication error. Please refresh the page and try again.";

      case ErrorCategory.AUTHORIZATION:
        return "You do not have permission to perform this action.";

      case ErrorCategory.VALIDATION:
        return (
          errorInfo.message || "Validation error. Please check your input."
        );

      case ErrorCategory.BUSINESS:
        return errorInfo.message || "A business rule error occurred.";

      case ErrorCategory.SYSTEM:
        return "A system error occurred. Please try again later.";

      default:
        return errorInfo.message || "An unexpected error occurred.";
    }
  }

  /**
   * Format error for logging
   */
  static formatLogMessage(errorInfo: ErrorInfo): string {
    const parts: string[] = [];

    parts.push(`[${errorInfo.category}]`);

    if (errorInfo.context?.service) {
      parts.push(`Service: ${errorInfo.context.service}`);
    }

    if (errorInfo.context?.operation) {
      parts.push(`Operation: ${errorInfo.context.operation}`);
    }

    if (errorInfo.statusCode) {
      parts.push(`Status: ${errorInfo.statusCode}`);
    }

    if (errorInfo.errorCode) {
      parts.push(`Code: ${errorInfo.errorCode}`);
    }

    parts.push(`Message: ${errorInfo.message}`);

    if (errorInfo.context?.additionalData) {
      parts.push(`Data: ${JSON.stringify(errorInfo.context.additionalData)}`);
    }

    return parts.join(" | ");
  }

  /**
   * Format error for reporting
   */
  static formatReportMessage(errorInfo: ErrorInfo): Record<string, any> {
    return {
      category: errorInfo.category,
      message: errorInfo.message,
      statusCode: errorInfo.statusCode,
      errorCode: errorInfo.errorCode,
      context: errorInfo.context,
      timestamp: errorInfo.context?.timestamp || new Date().toISOString(),
      shouldRetry: errorInfo.shouldRetry,
      retryAfter: errorInfo.retryAfter,
    };
  }
}
