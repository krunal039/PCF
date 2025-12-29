# Service Layer

This directory contains the service layer for Dataverse and iHub integration.

## Services

### DataverseService
High-level service for Dataverse operations. Provides methods for:
- Fetching records (single and multiple)
- Creating records
- Updating records
- Deleting records
- Executing actions

**Usage:**
```typescript
import { DataverseService } from './DataverseService';

const service = new DataverseService(context);

// Fetch records with options
const records = await service.fetchRecords('accounts', {
    select: ['name', 'emailaddress1'],
    filter: "statecode eq 0",
    top: 10,
    orderby: 'name'
});
```

### iHubService
High-level service for iHub API operations. Provides methods for:
- Fetching data (GET)
- Posting data (POST)
- Updating data (PUT)
- Deleting data (DELETE)
- Executing custom actions
- Automatic retry with exponential backoff
- Configurable timeout and retry attempts

**Usage:**
```typescript
import { iHubService } from './iHubService';

const service = new iHubService(context, {
    baseUrl: 'https://api.ihub.example.com',
    apiKey: 'your-api-key',
    timeout: 30000,
    retryAttempts: 3
});

// Fetch data
const response = await service.fetchData('/api/pas/details', {
    filters: { status: 'active' },
    page: 1,
    pageSize: 10
});

// Post data
const createResponse = await service.postData('/api/pas/details', {
    title: 'New Detail',
    status: 'draft'
});
```

### WebApiService
Low-level wrapper around the PowerApps Component Framework Web API. Handles:
- Direct Web API calls
- Error handling
- Request formatting

**Note:** Prefer using `DataverseService` for most operations. Use `WebApiService` only for advanced scenarios.

### ServiceFactory
Centralized factory for creating and managing service instances. Provides:
- Singleton pattern for services
- Centralized configuration
- Easy service access

**Usage:**
```typescript
import { ServiceFactory } from './ServiceFactory';

const factory = new ServiceFactory(context);

// Get Dataverse service
const dataverseService = factory.getDataverseService();

// Get iHub service with configuration
const iHubService = factory.getiHubService({
    baseUrl: 'https://api.ihub.example.com',
    apiKey: 'your-api-key'
});
```

## Adding New Services

1. Create a new service file in this directory
2. Import and use existing services as needed
3. Add TypeScript interfaces in `../models/`
4. Export the service from an index file if needed
5. Optionally add to ServiceFactory for centralized access

## Examples

See the `examples/` directory for detailed usage examples:
- `DataverseServiceExamples.ts` - Dataverse service examples
- `iHubServiceExamples.ts` - iHub service examples
