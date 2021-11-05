import * as fs from 'fs';
import { AbortController } from 'abort-controller';
export class DirectoryWatcher {
    constructor(directory) {
        Object.defineProperty(this, "directory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: directory
        });
        Object.defineProperty(this, "abortController", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new AbortController()
        });
    }
    watch(listener) {
        return fs.watch(this.directory, {
            signal: this.abortController.signal,
            encoding: 'utf8',
        }, listener);
    }
    abort() {
        this.abortController.abort();
    }
}
