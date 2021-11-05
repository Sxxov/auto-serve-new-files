import { ClientError } from './ClientError.js';
export class AssertionError extends ClientError {
    constructor(message, item1, item2) {
        super(`Assertion was false${message ? `: ${message}` : ''}`);
        Object.defineProperty(this, "item1", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: item1
        });
        Object.defineProperty(this, "item2", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: item2
        });
        if (item1 !== undefined || item2 !== undefined) {
            console.error(item1, 'vs', item2);
        }
    }
}
