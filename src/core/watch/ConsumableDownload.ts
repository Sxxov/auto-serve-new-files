import { v4 as uuid } from 'uuid';

export class ConsumableDownload {
	public id = uuid();
	public isConsumed = false;

	constructor(private path: string) {}

	public consume() {
		if (this.isConsumed) return null;
		return this.path;
	}
}
