import { ComponentFramework } from 'powerapps-component-framework';
import { iHubResponse, iHubRequest, iHubQueryOptions, iHubConfig } from '../models/iHubModels';
import { Logger, ErrorHandler, HttpClient, HttpClientConfig, RetryPolicy } from '../core';

export class iHubService {
    private context: ComponentFramework.Context<any>;
    private logger: Logger;
    private httpClient: HttpClient;
    private config: iHubConfig;

    constructor(context: ComponentFramework.Context<any>, config?: Partial<iHubConfig>) {
        this.context = context;
        this.logger = Logger.create('iHubService');
        
        // Default configuration
        this.config = {
            baseUrl: config?.baseUrl || '',
            apiKey: config?.apiKey || '',
            timeout: config?.timeout || 30000,
            retryAttempts: config?.retryAttempts || 3,
            ...config
        };

        // Create HTTP client with configuration
        const httpConfig: HttpClientConfig = {
            baseUrl: this.config.baseUrl,
            timeout: this.config.timeout,
            defaultHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
            },
            retryPolicy: {
                maxAttempts: this.config.retryAttempts || 3,
                baseDelay: 1000,
                maxDelay: 10000,
                exponentialBackoff: true
            }
        };

        this.httpClient = new HttpClient(httpConfig);
    }

    /**
     * Fetch data from iHub API
     * @param endpoint - API endpoint (e.g., '/api/data')
     * @param options - Query options (filters, pagination, etc.)
     * @returns Promise with iHub response
     */
    async fetchData(
        endpoint: string,
        options?: iHubQueryOptions
    ): Promise<iHubResponse> {
        try {
            this.logger.info(`Fetching data from iHub endpoint: ${endpoint}`);
            
            const queryString = this.buildQueryString(options);
            const url = `${endpoint}${queryString}`;
            
            const response = await this.httpClient.get<iHubResponse>(url);

            return this.formatResponse(response);
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'iHubService',
                operation: 'fetchData',
                entity: endpoint
            });
            this.logger.error('Error fetching data from iHub', error, errorInfo.context);
            throw error;
        }
    }

    /**
     * Post data to iHub API
     * @param endpoint - API endpoint
     * @param data - Data to post
     * @returns Promise with iHub response
     */
    async postData(
        endpoint: string,
        data: Record<string, any>
    ): Promise<iHubResponse> {
        try {
            this.logger.info(`Posting data to iHub endpoint: ${endpoint}`);
            
            const response = await this.httpClient.post<iHubResponse>(endpoint, data);

            return this.formatResponse(response);
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'iHubService',
                operation: 'postData',
                entity: endpoint
            });
            this.logger.error('Error posting data to iHub', error, errorInfo.context);
            throw error;
        }
    }

    /**
     * Update data in iHub API
     * @param endpoint - API endpoint
     * @param data - Data to update
     * @returns Promise with iHub response
     */
    async updateData(
        endpoint: string,
        data: Record<string, any>
    ): Promise<iHubResponse> {
        try {
            this.logger.info(`Updating data in iHub endpoint: ${endpoint}`);
            
            const response = await this.httpClient.put<iHubResponse>(endpoint, data);

            return this.formatResponse(response);
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'iHubService',
                operation: 'updateData',
                entity: endpoint
            });
            this.logger.error('Error updating data in iHub', error, errorInfo.context);
            throw error;
        }
    }

    /**
     * Delete data from iHub API
     * @param endpoint - API endpoint
     * @returns Promise with iHub response
     */
    async deleteData(endpoint: string): Promise<iHubResponse> {
        try {
            this.logger.info(`Deleting data from iHub endpoint: ${endpoint}`);
            
            const response = await this.httpClient.delete<iHubResponse>(endpoint);

            return this.formatResponse(response);
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'iHubService',
                operation: 'deleteData',
                entity: endpoint
            });
            this.logger.error('Error deleting data from iHub', error, errorInfo.context);
            throw error;
        }
    }

    /**
     * Execute a custom iHub action
     * @param actionName - Name of the action
     * @param parameters - Action parameters
     * @returns Promise with iHub response
     */
    async executeAction(
        actionName: string,
        parameters?: Record<string, any>
    ): Promise<iHubResponse> {
        try {
            this.logger.info(`Executing iHub action: ${actionName}`);
            
            const endpoint = `/api/actions/${actionName}`;
            const response = await this.httpClient.post<iHubResponse>(endpoint, parameters || {});

            return this.formatResponse(response);
        } catch (error) {
            const errorInfo = ErrorHandler.parse(error, {
                service: 'iHubService',
                operation: 'executeAction',
                entity: actionName
            });
            this.logger.error('Error executing iHub action', error, errorInfo.context);
            throw error;
        }
    }

    /**
     * Format response from HTTP client to iHub response format
     * @param response - HTTP client response
     * @returns Formatted iHub response
     */
    private formatResponse(response: any): iHubResponse {
        // If response is already in iHub format, return it
        if (response.success !== undefined) {
            return response;
        }

        // Format from HTTP client response
        return {
            success: true,
            data: response.data || response,
            message: response.message || 'Success',
            statusCode: response.status || 200,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Build query string from options
     * @param options - Query options
     * @returns Query string
     */
    private buildQueryString(options?: iHubQueryOptions): string {
        if (!options) return '';

        const queryParams: string[] = [];

        if (options.filters) {
            queryParams.push(`filters=${encodeURIComponent(JSON.stringify(options.filters))}`);
        }

        if (options.page) {
            queryParams.push(`page=${options.page}`);
        }

        if (options.pageSize) {
            queryParams.push(`pageSize=${options.pageSize}`);
        }

        if (options.sortBy) {
            queryParams.push(`sortBy=${options.sortBy}`);
        }

        if (options.sortOrder) {
            queryParams.push(`sortOrder=${options.sortOrder}`);
        }

        if (options.fields) {
            queryParams.push(`fields=${options.fields.join(',')}`);
        }

        return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    }

    /**
     * Update configuration
     * @param config - Partial configuration to update
     */
    updateConfig(config: Partial<iHubConfig>): void {
        this.config = { ...this.config, ...config };
        
        // Update HTTP client configuration
        if (config.baseUrl || config.timeout || config.retryAttempts) {
            const httpConfig: HttpClientConfig = {
                baseUrl: this.config.baseUrl,
                timeout: this.config.timeout,
                defaultHeaders: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
                },
                retryPolicy: {
                    maxAttempts: this.config.retryAttempts || 3,
                    baseDelay: 1000,
                    maxDelay: 10000,
                    exponentialBackoff: true
                }
            };
            
            // Create new HTTP client with updated config
            this.httpClient = new HttpClient(httpConfig);
        }
        
        this.logger.info('iHub configuration updated');
    }
}


