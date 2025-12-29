/**
 * Example usage of iHubService
 * This file demonstrates how to use the iHubService in your components
 */

import { ComponentFramework } from 'powerapps-component-framework';
import { iHubService } from '../iHubService';
import { iHubConfig, iHubQueryOptions } from '../../models/iHubModels';

// Example: Initialize iHub Service
export function exampleInitializeiHub(context: ComponentFramework.Context<any>): iHubService {
    const config: Partial<iHubConfig> = {
        baseUrl: 'https://api.ihub.example.com',
        apiKey: 'your-api-key-here',
        timeout: 30000,
        retryAttempts: 3
    };

    const service = new iHubService(context, config);
    return service;
}

// Example: Fetching data from iHub
export async function exampleFetchData(context: ComponentFramework.Context<any>) {
    const service = exampleInitializeiHub(context);

    const options: iHubQueryOptions = {
        filters: {
            status: 'active',
            category: 'PAS'
        },
        page: 1,
        pageSize: 10,
        sortBy: 'createdDate',
        sortOrder: 'desc',
        fields: ['id', 'title', 'status', 'createdDate']
    };

    const response = await service.fetchData('/api/pas/details', options);
    
    console.log('Fetched data from iHub:', response.data);
    return response;
}

// Example: Fetching with simple filter
export async function exampleFetchWithFilter(context: ComponentFramework.Context<any>) {
    const service = exampleInitializeiHub(context);

    const response = await service.fetchData('/api/pas/details', {
        filters: 'status eq "active"',
        pageSize: 20
    });

    return response;
}

// Example: Posting data to iHub
export async function examplePostData(context: ComponentFramework.Context<any>) {
    const service = exampleInitializeiHub(context);

    const data = {
        title: 'New PAS Detail',
        description: 'Description of the PAS detail',
        status: 'draft',
        category: 'PAS'
    };

    const response = await service.postData('/api/pas/details', data);
    
    console.log('Posted data to iHub:', response.data);
    return response;
}

// Example: Updating data in iHub
export async function exampleUpdateData(
    context: ComponentFramework.Context<any>,
    recordId: string
) {
    const service = exampleInitializeiHub(context);

    const data = {
        title: 'Updated PAS Detail',
        status: 'active'
    };

    const response = await service.updateData(`/api/pas/details/${recordId}`, data);
    
    console.log('Updated data in iHub:', response.data);
    return response;
}

// Example: Deleting data from iHub
export async function exampleDeleteData(
    context: ComponentFramework.Context<any>,
    recordId: string
) {
    const service = exampleInitializeiHub(context);

    const response = await service.deleteData(`/api/pas/details/${recordId}`);
    
    console.log('Deleted data from iHub');
    return response;
}

// Example: Executing a custom action
export async function exampleExecuteAction(context: ComponentFramework.Context<any>) {
    const service = exampleInitializeiHub(context);

    const parameters = {
        actionType: 'process',
        recordIds: ['id1', 'id2', 'id3'],
        options: {
            notify: true,
            async: false
        }
    };

    const response = await service.executeAction('processPASDetails', parameters);
    
    console.log('Executed action:', response.data);
    return response;
}

// Example: Using in a React component hook
export function exampleUseInHook(context: ComponentFramework.Context<any>) {
    const service = exampleInitializeiHub(context);

    const fetchPASDetails = async (pasId: string) => {
        try {
            const response = await service.fetchData(`/api/pas/details/${pasId}`, {
                fields: ['id', 'title', 'description', 'status']
            });
            return response;
        } catch (error) {
            console.error('Error fetching PAS details:', error);
            throw error;
        }
    };

    const createPASDetail = async (data: Record<string, any>) => {
        try {
            const response = await service.postData('/api/pas/details', data);
            return response;
        } catch (error) {
            console.error('Error creating PAS detail:', error);
            throw error;
        }
    };

    return {
        fetchPASDetails,
        createPASDetail
    };
}

// Example: Updating configuration at runtime
export function exampleUpdateConfig(context: ComponentFramework.Context<any>) {
    const service = exampleInitializeiHub(context);

    // Update configuration
    service.updateConfig({
        apiKey: 'new-api-key',
        timeout: 60000
    });

    return service;
}


