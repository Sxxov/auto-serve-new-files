import express from 'express';
import https from 'https';
import cors from 'cors';
import * as pathTool from 'path';
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
const server = https.createServer(
	{
		key: `-----BEGIN PRIVATE KEY-----
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
znmD1pgcIXMUq1HLdrfnE/F9cQvmKQ==
-----END PRIVATE KEY-----
`,
		cert: `-----BEGIN CERTIFICATE-----
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
-----END CERTIFICATE-----
`,
	},
	app,
);
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

	const watcher = new DirectoryWatcher(String(directory));

	req.once('close', () => {
		watcher.abort();
	});

	try {
		watcher.watch(async (eventType, filename) => {
			if (eventType === 'rename') return;
			if (filename == null) return;

			const path = pathTool.join(String(directory), filename);

			// if doesn't exist (err thrown) or is directory, return
			try {
				const stat = await fs.stat(path);

				if (stat.isDirectory()) return;
			} catch {
				return;
			}

			const download = new ConsumableDownload(path);

			ConsumableDownloadStore.set(filename, download);

			TaskSchedulerSingleton.schedule(() => {
				res.write(`data: ${download.id}\n\n`);
			}, filename);

			await TaskSchedulerSingleton.dispatchAfter(100);
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

	const found = Array.from(ConsumableDownloadStore.entries()).find(
		([, v]) => v.id === String(id),
	);

	if (found == null) return res.sendStatus(StatusCodes.NOT_FOUND);

	const [key, download] = found;
	const path = download.consume();

	ConsumableDownloadStore.delete(key);

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

server.listen(port, () => {
	console.log(`Listening on ${port}`);
});
