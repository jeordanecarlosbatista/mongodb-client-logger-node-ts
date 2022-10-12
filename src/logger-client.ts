import { v4 as uuid } from 'uuid';

enum LEVEL {
    INFO = 'info',
    WARN = 'warn',
    DEBUG = 'debug',
    ERROR = 'error',
    TRACE = 'trace'
}

export default class Logger {
    private logger?: Console = console;
    private requestId: string = uuid();

    constructor(private readonly serviceName: string, private readonly environment: string) { }

    private getData = (message: string, level: string, logData: any = null) => {
        return {
            time: new Date().getTime(),
            serviceName: this.serviceName,
            environment: this.environment,
            requestId: this.requestId,
            message,
            level,
            logData
        }
    }

    setRequestId(id: string): void {
        this.requestId = id;
    }

    getRequestId(): string {
        return this.requestId;
    }

    info(message: string, data?: any): void {
        const log = this.getData(message, LEVEL.INFO, data);
        this.logger?.info(message, JSON.stringify(log));
    }

    error(message: string, data?: any): void {
        const log = this.getData(message, LEVEL.ERROR, data);
        this.logger?.error(message, JSON.stringify(log));
    }

    warn(message: string, data?: any): void {
        const log = this.getData(message, LEVEL.WARN, data);
        this.logger?.warn(message, JSON.stringify(log));
    }

    debug(message: string, data?: any): void {
        const log = this.getData(message, LEVEL.DEBUG, data);
        this.logger?.debug(message, JSON.stringify(log));
    }

    trace(message: string, data?: any): void {
        const log = this.getData(message, LEVEL.TRACE, data);
        this.logger?.trace(message, JSON.stringify(log));
    }

    time(message: string): void {
        this.logger?.time(message);
    }

    timeEnd(message: string): void {
        this.logger?.timeEnd(message);
    }
}