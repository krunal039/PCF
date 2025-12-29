# Core Services Architecture Plan

## Current State Analysis

### Existing Core Services/Utilities

#### Currently Available

1. **Logger** (`src/utils/Logger.ts`)

   - Basic logging with context
   - Levels: info, warn, error, debug
   - Simple console-based logging
   - **Status**: Functional but basic

2. **ErrorHandler** (`src/utils/ErrorHandler.ts`)

   - Web API error parsing
   - Network/Auth error detection
   - User-friendly message formatting
   - **Status**: Functional but limited to Dataverse errors

3. **Validation** (`src/utils/Validation.ts`)

   - GUID validation
   - Email validation
   - Required field validation
   - Entity name validation
   - **Status**: Basic validation utilities

4. **Constants** (`src/utils/Constants.ts`)

   - Entity names
   - Error messages
   - Success messages
   - Page size constants
   - **Status**: Basic constants

5. **ServiceFactory** (`src/services/ServiceFactory.ts`)
   - Centralized service creation
   - Singleton pattern for services
   - **Status**: Basic factory pattern

### Current Usage Patterns

- **Logger**: Each service creates its own instance (`new Logger('ServiceName')`)
- **ErrorHandler**: Static methods, used inconsistently
- **Validation**: Static methods, used ad-hoc
- **Constants**: Direct imports, used throughout

## Proposed Core Services Architecture

### 1. Core Services Directory Structure

```
src/
├── core/                              # NEW: Core services directory
│   ├── logging/
│   │   ├── Logger.ts                  # Enhanced logger
│   │   ├── LogLevel.ts                # Log level enums
│   │   ├── LogFormatter.ts            # Log formatting
│   │   └── LogStorage.ts               # Optional: Log storage/persistence
│   │
│   ├── error/
│   │   ├── ErrorHandler.ts            # Enhanced error handler
│   │   ├── ErrorTypes.ts              # Error type definitions
│   │   ├── ErrorFormatter.ts          # Error message formatting
│   │   └── ErrorReporter.ts           # Optional: Error reporting service
│   │
│   ├── validation/
│   │   ├── Validator.ts               # Enhanced validation service
│   │   ├── ValidationRules.ts         # Validation rule definitions
│   │   └── ValidationResult.ts        # Validation result types
│   │
│   ├── configuration/
│   │   ├── ConfigService.ts           # Configuration management
│   │   ├── ConfigProvider.ts          # Configuration provider interface
│   │   └── EnvironmentConfig.ts       # Environment-based config
│   │
│   ├── cache/
│   │   ├── CacheService.ts            # Caching service
│   │   ├── CacheStrategy.ts            # Cache strategy interface
│   │   └── MemoryCache.ts              # In-memory cache implementation
│   │
│   ├── http/
│   │   ├── HttpClient.ts               # Common HTTP client
│   │   ├── HttpInterceptor.ts           # HTTP interceptors
│   │   └── RetryPolicy.ts              # Retry policy configuration
│   │
│   └── index.ts                        # Core services barrel export
│
└── utils/                              # Keep for backward compatibility
    └── ... (existing utilities)
```

### 2. Core Services Enhancement Plan

#### A. Enhanced Logging Service

**Current Issues:**

- Basic console logging only
- No log levels configuration
- No log filtering
- No structured logging
- No log persistence

**Proposed Enhancements:**

- ✅ Log level configuration (TRACE, DEBUG, INFO, WARN, ERROR)
- ✅ Structured logging with metadata
- ✅ Log filtering by level/context
- ✅ Optional log storage (localStorage, sessionStorage)
- ✅ Performance logging (timing, metrics)
- ✅ Log context propagation
- ✅ Singleton pattern for global logger instance

**Implementation:**

```typescript
// Enhanced Logger with configuration
class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private formatter: LogFormatter;
  private storage?: LogStorage;

  static getInstance(): Logger;
  setLogLevel(level: LogLevel): void;
  log(level: LogLevel, message: string, metadata?: any): void;
  time(label: string): void;
  timeEnd(label: string): number;
}
```

