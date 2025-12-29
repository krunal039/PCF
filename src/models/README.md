# Models

This directory contains TypeScript interfaces and type definitions for the application.

## DataverseModels.ts

Contains:
- **DataverseResponse**: Response structure from Dataverse queries
- **DataverseRecord**: Individual record structure
- **QueryOptions**: Options for querying Dataverse
- **Entity Interfaces**: TypeScript interfaces for common entities (Account, Contact, etc.)
- **WebApiError**: Error response structure

## Adding New Models

1. Add interface to appropriate file or create new file
2. Export the interface
3. Import in services/components where needed

## Example

```typescript
export interface CustomEntity extends BaseEntityFields {
    customentityid?: string;
    customfield?: string;
}
```


