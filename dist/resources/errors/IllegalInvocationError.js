import { ClientError } from './ClientError.js';
export class IllegalInvocationError extends ClientError {
    constructor(message, methodName) {
        super(`Illegal invocation${methodName ? ` (to ${methodName})` : ''}${message ? `: ${message}` : ''}`);
    }
}
