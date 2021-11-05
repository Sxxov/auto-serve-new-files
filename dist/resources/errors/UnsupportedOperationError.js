import { ClientError } from './ClientError.js';
export class UnsupportedOperationError extends ClientError {
    constructor(message) {
        super(`Unsupported operation${message ? `: ${message}` : ''}`);
    }
}
