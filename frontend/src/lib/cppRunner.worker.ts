import WebpModuleFactory from "./cpp/webp_module";
import ImagecoreModuleFactory from "./cpp/image_core_module";
import SvgModuleFactory from "./cpp/svg_module";

import { type FormatName, JPEG_QUALITY, WEBP_QUALITY } from "./fileManager";

export interface SuccessObj {
	ok: true;
	data: Uint8Array<ArrayBuffer>;
}
export interface FailObj {
	ok: false;
	error: string;
}
export type ReturnObj = SuccessObj | FailObj;

export interface WorkerRequest {
	inBytes: Uint8Array;
	format: FormatName;
}
export type WorkerResponse = ReturnObj;

type FuncMapping = Record<FormatName, (input: Uint8Array) => ReturnObj>;

let funcMappingCache: FuncMapping | null = null;

async function getFuncMapping(): Promise<FuncMapping> {
	if (funcMappingCache !== null) return funcMappingCache;

	const ImageModule = await ImagecoreModuleFactory();
	const WebpModule = await WebpModuleFactory();
	const SvgModule = await SvgModuleFactory();

	funcMappingCache = {
		PNG: (input: Uint8Array) => ImageModule.convert_to_png(input),
		JPEG: (input: Uint8Array) =>
			ImageModule.convert_to_jpeg(input, JPEG_QUALITY),
		BMP: (input: Uint8Array) => ImageModule.convert_to_bmp(input),
		TGA: (input: Uint8Array) => ImageModule.convert_to_tga(input),
		HDR: (input: Uint8Array) => ImageModule.convert_to_hdr(input),
		WebP: (input: Uint8Array) =>
			WebpModule.convert_to_webp(input, WEBP_QUALITY),
		SVG: (input: Uint8Array) => SvgModule.convert_to_svg(input),
	};

	return funcMappingCache;
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
	const inBytes = event.data.inBytes;
	const format = event.data.format;

	const funcMapping = await getFuncMapping();

	// syncronous and very slow, but we're in a worker so who cares
	const result = funcMapping[format](inBytes);

	self.postMessage(result);
};
