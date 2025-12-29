# Changelog

## Project Restructure - PASDetailsPCF

### Changes Made

#### 1. Project Renamed
- **Old Name**: ComplexPCFControl
- **New Name**: PASDetailsPCF
- All references updated across the project

#### 2. Multiple Controls Support
- **New Structure**: Controls are now in `controls/` directory
- **Before**: Single control in root `ComplexPCFControl/` folder
- **After**: Multiple controls supported in `controls/[ControlName]/` folders
- **Root `.pcfproj`**: Updated to reference controls from `controls/` directory

#### 3. iHub Service Layer Added
- **New Service**: `src/services/iHubService.ts`
  - Full CRUD operations (GET, POST, PUT, DELETE)
  - Retry logic with exponential backoff
  - Configurable timeout and retry attempts
  - Query options support (filters, pagination, sorting)
  - Custom action execution
  
- **New Models**: `src/models/iHubModels.ts`
  - iHubResponse interface
  - iHubRequest interface
  - iHubQueryOptions interface
  - iHubConfig interface
  - PASDetails entity interface

- **New Hook**: `src/frontend/hooks/useiHubData.ts`
  - React hook for iHub data fetching
  - Similar pattern to useDataverseData

- **Service Factory**: `src/services/ServiceFactory.ts`
  - Centralized service creation
  - Singleton pattern for services
  - Configuration management

- **Examples**: `src/services/examples/iHubServiceExamples.ts`
  - Comprehensive usage examples
  - Integration patterns

#### 4. Documentation Updated
- **README.md**: Complete rewrite with new structure
- **PROJECT_STRUCTURE.md**: Updated with multiple controls architecture
- **Service README**: Updated with iHub service documentation

### File Structure Changes

#### Removed
- `ComplexPCFControl/` (old single control structure)

#### Added
- `controls/PASDetailsPCF/` (new control structure)
- `src/services/iHubService.ts`
- `src/services/ServiceFactory.ts`
- `src/models/iHubModels.ts`
- `src/frontend/hooks/useiHubData.ts`
- `src/services/examples/iHubServiceExamples.ts`

#### Modified
- `.pcfproj` - Updated to reference controls from `controls/` directory
- `package.json` - Updated name and description
- All documentation files

### Migration Guide

If you have existing code using the old structure:

1. **Update Imports**: Change any imports from `ComplexPCFControl` to `PASDetailsPCF`
2. **Control References**: Update any references to the control folder
3. **Service Usage**: You can now use both DataverseService and iHubService
4. **Multiple Controls**: To add more controls, create new folders in `controls/`

### New Features

#### iHub Service Usage
```typescript
// Initialize
const iHubService = new iHubService(context, {
    baseUrl: 'https://api.ihub.example.com',
    apiKey: 'your-api-key',
    timeout: 30000,
    retryAttempts: 3
});

// Fetch data
const data = await iHubService.fetchData('/api/pas/details', {
    filters: { status: 'active' },
    page: 1,
    pageSize: 10
});
```

#### Service Factory Usage
```typescript
const factory = new ServiceFactory(context);
const dataverseService = factory.getDataverseService();
const iHubService = factory.getiHubService({ baseUrl: '...', apiKey: '...' });
```

#### Multiple Controls
Add new controls by:
1. Creating folder: `controls/MyNewControl/`
2. Adding required files
3. Adding reference in `.pcfproj`


