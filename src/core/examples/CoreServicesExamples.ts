/**
 * Core Services Usage Examples
 * Demonstrates how to use core services in your components and services
 */

import { 
    Logger, 
    LogLevel, 
    ErrorHandler, 
    ConfigService, 
    DefaultConfig,
    Validator,
    ValidationRules,
    HttpClient,
    CacheService
} from '../index';

// ============================================
// Logger Examples
// ============================================

export function loggerExamples() {
    // Get singleton logger
    const logger = Logger.getInstance('MyService');
    
    // Set log level
    logger.setLogLevel(LogLevel.DEBUG);
    
    // Log messages
    logger.trace('Trace message');
    logger.debug('Debug message', { data: 'value' });
    logger.info('Service started', { service: 'MyService' });
    logger.warn('Warning message', { warning: 'details' });
    logger.error('Error message', new Error('Error'), { context: 'operation' });
    
    // Performance timing
    logger.time('operation');
    // ... do work ...
    const duration = logger.timeEnd('operation'); // Returns duration in ms
    
    // Create context-specific logger
    const serviceLogger = Logger.create('SpecificService', {
        defaultLevel: LogLevel.INFO,
        enableStorage: true
    });
}

// ============================================
// ErrorHandler Examples
// ============================================

export async function errorHandlerExamples() {
    try {
        // Some operation that might fail
        throw new Error('Network error');
    } catch (error) {
        // Categorize error
        const category = ErrorHandler.categorize(error);
        console.log('Error category:', category);
        
        // Get user-friendly message
        const userMessage = ErrorHandler.getUserMessage(error, {
            service: 'MyService',
            operation: 'fetchData'
        });
        console.log('User message:', userMessage);
        
        // Get log message
        const logMessage = ErrorHandler.getLogMessage(error, {
            service: 'MyService',
            operation: 'fetchData'
        });
        console.log('Log message:', logMessage);
        
        // Report error
        await ErrorHandler.report(error, {
            service: 'MyService',
            operation: 'fetchData',
            entity: 'accounts'
        });
        
        // Check if should retry
        if (ErrorHandler.shouldRetry(error)) {
            const retryAfter = ErrorHandler.getRetryAfter(error);
            console.log('Should retry after:', retryAfter, 'ms');
        }
    }
}

// ============================================
// ConfigService Examples
// ============================================

export function configServiceExamples() {
    // Get instance
    const config = ConfigService.getInstance();
    
    // Load default configuration
    config.load(DefaultConfig);
    
    // Get configuration values
    const baseUrl = config.get<string>('iHub.baseUrl');
    const timeout = config.get<number>('http.defaultTimeout', 30000);
    const pageSize = config.get<number>('pagination.defaultPageSize', 10);
    
    // Get optional value (returns undefined if not found)
    const apiKey = config.getOptional<string>('iHub.apiKey');
    
    // Set configuration
    config.set('iHub.baseUrl', 'https://api.example.com');
    config.set('iHub.apiKey', 'your-api-key');
    
    // Check if key exists
    if (config.has('iHub.baseUrl')) {
        console.log('iHub base URL is configured');
    }
    
    // Validate required keys
    const isValid = config.validate([
        'iHub.baseUrl',
        'iHub.apiKey'
    ]);
    
    if (!isValid) {
        console.error('Configuration validation failed');
    }
    
    // Get all configuration
    const allConfig = config.getAll();
    console.log('All configuration:', allConfig);
}

// ============================================
// Validator Examples
// ============================================

export function validatorExamples() {
    // Validate email
    const emailResult = Validator.validate('user@example.com', [
        ValidationRules.required('Email is required'),
        ValidationRules.email('Invalid email format')
    ]);
    
    if (!emailResult.isValid) {
        console.error('Email validation errors:', emailResult.errors);
    }
    
    // Validate entity
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
    };
    
    const schema = {
        name: [
            ValidationRules.required('Name is required'),
            ValidationRules.length(1, 100, 'Name must be between 1 and 100 characters')
        ],
        email: [
            ValidationRules.required('Email is required'),
            ValidationRules.email('Invalid email format')
        ],
        age: [
            ValidationRules.range(0, 120, 'Age must be between 0 and 120')
        ]
    };
    
    const entityResult = Validator.validateEntity(user, schema);
    if (!entityResult.isValid) {
        console.error('Entity validation errors:', entityResult.errors);
    }
    
    // Custom validation rule
    Validator.addRule('customRule', (value: any) => {
        return {
            isValid: value > 0,
            errors: value <= 0 ? ['Value must be greater than 0'] : []
        };
    });
    
    const customResult = Validator.validate(5, [
        Validator.getRule('customRule')!
    ]);
}

