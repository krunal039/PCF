# Frontend Layer

This directory contains all React components and frontend logic.

## Structure

- **components/**: Reusable React components
- **hooks/**: Custom React hooks for data fetching and state management
- **App.tsx**: Main application component

## Components

### MainContainer
Main container component that displays the control content.

### LoadingSpinner
Loading indicator component.

### ErrorBoundary
Error boundary component for catching and displaying errors.

## Hooks

### useDataverseData
Custom hook for fetching data from Dataverse.

**Usage:**
```typescript
import { useDataverseData } from '../hooks/useDataverseData';

const { data, loading, error, refresh } = useDataverseData(context);
```

## Adding New Components

1. Create component file in `components/`
2. Create corresponding CSS file if needed
3. Export from component file
4. Import and use in parent components

## Styling

- Component-specific styles should be in `components/[ComponentName].css`
- Global styles are in `../styles/App.css`
- Use CSS modules or regular CSS files


