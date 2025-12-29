/**
 * Application Constants
 */

export const ENTITY_NAMES = {
    ACCOUNT: 'accounts',
    CONTACT: 'contacts',
    LEAD: 'leads',
    OPPORTUNITY: 'opportunities',
    CASE: 'incidents',
    TASK: 'tasks'
} as const;

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    AUTH_ERROR: 'Authentication error. Please refresh the page.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Validation error. Please check your input.',
    UNKNOWN_ERROR: 'An unknown error occurred.'
} as const;

export const SUCCESS_MESSAGES = {
    RECORD_CREATED: 'Record created successfully.',
    RECORD_UPDATED: 'Record updated successfully.',
    RECORD_DELETED: 'Record deleted successfully.'
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 5000;


