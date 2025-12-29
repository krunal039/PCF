# Utilities

This directory contains utility functions and helpers.

## Utilities

### Logger
Centralized logging utility with different log levels.

**Usage:**
```typescript
import { Logger } from './Logger';

const logger = new Logger('MyComponent');
logger.info('Information message');
logger.error('Error message', error);
```

### ErrorHandler
Utility for parsing and handling errors from Dataverse.

**Usage:**
```typescript
import { ErrorHandler } from './ErrorHandler';

const errorMessage = ErrorHandler.getUserFriendlyMessage(error);
```

### Validation
Input validation utilities.

**Usage:**
```typescript
import { Validation } from './Validation';

if (Validation.isValidGuid(recordId)) {
    // Process record
}
```

### Constants
Application-wide constants.

**Usage:**
```typescript
import { ENTITY_NAMES, ERROR_MESSAGES } from './Constants';

const entityName = ENTITY_NAMES.ACCOUNT;
```


