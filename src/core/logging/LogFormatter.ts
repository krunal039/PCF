import { LogLevel, LogLevelNames } from "./LogLevel";

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: any;
  error?: Error;
}

/**
 * Log formatter for formatting log entries
 */
export class LogFormatter {
  /**
   * Format log entry as string
   */
  static format(entry: LogEntry): string {
    const levelName = LogLevelNames[entry.level];
    const timestamp = entry.timestamp;
    const context = entry.context;
    const message = entry.message;

    let formatted = `[${timestamp}] [${context}] [${levelName}] ${message}`;

    if (entry.metadata) {
      formatted += ` ${JSON.stringify(entry.metadata)}`;
    }

    if (entry.error) {
      formatted += `\nError: ${entry.error.message}`;
      if (entry.error.stack) {
        formatted += `\nStack: ${entry.error.stack}`;
      }
    }

    return formatted;
  }

  /**
   * Format log entry as structured object
   */
  static formatStructured(entry: LogEntry): Record<string, any> {
    return {
      timestamp: entry.timestamp,
      level: LogLevelNames[entry.level],
      context: entry.context,
      message: entry.message,
      metadata: entry.metadata,
      error: entry.error
        ? {
            message: entry.error.message,
            stack: entry.error.stack,
            name: entry.error.name,
          }
        : undefined,
    };
  }
}
