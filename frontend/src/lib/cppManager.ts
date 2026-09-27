import MainModuleFactory from "./cpp/cpp_module";

export const JPEG_QUALITY = 85;

export interface FileFormat {
	/** much match the name in the islandData */
	name: string;

	/** file extension for the file download. Does *not* include the dot */
	ext: string;

	/**
	 * {@link https://www.iana.org/assignments/media-types#image|Super useful resource for MIME types}
	 */
	mimeType: string;

	/** the conversion function */
	func: (input: Uint8Array) => Uint8Array;
}

export class CppManager {
	formats: FileFormat[] = [];

	constructor() {}

	async init() {
		const Module = await MainModuleFactory();

		this.formats = [
			// https://en.wikipedia.org/wiki/PNG
			{
				name: "PNG",
				ext: "png",
				mimeType: "image/png",
				func: (input: Uint8Array) => Module.convert_to_png(input),
			},

			// https://en.wikipedia.org/wiki/JPEG
			{
				name: "JPEG",
				ext: "jpg",
				mimeType: "image/jpeg",
				func: (input: Uint8Array) =>
					Module.convert_to_jpeg(input, JPEG_QUALITY),
			},

			// https://en.wikipedia.org/wiki/BMP_file_format
			{
				name: "BMP",
				ext: "bmp",
				mimeType: "image/bmp",
				func: (input: Uint8Array) => Module.convert_to_bmp(input),
			},

			// https://en.wikipedia.org/wiki/Truevision_TGA
			// Ive literally never heard of this format lol
			{
				name: "TGA",
				ext: "tga",

				// apparently this mime type is unofficial and unregistered
				mimeType: "image/x-targa",
				func: (input: Uint8Array) => Module.convert_to_tga(input),
			},

			// https://en.wikipedia.org/wiki/RGBE_image_format
			{
				name: "HDR",
				ext: "hdr",
				mimeType: "image/vnd.radiance",
				func: (input: Uint8Array) => Module.convert_to_hdr(input),
			},
		];
	}

	findFormat(name: string): FileFormat | undefined {
		return this.formats.find((x) => x.name === name);
	}
}
