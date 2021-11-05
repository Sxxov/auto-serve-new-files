import { WalkUtility } from '../../../utilities';
export class Factory {
    constructor(Item) {
        Object.defineProperty(this, "Item", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Item
        });
    }
    create(options) {
        const instance = new this.Item();
        WalkUtility.mirror(options, instance);
        return instance;
    }
}
