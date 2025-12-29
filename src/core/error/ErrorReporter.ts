import { ErrorInfo } from "./ErrorTypes";
import { ErrorFormatter } from "./ErrorFormatter";
import { Logger } from "../logging/Logger";

/**
 * Error reporter interface
 */
export interface IErrorReporter {
  report(error: ErrorInfo): void | Promise<void>;
}

/**
 * Console error reporter (default)
 */
export class ConsoleErrorReporter implements IErrorReporter {
  private logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || Logger.getInstance("ErrorReporter");
  }

  report(error: ErrorInfo): void {
    const message = ErrorFormatter.formatLogMessage(error);
    this.logger.error(message, error.originalError, error.context);
  }
}

/**
 * Error reporter service
 */
export class ErrorReporter {
  private static reporters: IErrorReporter[] = [];
  private static defaultReporter: IErrorReporter;

  static {
    ErrorReporter.defaultReporter = new ConsoleErrorReporter();
    ErrorReporter.reporters.push(ErrorReporter.defaultReporter);
  }

  /**
   * Add error reporter
   */
  static addReporter(reporter: IErrorReporter): void {
    ErrorReporter.reporters.push(reporter);
  }

  /**
   * Remove error reporter
   */
  static removeReporter(reporter: IErrorReporter): void {
    const index = ErrorReporter.reporters.indexOf(reporter);
    if (index > -1) {
      ErrorReporter.reporters.splice(index, 1);
    }
  }

  /**
   * Report error to all reporters
   */
  static async report(error: ErrorInfo): Promise<void> {
    const promises = ErrorReporter.reporters.map((reporter) => {
      try {
        return Promise.resolve(reporter.report(error));
      } catch (err) {
        console.error("Error in error reporter:", err);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }
}
