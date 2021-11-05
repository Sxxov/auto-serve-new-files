export class TaskSchedulerSingleton {
    static schedule(task, key = String(Math.random() * Date.now())) {
        this.scheduled.set(key, task);
    }
    static dispatchSync() {
        for (const [, task] of this.scheduled) {
            void task();
        }
    }
    static async dispatch() {
        for (const [, task] of this.scheduled) {
            await task();
        }
    }
    static async dispatchNextTick() {
        await this.dispatchAfter(0);
    }
    static async dispatchAfter(ms) {
        return new Promise((resolve) => {
            if (this.dispatchHandle)
                clearTimeout(this.dispatchHandle);
            this.dispatchHandle = setTimeout(async () => {
                this.dispatchHandle = null;
                for (const [, task] of this.scheduled) {
                    await task();
                }
                resolve();
            }, ms);
        });
    }
}
Object.defineProperty(TaskSchedulerSingleton, "dispatchHandle", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
Object.defineProperty(TaskSchedulerSingleton, "scheduled", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
