// this is a harness for imagemagick-bridge.mjs for running it on Node and
// using it to do file I/O

import { init_imagemagick, ImageMagick, MagickGeometry, FORMATS, summarize_errors } from './imagemagick-bridge.mjs';
import { extname } from 'node:path';
import { createRequire } from 'node:module';
import fs from "node:fs";

let hasInit = false;
async function init() {
	if (hasInit) return;

	const require = createRequire(import.meta.url);
	const wasmPath = require.resolve('@imagemagick/magick-wasm/magick.wasm');
	const wasmBytes = fs.readFileSync(wasmPath);
	await init_imagemagick(wasmBytes);

	hasInit = true;
}

export async function process_image(inputpath, outputpath, processorfunc) {
	await init();

	const inputbytes = fs.readFileSync(inputpath);
	const format = FORMATS[extname(outputpath).toLowerCase()];
	if (!format) throw new Error(`Unsupported output extension: ${outputpath}`);

	let output;
	try {
		await ImageMagick.read(
			new Uint8Array(inputbytes),
			async (image) => {
				await processorfunc(image, MagickGeometry);
				image.write(format, (data) => {
					output = Buffer.from(data);
				});
			},
		);
	} catch (error) {
		throw summarize_errors(error);
	}
	fs.writeFileSync(outputpath, output);
}
