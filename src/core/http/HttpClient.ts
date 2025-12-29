import {
  HttpRequestConfig,
  HttpResponse,
  IHttpInterceptor,
} from "./HttpInterceptor";
import {
  RetryPolicy,
  DefaultRetryPolicy,
  RetryPolicyHelper,
} from "./RetryPolicy";
import { Logger } from "../logging/Logger";
import { ErrorHandler } from "../error/ErrorHandler";

/**
 * HTTP client configuration
 */
export interface HttpClientConfig {
  baseUrl?: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  retryPolicy?: RetryPolicy;
}

/**
 * HTTP Client with retry logic and interceptors
 */
export class HttpClient {
  private config: HttpClientConfig;
  private interceptors: IHttpInterceptor[] = [];
  private logger: Logger;

  constructor(config: HttpClientConfig = {}) {
    this.config = {
      timeout: 30000,
      defaultHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      retryPolicy: DefaultRetryPolicy,
      ...config,
    };
    this.logger = Logger.getInstance("HttpClient");
  }

  /**
   * Add interceptor
   */
  addInterceptor(interceptor: IHttpInterceptor): void {
    this.interceptors.push(interceptor);
  }

  /**
   * Remove interceptor
   */
  removeInterceptor(interceptor: IHttpInterceptor): void {
    const index = this.interceptors.indexOf(interceptor);
    if (index > -1) {
      this.interceptors.splice(index, 1);
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: "GET",
      ...config,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: Partial<HttpRequestConfig>
  ): Promise<T> {
    return this.request<T>({
      url,
      method: "POST",
      body: data,
      ...config,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: Partial<HttpRequestConfig>
  ): Promise<T> {
    return this.request<T>({
      url,
      method: "PUT",
      body: data,
      ...config,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    url: string,
    config?: Partial<HttpRequestConfig>
  ): Promise<T> {
    return this.request<T>({
      url,
      method: "DELETE",
      ...config,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: Partial<HttpRequestConfig>
  ): Promise<T> {
    return this.request<T>({
      url,
      method: "PATCH",
      body: data,
      ...config,
    });
  }

  /**
   * Execute HTTP request with retry logic
   */
  private async request<T>(requestConfig: HttpRequestConfig): Promise<T> {
    const fullConfig = this.buildRequestConfig(requestConfig);
    const retryPolicy =
      fullConfig.retryPolicy || this.config.retryPolicy || DefaultRetryPolicy;

    let lastError: any;

    for (let attempt = 1; attempt <= retryPolicy.maxAttempts; attempt++) {
      try {
        // Apply request interceptors
        const interceptedConfig = await this.applyRequestInterceptors(
          fullConfig
        );

        // Execute request
        const response = await this.executeRequest<T>(interceptedConfig);

        // Apply response interceptors
        const interceptedResponse = await this.applyResponseInterceptors(
          response
        );

        return interceptedResponse.data;
      } catch (error) {
        lastError = error;

        // Check if should retry
        if (!RetryPolicyHelper.shouldRetry(error, attempt, retryPolicy)) {
          throw error;
        }

        // Calculate delay and wait
        const delay = RetryPolicyHelper.getRetryDelay(
          error,
          attempt,
          retryPolicy
        );
        this.logger.warn(
          `Request failed, retrying (${attempt}/${retryPolicy.maxAttempts})`,
          {
            url: fullConfig.url,
            delay,
          }
        );

        await this.delay(delay);
      }
    }

    // All retries failed
    const errorInfo = ErrorHandler.parse(lastError, {
      operation: fullConfig.method,
      service: "HttpClient",
    });
    throw lastError;
  }

  /**
   * Build full request configuration
   */
  private buildRequestConfig(config: HttpRequestConfig): HttpRequestConfig {
    const url = config.url.startsWith("http")
      ? config.url
      : `${this.config.baseUrl || ""}${config.url}`;

    return {
      ...config,
      url,
      headers: {
        ...this.config.defaultHeaders,
        ...config.headers,
      },
      timeout: config.timeout || this.config.timeout,
      retryPolicy: config.retryPolicy || this.config.retryPolicy,
    };
  }

  /**
   * Execute HTTP request
   */
  private async executeRequest<T>(
    config: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const fetchConfig: RequestInit = {
        method: config.method,
        headers: config.headers,
        signal: controller.signal,
      };

      if (config.body && config.method !== "GET") {
        fetchConfig.body =
          typeof config.body === "string"
            ? config.body
            : JSON.stringify(config.body);
      }

      const response = await fetch(config.url, fetchConfig);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw {
          status: response.status,
          statusText: response.statusText,
          response: await this.parseResponse(response),
        };
      }

      const data = await this.parseResponse<T>(response);
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers,
        config,
      };
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "AbortError"
      ) {
        throw {
          message: "Request timeout",
          code: "TIMEOUT",
          status: 408,
        };
      }

      throw error;
    }
  }

  /**
   * Parse response body
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as T;
    }
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(
    config: HttpRequestConfig
  ): Promise<HttpRequestConfig> {
    let interceptedConfig = config;

    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        interceptedConfig = await interceptor.onRequest(interceptedConfig);
      }
    }

    return interceptedConfig;
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors<T>(
    response: HttpResponse<T>
  ): Promise<HttpResponse<T>> {
    let interceptedResponse = response;

    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        interceptedResponse = await interceptor.onResponse(interceptedResponse);
      }
    }

    return interceptedResponse;
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
