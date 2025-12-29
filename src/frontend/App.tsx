import React, { useEffect, useState } from 'react';
import { ComponentFramework } from 'powerapps-component-framework';
import { MainContainer } from './components/MainContainer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import '../styles/App.css';

export interface AppProps {
    context: ComponentFramework.Context<any>;
    sampleProperty?: string;
    onUpdate?: () => void;
}

export const App: React.FC<AppProps> = ({ context, sampleProperty, onUpdate }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize component
        const initialize = async () => {
            try {
                setIsLoading(true);
                // Add initialization logic here
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulated loading
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setIsLoading(false);
            }
        };

        initialize();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <ErrorBoundary error={error} onRetry={() => window.location.reload()} />
        );
    }

    return (
        <ErrorBoundary>
            <div className="app-container">
                <MainContainer 
                    context={context}
                    sampleProperty={sampleProperty}
                    onUpdate={onUpdate}
                />
            </div>
        </ErrorBoundary>
    );
};


