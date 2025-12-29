# Project Structure Overview

## Directory Tree

```
PFCX/
│
├── controls/                           # PCF Controls (Multiple Controls Supported)
│   └── PASDetailsPCF/                 # PAS Details PCF Control
│       ├── ControlManifest.Input.xml  # Control manifest (properties, resources)
│       ├── PASDetailsPCF.pcfproj     # MSBuild project file
│       ├── index.ts                   # Control entry point (implements IStandardControl)
│       ├── css/
│       │   └── PASDetailsPCF.css      # Control-specific styles
│       └── strings/
│           └── PASDetailsPCF.1033.resx # Localization strings (English)
│   └── [Additional Controls...]      # Add more controls here
│
├── src/                                # Shared Source Code
│   │
│   ├── frontend/                       # Frontend Layer
│   │   ├── App.tsx                     # Main React application component
│   │   ├── components/                 # React UI Components
│   │   │   ├── MainContainer.tsx       # Main container component
│   │   │   ├── MainContainer.css       # Container styles
│   │   │   ├── LoadingSpinner.tsx      # Loading indicator
│   │   │   ├── LoadingSpinner.css      # Spinner styles
│   │   │   ├── ErrorBoundary.tsx       # Error boundary component
│   │   │   └── ErrorBoundary.css       # Error boundary styles
│   │   ├── hooks/                      # Custom React Hooks
│   │   │   ├── useDataverseData.ts     # Hook for Dataverse data fetching
│   │   │   └── useiHubData.ts          # Hook for iHub data fetching
│   │   └── README.md                   # Frontend documentation
│   │
│   ├── services/                       # Service Layer (Business Logic)
│   │   ├── DataverseService.ts         # High-level Dataverse operations
│   │   ├── WebApiService.ts            # Low-level Web API wrapper
│   │   ├── iHubService.ts              # iHub API operations
│   │   ├── ServiceFactory.ts           # Service factory for centralized access
│   │   ├── examples/                   # Usage examples
│   │   │   ├── DataverseServiceExamples.ts
│   │   │   └── iHubServiceExamples.ts
│   │   └── README.md                   # Service layer documentation
│   │
│   ├── models/                         # TypeScript Models & Interfaces
│   │   ├── DataverseModels.ts          # Dataverse data models
│   │   ├── iHubModels.ts               # iHub data models
│   │   └── README.md                   # Models documentation
│   │
│   ├── utils/                          # Utility Functions
│   │   ├── Logger.ts                   # Logging utility
│   │   ├── ErrorHandler.ts             # Error handling utilities
│   │   ├── Validation.ts                # Validation utilities
│   │   ├── Constants.ts                # Application constants
│   │   └── README.md                   # Utilities documentation
│   │
│   └── styles/                         # Global Styles
│       └── App.css                     # Global application styles
│
├── .vscode/                            # VS Code Configuration
│   ├── settings.json                   # Editor settings
│   └── extensions.json                 # Recommended extensions
│
├── package.json                        # NPM dependencies & scripts
├── tsconfig.json                       # TypeScript configuration
├── .pcfproj                            # Root PCF project file (references all controls)
├── .eslintrc.json                      # ESLint configuration
├── .gitignore                          # Git ignore rules
├── README.md                           # Main project documentation
└── PROJECT_STRUCTURE.md                # This file
```

## Layer Architecture

### 1. PCF Control Layer (`controls/`)
- **Purpose**: PCF-specific files required by the framework
- **Structure**: Each control has its own folder
- **Files per Control**:
  - `ControlManifest.Input.xml`: Defines control properties, resources, and features
  - `[ControlName].pcfproj`: MSBuild project file
  - `index.ts`: Implements `IStandardControl` interface, bridges PCF and React
  - CSS and localization files
- **Multiple Controls**: Add new folders for additional controls

### 2. Frontend Layer (`src/frontend/`)
- **Purpose**: React-based UI components
- **Components**: Reusable React components
- **Hooks**: Custom hooks for data fetching and state management
- **Styles**: Component-specific CSS

### 3. Service Layer (`src/services/`)
- **Purpose**: Business logic and API integration
- **DataverseService**: High-level Dataverse operations (CRUD, queries)
- **iHubService**: iHub API operations with retry logic
- **WebApiService**: Low-level Web API wrapper
- **ServiceFactory**: Centralized service creation and management
- **Abstraction**: Separates UI from API calls

### 4. Models Layer (`src/models/`)
- **Purpose**: TypeScript type definitions
- **Interfaces**: Entity models, response types, query options
- **Type Safety**: Ensures type safety across the application

### 5. Utilities Layer (`src/utils/`)
- **Purpose**: Reusable utility functions
- **Logger**: Centralized logging
- **ErrorHandler**: Error parsing and formatting
- **Validation**: Input validation
- **Constants**: Application constants

## Data Flow

```
PCF Control (controls/[ControlName]/index.ts)
    ↓
React App (src/frontend/App.tsx)
    ↓
Components (MainContainer, etc.)
    ↓
Hooks (useDataverseData, useiHubData)
    ↓
Service Layer (DataverseService, iHubService)
    ↓
Web API / External APIs
    ↓
Dataverse Web API / iHub API
```

## Multiple Controls Architecture

### Adding a New Control

1. **Create Control Folder**:
   ```
   controls/MyNewControl/
   ```

2. **Create Required Files**:
   - `ControlManifest.Input.xml`
   - `MyNewControl.pcfproj`
   - `index.ts`
   - `css/MyNewControl.css`
   - `strings/MyNewControl.1033.resx`

3. **Add to Root Project**:
   Edit `.pcfproj` and add:
   ```xml
   <ProjectReference Include="$(MSBuildThisFileDirectory)controls\MyNewControl\MyNewControl.pcfproj" />
   ```

4. **Share Codebase**:
   All controls share the same `src/` directory, allowing code reuse across controls.

## Service Integration

### Dataverse Integration
- Uses PowerApps Component Framework Web API
- Direct integration with Dataverse
- No external dependencies

### iHub Integration
- HTTP-based API integration
- Configurable base URL and authentication
- Retry logic with exponential backoff
- Supports GET, POST, PUT, DELETE operations

## Key Design Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Type Safety**: TypeScript interfaces throughout
3. **Reusability**: Services and utilities are reusable across controls
4. **Error Handling**: Centralized error handling
5. **Maintainability**: Clear structure and documentation
6. **Scalability**: Supports multiple controls with shared codebase

## Adding New Features

### Adding a New Component
1. Create component in `src/frontend/components/`
2. Add CSS file if needed
3. Import in `App.tsx` or parent component

### Adding a New Service Method
1. Add method to appropriate service (`DataverseService.ts` or `iHubService.ts`)
2. Use low-level services for API calls
3. Add TypeScript interfaces in `src/models/`

### Adding a New Entity Model
1. Create interface in appropriate model file (`DataverseModels.ts` or `iHubModels.ts`)
2. Extend base interfaces if applicable
3. Use in services and components

### Adding a New Utility
1. Create utility file in `src/utils/`
2. Export functions/classes
3. Import where needed

### Adding a New Control
1. Create folder in `controls/`
2. Create all required PCF files
3. Add reference in `.pcfproj`
4. Share `src/` codebase with other controls
