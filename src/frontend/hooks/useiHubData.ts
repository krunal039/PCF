import { useState, useEffect, useCallback } from 'react';
import { ComponentFramework } from 'powerapps-component-framework';
import { ServiceFactory } from '../../services/ServiceFactory';
import { iHubResponse, iHubQueryOptions } from '../../models/iHubModels';
import { ErrorHandler } from '../../core';

export const useiHubData = (
    context: ComponentFramework.Context<any>,
    endpoint: string,
    options?: iHubQueryOptions
) => {
    const [data, setData] = useState<iHubResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const serviceFactory = new ServiceFactory(context);
    const iHubService = serviceFactory.getiHubService();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await iHubService.fetchData(endpoint, options);
            setData(result);
        } catch (err) {
            const errorMessage = ErrorHandler.getUserMessage(err, {
                service: 'useiHubData',
                operation: 'fetchData',
                entity: endpoint
            });
            setError(errorMessage);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [context, endpoint, JSON.stringify(options)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refresh: fetchData
    };
};


