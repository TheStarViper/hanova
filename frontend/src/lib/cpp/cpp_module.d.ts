// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare var RuntimeExports: {
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Array=} args
     * @param {Object=} opts
     */
    ccall: (ident: any, returnType?: (string | null) | undefined, argTypes?: any[] | undefined, args?: any[] | undefined, opts?: Object | undefined) => any;
    /**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */
    cwrap: (ident: any, returnType?: string | undefined, argTypes?: any[] | undefined, opts?: Object | undefined) => any;
};
interface WasmModule {
}

interface EmbindModule {
  convert_to_png(_0: any): any;
  convert_to_jpeg(_0: any, _1: number): any;
  convert_to_bmp(_0: any): any;
  get_image_width(_0: any): number;
  get_image_height(_0: any): number;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
