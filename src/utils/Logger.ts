/**
 * Simple Logger utility for PCF controls
 */
export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private formatMessage(level: string, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        const argsString = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
        return `[${timestamp}] [${this.context}] [${level}] ${message}${argsString}`;
    }

    info(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('INFO', message, ...args);
        console.log(formattedMessage);
    }

    warn(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('WARN', message, ...args);
        console.warn(formattedMessage);
    }

    error(message: string, ...args: any[]): void {
        const formattedMessage = this.formatMessage('ERROR', message, ...args);
        console.error(formattedMessage);
    }

    debug(message: string, ...args: any[]): void {
        if (process.env.NODE_ENV === 'development') {
            const formattedMessage = this.formatMessage('DEBUG', message, ...args);
            console.debug(formattedMessage);
        }
    }
}


