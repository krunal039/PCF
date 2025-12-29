# PAS Details PCF - Developer Guide

A comprehensive PowerApps Component Framework (PCF) project with modern architecture, supporting multiple controls, Dataverse integration, and iHub service layer.

## Quick Start

### Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn**
- **PowerApps CLI** (`pac` CLI)
  ```bash
  npm install -g @microsoft/powerapps-cli
  ```

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Build the project
npm run build

# 3. Generate TypeScript types (first time only)
npm run refreshTypes

# 4. Start development server
npm start
```

The test harness will open at `http://localhost:8181`

## Architecture Overview

### Project Structure

```
PFCX/
├── controls/                    # PCF Controls (supports multiple)
│   └── PASDetailsPCF/          # Control implementation
│       ├── ControlManifest.Input.xml
│       ├── PASDetailsPCF.pcfproj
│       ├── index.ts            # Control entry point
│       ├── css/
│       └── strings/
│
├── src/                         # Shared source code
│   ├── core/                    # Core Services (shared across controls)
│   │   ├── logging/            # Enhanced logging
│   │   ├── error/              # Error handling
│   │   ├── validation/         # Validation engine
│   │   ├── configuration/      # Config management
│   │   ├── http/               # HTTP client
│   │   └── cache/              # Caching service
│   │
│   ├── services/                # Business Services
│   │   ├── DataverseService.ts
│   │   ├── iHubService.ts
│   │   ├── WebApiService.ts
│   │   └── ServiceFactory.ts
│   │
│   ├── frontend/                # React UI Layer
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── models/                  # TypeScript interfaces
│   └── utils/                   # Legacy utilities (backward compat)
│
└── package.json
```

### Architecture Layers

```
┌─────────────────────────────────────┐
│   PCF Control Layer                 │
│   (controls/PASDetailsPCF/)        │
│   - Control Manifest                │
│   - Entry Point (index.ts)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Frontend Layer                     │
│   (src/frontend/)                    │
│   - React Components                 │
│   - Custom Hooks                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Service Layer                      │
│   (src/services/)                    │
│   - DataverseService                 │
│   - iHubService                      │
│   - ServiceFactory                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Core Services Layer                │
│   (src/core/)                        │
│   - Logger, ErrorHandler             │
│   - ConfigService, Validator          │
│   - HttpClient, CacheService         │
└──────────────────────────────────────┘
```

## Core Services Architecture

### 1. Logging Service (`src/core/logging/`)

**Purpose**: Centralized logging with multiple levels and optional storage

**Usage**:

```typescript
import { Logger, LogLevel } from "@core";

const logger = Logger.getInstance("MyService");
logger.setLogLevel(LogLevel.DEBUG);
logger.info("Service started", { metadata });
logger.error("Error occurred", error, { context });
logger.time("operation");
// ... do work ...
logger.timeEnd("operation");
```

**Features**:

- Log levels: TRACE, DEBUG, INFO, WARN, ERROR
- Structured logging
- Optional storage (memory/localStorage)
- Performance timing

### 2. Error Handling (`src/core/error/`)

**Purpose**: Unified error categorization and handling

**Usage**:

```typescript
import { ErrorHandler } from "@core";

try {
  // operation
} catch (error) {
  const message = ErrorHandler.getUserMessage(error, {
    service: "MyService",
    operation: "fetchData",
  });
  await ErrorHandler.report(error, { service: "MyService" });
}
```

**Error Categories**:

- NETWORK, AUTHENTICATION, AUTHORIZATION
- VALIDATION, BUSINESS, SYSTEM, UNKNOWN

### 3. Configuration Service (`src/core/configuration/`)

**Purpose**: Centralized configuration management

**Usage**:

```typescript
import { ConfigService, DefaultConfig } from "@core";

const config = ConfigService.getInstance();
config.load(DefaultConfig);
const baseUrl = config.get<string>("iHub.baseUrl");
config.set("iHub.apiKey", "your-key");
```

**Providers**:

- Memory (runtime configuration)
- Environment (process.env)

### 4. Validation Service (`src/core/validation/`)

**Purpose**: Rules-based validation engine

**Usage**:

