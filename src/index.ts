import express from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import { validate as validateUuid } from 'uuid';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { DirectoryPermissionChecker } from './core/watch/DirectoryPermissionChecker.js';
import { DirectoryWatcher } from './core/watch/DirectoryWatcher.js';
import { TaskSchedulerSingleton } from './core/watch/TaskSchedulerSingleton.js';
import { ConsumableDownloadStore } from './core/watch/ConsumableDownloadStore.js';
import { ConsumableDownload } from './core/watch/ConsumableDownload.js';
import indexHtml from './routes/index.html.js';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 8080;

app.use(
	cors(),
	express.json(),
	express.urlencoded({
		extended: true,
	}),
);

app.get('/api/v1/sse/watch', async (req, res) => {
	const {
		query: { directory },
	} = req;

	if (!directory) return res.sendStatus(StatusCodes.BAD_REQUEST);

	if (!new DirectoryPermissionChecker(String(directory)).isPermitted())
		return res.sendStatus(StatusCodes.FORBIDDEN);

	res.writeHead(StatusCodes.OK, {
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
		'Cache-Control': 'no-cache',
	});

	const watcher = new DirectoryWatcher(directory as string);

	req.once('close', () => {
		watcher.abort();
	});

	try {
		watcher.watch((eventType, filename) => {
			TaskSchedulerSingleton.schedule(async () => {
				// if doesn't exist (err thrown) or is directory, return
				try {
					const stat = await fs.stat(filename);

					if (stat.isDirectory()) return;
				} catch {
					return;
				}

				const download = new ConsumableDownload(filename);

				ConsumableDownloadStore.set(download.id, download);

				res.write(`data: ${download.id}\n\n`);
			});

			void TaskSchedulerSingleton.dispatchNextTick();
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			if (err.name === 'AbortError') return;
		}

		throw err;
	}
});

app.get('/api/v1/download', (req, res) => {
	const {
		query: { id },
	} = req;

	if (!id || !validateUuid(String(id)))
		return res.sendStatus(StatusCodes.BAD_REQUEST);

	const download = ConsumableDownloadStore.get(id as string);

	if (download == null) return res.sendStatus(StatusCodes.NOT_FOUND);

	const path = download.consume();

	ConsumableDownloadStore.delete(String(id));

	res.download(path!);
});

app.get('/', async (req, res) => {
	const {
		query: { directory },
	} = req;

	if (!directory) return res.sendStatus(StatusCodes.BAD_REQUEST);

	if (!new DirectoryPermissionChecker(String(directory)).isPermitted())
		return res.sendStatus(StatusCodes.FORBIDDEN);

	res.setHeader('Content-type', 'text/html');
	res.send(indexHtml);
});

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
