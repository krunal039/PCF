# PAS Details PCF Control Project

A comprehensive PowerApps Component Framework (PCF) control project structure with frontend components, Dataverse integration, and iHub service layer. Supports multiple PCF controls in a single solution.

## Project Structure

```
PFCX/
├── controls/                          # PCF Controls (supports multiple controls)
│   └── PASDetailsPCF/                 # PAS Details PCF Control
│       ├── ControlManifest.Input.xml  # Control manifest
│       ├── PASDetailsPCF.pcfproj      # PCF project file
│       ├── index.ts                   # Main control entry point
│       ├── css/                       # Control-specific styles
│       │   └── PASDetailsPCF.css
│       └── strings/                   # Localization strings
│           └── PASDetailsPCF.1033.resx
│
├── src/                               # Shared Source Code
│   ├── frontend/                      # Frontend React components
│   │   ├── App.tsx                    # Main app component
│   │   ├── components/                # React components
│   │   │   ├── MainContainer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── hooks/                     # Custom React hooks
│   │       ├── useDataverseData.ts    # Hook for Dataverse data
│   │       └── useiHubData.ts          # Hook for iHub data
│   │
│   ├── services/                      # Service Layer
│   │   ├── DataverseService.ts        # Dataverse operations
│   │   ├── WebApiService.ts           # Web API wrapper
│   │   ├── iHubService.ts              # iHub API operations
│   │   ├── ServiceFactory.ts          # Service factory for creating services
│   │   └── examples/                  # Usage examples
│   │       ├── DataverseServiceExamples.ts
│   │       └── iHubServiceExamples.ts
│   │
│   ├── models/                         # TypeScript interfaces/models
│   │   ├── DataverseModels.ts         # Dataverse data models
│   │   └── iHubModels.ts              # iHub data models
│   │
│   ├── core/                           # Core Services (shared across controls)
│   │   ├── logging/                    # Enhanced logging service
│   │   ├── error/                      # Enhanced error handling
│   │   ├── validation/                 # Enhanced validation service
│   │   ├── configuration/              # Configuration management
│   │   ├── http/                       # HTTP client with retry logic
│   │   ├── cache/                      # Caching service
│   │   └── index.ts                    # Core services barrel export
│   │
│   ├── utils/                          # Legacy utilities (backward compatibility)
│   │   ├── Logger.ts                  # Legacy logging utility
│   │   ├── ErrorHandler.ts            # Legacy error handling
│   │   ├── Constants.ts               # Legacy constants
│   │   └── Validation.ts              # Legacy validation utilities
│   │
│   └── styles/                         # Global styles
│       └── App.css
│
├── package.json                        # NPM dependencies
├── tsconfig.json                       # TypeScript configuration
├── .pcfproj                            # Root PCF project file
├── .eslintrc.json                      # ESLint configuration
└── README.md                           # This file
```

## Features

- **Multiple PCF Controls**: Support for multiple controls in a single solution
- **Frontend Layer**: React-based UI components with TypeScript
- **Service Layer**: Abstraction layer for Dataverse and iHub API calls
- **Core Services**: Shared core services for logging, error handling, configuration, validation, HTTP, and caching
- **iHub Integration**: Complete iHub service layer with retry logic and error handling
- **Enhanced Logging**: Multi-level logging with structured output and optional storage
- **Error Handling**: Comprehensive error categorization, formatting, and reporting
- **Configuration Management**: Centralized configuration with multiple providers
- **HTTP Client**: Common HTTP client with retry logic and interceptors
- **Caching**: In-memory caching with TTL support
- **Type Safety**: Full TypeScript support with interfaces and models
- **Modern Architecture**: Separation of concerns with clear layer boundaries

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PowerApps CLI (pac CLI)
- Visual Studio Code (recommended)
- Power Platform Tools extension for VS Code

## Setup Instructions

### 1. Install PowerApps CLI

