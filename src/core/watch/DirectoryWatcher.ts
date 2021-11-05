import * as fs from 'fs';
import { AbortController } from 'abort-controller';

export class DirectoryWatcher {
	private abortController = new AbortController();

	constructor(public directory: string) {}

	public watch(listener: fs.WatchListener<string>) {
		return fs.watch(
			this.directory,
			{
				signal: this.abortController.signal,
				encoding: 'utf8',
			},
			listener,
		);
	}

	public abort() {
		this.abortController.abort();
	}
}
