/**
 * Default configuration values
 * These are loaded into ConfigService on initialization
 */
export const DefaultConfig = {
    // Entity names
    entities: {
        account: 'accounts',
        contact: 'contacts',
        lead: 'leads',
        opportunity: 'opportunities',
        case: 'incidents',
        task: 'tasks'
    },

    // Error messages
    messages: {
        error: {
            network: 'Network error. Please check your connection.',
            auth: 'Authentication error. Please refresh the page.',
            notFound: 'The requested resource was not found.',
            validation: 'Validation error. Please check your input.',
            unknown: 'An unknown error occurred.'
        },
        success: {
            recordCreated: 'Record created successfully.',
            recordUpdated: 'Record updated successfully.',
            recordDeleted: 'Record deleted successfully.'
        }
    },

    // Pagination
    pagination: {
        defaultPageSize: 10,
        maxPageSize: 5000
    },

    // HTTP defaults
    http: {
        defaultTimeout: 30000,
        defaultRetryAttempts: 3,
        defaultRetryDelay: 1000
    },

    // Cache defaults
    cache: {
        defaultTTL: 300000, // 5 minutes
        maxSize: 100
    },

    // Logging defaults
    logging: {
        defaultLevel: 'INFO',
        enableStorage: false,
        enableConsole: true
    }
};