#### B. Enhanced Error Handling Service

**Current Issues:**

- Only handles Dataverse errors
- No error categorization
- No error reporting/tracking
- Limited error context

**Proposed Enhancements:**

- ✅ Unified error handling for all services (Dataverse, iHub, etc.)
- ✅ Error categorization (Network, Auth, Validation, Business, System)
- ✅ Error context preservation
- ✅ Error reporting/tracking (optional integration)
- ✅ Error recovery strategies
- ✅ User-friendly message mapping
- ✅ Error logging integration

**Implementation:**

```typescript
class ErrorHandler {
  static categorize(error: any): ErrorCategory;
  static format(error: any, context?: ErrorContext): string;
  static getUserMessage(error: any): string;
  static report(error: any, context?: ErrorContext): void;
  static shouldRetry(error: any): boolean;
}
```

#### C. Enhanced Validation Service

**Current Issues:**

- Basic validation only
- No validation rules engine
- No validation result details
- No async validation support

**Proposed Enhancements:**

- ✅ Validation rules engine
- ✅ Composite validators
- ✅ Async validation support
- ✅ Validation result with details
- ✅ Custom validation rules
- ✅ Validation context

**Implementation:**

```typescript
class Validator {
  static validate(value: any, rules: ValidationRule[]): ValidationResult;
  static async validateAsync(
    value: any,
    rules: ValidationRule[]
  ): Promise<ValidationResult>;
  static addRule(name: string, rule: ValidationRule): void;
  static validateEntity(entity: any, schema: EntitySchema): ValidationResult;
}
```

#### D. Configuration Service

**Current Issues:**

- No centralized configuration
- Configuration scattered across services
- No environment-based configuration
- Hard-coded values

**Proposed Enhancements:**

- ✅ Centralized configuration management
- ✅ Environment-based configuration (dev, test, prod)
- ✅ Configuration validation
- ✅ Configuration providers (context, environment, defaults)
- ✅ Configuration caching
- ✅ Type-safe configuration

**Implementation:**

```typescript
class ConfigService {
  static getInstance(): ConfigService;
  get<T>(key: string, defaultValue?: T): T;
  set(key: string, value: any): void;
  load(config: Record<string, any>): void;
  validate(): boolean;
}
```

#### E. Caching Service

**Current Issues:**

- No caching mechanism
- Services fetch data repeatedly
- No cache invalidation strategy

**Proposed Enhancements:**

- ✅ In-memory caching
- ✅ Cache expiration (TTL)
- ✅ Cache invalidation strategies
- ✅ Cache keys management
- ✅ Cache statistics
- ✅ Optional: localStorage/sessionStorage cache

**Implementation:**

```typescript
class CacheService {
  static getInstance(): CacheService;
  get<T>(key: string): T | null;
  set(key: string, value: any, ttl?: number): void;
  invalidate(key: string): void;
  clear(): void;
  getStats(): CacheStats;
}
```

#### F. HTTP Client Service

**Current Issues:**

- iHub service has its own HTTP implementation
- No shared HTTP utilities
- Retry logic duplicated
- No request/response interceptors

**Proposed Enhancements:**

- ✅ Common HTTP client with retry logic
- ✅ Request/response interceptors
- ✅ Request/response transformation
- ✅ Timeout handling
- ✅ Retry policies
- ✅ Request cancellation
- ✅ Used by both Dataverse and iHub services

**Implementation:**

```typescript
class HttpClient {
  constructor(config: HttpClientConfig);
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
  addInterceptor(interceptor: HttpInterceptor): void;
}
```

### 3. Service Integration Plan

#### Phase 1: Core Services Foundation

1. Create `src/core/` directory structure
2. Implement enhanced Logger
3. Implement enhanced ErrorHandler
4. Create barrel exports (`src/core/index.ts`)

#### Phase 2: Configuration & Validation

5. Implement ConfigService
6. Implement enhanced Validator
7. Migrate Constants to ConfigService

#### Phase 3: HTTP & Caching

