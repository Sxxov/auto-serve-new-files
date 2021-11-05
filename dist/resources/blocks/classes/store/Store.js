// copied from svelte's implementation
import { AbstractStore } from './stores/AbstractStore.js';
export const STORE_SET_KEY = Symbol('set');
export class Store extends AbstractStore {
    constructor(value, isWritable = true) {
        super();
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
        });
        Object.defineProperty(this, "isWritable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: isWritable
        });
        Object.defineProperty(this, "subscribers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "subscriberQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "stop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    static neq(a, b) {
        // @ts-expect-error unknown assignment
        // eslint-disable-next-line no-self-compare, eqeqeq, no-negated-condition
        return a != a
            ? // eslint-disable-next-line no-self-compare, eqeqeq
                b == b
            : a !== b
                || (a && typeof a === 'object')
                || typeof a === 'function';
    }
    [STORE_SET_KEY](newValue) {
        if (Store.neq(this.value, newValue)) {
            this.value = newValue;
            this.trigger();
        }
    }
    set(newValue) {
        this[STORE_SET_KEY](newValue);
    }
    trigger() {
        if (!this.stop) {
            return;
        }
        // only run store when last trigger call is finished
        const runQueue = this.subscriberQueue.length === 0;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.subscribers.length; i += 1) {
            const s = this.subscribers[i];
            s[1]();
            this.subscriberQueue.push(s, this.value);
        }
        if (runQueue) {
            for (let i = 0; i < this.subscriberQueue.length; i += 2) {
                this.subscriberQueue[i][0](this.subscriberQueue[i + 1]);
            }
            // mark store as runnable again
            this.subscriberQueue.length = 0;
        }
    }
    update(fn) {
        this.set(fn(this.value));
    }
    subscribe(run, invalidate = () => { }) {
        const subscriber = [run, invalidate];
        this.subscribers.push(subscriber);
        if (this.subscribers.length === 1) {
            this.stop = () => { };
        }
        run(this.value);
        return () => {
            this.unsubscribe(subscriber);
        };
    }
    subscribeLazy(run, invalidate = () => { }) {
        const subscriber = [run, invalidate];
        this.subscribers.push(subscriber);
        if (this.subscribers.length === 1) {
            this.stop = () => { };
        }
        return () => {
            this.unsubscribe(subscriber);
        };
    }
    unsubscribe(subscriber) {
        const index = this.subscribers.indexOf(subscriber);
        if (index !== -1) {
            this.subscribers.splice(index, 1);
        }
        if (this.subscribers.length === 0) {
            this.stop?.();
            this.stop = null;
        }
    }
}