```typescript
import { Validator, ValidationRules } from "@core";

const result = Validator.validate(email, [
  ValidationRules.required("Email required"),
  ValidationRules.email("Invalid format"),
]);

// Entity validation
const schema = {
  name: [ValidationRules.required(), ValidationRules.length(1, 100)],
  email: [ValidationRules.required(), ValidationRules.email()],
};
const entityResult = Validator.validateEntity(user, schema);
```

### 5. HTTP Client (`src/core/http/`)

**Purpose**: Common HTTP client with retry and interceptors

**Usage**:

```typescript
import { HttpClient } from "@core";

const client = new HttpClient({
  baseUrl: "https://api.example.com",
  timeout: 30000,
  retryPolicy: {
    maxAttempts: 3,
    baseDelay: 1000,
    exponentialBackoff: true,
  },
});

// Add interceptors
client.addInterceptor({
  onRequest: (config) => {
    config.headers["Authorization"] = "Bearer token";
    return config;
  },
});

const data = await client.get("/api/data");
const result = await client.post("/api/data", { name: "value" });
```

### 6. Cache Service (`src/core/cache/`)

**Purpose**: In-memory caching with TTL

**Usage**:

```typescript
import { CacheService } from "@core";

const cache = CacheService.getInstance();
cache.set("key", data, 300000); // 5 minutes TTL
const cached = cache.get("key");
cache.invalidate("pattern*");
const stats = cache.getStats();
```

## Service Layer

### DataverseService

High-level Dataverse operations using Web API.

```typescript
import { DataverseService } from "@services/DataverseService";

const service = new DataverseService(context);

// Fetch records
const records = await service.fetchRecords("accounts", {
  select: ["name", "emailaddress1"],
  filter: "statecode eq 0",
  top: 10,
  orderby: "name",
});

// CRUD operations
const recordId = await service.createRecord("accounts", {
  name: "New Account",
});
await service.updateRecord("accounts", recordId, { name: "Updated" });
await service.deleteRecord("accounts", recordId);
```

### iHubService

iHub API operations with automatic retry.

```typescript
import { iHubService } from "@services/iHubService";

const service = new iHubService(context, {
  baseUrl: "https://api.ihub.example.com",
  apiKey: "your-api-key",
  timeout: 30000,
  retryAttempts: 3,
});

// Fetch data
const response = await service.fetchData("/api/pas/details", {
  filters: { status: "active" },
  page: 1,
  pageSize: 10,
  sortBy: "createdDate",
  sortOrder: "desc",
});

// CRUD operations
const createResponse = await service.postData("/api/pas/details", data);
await service.updateData("/api/pas/details/1", data);
await service.deleteData("/api/pas/details/1");
```

### ServiceFactory

Centralized service creation and configuration.

```typescript
import { ServiceFactory } from "@services/ServiceFactory";

const factory = new ServiceFactory(context);

// Get services
const dataverseService = factory.getDataverseService();
const iHubService = factory.getiHubService({
  baseUrl: "https://api.ihub.example.com",
  apiKey: "your-api-key",
});
```

## Frontend Layer

### React Components

```typescript
// src/frontend/App.tsx
import React from "react";
import { MainContainer } from "./components/MainContainer";

export const App: React.FC<AppProps> = ({ context, sampleProperty }) => {
  return <MainContainer context={context} sampleProperty={sampleProperty} />;
};
```

### Custom Hooks

```typescript
// Using Dataverse hook
import { useDataverseData } from "@hooks/useDataverseData";

const { data, loading, error, refresh } = useDataverseData(context);

// Using iHub hook
import { useiHubData } from "@hooks/useiHubData";

const { data, loading, error } = useiHubData(context, "/api/pas/details", {
  page: 1,
  pageSize: 10,
});
```

## Adding a New PCF Control

1. **Create control folder**:

   ```
   controls/MyNewControl/
   ```

2. **Create required files**:

   - `ControlManifest.Input.xml`
   - `MyNewControl.pcfproj`
   - `index.ts`
   - `css/MyNewControl.css`
   - `strings/MyNewControl.1033.resx`

3. **Add to root `.pcfproj`**:

   ```xml
   <ProjectReference Include="$(MSBuildThisFileDirectory)controls\MyNewControl\MyNewControl.pcfproj" />
   ```

4. **Share codebase**: All controls share `src/` directory

## Development Workflow

### Build Commands

