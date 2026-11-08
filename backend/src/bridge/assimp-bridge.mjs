import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";
import { MODEL_FORMATS } from "./formats.mjs";

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

function toBase64(bytes){
    let s = "";
    for (let i = 0; i<bytes.length;i+=0x8000){
        s += String.fromCharCode(...bytes.subarray(i,i+0x8000));
    }
    return btoa(s);
}

function embedBuffers(){
    const gltf = JSON.parse(new TextDecoder().decode(files[mainName]));
    for (const buffer of gltf.buffers??[]){
        const data = buffer.uri && (files[buffer.uri]??files[decodeURIComponent(buffer.uri)]);
        if (data) {
            buffer.uri = `data:application/octet-stream;base64,${toBase64(data)}`;
        }
    }
    return new TextEncoder().encode(JSON.stringify(gltf));
}

export async function convert_model(bytes,target,options={}){
    const from = MODEL_FORMATS[options.from];
    const to = MODEL_FORMATS[target];

    if (!from?.read){
        throw new ConvertError(ErrorCode.UnsupportedInput, `Unsupported 3D input: "${options.from}"`);
    }
    if (!to?.write) {
    throw new ConvertError(ErrorCode.UnsupportedOutput, `Can only write glb or gltf, not "${target}"`);
    }
    
    let list,result;
    try{
        const ajs = await assimp();
        list = new ajs.FileList();
        list.AddFile(`model.${options.from}`,bytes);

        for (const [name,data]of Object.entries(options.files ?? {})){
            list.AddFile(name,data instanceof Uint8Array ? data : new Uint8Array(data));
        }

        result = ajs.ConvertFileList(list,to.write);
        if (!result.IsSuccess()||result.FileCount() ===0){
            throw new ConvertError(
                ErrorCode.CorruptInput,
                `assimp could not convert this ${options.from} file (${result.GetErrorCode?.() ?? "unknown error"})`,
            );
        }
        
        const files = {};
        for (let i = 0;i<result.FileCount();i++){
            const file = result.GetFile(i);
            files[file.GetPath()] = file.GetContent().slice();
        }

        const names = Object.keys(files);
        if (target==="glb") {return files[names[0]];}
        const main = names.find((n)=>n.endsWith(".gltf")) ?? names[0];
        return embedBuffers(files,main);
    } catch (error){
        throw to_convert_error(error,ErrorCode.NativeFailure);
    } finally {
        result?.delete?.();
        list?.delete?.();
    }
}