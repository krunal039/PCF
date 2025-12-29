import { IConfigProvider, MemoryConfigProvider, EnvironmentConfigProvider } from './ConfigProvider';
import { Logger } from '../logging/Logger';

/**
 * Configuration service for managing application configuration
 */
export class ConfigService {
    private static instance: ConfigService | null = null;
    private providers: IConfigProvider[] = [];
    private logger: Logger;

    private constructor() {
        this.logger = Logger.getInstance('ConfigService');
        
        // Default providers (order matters - first provider takes precedence)
        this.providers.push(new MemoryConfigProvider());
        this.providers.push(new EnvironmentConfigProvider());
    }

    /**
     * Get singleton instance
     */
    static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    /**
     * Add configuration provider
     */
    addProvider(provider: IConfigProvider, priority: number = 0): void {
        this.providers.splice(priority, 0, provider);
    }

    /**
     * Remove configuration provider
     */
    removeProvider(provider: IConfigProvider): void {
        const index = this.providers.indexOf(provider);
        if (index > -1) {
            this.providers.splice(index, 1);
        }
    }

    /**
     * Get configuration value
     */
    get<T>(key: string, defaultValue?: T): T {
        // Check providers in order
        for (const provider of this.providers) {
            if (provider.has(key)) {
                const value = provider.get<T>(key);
                if (value !== undefined) {
                    return value;
                }
            }
        }

        // Return default if not found
        if (defaultValue !== undefined) {
            return defaultValue;
        }

        this.logger.warn(`Configuration key '${key}' not found and no default provided`);
        throw new Error(`Configuration key '${key}' not found`);
    }

    /**
     * Get configuration value (optional, returns undefined if not found)
     */
    getOptional<T>(key: string, defaultValue?: T): T | undefined {
        try {
            return this.get<T>(key, defaultValue);
        } catch {
            return defaultValue;
        }
    }

    /**
     * Set configuration value (sets in first provider that supports it)
     */
    set(key: string, value: any): void {
        if (this.providers.length > 0) {
            this.providers[0].set(key, value);
        }
    }

    /**
     * Check if configuration key exists
     */
    has(key: string): boolean {
        return this.providers.some(provider => provider.has(key));
    }

    /**
     * Load configuration from object
     */
    load(config: Record<string, any>): void {
        Object.entries(config).forEach(([key, value]) => {
            this.set(key, value);
        });
        this.logger.info('Configuration loaded', { keys: Object.keys(config) });
    }

    /**
     * Get all configuration
     */
    getAll(): Record<string, any> {
        const allConfig: Record<string, any> = {};
        
        // Merge all providers (later providers override earlier ones)
        for (const provider of this.providers) {
            Object.assign(allConfig, provider.getAll());
        }

        return allConfig;
    }

    /**
     * Validate configuration
     */
    validate(requiredKeys: string[]): boolean {
        const missing: string[] = [];

        for (const key of requiredKeys) {
            if (!this.has(key)) {
                missing.push(key);
            }
        }

        if (missing.length > 0) {
            this.logger.error('Configuration validation failed', { missing });
            return false;
        }

        this.logger.info('Configuration validation passed');
        return true;
    }

    /**
     * Clear all configuration
     */
    clear(): void {
        this.providers.forEach(provider => provider.clear());
        this.logger.info('Configuration cleared');
    }
}