```bash
npm install -g @microsoft/powerapps-cli
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Start Development Server

```bash
npm start
```

This will start the PCF test harness for local development.

### 5. Generate Type Definitions

After building, generate TypeScript types from the manifest:

```bash
npm run refreshTypes
```

## Development Workflow

### Adding New PCF Controls

1. Create a new folder in `controls/` directory (e.g., `controls/MyNewControl/`)
2. Create the control files:
   - `ControlManifest.Input.xml`
   - `MyNewControl.pcfproj`
   - `index.ts`
   - `css/MyNewControl.css`
   - `strings/MyNewControl.1033.resx`
3. Add a reference in `.pcfproj`:
   ```xml
   <ProjectReference Include="$(MSBuildThisFileDirectory)controls\MyNewControl\MyNewControl.pcfproj" />
   ```

### Adding New Components

1. Create component in `src/frontend/components/`
2. Add corresponding CSS file if needed
3. Import and use in `App.tsx` or other components

### Using Dataverse Service

```typescript
import { DataverseService } from '@services/DataverseService';

// In your component
const dataverseService = new DataverseService(context);

// Fetch records
const records = await dataverseService.fetchRecords('accounts', {
    select: ['name', 'emailaddress1'],
    filter: "statecode eq 0",
    top: 10
});

// Create record
const recordId = await dataverseService.createRecord('accounts', {
    name: 'New Account',
    emailaddress1: 'test@example.com'
});
```

### Using iHub Service

```typescript
import { iHubService } from '@services/iHubService';

// Initialize iHub service
const iHubService = new iHubService(context, {
    baseUrl: 'https://api.ihub.example.com',
    apiKey: 'your-api-key',
    timeout: 30000,
    retryAttempts: 3
});

// Fetch data
const response = await iHubService.fetchData('/api/pas/details', {
    filters: { status: 'active' },
    page: 1,
    pageSize: 10,
    sortBy: 'createdDate',
    sortOrder: 'desc'
});

// Post data
const createResponse = await iHubService.postData('/api/pas/details', {
    title: 'New PAS Detail',
    description: 'Description',
    status: 'draft'
});
```

### Using Service Factory

```typescript
import { ServiceFactory } from '@services/ServiceFactory';

// Create service factory
const serviceFactory = new ServiceFactory(context);

// Get Dataverse service
const dataverseService = serviceFactory.getDataverseService();

// Get iHub service (with optional config)
const iHubService = serviceFactory.getiHubService({
    baseUrl: 'https://api.ihub.example.com',
    apiKey: 'your-api-key'
});
```

### Using React Hooks

```typescript
import { useDataverseData } from '@hooks/useDataverseData';
import { useiHubData } from '@hooks/useiHubData';

// In your component
const { data, loading, error, refresh } = useDataverseData(context);

// For iHub
const { data: iHubData, loading: iHubLoading, error: iHubError } = useiHubData(
    context,
    '/api/pas/details',
    { page: 1, pageSize: 10 }
);
```

## Building for Production

```bash
npm run build
```

The output will be in the `out/` directory.

## Deployment

1. Build the project: `npm run build`
2. Create a solution in Power Apps
3. Add the PCF controls to the solution
4. Export the solution as managed or unmanaged
5. Import into your target environment

## Project Architecture

### Core Services Layer (`src/core/`)
- **Logging**: Enhanced logging with multiple levels, structured output, and optional storage
- **Error Handling**: Error categorization, formatting, and reporting
- **Configuration**: Centralized configuration management with multiple providers
- **Validation**: Enhanced validation service with rules engine
- **HTTP Client**: Common HTTP client with retry logic and interceptors
- **Cache**: In-memory caching with TTL support

### Frontend Layer (`src/frontend/`)
- React components for UI
- Custom hooks for data fetching
- Component-specific styles

### Service Layer (`src/services/`)
- **DataverseService**: High-level Dataverse operations (uses core services)
- **WebApiService**: Low-level Web API wrapper (uses core services)
- **iHubService**: iHub API operations with retry logic (uses HttpClient from core)
- **ServiceFactory**: Centralized service creation (uses ConfigService)

### Models (`src/models/`)
- TypeScript interfaces for type safety
- Dataverse entity models
- iHub data models
- Query options and response types

### Utilities (`src/utils/`)
- Legacy utilities maintained for backward compatibility
- New code should use core services instead

## Multiple Controls Support

This project structure supports multiple PCF controls:

1. Each control has its own folder in `controls/`
2. Each control has its own manifest, project file, and entry point
3. All controls share the same `src/` codebase
4. Controls are referenced in the root `.pcfproj` file
5. Build output includes all controls in the `out/` directory

## iHub Service Features

- **HTTP Methods**: GET, POST, PUT, DELETE support
- **Retry Logic**: Automatic retry with exponential backoff
- **Error Handling**: Comprehensive error parsing and handling
- **Query Options**: Filters, pagination, sorting, field selection
- **Custom Actions**: Execute custom iHub actions
- **Configuration**: Flexible configuration management

## Core Services Usage

### Logger
```typescript
import { Logger, LogLevel } from '@core';

