import { Log } from '../../core/log/Log.js';
export class ClientError extends Error {
    constructor(message = 'No message provided, an error with errors?', isSilent = false) {
        super(message);
        this.name = this.constructor.name;
        // eslint is drunk
        // eslint-disable-next-line
        Error.captureStackTrace?.(this, this.constructor);
        if (!isSilent)
            Log.debug(`new ${this.stack ?? this.message}`);
    }
    static from(obj) {
        const clientError = new this();
        clientError.name = obj.name;
        clientError.message = obj.message;
        clientError.stack = obj.stack;
        return clientError;
    }
    toPlainObject() {
        return {
            name: this.name,
            message: this.message,
            stack: this.stack,
        };
    }
}
