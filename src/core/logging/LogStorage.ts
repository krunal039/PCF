import { LogEntry } from "./LogFormatter";
import { LogLevel } from "./LogLevel";

/**
 * Log storage interface
 */
export interface ILogStorage {
  store(entry: LogEntry): void;
  retrieve(level?: LogLevel, limit?: number): LogEntry[];
  clear(): void;
  getSize(): number;
}

/**
 * In-memory log storage implementation
 */
export class MemoryLogStorage implements ILogStorage {
  private logs: LogEntry[] = [];
  private maxSize: number = 1000;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  store(entry: LogEntry): void {
    this.logs.push(entry);

    // Maintain max size
    if (this.logs.length > this.maxSize) {
      this.logs.shift();
    }
  }

  retrieve(level?: LogLevel, limit?: number): LogEntry[] {
    let filtered =
      level !== undefined
        ? this.logs.filter((log) => log.level >= level)
        : [...this.logs];

    if (limit !== undefined && limit > 0) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  clear(): void {
    this.logs = [];
  }

  getSize(): number {
    return this.logs.length;
  }
}

/**
 * LocalStorage log storage implementation (optional)
 */
export class LocalStorageLogStorage implements ILogStorage {
  private key: string = "pcf_logs";
  private maxSize: number = 100;

  constructor(key: string = "pcf_logs", maxSize: number = 100) {
    this.key = key;
    this.maxSize = maxSize;
  }

  store(entry: LogEntry): void {
    try {
      const logs = this.retrieve();
      logs.push(entry);

      // Maintain max size
      if (logs.length > this.maxSize) {
        logs.shift();
      }

      localStorage.setItem(this.key, JSON.stringify(logs));
    } catch (error) {
      // localStorage might be full or unavailable
      console.warn("Failed to store log in localStorage:", error);
    }
  }

  retrieve(level?: LogLevel, limit?: number): LogEntry[] {
    try {
      const stored = localStorage.getItem(this.key);
      if (!stored) return [];

      let logs: LogEntry[] = JSON.parse(stored);

      if (level !== undefined) {
        logs = logs.filter((log) => log.level >= level);
      }

      if (limit !== undefined && limit > 0) {
        logs = logs.slice(-limit);
      }

      return logs;
    } catch (error) {
      console.warn("Failed to retrieve logs from localStorage:", error);
      return [];
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.warn("Failed to clear logs from localStorage:", error);
    }
  }

  getSize(): number {
    return this.retrieve().length;
  }
}
