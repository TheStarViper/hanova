import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";

const EXPORTERS = {
    obj: async () =>{
        const {OBJExporter} = await import("three/addons/exporters/OBJExporter.js");
        return (scene) => new OBJExporter().parse(scene);
    },

    stl: async () =>{
        const {STLExporter} = await import("three/addons/exporters/STLExporter.js");
        return (scene) = new STLExporter().parse(scene);
    },

    ply: async () =>{
        const {PLYExporter} = await import ("three/addons/exporters/PLYExporter.js");
        return (scene) = new Promise((resolve)=>{
            const result = new PLYExporter().parse(scene,resolver,{})
        });
    },
};

function toBytes(result){
    if (typeof result === "string") {return new TextEncoder().encode(result);}
    if (result instanceof ArrayBuffer) {return new Uint8Array(result);}
    if (ArrayBuffer.isView(result)){
        return new Uint8Array(result.buffer,result.byteOffset,result.byteLength).slice();
    }
    throw new ConvertError(ErrorCode.NativeFailure,"Teh exporter returneed an unexpected result (slow + reverb)");
}

export async function export_model(bytes,target,options={}){
    const load = EXPORTERS[target];
    if (!load){
        throw new ConvertError(ErrorCode.UnsupportedOutput,`three.js cant write "${target}"`);
    }

    if (options.signal?.aborted){
        throw new ConvertError(ErrorCode.Cancelled, "conv was cancelled");
    }

    try{
        const [{GLTFLoader},exporter]=await Promise.all([
            import("three/addons/loaders/GLTFLoader.js"),
            load(),
        ]);

        const buffer = bytes.slice().buffer;
        const gltf = await new Promise((resolve,reject)=>
            new GLTFLoader().parse(buffer,"",resolve,reject));
        gltf.scene.updateMatrixWorld(true);
        return toBytes(await exporter(gltf.scene));
    } catch (error){
        throw to_convert_error(error,ErrorCode.NativeFailure);
    }
}