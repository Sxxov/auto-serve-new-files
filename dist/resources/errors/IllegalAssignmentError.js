import { ClientError } from './ClientError.js';
export class IllegalAssignmentError extends ClientError {
    constructor(message, variableName) {
        super(`Illegal assignment${variableName ? ` (to ${variableName})` : ''}${message ? `: ${message}` : ''}`);
    }
}
