# How PCF Control Calls DataverseService

## Complete Flow Diagram

```
Power Apps Environment
    │
    │ (provides context with webAPI)
    ▼
┌─────────────────────────────────────┐
│  PCF Control Entry Point            │
│  (controls/PASDetailsPCF/index.ts) │
│  - Receives context from Power Apps │
│  - Implements IStandardControl      │
└──────────────┬──────────────────────┘
               │
               │ (passes context as prop)
               ▼
┌─────────────────────────────────────┐
│  React App Component                │
│  (src/frontend/App.tsx)             │
│  - Receives context prop            │
│  - Renders MainContainer            │
└──────────────┬──────────────────────┘
               │
               │ (passes context prop)
               ▼
┌─────────────────────────────────────┐
│  MainContainer Component            │
│  (src/frontend/components/          │
│   MainContainer.tsx)                │
│  - Uses useDataverseData hook       │
└──────────────┬──────────────────────┘
               │
               │ (hook uses context)
               ▼
┌─────────────────────────────────────┐
│  useDataverseData Hook              │
│  (src/frontend/hooks/               │
│   useDataverseData.ts)              │
│  - Creates DataverseService         │
│  - Calls fetchRecords()             │
└──────────────┬──────────────────────┘
               │
               │ (service uses context)
               ▼
┌─────────────────────────────────────┐
│  DataverseService                   │
│  (src/services/DataverseService.ts) │
│  - Uses WebApiService               │
│  - Calls retrieveMultipleRecords()  │
└──────────────┬──────────────────────┘
               │
               │ (uses context.webAPI)
               ▼
┌─────────────────────────────────────┐
│  WebApiService                      │
│  (src/services/WebApiService.ts)    │
│  - Uses context.webAPI              │
│  - Calls Power Apps Web API         │
└──────────────┬──────────────────────┘
               │
               │ (Power Apps Web API)
               ▼
        Dataverse Database
```

## Step-by-Step Code Flow

### Step 1: PCF Control Entry Point

```typescript
// controls/PASDetailsPCF/index.ts
export class PASDetailsPCF implements ComponentFramework.StandardControl {
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Context contains webAPI access
        this._context = context;
        
        // Pass context to React component
        this._props = {
            context: context,  // ← Context passed here
            sampleProperty: context.parameters.sampleProperty.raw,
            onUpdate: this._notifyOutputChanged.bind(this)
        };

        // Render React component with context
        ReactDOM.render(
            React.createElement(App, this._props),
            this._container
        );
    }
}
```

**Key Point**: The `context` object contains `context.webAPI` which is the Power Apps Web API interface.

### Step 2: React App Component

```typescript
// src/frontend/App.tsx
export const App: React.FC<AppProps> = ({ context, sampleProperty, onUpdate }) => {
    // Context is received as prop
    return (
        <MainContainer 
            context={context}  // ← Context passed to child component
            sampleProperty={sampleProperty}
            onUpdate={onUpdate}
        />
    );
};
```

### Step 3: MainContainer Uses Hook

```typescript
// src/frontend/components/MainContainer.tsx
export const MainContainer: React.FC<MainContainerProps> = ({ 
    context,  // ← Context received as prop
    sampleProperty,
    onUpdate 
}) => {
    // Hook uses context to fetch data
    const { data, loading, error, refresh } = useDataverseData(context);
    
    // Component renders based on hook data
    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {data && <div>{JSON.stringify(data)}</div>}
        </div>
    );
};
```

### Step 4: Hook Creates DataverseService

```typescript
// src/frontend/hooks/useDataverseData.ts
export const useDataverseData = (context: ComponentFramework.Context<any>) => {
    // Create DataverseService instance with context
    const dataverseService = new DataverseService(context);  // ← Service created here
    
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Call service method
            const result = await dataverseService.fetchRecords();  // ← Service called here
            setData(result);
        } catch (err) {
            // Error handling
        } finally {
            setLoading(false);
        }
    }, [context]);

    useEffect(() => {
        fetchData();  // Automatically fetch on mount
    }, [fetchData]);

    return { data, loading, error, refresh: fetchData };
};
```

### Step 5: DataverseService Uses WebApiService

