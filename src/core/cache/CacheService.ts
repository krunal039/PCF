import { Logger } from '../logging/Logger';

/**
 * Cache entry
 */
interface CacheEntry<T> {
    value: T;
    timestamp: number;
    ttl?: number;
}

/**
 * Cache statistics
 */
export interface CacheStats {
    size: number;
    hits: number;
    misses: number;
    hitRate: number;
}

/**
 * Cache service for in-memory caching
 */
export class CacheService {
    private static instance: CacheService | null = null;
    private cache: Map<string, CacheEntry<any>> = new Map();
    private maxSize: number = 100;
    private hits: number = 0;
    private misses: number = 0;
    private logger: Logger;

    private constructor() {
        this.logger = Logger.getInstance('CacheService');
    }

    /**
     * Get singleton instance
     */
    static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    /**
     * Get value from cache
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        
        if (!entry) {
            this.misses++;
            return null;
        }

        // Check if expired
        if (entry.ttl) {
            const age = Date.now() - entry.timestamp;
            if (age > entry.ttl) {
                this.cache.delete(key);
                this.misses++;
                this.logger.debug(`Cache entry expired: ${key}`);
                return null;
            }
        }

        this.hits++;
        return entry.value as T;
    }

    /**
     * Set value in cache
     */
    set<T>(key: string, value: T, ttl?: number): void {
        // Remove oldest entries if at max size
        if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        const entry: CacheEntry<T> = {
            value,
            timestamp: Date.now(),
            ttl
        };

        this.cache.set(key, entry);
        this.logger.debug(`Cache entry set: ${key}`, { ttl });
    }

    /**
     * Check if key exists in cache
     */
    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        // Check if expired
        if (entry.ttl) {
            const age = Date.now() - entry.timestamp;
            if (age > entry.ttl) {
                this.cache.delete(key);
                return false;
            }
        }

        return true;
    }

    /**
     * Remove entry from cache
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
        this.logger.info('Cache cleared');
    }

    /**
     * Invalidate entries matching pattern
     */
    invalidate(pattern: string | RegExp): number {
        let count = 0;
        const regex = typeof pattern === 'string' 
            ? new RegExp(pattern.replace(/\*/g, '.*')) 
            : pattern;

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
                count++;
            }
        }

        this.logger.info(`Cache invalidated: ${count} entries`, { pattern });
        return count;
    }

    /**
     * Get cache statistics
     */
    getStats(): CacheStats {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? this.hits / total : 0;

        return {
            size: this.cache.size,
            hits: this.hits,
            misses: this.misses,
            hitRate: hitRate
        };
    }

    /**
     * Set maximum cache size
     */
    setMaxSize(size: number): void {
        this.maxSize = size;
        
        // Remove oldest entries if over limit
        while (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }

    /**
     * Get all cache keys
     */
    keys(): string[] {
        return Array.from(this.cache.keys());
    }
}

