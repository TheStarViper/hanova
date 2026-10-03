// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
interface WasmModule {
}

interface EmbindModule {
  get_image_width(_0: any): number;
  get_image_height(_0: any): number;
  get_image_width(_0: any): number;
  get_image_height(_0: any): number;
}

export type MainModule = WasmModule & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
