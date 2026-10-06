// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare var RuntimeExports: {
    FS_createPath: (...args: any[]) => any;
    FS_createDataFile: (...args: any[]) => any;
    FS_preloadFile: (parent: any, name: any, url: any, canRead: any, canWrite: any, dontCreateFile: any, canOwn: any, preFinish: any) => Promise<void>;
    FS_unlink: (...args: any[]) => any;
    FS_createLazyFile: (...args: any[]) => any;
    FS_createDevice: (...args: any[]) => any;
    addRunDependency: (id: any) => void;
    removeRunDependency: (id: any) => void;
};
interface WasmModule {
}

interface EmbindModule {
  magick_identify(_0: any): any;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
export default function MainModuleFactory (options?: unknown): Promise<MainModule>;
