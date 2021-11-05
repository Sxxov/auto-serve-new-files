import { IllegalAssignmentError, IllegalInvocationError, } from '../../../../errors';
export class AbstractStore {
    constructor() {
        Object.defineProperty(this, "isWritable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    seal() {
        if (!this.isWritable) {
            throw new IllegalInvocationError('Cannot seal non-writable store', this.constructor.name + '#seal()');
        }
        this.isWritable = false;
        const { set } = this;
        this.set = this.nonWritableSet;
        return set.bind(this);
    }
    nonWritableSet(_) {
        throw new IllegalAssignmentError('This store is not writable', 'PrimitiveStore#value');
    }
}
