import ImageModuleFactory, {
	type MainModule as ImageModule,
} from "./cpp/image_core_module";
import WebpModuleFactory, {
	type MainModule as WebpModule,
} from "./cpp/webp_module";
import SvgModuleFactory, {
	type MainModule as SvgModule,
} from "./cpp/svg_module";

import { type FormatName, JPEG_QUALITY, WEBP_QUALITY } from "./fileManager";

type Bytes = Uint8Array<ArrayBuffer>;

export interface SuccessObj {
	ok: true;
	data: Bytes;
}
export interface FailObj {
	ok: false;
	error: string;
}
export type ReturnObj = SuccessObj | FailObj;

export interface WorkerRequest {
	inBytes: Bytes;
	outFormat: FormatName;
}
export type WorkerResponse = ReturnObj;

type OutFuncMapping = Record<FormatName, (input: Bytes) => ReturnObj>;

interface Modules {
	image: ImageModule;
	webp: WebpModule;
	svg: SvgModule;
}

let moduleCache: Modules | null = null;

async function getModules(): Promise<Modules> {
	if (moduleCache !== null) return moduleCache;

	moduleCache = {
		image: await ImageModuleFactory(),
		webp: await WebpModuleFactory(),
		svg: await SvgModuleFactory(),
	};

	return moduleCache;
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
	const inBytes = event.data.inBytes;
	const outFormat = event.data.outFormat;

	const modules = await getModules();

	const outFuncMapping: OutFuncMapping = {
		PNG: (input: Bytes) => modules.image.convert_to_png(input),
		JPEG: (input: Bytes) => modules.image.convert_to_jpeg(input, JPEG_QUALITY),
		BMP: (input: Bytes) => modules.image.convert_to_bmp(input),
		TGA: (input: Bytes) => modules.image.convert_to_tga(input),
		HDR: (input: Bytes) => modules.image.convert_to_hdr(input),
		WebP: (input: Bytes) => modules.webp.convert_to_webp(input, WEBP_QUALITY),
		SVG: (input: Bytes) => modules.svg.convert_to_svg(input),
	};

	// syncronous and very slow, but we're in a worker so who cares
	const result = outFuncMapping[outFormat](inBytes);

	self.postMessage(result);
};
