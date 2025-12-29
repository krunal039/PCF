import { ErrorCategory } from "../error/ErrorTypes";
import { ErrorHandler } from "../error/ErrorHandler";

/**
 * Retry policy configuration
 */
export interface RetryPolicy {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBackoff: boolean;
  retryableErrors?: ErrorCategory[];
}

/**
 * Default retry policy
 */
export const DefaultRetryPolicy: RetryPolicy = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  exponentialBackoff: true,
  retryableErrors: [ErrorCategory.NETWORK, ErrorCategory.SYSTEM],
};

/**
 * Retry policy utility
 */
export class RetryPolicyHelper {
  /**
   * Calculate retry delay
   */
  static calculateDelay(attempt: number, policy: RetryPolicy): number {
    if (!policy.exponentialBackoff) {
      return policy.baseDelay;
    }

    const delay = policy.baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, policy.maxDelay);
  }

  /**
   * Check if error should be retried
   */
  static shouldRetry(
    error: any,
    attempt: number,
    policy: RetryPolicy
  ): boolean {
    if (attempt >= policy.maxAttempts) {
      return false;
    }

    const errorInfo = ErrorHandler.parse(error);

    if (policy.retryableErrors && policy.retryableErrors.length > 0) {
      return policy.retryableErrors.includes(errorInfo.category);
    }

    return errorInfo.shouldRetry || false;
  }

  /**
   * Get retry delay for error
   */
  static getRetryDelay(
    error: any,
    attempt: number,
    policy: RetryPolicy
  ): number {
    const errorInfo = ErrorHandler.parse(error);

    // Use error's retryAfter if available
    if (errorInfo.retryAfter) {
      return errorInfo.retryAfter;
    }

    return this.calculateDelay(attempt, policy);
  }
}
