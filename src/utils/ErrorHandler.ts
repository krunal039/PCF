import { WebApiError } from '../models/DataverseModels';
import { Logger } from './Logger';

const logger = new Logger('ErrorHandler');

/**
 * Error Handler utility for handling Dataverse errors
 */
export class ErrorHandler {
    /**
     * Parse and format Web API errors
     */
    static parseWebApiError(error: any): string {
        try {
            if (error?.error) {
                const webApiError = error as WebApiError;
                return webApiError.error.message || 'An error occurred';
            }

            if (error?.message) {
                return error.message;
            }

            if (typeof error === 'string') {
                return error;
            }

            return 'An unknown error occurred';
        } catch (err) {
            logger.error('Error parsing Web API error:', err);
            return 'An error occurred while processing the request';
        }
    }

    /**
     * Check if error is a network error
     */
    static isNetworkError(error: any): boolean {
        return error?.message?.toLowerCase().includes('network') ||
               error?.message?.toLowerCase().includes('fetch') ||
               error?.code === 'ECONNREFUSED';
    }

    /**
     * Check if error is an authentication error
     */
    static isAuthError(error: any): boolean {
        return error?.status === 401 ||
               error?.status === 403 ||
               error?.code === 'UNAUTHORIZED';
    }

    /**
     * Get user-friendly error message
     */
    static getUserFriendlyMessage(error: any): string {
        if (this.isNetworkError(error)) {
            return 'Network error. Please check your connection and try again.';
        }

        if (this.isAuthError(error)) {
            return 'Authentication error. Please refresh the page and try again.';
        }

        return this.parseWebApiError(error);
    }
}


