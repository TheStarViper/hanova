import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";
import { MODEL_FORMATS } from "./converter.mjs";

let assimpPromise;

function assimp(){ //loadah
    assimpPromise ??= (async ()=>{
        const inNode = typeof process !== "undefined" && !!process.version?.node;
        const mod = await import("assimpjs");
        const create = mod.default??mod;

        if (inNode){return create();}
        const wasm = (await import("assimpjs/dist/assimpjs.wasm?url")).default;
        return create({locateFile: (name)=>(name.endsWith(".wasm")?wasm:name)});
    })().catch((error)=>{
        assimpPromise = undefined;
        throw error;
    });
    return assimpPromise;
}

