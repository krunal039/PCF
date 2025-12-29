import { LogLevel, LogLevelNames } from "./LogLevel";
import { LogEntry, LogFormatter } from "./LogFormatter";
import { ILogStorage, MemoryLogStorage } from "./LogStorage";

/**
 * Logger configuration
 */
export interface LoggerConfig {
  defaultLevel?: LogLevel;
  enableStorage?: boolean;
  storage?: ILogStorage;
  enableConsole?: boolean;
  enableStructuredLogging?: boolean;
}

/**
 * Enhanced Logger with configuration and storage support
 */
export class Logger {
  private static instance: Logger | null = null;
  private config: LoggerConfig;
  private context: string;
  private timers: Map<string, number> = new Map();

  private constructor(context: string, config?: LoggerConfig) {
    this.context = context;
    this.config = {
      defaultLevel: LogLevel.INFO,
      enableStorage: false,
      enableConsole: true,
      enableStructuredLogging: false,
      ...config,
    };

    if (this.config.enableStorage && !this.config.storage) {
      this.config.storage = new MemoryLogStorage();
    }
  }

  /**
   * Get or create logger instance (singleton pattern)
   */
  static getInstance(context: string = "App", config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(context, config);
    }
    return Logger.instance;
  }

  /**
   * Create a new logger instance with specific context
   */
  static create(context: string, config?: LoggerConfig): Logger {
    return new Logger(context, config);
  }

  /**
   * Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.config.defaultLevel = level;
  }

  /**
   * Get current log level
   */
  getLogLevel(): LogLevel {
    return this.config.defaultLevel || LogLevel.INFO;
  }

  /**
   * Log a message
   */
  private log(
    level: LogLevel,
    message: string,
    metadata?: any,
    error?: Error
  ): void {
    const currentLevel = this.getLogLevel();

    // Skip if level is below threshold
    if (level < currentLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      metadata,
      error,
    };

    // Console output
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Storage
    if (this.config.enableStorage && this.config.storage) {
      this.config.storage.store(entry);
    }
  }

  /**
   * Log to console
   */
  private logToConsole(entry: LogEntry): void {
    const formatted = this.config.enableStructuredLogging
      ? JSON.stringify(LogFormatter.formatStructured(entry), null, 2)
      : LogFormatter.format(entry);

    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.log(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
    }
  }

  /**
   * Log trace message
   */
  trace(message: string, metadata?: any): void {
    this.log(LogLevel.TRACE, message, metadata);
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: any): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: any): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: any): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | any, metadata?: any): void {
    const err = error instanceof Error ? error : undefined;
    const meta = error instanceof Error ? metadata : error || metadata;
    this.log(LogLevel.ERROR, message, meta, err);
  }

  /**
   * Start a performance timer
   */
  time(label: string): void {
    this.timers.set(label, performance.now());
  }

  /**
   * End a performance timer and log the duration
   */
  timeEnd(label: string): number | null {
    const startTime = this.timers.get(label);
    if (startTime === undefined) {
      this.warn(`Timer '${label}' was not started`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(label);
    this.debug(`Timer '${label}' completed`, {
      duration: `${duration.toFixed(2)}ms`,
    });

    return duration;
  }

  /**
   * Get stored logs
   */
  getStoredLogs(level?: LogLevel, limit?: number): LogEntry[] {
    if (!this.config.enableStorage || !this.config.storage) {
      return [];
    }
    return this.config.storage.retrieve(level, limit);
  }

  /**
   * Clear stored logs
   */
  clearStoredLogs(): void {
    if (this.config.enableStorage && this.config.storage) {
      this.config.storage.clear();
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.config.enableStorage && !this.config.storage) {
      this.config.storage = new MemoryLogStorage();
    }
  }
}