// ============================================
// HttpClient Examples
// ============================================

export async function httpClientExamples() {
    // Create client
    const client = new HttpClient({
        baseUrl: 'https://api.example.com',
        timeout: 30000,
        defaultHeaders: {
            'Content-Type': 'application/json'
        },
        retryPolicy: {
            maxAttempts: 3,
            baseDelay: 1000,
            maxDelay: 10000,
            exponentialBackoff: true
        }
    });
    
    // Add request interceptor
    client.addInterceptor({
        onRequest: async (config) => {
            // Add auth token
            config.headers = {
                ...config.headers,
                'Authorization': 'Bearer token'
            };
            return config;
        }
    });
    
    // Add response interceptor
    client.addInterceptor({
        onResponse: async (response) => {
            // Transform response
            return {
                ...response,
                data: response.data.result
            };
        },
        onError: async (error) => {
            // Handle error
            console.error('HTTP error:', error);
            throw error;
        }
    });
    
    // Make requests
    try {
        const data = await client.get('/api/data');
        const result = await client.post('/api/data', { name: 'value' });
        const updated = await client.put('/api/data/1', { name: 'updated' });
        await client.delete('/api/data/1');
    } catch (error) {
        console.error('Request failed:', error);
    }
}

// ============================================
// CacheService Examples
// ============================================

export function cacheServiceExamples() {
    // Get instance
    const cache = CacheService.getInstance();
    
    // Set cache with TTL (5 minutes = 300000ms)
    const data = { id: 1, name: 'Account' };
    cache.set('account:1', data, 300000);
    
    // Get from cache
    const cached = cache.get('account:1');
    if (cached) {
        console.log('Found in cache:', cached);
    } else {
        console.log('Not in cache, fetching...');
        // Fetch fresh data
    }
    
    // Check if exists
    if (cache.has('account:1')) {
        console.log('Cache entry exists');
    }
    
    // Invalidate specific key
    cache.delete('account:1');
    
    // Invalidate by pattern
    cache.invalidate('account:*');
    
    // Get cache statistics
    const stats = cache.getStats();
    console.log('Cache stats:', {
        size: stats.size,
        hits: stats.hits,
        misses: stats.misses,
        hitRate: stats.hitRate
    });
    
    // Set max size
    cache.setMaxSize(200);
    
    // Clear all cache
    cache.clear();
}

// ============================================
// Combined Example
// ============================================

export async function combinedExample() {
    const logger = Logger.getInstance('MyService');
    const config = ConfigService.getInstance();
    const cache = CacheService.getInstance();
    
    // Load configuration
    config.load(DefaultConfig);
    
    // Create HTTP client
    const client = new HttpClient({
        baseUrl: config.get<string>('iHub.baseUrl'),
        timeout: config.get<number>('http.defaultTimeout')
    });
    
    try {
        logger.info('Fetching data');
        
        // Check cache first
        const cacheKey = 'data:accounts';
        let data = cache.get(cacheKey);
        
        if (!data) {
            // Fetch from API
            data = await client.get('/api/accounts');
            
            // Cache result
            const ttl = config.get<number>('cache.defaultTTL');
            cache.set(cacheKey, data, ttl);
            
            logger.info('Data fetched and cached');
        } else {
            logger.info('Data retrieved from cache');
        }
        
        return data;
    } catch (error) {
        const errorInfo = ErrorHandler.parse(error, {
            service: 'MyService',
            operation: 'fetchData'
        });
        
        logger.error('Failed to fetch data', error, errorInfo.context);
        
        const userMessage = ErrorHandler.getUserMessage(error);
        throw new Error(userMessage);
    }
}

