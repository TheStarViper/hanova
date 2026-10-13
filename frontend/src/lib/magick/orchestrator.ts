import coreFactory, {
	type MainModule as coreModule,
} from "../cpp/image_core_module";
import webpFactory, { type MainModule as WebpModule } from "../cpp/webp_module";
import svgFactory, { type MainModule as SvgModule } from "../cpp/svg_module";

import * as magick from "./imagemagickBridge.js";

export class ConvertError extends Error {
	step: string | undefined;

	constructor(
		public code: string,
		message: string,
		{ step, cause }: { step?: string; cause?: Error } = {},
	) {
		super(message);
		this.name = "ConvertError";
		this.code = code;
		this.step = step;
		this.cause = cause;
	}
}

export function simplifyError(
	error: ConvertError | number | string | Error,
): string {
	if (error instanceof ConvertError) return error.message;

	if (typeof error === "number") {
		return `C++ exception thrown (pointer ${error}); build with -fexceptions or catch it in C++`;
	}

	if (typeof error === "string") {
		return error;
	}

	const message = String(error?.message ?? error);

	const magick = /^(\w+)\s*(?:`([^']*)')?\s*@/.exec(message); //icl i have 0 idea wtf this line does
	if (magick) return `${magick[1]}${magick[2] ? ` (${magick[2]})` : ""}`;

	if (error?.name === "BindingError" || error?.name === "UnboundTypeError") {
		return `embind: ${message.split("\n")[0]}`;
	}

	// if (error?.code && error?.syscall) {
	// 	return `${error.code}: ${error.syscall} ${error.path ?? ""}`.trim();
	// }

	return `${error?.name ?? "Error"}: ${message.split("\n")[0]}`;
}

export const FORMATS = [
	"png",
	"jpg",
	"bmp",
	"hdr",
	"tga",
	"webp",
	"svg",
	"gif",
	"avif",
	"tiff",
	"ico",
	"heic",
	"jxl",
	"qoi",
	"psd",
] as const satisfies string[];
type FormatName = (typeof FORMATS)[number];

//formats that are the same with diff extensions
const ALIASES = {
	jpeg: "jpg",
	jpe: "jpg",
	targa: "tga",
	tif: "tiff",
	heif: "heic",
} as const satisfies Record<string, FormatName>;

const N = FORMATS.length;

interface Modules {
	core: coreModule;
	webp: WebpModule;
	svg: SvgModule;
	magick?: typeof magick;
}
type ConverterFunc = (
	bytes: Buffer<ArrayBuffer>,
	quality?: number,
) => Buffer<ArrayBuffer>;

export function createconverter({ core, webp, svg, magick }: Modules) {
	const unwrap = (r: any) => {
		if (Array.isArray(r) || r instanceof Uint8Array) {
			return r;
		}
		if (r && r.ok === false) {
			throw new Error(
				`native conversion failed: ${r.error ?? r.errorType ?? "unknown error"}`,
			);
		}

		if (r?.data instanceof Uint8Array) {
			const out = r.data.slice();
			r.delete?.();
			return out;
		}
		throw new Error(`unexpected native result: ${Object.keys(r ?? {})}`);
	};

	console.log("core keys:", Object.keys(core ?? {}));
	const table = Array.from({ length: N }, () => Array(N).fill(null));

	function register(
		from: FormatName,
		to: FormatName,
		func: ConverterFunc,
		cost = 1,
	) {
		const fromIdx = FORMATS.indexOf(from);
		const toIdx = FORMATS.indexOf(to);

		if (fromIdx === undefined || toIdx === undefined) {
			throw new Error(`register: unknown format ${from} -> ${to}`);
		}
		table[fromIdx][toIdx] = { func, cost };
	}

	const STB_ENCODER = {
		png: core.convert_to_png,
		jpg: core.convert_to_jpeg,
		bmp: core.convert_to_bmp,
		tga: core.convert_to_tga,
		hdr: core.convert_to_hdr,
	};

	for (const from in STB_ENCODER) {
		for (const to in STB_ENCODER) {
			if (from !== to) {
				register(
					from as keyof typeof STB_ENCODER,
					to as keyof typeof STB_ENCODER,
					(bytes: Buffer<ArrayBuffer>, q?: number) =>
						unwrap(
							STB_ENCODER[to as keyof typeof STB_ENCODER](bytes, q as any),
						),
					1,
				);
			}
		}
	}

	//libwebp
	register(
		"png",
		"webp",
		(bytes, q) => unwrap(webp.convert_to_webp(bytes, q)),
		1,
	);
	register(
		"webp",
		"png",
		(bytes) => unwrap(webp.convert_webp_to_png(bytes)),
		1,
	);

	//nanosvg
	register("svg", "png", (bytes) => unwrap(svg.convert_svg_to_png(bytes)), 1);

	//magick

	if (magick) {
		const MAGICK_COST = 5;
		const READABLE = ["png", "jpg", "bmp", "tga", "hdr"];
		const WRITABLE = Object.keys(magick.FORMATS);

		for (const to of WRITABLE) {
			const proc = magick.MAGICK_PROCESSORS?.[to];
			for (const from of READABLE) {
				register(
					from,
					to,
					(bytes, q) =>
						magick.convert_bytes(bytes, magick.FORMATS[to], q, proc),
					MAGICK_COST,
				);
			}
		}

		for (const from of WRITABLE) {
			register(
				from,
				"png",
				(bytes) =>
					magick.convert_bytes(
						bytes,
						magick.formats.png ?? "png".toUpperCase(),
						undefined,
					),
				MAGICK_COST,
			);
		}
	}

	function search_path(start, target) {
		if (start === target) {
			return [];
		}

		const distance = Array(N).fill(Infinity);
		const prev = Array(N).fill(null);
		const done = new Set();

		distance[start] = 0;

		while (true) {
			let cur = -1;
			for (let i = 0; i < N; i++) {
				if (
					!done.has(i) &&
					distance[i] < Infinity &&
					(cur === -1 || distance[i] < distance[cur])
				) {
					cur = i;
				}
			}

			if (cur === -1) {
				return null;
			}
			if (cur === target) {
				break;
			}
			done.add(cur);

			for (let next = 0; next < N; next++) {
				const cell = table[cur][next];
				if (cell && distance[cur] + cell.cost < distance[next]) {
					distance[next] = distance[cur] + cell.cost;
					prev[next] = [cur, cell];
				}
			}
		}

		const path = [];
		for (let i = target; prev[i]; i = prev[i][0]) {
			path.unshift({
				from: FORMATS[prev[i][0]],
				to: FORMATS[i],
				func: prev[i][1].func,
			});
		}
		return path;
	}

	async function convert_image(target_format, bytes, quality) {
		let detected_format = core.validate_file_format(bytes);

		if (detected_format === "unknown" && magick) {
			detected_format = await magick.detect_format(bytes);
		}

		detected_format = ALIASES[detected_format] ?? detected_format;
		target_format = ALIASES[target_format] ?? target_format;

		let current_index = INDEX[detected_format];
		let target_index = INDEX[target_format];

		if (current_index === undefined) {
			throw new Error(`Unsupported Input Format: "${detected_format}"`);
		}
		if (target_index === undefined) {
			throw new Error(`Unsupported Output Format: "${target_format}"`);
		}

		const path = search_path(current_index, target_index);
		if (!path) {
			throw new Error(
				`No conversion path found "${detected_format}"->"${FORMATS[target_index]}"`,
			);
		}

		let data = bytes;
		for (const step of path) {
			try {
				console.log(`Converting ${step.from} -> ${step.to}...`);
				data = await step.func(data, quality);
			} catch (error) {
				throw new ConvertError(
					"StepFailed",
					`${step.from} -> ${step.to} failed: ${simplifyError(error)}`,
					{ step: `${step.from} -> ${step.to}`, cause: error },
				);
			}
		}
		return data;
	}
	return { convert_image, search_path };
}

async function getConverter() {
	const [core, webp, svg] = await Promise.all([
		coreFactory(),
		webpFactory(),
		svgFactory(),
	]);
	return createconverter({ core, webp, svg, magick });
}