const logger = Logger.getInstance('MyService');
logger.setLogLevel(LogLevel.DEBUG);
logger.info('Message', { metadata });
```

### ErrorHandler
```typescript
import { ErrorHandler } from '@core';

try {
    // operation
} catch (error) {
    const message = ErrorHandler.getUserMessage(error, { service: 'MyService' });
    await ErrorHandler.report(error, { service: 'MyService' });
}
```

### ConfigService
```typescript
import { ConfigService, DefaultConfig } from '@core';

const config = ConfigService.getInstance();
config.load(DefaultConfig);
const value = config.get<string>('iHub.baseUrl');
```

### Validator
```typescript
import { Validator, ValidationRules } from '@core';

const result = Validator.validate(value, [
    ValidationRules.required(),
    ValidationRules.email()
]);
```

### HttpClient
```typescript
import { HttpClient } from '@core';

const client = new HttpClient({ baseUrl: 'https://api.example.com' });
const data = await client.get('/api/data');
```

### CacheService
```typescript
import { CacheService } from '@core';

const cache = CacheService.getInstance();
cache.set('key', data, 300000); // 5 minutes TTL
const cached = cache.get('key');
```

See `src/core/README.md` and `src/core/examples/CoreServicesExamples.ts` for detailed examples.

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for data structures
2. **Error Handling**: Use ErrorHandler from core services for consistent error messages
3. **Logging**: Use Logger from core services for debugging and monitoring
4. **Configuration**: Use ConfigService for all configuration needs
5. **Service Layer**: Always use service classes instead of direct API calls
6. **Component Structure**: Keep components small and focused
7. **Reusability**: Extract common logic into hooks or utilities
8. **Service Factory**: Use ServiceFactory for centralized service management
9. **Core Services**: Prefer core services over legacy utilities in `src/utils/`

## Configuration

### iHub Configuration

iHub service can be configured in several ways:

1. **Environment Variables**:
   ```bash
   REACT_APP_IHUB_BASE_URL=https://api.ihub.example.com
   REACT_APP_IHUB_API_KEY=your-api-key
   ```

2. **Service Factory** (recommended):
   ```typescript
   const serviceFactory = new ServiceFactory(context);
   const iHubService = serviceFactory.getiHubService({
       baseUrl: 'https://api.ihub.example.com',
       apiKey: 'your-api-key'
   });
   ```

3. **Direct Instantiation**:
   ```typescript
   const iHubService = new iHubService(context, {
       baseUrl: 'https://api.ihub.example.com',
       apiKey: 'your-api-key',
       timeout: 30000,
       retryAttempts: 3
   });
   ```

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check TypeScript version compatibility
- Verify PCF CLI is installed: `pac pcf version`
- Verify all control references in `.pcfproj` are correct

### Runtime Errors
- Check browser console for detailed error messages
- Verify Web API permissions in Dataverse
- Ensure entity names are correct (lowercase, plural)
- Verify iHub configuration (baseUrl, apiKey)

### Type Generation Issues
- Run `npm run refreshTypes` after manifest changes
- Check ControlManifest.Input.xml for syntax errors
- Ensure control folder structure matches expected format

## Additional Resources

- [PCF Documentation](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/overview)
- [Web API Reference](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/overview)
- [PCF Samples](https://github.com/microsoft/PowerApps-Samples)

## License

This project is provided as-is for development purposes.