```bash
# Build project
npm run build

# Start development server
npm start

# Generate TypeScript types
npm run refreshTypes

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Development Tips

1. **Use Core Services**: Always use core services instead of direct implementations
2. **Error Handling**: Use ErrorHandler for consistent error messages
3. **Logging**: Use Logger for debugging and monitoring
4. **Configuration**: Use ConfigService for all configuration needs
5. **Type Safety**: Leverage TypeScript interfaces throughout

## Code Examples

### Complete Service Usage

```typescript
import { ServiceFactory } from "@services/ServiceFactory";
import { Logger, ErrorHandler, CacheService } from "@core";

export class MyService {
  private logger = Logger.create("MyService");
  private cache = CacheService.getInstance();
  private factory: ServiceFactory;

  constructor(context: ComponentFramework.Context<any>) {
    this.factory = new ServiceFactory(context);
  }

  async fetchData(entityName: string) {
    try {
      this.logger.time("fetchData");

      // Check cache
      const cacheKey = `data:${entityName}`;
      let data = this.cache.get(cacheKey);

      if (!data) {
        // Fetch from Dataverse
        const service = this.factory.getDataverseService();
        const response = await service.fetchRecords(entityName, {
          top: 10,
        });
        data = response.value;

        // Cache result
        this.cache.set(cacheKey, data, 300000);
      }

      this.logger.timeEnd("fetchData");
      return data;
    } catch (error) {
      const errorInfo = ErrorHandler.parse(error, {
        service: "MyService",
        operation: "fetchData",
        entity: entityName,
      });
      this.logger.error("Failed to fetch data", error, errorInfo.context);
      throw error;
    }
  }
}
```

### React Component with Services

```typescript
import React, { useEffect, useState } from "react";
import { ServiceFactory } from "@services/ServiceFactory";
import { ErrorHandler } from "@core";

export const MyComponent: React.FC<{
  context: ComponentFramework.Context<any>;
}> = ({ context }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const factory = new ServiceFactory(context);
        const service = factory.getDataverseService();
        const result = await service.fetchRecords("accounts");
        setData(result.value);
      } catch (err) {
        const message = ErrorHandler.getUserMessage(err, {
          service: "MyComponent",
          operation: "fetchData",
        });
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [context]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{JSON.stringify(data)}</div>;
};
```

## TypeScript Path Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of
import { DataverseService } from "../../services/DataverseService";

// Use
import { DataverseService } from "@services/DataverseService";
```

Available aliases:

- `@/*` → `src/*`
- `@components/*` → `src/frontend/components/*`
- `@services/*` → `src/services/*`
- `@models/*` → `src/models/*`
- `@utils/*` → `src/utils/*`
- `@hooks/*` → `src/frontend/hooks/*`
- `@core` → `src/core` (barrel export)

## Deployment

1. **Build for production**:

   ```bash
   npm run build
   ```

2. **Create solution** in Power Apps

3. **Add PCF controls** to solution

4. **Export solution** (managed/unmanaged)

5. **Import** into target environment

## Key Concepts

### Multiple Controls Support

- Each control in `controls/` directory
- All controls share `src/` codebase
- Centralized core services

### Service Layer Pattern

- Business services (DataverseService, iHubService)
- Core services (Logger, ErrorHandler, etc.)
- ServiceFactory for centralized creation

### Error Handling Strategy

- Categorize errors automatically
- User-friendly messages
- Error reporting integration
- Retry logic support

### Configuration Management

- Multiple providers (Memory, Environment)
- Priority-based resolution
- Type-safe access
- Default values

## Troubleshooting

### Build Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type Errors

```bash
npm run refreshTypes
```

### Port Conflicts

Change port in `package.json` scripts or close conflicting applications

## Additional Resources

- [PCF Documentation](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/overview)
- [Web API Reference](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/overview)
- [PCF Samples](https://github.com/microsoft/PowerApps-Samples)

## Best Practices

1. Use core services for logging, errors, config
2. Use ServiceFactory for service creation
3. Provide error context for better debugging
4. Use TypeScript interfaces for type safety
5. Leverage caching for performance
6. Use path aliases for cleaner imports
7. Keep components small and focused
8. Extract reusable logic into hooks/services

---

**Ready to develop?** Start with `npm install && npm run build && npm start`
