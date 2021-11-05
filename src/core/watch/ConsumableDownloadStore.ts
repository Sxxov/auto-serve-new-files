import { MapStore } from '../../resources/blocks/classes/store/stores/MapStore.js';
import type { ConsumableDownload } from './ConsumableDownload.js';

export const ConsumableDownloadStore = new MapStore<
	string,
	ConsumableDownload
>();
