/**
 * HTTP request configuration
 */
export interface HttpRequestConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
    retryPolicy?: import('./RetryPolicy').RetryPolicy;
}

/**
 * HTTP response
 */
export interface HttpResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: HttpRequestConfig;
}

/**
 * HTTP interceptor interface
 */
export interface IHttpInterceptor {
    onRequest?(config: HttpRequestConfig): HttpRequestConfig | Promise<HttpRequestConfig>;
    onResponse?<T>(response: HttpResponse<T>): HttpResponse<T> | Promise<HttpResponse<T>>;
    onError?(error: any): any | Promise<any>;
}

/**
 * Request interceptor
 */
export class RequestInterceptor implements IHttpInterceptor {
    constructor(
        public onRequest?: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>
    ) {}
}

/**
 * Response interceptor
 */
export class ResponseInterceptor implements IHttpInterceptor {
    constructor(
        public onResponse?: <T>(response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>,
        public onError?: (error: any) => any | Promise<any>
    ) {}
}

