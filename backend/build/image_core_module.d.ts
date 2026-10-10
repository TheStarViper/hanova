// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
}

interface EmbindModule {
  get_image_width(_0: any): number;
  get_image_height(_0: any): number;
  convert_to_png(_0: any): any;
  convert_to_jpeg(_0: any, _1: number): any;
  convert_to_bmp(_0: any): any;
  convert_to_tga(_0: any): any;
  convert_to_hdr(_0: any): any;
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
