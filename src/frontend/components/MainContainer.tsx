import React from 'react';
import { ComponentFramework } from 'powerapps-component-framework';
import { useDataverseData } from '../../hooks/useDataverseData';
import './MainContainer.css';

export interface MainContainerProps {
    context: ComponentFramework.Context<any>;
    sampleProperty?: string;
    onUpdate?: () => void;
}

export const MainContainer: React.FC<MainContainerProps> = ({ 
    context, 
    sampleProperty,
    onUpdate 
}) => {
    const { data, loading, error, refresh } = useDataverseData(context);

    return (
        <div className="main-container">
            <div className="header">
                <h2>Complex PCF Control</h2>
                {sampleProperty && <p>Property: {sampleProperty}</p>}
            </div>
            
            <div className="content">
                {loading && <div>Loading data...</div>}
                {error && <div className="error">Error: {error}</div>}
                {data && (
                    <div className="data-display">
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                )}
                <button onClick={refresh} className="refresh-button">
                    Refresh Data
                </button>
            </div>
        </div>
    );
};


