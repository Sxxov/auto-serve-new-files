export type TaskSchedulerTask = (() => void) | (() => Promise<void>);

export class TaskSchedulerSingleton {
	private static dispatchHandle: ReturnType<typeof setTimeout> | null = null;
	public static scheduled: Map<string, TaskSchedulerTask> = new Map();

	public static schedule(
		task: TaskSchedulerTask,
		key = String(Math.random() * Date.now()),
	) {
		this.scheduled.set(key, task);
	}

	public static dispatchSync() {
		for (const [, task] of this.scheduled) {
			void task();
		}
	}

	public static async dispatch() {
		for (const [, task] of this.scheduled) {
			await task();
		}
	}

	public static async dispatchNextTick() {
		await this.dispatchAfter(0);
	}

	public static async dispatchAfter(ms: number) {
		return new Promise<void>((resolve) => {
			if (this.dispatchHandle) clearTimeout(this.dispatchHandle);

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
