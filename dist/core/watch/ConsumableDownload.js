import { v4 as uuid } from 'uuid';
export class ConsumableDownload {
    constructor(path) {
        Object.defineProperty(this, "path", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: path
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: uuid()
        });
        Object.defineProperty(this, "isConsumed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    consume() {
        if (this.isConsumed)
            return null;
        return this.path;
    }
}
