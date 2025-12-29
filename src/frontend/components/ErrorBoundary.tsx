import React, { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
    children?: ReactNode;
    error?: string;
    onRetry?: () => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError || this.props.error) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <h3>Something went wrong</h3>
                        <p>{this.props.error || this.state.error?.message || 'An unexpected error occurred'}</p>
                        {this.props.onRetry && (
                            <button onClick={this.props.onRetry} className="retry-button">
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}


