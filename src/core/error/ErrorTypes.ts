/**
 * Error categories
 */
export enum ErrorCategory {
  NETWORK = "NETWORK",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  VALIDATION = "VALIDATION",
  BUSINESS = "BUSINESS",
  SYSTEM = "SYSTEM",
  UNKNOWN = "UNKNOWN",
}

/**
 * Error context information
 */
export interface ErrorContext {
  service?: string;
  operation?: string;
  entity?: string;
  recordId?: string;
  userId?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

/**
 * Error information structure
 */
export interface ErrorInfo {
  category: ErrorCategory;
  message: string;
  originalError: any;
  context?: ErrorContext;
  userMessage?: string;
  shouldRetry?: boolean;
  retryAfter?: number;
  statusCode?: number;
  errorCode?: string;
}
