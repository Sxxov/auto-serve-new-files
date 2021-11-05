import { ExtendableStore } from './ExtendableStore.js';
export class ArrayStore extends ExtendableStore {
    constructor(length = 0, isWritable) {
        super(new Array(length), isWritable);
        Object.defineProperty(this, "currentLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    [Symbol.iterator]() {
        return this.value.values();
    }
    get length() {
        return this.value.length;
    }
    removeAt(index) {
        this.value.splice(index, 1);
        this.trigger();
    }
    remove(...items) {
        items.forEach((item) => {
            const indexOfItem = this.value.indexOf(item);
            this.value.splice(indexOfItem, 1);
        });
        this.trigger();
    }
    setAt(index, newValue) {
        this.value[index] = newValue;
        this.trigger();
        return newValue;
    }
    getAt(index) {
        return this.value[index];
    }
    push(...items) {
        const result = this.value.push(...items);
        this.trigger();
        return result;
    }
    pop() {
        const result = this.value.pop();
        this.trigger();
        return result;
    }
    shift() {
        const result = this.value.shift();
        this.trigger();
        return result;
    }
    unshift(...items) {
        const result = this.value.unshift(...items);
        this.trigger();
        return result;
    }
    splice(start, deleteCount, ...replacements) {
        const result = replacements.length > 0
            ? this.value.splice(start, deleteCount, ...replacements)
            : this.value.splice(start, deleteCount);
        this.trigger();
        return result;
    }
    reverse() {
        this.value.reverse();
        this.trigger();
        return this;
    }
    sort(compareFn) {
        this.value.sort(compareFn);
        this.trigger();
        return this;
    }
    append(array) {
        const result = this.value.push(...array);
        this.trigger();
        return result;
    }
}
