import { ClientError } from './ClientError.js';
export class IllegalArgumentError extends ClientError {
    constructor(message, paramName) {
        super(`Illegal argument${paramName ? ` (caused by ${paramName})` : ''}${message ? `: ${message}` : ''}`);
    }
}