8. Implement HttpClient
9. Implement CacheService
10. Refactor iHubService to use HttpClient

#### Phase 4: Integration

11. Update all services to use core services
12. Update ServiceFactory to use core services
13. Update frontend hooks to use core services

#### Phase 5: Documentation & Examples

14. Create core services documentation
15. Add usage examples
16. Update README

### 4. Migration Strategy

#### Backward Compatibility

- Keep existing `src/utils/` for backward compatibility
- Create wrappers/adapter pattern if needed
- Gradual migration path

#### Service Updates

- **DataverseService**: Use enhanced Logger, ErrorHandler, HttpClient
- **iHubService**: Use enhanced Logger, ErrorHandler, HttpClient, CacheService
- **WebApiService**: Use enhanced Logger, ErrorHandler
- **ServiceFactory**: Use ConfigService for configuration

### 5. Benefits

1. **Consistency**: All services use same logging, error handling patterns
2. **Reusability**: Core services shared across all controls
3. **Maintainability**: Centralized core functionality
4. **Testability**: Core services can be easily mocked/tested
5. **Extensibility**: Easy to add new core services
6. **Performance**: Caching reduces redundant API calls
7. **Debugging**: Enhanced logging and error handling

### 6. Implementation Priority

**High Priority:**

1. Enhanced Logger (used everywhere)
2. Enhanced ErrorHandler (used everywhere)
3. ConfigService (centralizes configuration)

**Medium Priority:** 4. HttpClient (reduces duplication) 5. Enhanced Validator (improves validation)

**Low Priority:** 6. CacheService (performance optimization) 7. ErrorReporter (optional feature)

### 7. File Organization

```
src/
├── core/                    # NEW: Core services (shared across all controls)
│   ├── logging/
│   ├── error/
│   ├── validation/
│   ├── configuration/
│   ├── cache/
│   ├── http/
│   └── index.ts
│
├── services/                # Business services (Dataverse, iHub)
│   ├── DataverseService.ts  # Uses core services
│   ├── iHubService.ts       # Uses core services
│   └── ServiceFactory.ts    # Uses core services
│
├── utils/                    # Keep for backward compatibility
│   └── ... (existing)
│
└── frontend/                # Frontend components
    └── ... (existing)
```

### 8. Usage Examples (After Implementation)

```typescript
// Logger - Singleton pattern
import { Logger } from "@core";

const logger = Logger.getInstance();
logger.setLogLevel(LogLevel.INFO);
logger.info("Service started", { service: "DataverseService" });

// ErrorHandler - Unified error handling
import { ErrorHandler } from "@core";

try {
  // operation
} catch (error) {
  const category = ErrorHandler.categorize(error);
  const message = ErrorHandler.getUserMessage(error);
  ErrorHandler.report(error, { context: "DataverseService.fetchRecords" });
}

// ConfigService - Centralized configuration
import { ConfigService } from "@core";

const config = ConfigService.getInstance();
const baseUrl = config.get<string>("iHub.baseUrl");
const apiKey = config.get<string>("iHub.apiKey");

// HttpClient - Shared HTTP client
import { HttpClient } from "@core";

const httpClient = new HttpClient({
  baseUrl: "https://api.example.com",
  timeout: 30000,
  retryAttempts: 3,
});

// CacheService - Caching
import { CacheService } from "@core";

const cache = CacheService.getInstance();
const data = cache.get("accounts") || (await fetchAccounts());
cache.set("accounts", data, 300000); // 5 minutes TTL
```

## Next Steps

1. **Review this plan** - Confirm approach and priorities
2. **Approve implementation** - Get approval before coding
3. **Implement Phase 1** - Start with Logger and ErrorHandler
4. **Test integration** - Ensure backward compatibility
5. **Gradual migration** - Update services one by one

## Questions to Consider

1. Do we need log persistence (localStorage/sessionStorage)?
2. Do we need error reporting service (external service integration)?
3. What cache strategy do we need (memory only or persistent)?
4. Should we support multiple log outputs (console, file, remote)?
5. What configuration sources do we need (context, environment, user settings)?
