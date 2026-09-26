import MainModuleFactory from "./cpp/cpp_module";

export class CppManager {
	public convertToPNG: (input: Uint8Array) => Uint8Array = (
		input: Uint8Array,
	) => input;

	constructor() {}

	public async init() {
		const Module = await MainModuleFactory();

		// idk why this didn't work in affixle. I think its because there, Andrew
		// was using EMSCRIPTEN_KEEPALIVE, but now he's using emscripten::val or
		// something, so now I can use the Module functions directly with cwrap.
		// Idk tho.
		this.convertToPNG = Module.convert_to_png;
	}
}
