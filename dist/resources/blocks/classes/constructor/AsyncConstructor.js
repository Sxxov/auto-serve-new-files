import { IllegalInvocationError } from '../../../errors';
export class AsyncConstructor {
    constructor() {
        if (!this.constructor.isBeingInstantiated) {
            throw new IllegalInvocationError(`Constructor was called directly. (Use "await ${this?.constructor?.name ?? '[unknown]'}.new()" instead)`);
        }
        this.constructor.isBeingInstantiated =
            false;
    }
    static async new(..._args) {
        this.brace();
        return undefined;
    }
    static brace() {
        this.isBeingInstantiated = true;
    }
}
Object.defineProperty(AsyncConstructor, "isBeingInstantiated", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
