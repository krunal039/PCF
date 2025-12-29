# Core Services

This directory contains the core services that are shared across all PCF controls. These services provide foundational functionality for logging, error handling, configuration, validation, HTTP requests, and caching.

## Services Overview

### 1. Logging (`logging/`)

Enhanced logging service with multiple log levels, structured logging, and optional storage.

**Features:**
- Multiple log levels (TRACE, DEBUG, INFO, WARN, ERROR)
- Structured logging support
- Optional log storage (memory or localStorage)
- Performance timing utilities
- Singleton pattern for global logger

**Usage:**
```typescript
import { Logger, LogLevel } from '@core';

// Get singleton instance
const logger = Logger.getInstance('MyService');
logger.setLogLevel(LogLevel.DEBUG);

// Log messages
logger.info('Service started', { service: 'MyService' });
logger.error('Error occurred', error, { context: 'operation' });

// Performance timing
logger.time('operation');
// ... do work ...
logger.timeEnd('operation'); // Logs duration
```

### 2. Error Handling (`error/`)

Comprehensive error handling with categorization, formatting, and reporting.

**Features:**
- Error categorization (Network, Auth, Validation, Business, System)
- User-friendly error messages
- Error context preservation
- Error reporting integration
- Retry decision logic

**Usage:**
```typescript
import { ErrorHandler, ErrorCategory } from '@core';

try {
    // operation
} catch (error) {
    // Categorize error
    const category = ErrorHandler.categorize(error);
    
    // Get user-friendly message
    const userMessage = ErrorHandler.getUserMessage(error, {
        service: 'MyService',
        operation: 'fetchData'
    });
    
    // Report error
    await ErrorHandler.report(error, {
        service: 'MyService',
        operation: 'fetchData'
    });
    
    // Check if should retry
    if (ErrorHandler.shouldRetry(error)) {
        // retry logic
    }
}
```

### 3. Configuration (`configuration/`)

Centralized configuration management with multiple providers.

**Features:**
- Multiple configuration providers (Memory, Environment)
- Priority-based provider chain
- Type-safe configuration access
- Configuration validation
- Default configuration values

**Usage:**
```typescript
import { ConfigService, DefaultConfig } from '@core';

// Get instance
const config = ConfigService.getInstance();

// Load default configuration
config.load(DefaultConfig);

// Get configuration values
const baseUrl = config.get<string>('iHub.baseUrl');
const timeout = config.get<number>('http.defaultTimeout', 30000);

// Set configuration
config.set('iHub.apiKey', 'your-api-key');

// Validate required keys
config.validate(['iHub.baseUrl', 'iHub.apiKey']);
```

### 4. Validation (`validation/`)

Enhanced validation service with rules engine.

**Features:**
- Built-in validation rules
- Custom validation rules
- Entity validation
- Async validation support
- Detailed validation results

**Usage:**
```typescript
import { Validator, ValidationRules } from '@core';

// Validate single value
const result = Validator.validate(email, [
    ValidationRules.required('Email is required'),
    ValidationRules.email('Invalid email format')
]);

if (!result.isValid) {
    console.error(result.errors);
}

// Validate entity
const schema = {
    name: [ValidationRules.required(), ValidationRules.length(1, 100)],
    email: [ValidationRules.required(), ValidationRules.email()],
    age: [ValidationRules.range(0, 120)]
};

const entityResult = Validator.validateEntity(user, schema);
```

### 5. HTTP Client (`http/`)

Common HTTP client with retry logic and interceptors.

**Features:**
- Automatic retry with exponential backoff
- Request/response interceptors
- Configurable timeout
- Retry policy configuration
- Request cancellation

**Usage:**
```typescript
import { HttpClient, RetryPolicy } from '@core';

// Create client
const client = new HttpClient({
    baseUrl: 'https://api.example.com',
    timeout: 30000,
    retryPolicy: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        exponentialBackoff: true
    }
});

// Add interceptor
client.addInterceptor({
    onRequest: (config) => {
        config.headers['X-Custom-Header'] = 'value';
        return config;
    },
    onResponse: (response) => {
        // Transform response
        return response;
    }
});

// Make requests
const data = await client.get('/api/data');
const result = await client.post('/api/data', { name: 'value' });
```

### 6. Cache Service (`cache/`)

In-memory caching service with TTL support.

**Features:**
- In-memory caching
- TTL (Time To Live) support
- Cache invalidation
- Cache statistics
- Size management

**Usage:**
```typescript
import { CacheService } from '@core';

// Get instance
const cache = CacheService.getInstance();

// Set cache with TTL (5 minutes)
cache.set('accounts', data, 300000);

// Get from cache
const cached = cache.get('accounts');
if (!cached) {
    // Fetch fresh data
}

// Invalidate
cache.delete('accounts');
cache.invalidate('account*'); // Pattern matching

// Get statistics
const stats = cache.getStats();
console.log(`Hit rate: ${stats.hitRate}`);
```

## Integration

All core services are integrated into business services:

- **DataverseService**: Uses Logger, ErrorHandler
- **iHubService**: Uses Logger, ErrorHandler, HttpClient
- **ServiceFactory**: Uses ConfigService
- **Frontend Hooks**: Use ErrorHandler

## Best Practices

1. **Logger**: Use context-specific loggers for better traceability
2. **ErrorHandler**: Always provide context when handling errors
3. **ConfigService**: Load default config on application startup
4. **Validator**: Define validation schemas for entities
5. **HttpClient**: Configure retry policies based on API characteristics
6. **CacheService**: Use appropriate TTL values based on data freshness requirements

## Examples

See the examples directory for detailed usage examples:
- `src/services/examples/` - Service usage examples
- `src/core/examples/` - Core service examples (if created)

