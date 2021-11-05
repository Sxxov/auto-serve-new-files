import { WalkUtility } from '../../../utilities';
export class Item {
    /**
     * @internal
     * @deprecated You're probably looking for `Item.from()`
     */
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() { }
    static from(
    // use this adapter type instead of just `InstanceType<T>`
    // to hide protected types & `toString`
    options) {
        const instance = new this();
        WalkUtility.mirror(options, instance);
        return instance;
    }
}
