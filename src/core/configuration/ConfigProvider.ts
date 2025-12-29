/**
 * Configuration provider interface
 */
export interface IConfigProvider {
  get<T>(key: string, defaultValue?: T): T | undefined;
  set(key: string, value: any): void;
  has(key: string): boolean;
  getAll(): Record<string, any>;
  clear(): void;
}

/**
 * Environment-based configuration provider
 */
export class EnvironmentConfigProvider implements IConfigProvider {
  private prefix: string;

  constructor(prefix: string = "REACT_APP_") {
    this.prefix = prefix;
  }

  get<T>(key: string, defaultValue?: T): T | undefined {
    const envKey = `${this.prefix}${key.toUpperCase().replace(/\./g, "_")}`;
    const value = process.env[envKey];

    if (value === undefined) {
      return defaultValue;
    }

    // Try to parse JSON
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  set(key: string, value: any): void {
    // Environment variables are read-only in browser
    console.warn("Cannot set environment variables in browser");
  }

  has(key: string): boolean {
    const envKey = `${this.prefix}${key.toUpperCase().replace(/\./g, "_")}`;
    return process.env[envKey] !== undefined;
  }

  getAll(): Record<string, any> {
    const config: Record<string, any> = {};
    const prefix = this.prefix;

    Object.keys(process.env).forEach((key) => {
      if (key.startsWith(prefix)) {
        const configKey = key
          .substring(prefix.length)
          .toLowerCase()
          .replace(/_/g, ".");
        config[configKey] = process.env[key];
      }
    });

    return config;
  }

  clear(): void {
    // Environment variables cannot be cleared
    console.warn("Cannot clear environment variables");
  }
}

/**
 * In-memory configuration provider
 */
export class MemoryConfigProvider implements IConfigProvider {
  private config: Record<string, any> = {};

  get<T>(key: string, defaultValue?: T): T | undefined {
    const value = this.getNestedValue(this.config, key);
    return value !== undefined ? (value as T) : defaultValue;
  }

  set(key: string, value: any): void {
    this.setNestedValue(this.config, key, value);
  }

  has(key: string): boolean {
    return this.getNestedValue(this.config, key) !== undefined;
  }

  getAll(): Record<string, any> {
    return { ...this.config };
  }

  clear(): void {
    this.config = {};
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split(".");
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }
}
