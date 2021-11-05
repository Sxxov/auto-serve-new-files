const main = async () => {
	const params = new URLSearchParams(location.search);
	const directory = String(params.get('directory'));
	const filename = params.get('filename') ?? 'stuff';
	const events = new EventSource(`/api/v1/sse/watch?directory=${directory}`);

	const button: HTMLButtonElement = document.querySelector('#directory')!;
	let file:
		| (WritableStream & {
				write(data: BufferSource | Blob | string): Promise<void>;
				seek(): Promise<void>;
				truncate(): Promise<void>;
		  })
		| null = null;

	button.addEventListener('click', async () => {
		/* eslint-disable
			@typescript-eslint/no-unsafe-call,
			@typescript-eslint/no-unsafe-assignment,
			@typescript-eslint/no-unsafe-member-access
		*/
		const directoryHandle = await (window as any).showDirectoryPicker();
		const fileHandle = await directoryHandle.getFileHandle(filename, {
			create: true,
		});
		file = await fileHandle.createWritable();

		/* eslint-enable */

		document.title = `Watching: ${directory}`;

		button.disabled = true;
		button.innerText = '✔️';

		events.addEventListener('message', async (event) => {
			const id = String(event.data);
			const blob = await (
				await fetch(`/api/v1/download?id=${id}`)
			).blob();

			file?.write(blob);
			console.log(`Written file(${filename}) with data(${id})`);
		});
	});
};

export default /* html */ `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0"
			/>
			<title>...</title>
			<style>
				body {
					display: grid;
					justify-items: center;
					align-items: center;
					margin: 0;
					height: 100vh;
					width: 100%;
				}

				button {
					padding: 16px 32px;
					border-radius: 32px;
					border: none;
					color: #f88f;
					cursor: pointer;

					background: #f882;
					transform: scale(1);

					transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
				}

				button:hover:not(:disabled):not(:active) {
					background: #fff2;
					transform: scale(1.1);
				}

				button:active {
					background: #f88f;
					transform: scale(0.9);
				}

				button:disabled {
					background: #0001;
					color: #000f;

					pointer-events: none;
				}
			</style>
		</head>
		<body>
			<button id='directory'><b>pick save location</b></button>
			<script type="module">
				(${main.toString()})();
			</script>
		</body>
	</html>
`;