```typescript
// src/services/DataverseService.ts
export class DataverseService {
    private context: ComponentFramework.Context<any>;
    private webApiService: WebApiService;
    
    constructor(context: ComponentFramework.Context<any>) {
        this.context = context;  // ← Context stored
        this.webApiService = new WebApiService(context);  // ← WebApiService created
    }

    async fetchRecords(
        entityName: string = 'accounts',
        options?: QueryOptions
    ): Promise<DataverseResponse> {
        // Build query string
        const queryString = this.buildQueryString(options);
        
        // Call WebApiService
        const response = await this.webApiService.retrieveMultipleRecords(
            entityName,
            queryString
        );  // ← WebApiService called here

        return {
            value: response.value || [],
            '@odata.count': response['@odata.count'],
            '@odata.nextLink': response['@odata.nextLink']
        };
    }
}
```

### Step 6: WebApiService Uses Power Apps Web API

```typescript
// src/services/WebApiService.ts
export class WebApiService {
    private context: ComponentFramework.Context<any>;
    
    constructor(context: ComponentFramework.Context<any>) {
        this.context = context;  // ← Context stored
    }

    async retrieveMultipleRecords(
        entitySetName: string,
        queryString?: string
    ): Promise<any> {
        // Direct call to Power Apps Web API
        const response = await this.context.webAPI.retrieveMultipleRecords(
            entitySetName,
            queryString
        );  // ← Power Apps Web API called here
        
        return response;
    }
}
```

**Key Point**: `context.webAPI` is provided by Power Apps and gives access to Dataverse.

## Direct Service Usage (Alternative Pattern)

You can also call DataverseService directly in a component without hooks:

```typescript
// Direct usage in a component
import { DataverseService } from '@services/DataverseService';

export const MyComponent: React.FC<{ context: ComponentFramework.Context<any> }> = ({ context }) => {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            // Create service directly
            const service = new DataverseService(context);
            
            // Call service method
            const result = await service.fetchRecords('accounts', {
                select: ['name', 'emailaddress1'],
                top: 10
            });
            
            setData(result.value);
        };
        
        fetchData();
    }, [context]);
    
    return <div>{JSON.stringify(data)}</div>;
};
```

## Using ServiceFactory (Recommended Pattern)

```typescript
import { ServiceFactory } from '@services/ServiceFactory';

export const MyComponent: React.FC<{ context: ComponentFramework.Context<any> }> = ({ context }) => {
    useEffect(() => {
        const fetchData = async () => {
            // Use ServiceFactory
            const factory = new ServiceFactory(context);
            const service = factory.getDataverseService();
            
            // Call service
            const result = await service.fetchRecords('accounts');
            // ...
        };
        
        fetchData();
    }, [context]);
};
```

## Key Points

1. **Context is the Bridge**: The `context` object flows from Power Apps → PCF Control → React Components → Services
2. **Context.webAPI**: Contains the Power Apps Web API interface for Dataverse access
3. **Service Layer**: DataverseService wraps WebApiService for easier usage
4. **Hooks Pattern**: Custom hooks encapsulate service calls and state management
5. **ServiceFactory**: Centralized service creation (recommended)

## Complete Example

```typescript
// 1. PCF Control receives context
export class PASDetailsPCF {
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        ReactDOM.render(
            React.createElement(App, { context }),  // Pass context
            this._container
        );
    }
}

// 2. React component receives context
export const App = ({ context }) => {
    return <MainContainer context={context} />;  // Pass context
};

// 3. Component uses hook
export const MainContainer = ({ context }) => {
    const { data } = useDataverseData(context);  // Hook uses context
    return <div>{JSON.stringify(data)}</div>;
};

// 4. Hook creates service
export const useDataverseData = (context) => {
    const service = new DataverseService(context);  // Service created
    const result = await service.fetchRecords();  // Service called
    return { data: result };
};

// 5. Service uses WebApiService
export class DataverseService {
    constructor(context) {
        this.webApiService = new WebApiService(context);
    }
    async fetchRecords() {
        return await this.webApiService.retrieveMultipleRecords('accounts');
    }
}

// 6. WebApiService uses Power Apps API
export class WebApiService {
    async retrieveMultipleRecords(entityName) {
        return await this.context.webAPI.retrieveMultipleRecords(entityName);
    }
}
```

## Summary

**The flow is:**
1. Power Apps provides `context` with `context.webAPI`
2. PCF Control passes `context` to React
3. React components pass `context` to hooks or services
4. Hooks/Services create `DataverseService(context)`
5. `DataverseService` uses `WebApiService(context)`
6. `WebApiService` calls `context.webAPI.retrieveMultipleRecords()`
7. Power Apps Web API queries Dataverse

The `context` object is the key - it provides access to Dataverse through `context.webAPI`.

