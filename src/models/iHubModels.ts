/**
 * iHub Service Models
 */

/**
 * iHub API Response
 */
export interface iHubResponse {
    success: boolean;
    data: any;
    message?: string;
    statusCode?: number;
    timestamp?: string;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

/**
 * iHub API Request
 */
export interface iHubRequest {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: Record<string, any>;
    headers?: Record<string, string>;
}

/**
 * iHub Query Options
 */
export interface iHubQueryOptions {
    filters?: Record<string, any> | string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    fields?: string[];
}

/**
 * iHub Service Configuration
 */
export interface iHubConfig {
    baseUrl: string;
    apiKey?: string;
    timeout?: number;
    retryAttempts?: number;
    headers?: Record<string, string>;
}

/**
 * Example: PAS Details Entity
 */
export interface PASDetails {
    id?: string;
    pasId?: string;
    title?: string;
    description?: string;
    status?: string;
    createdDate?: string;
    modifiedDate?: string;
    createdBy?: string;
    modifiedBy?: string;
    [key: string]: any;
}

/**
 * Example: iHub API Error Response
 */
export interface iHubError {
    error: {
        code: string;
        message: string;
        details?: {
            field?: string;
            value?: any;
            constraint?: string;
        }[];
    };
    statusCode: number;
    timestamp: string;
}


