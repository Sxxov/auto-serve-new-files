import { ExtendableStore } from './ExtendableStore.js';
export class MapStore extends ExtendableStore {
    constructor(isWritable) {
        super(new Map(), isWritable);
    }
    // @ts-expect-error Forcefully override `#set`
    set(key, value) {
        this.value.set(key, value);
        this.trigger();
        return this;
    }
    setStore(value) {
        super.set(value);
    }
    delete(key) {
        const result = this.value.delete(key);
        if (result) {
            this.trigger();
        }
        return result;
    }
    clear() {
        this.value.clear();
        this.trigger();
    }
    getOrAssign(key, value) {
        let result = this.get(key);
        if (result === undefined) {
            result = value;
            this.set(key, value);
        }
        return result;
    }
    getOrAssignFromFactory(key, valueFactory) {
        let result = this.get(key);
        if (result === undefined) {
            result = valueFactory();
            this.set(key, result);
        }
        return result;
    }
}
