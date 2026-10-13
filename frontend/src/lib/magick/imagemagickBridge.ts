import * as magickModule from "@imagemagick/magick-wasm";
import magickWasmUrl from "@imagemagick/magick-wasm/magick.wasm?url";

export class ImageError extends Error {
	constructor(
		public code: string,
		message: string,
	) {
		super(message);
		this.name = "ImageError";
	}
}

let isinit = false;

export async function initImagemagick() {
	if (isinit) return;

	const wasmUrl = new URL(magickWasmUrl, import.meta.url);
	const response = await fetch(wasmUrl);
	const wasmBuffer = await response.arrayBuffer();
	await magickModule.initializeImageMagick(new Uint8Array(wasmBuffer));

	isinit = true;
}

export const MAGICK_BY_NAME = {
	png: magickModule.MagickFormat.Png,
	gif: magickModule.MagickFormat.Gif,
	avif: magickModule.MagickFormat.Avif,
	tiff: magickModule.MagickFormat.Tiff,
	ico: magickModule.MagickFormat.Ico,
	heic: magickModule.MagickFormat.Heic,
	jxl: magickModule.MagickFormat.Jxl,
	qoi: magickModule.MagickFormat.Qoi,
	psd: magickModule.MagickFormat.Psd,
};

export const MAGICK_PROCESSORS = {
	ico: (image: magickModule.IMagickImage) => {
		if (image.width > 256 || image.height > 256) {
			image.resize(new magickModule.MagickGeometry(256, 256));
		}
	},
};

export async function convertBytes(
	bytes: magickModule.ByteArray,
	format: magickModule.MagickFormat,
	quality: number,
	processor: (image: magickModule.IMagickImage) => void,
): Promise<Buffer> {
	await initImagemagick();
	try {
		magickModule.ImageMagick.read(bytes, (image) => {
			if (quality != null) image.quality = quality;
			if (processor) processor(image);
			image.write(format, (data) => {
				return Uint8Array.from(data);
			});
		});
	} catch (error) {
		if (error instanceof Error) throw summarizeErrors(error);
	}
	throw new Error("unexpected error occurred");
}

export async function detectFormat(bytes: magickModule.ByteArray) {
	await initImagemagick();
	try {
		let name = "unknown";
		magickModule.ImageMagick.read(bytes, (image) => {
			name = String(image.format).toLowerCase();
		});
		return name;
	} catch {
		return "unknown";
	}
}

export const FORMATS = {
	".png": magickModule.MagickFormat.Png,
	".jpg": magickModule.MagickFormat.Jpeg,
	".jpeg": magickModule.MagickFormat.Jpeg,
	".jpe": magickModule.MagickFormat.Jpeg,
	".bmp": magickModule.MagickFormat.Bmp,
	".webp": magickModule.MagickFormat.WebP,
	".gif": magickModule.MagickFormat.Gif,
	".avif": magickModule.MagickFormat.Avif,
	".tiff": magickModule.MagickFormat.Tiff,
	".tif": magickModule.MagickFormat.Tif,
	".heic": magickModule.MagickFormat.Heic,
	".heif": magickModule.MagickFormat.Heif,
	".jxl": magickModule.MagickFormat.Jxl,
	".ico": magickModule.MagickFormat.Ico,
	".psd": magickModule.MagickFormat.Psd,
	".pdf": magickModule.MagickFormat.Pdf, // FIX add document conversion
	".eps": magickModule.MagickFormat.Eps,
	".ai": magickModule.MagickFormat.Ai,
	".ora": magickModule.MagickFormat.Ora,
	".xcf": magickModule.MagickFormat.Xcf,
	".qoi": magickModule.MagickFormat.Qoi,
	".exr": magickModule.MagickFormat.Exr,

	//camera formats
	".raw": magickModule.MagickFormat.Raw,
	".dng": magickModule.MagickFormat.Dng,
	".cr2": magickModule.MagickFormat.Cr2,
	".cr3": magickModule.MagickFormat.Cr3,
	".nef": magickModule.MagickFormat.Nef,
	".arw": magickModule.MagickFormat.Arw,
	".orf": magickModule.MagickFormat.Orf,
	".rw2": magickModule.MagickFormat.Rw2,
	".raf": magickModule.MagickFormat.Raf,
	".pef": magickModule.MagickFormat.Pef,
	".srw": magickModule.MagickFormat.Srw,
	".x3f": magickModule.MagickFormat.X3f,
	".3fr": magickModule.MagickFormat.ThreeFr,
	".fff": magickModule.MagickFormat.Fff,
	".iiq": magickModule.MagickFormat.Iiq,
	".mos": magickModule.MagickFormat.Mos,
	".mrw": magickModule.MagickFormat.Mrw,
} satisfies Record<`.${string}`, magickModule.MagickFormat>;

function summarizeErrors(error: Error) {
	const m = /^(\w+)\s*(?:`([^']*)')?/.exec(error?.message ?? "");
	const code = m?.[1] ?? "Unknown";
	const detail = m?.[2] || "";

	switch (code) {
		case "NoEncodeDelegateForThisImageFormat":
			return new ImageError(
				code,
				`Can't write ${detail}: format is read-only or not in this build`,
			);
		case "NoDecodeDelegateForThisImageFormat":
			return new ImageError(
				code,
				`Can't read ${detail}: format is not supported`,
			);
		case "WidthOrHeightExceedsLimit":
			return new ImageError(
				code,
				`Image is too large for this format (ICO max is 256x256)`,
			);
		default:
			return new ImageError(code, error?.message ?? String(error));
	}
}

export async function processImage(
	inputBytes: Buffer,
	outExt: keyof typeof FORMATS,
	processorFunc: (
		image: magickModule.IMagickImage,
		module: typeof magickModule,
	) => Promise<void>,
): Promise<Buffer> {
	await initImagemagick();

	const format = FORMATS[outExt];
	if (!format) throw new Error(`Unsupported output extension: ${outExt}`);

	try {
		await magickModule.ImageMagick.read(
			new Uint8Array(inputBytes),
			async (image) => {
				await processorFunc(image, magickModule);
				image.write(format, (data) => {
					return Buffer.from(data);
				});
			},
		);
	} catch (error) {
		if (error instanceof Error) throw summarizeErrors(error);
	}

	throw new Error("unexpected error ocurred");
}
