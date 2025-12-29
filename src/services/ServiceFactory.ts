import { ComponentFramework } from 'powerapps-component-framework';
import { DataverseService } from './DataverseService';
import { iHubService } from './iHubService';
import { iHubConfig } from '../models/iHubModels';
import { ConfigService, DefaultConfig } from '../core';

/**
 * Service Factory for creating service instances
 * Centralizes service creation and configuration
 */
export class ServiceFactory {
    private context: ComponentFramework.Context<any>;
    private dataverseService: DataverseService | null = null;
    private iHubService: iHubService | null = null;

    constructor(context: ComponentFramework.Context<any>) {
        this.context = context;
        
        // Initialize ConfigService with default configuration
        const config = ConfigService.getInstance();
        config.load(DefaultConfig);
    }

    /**
     * Get or create DataverseService instance
     * @returns DataverseService instance
     */
    getDataverseService(): DataverseService {
        if (!this.dataverseService) {
            this.dataverseService = new DataverseService(this.context);
        }
        return this.dataverseService;
    }

    /**
     * Get or create iHubService instance
     * @param config - Optional iHub configuration
     * @returns iHubService instance
     */
    getiHubService(config?: Partial<iHubConfig>): iHubService {
        if (!this.iHubService) {
            // You can get configuration from context parameters or environment
            const defaultConfig: Partial<iHubConfig> = {
                baseUrl: this.getiHubBaseUrl(),
                apiKey: this.getiHubApiKey(),
                timeout: 30000,
                retryAttempts: 3,
                ...config
            };
            
            this.iHubService = new iHubService(this.context, defaultConfig);
        } else if (config) {
            // Update existing service configuration
            this.iHubService.updateConfig(config);
        }
        
        return this.iHubService;
    }

    /**
     * Get iHub base URL from context or environment
     * @returns Base URL string
     */
    private getiHubBaseUrl(): string {
        const config = ConfigService.getInstance();
        return config.getOptional<string>('iHub.baseUrl') || 
               config.getOptional<string>('REACT_APP_IHUB_BASE_URL') || 
               '';
    }

    /**
     * Get iHub API key from context or environment
     * @returns API key string
     */
    private getiHubApiKey(): string {
        const config = ConfigService.getInstance();
        return config.getOptional<string>('iHub.apiKey') || 
               config.getOptional<string>('REACT_APP_IHUB_API_KEY') || 
               '';
    }

    /**
     * Reset services (useful for testing or reconfiguration)
     */
    reset(): void {
        this.dataverseService = null;
        this.iHubService = null;
    }
}


