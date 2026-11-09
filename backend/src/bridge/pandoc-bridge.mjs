import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";
import { DOC_FORMATS } from "./formats.mjs";

let pandocPromise;
const pandoc = () =>(pandocPromise ??= import("pandoc-wasm").catch((error)=>{ //loader
        pandocPromise = undefined;
        throw error;
    })
);

const latin1 = (bytes,start,end) => new TextDecoder("latin1").decode(bytes.subarray(start,end));

export async function convert_document(bytes,target,options = {}){
    const from = DOC_FORMATS[options.from];
    const to = DOC_FORMATS[target];

    if (!from?.read){
        throw new ConvertError(ErrorCode.UnsupportedInput, `Unsupported document input: "${options.from}"`);
    }
    if (!to?.write) {
        throw new ConvertError(ErrorCode.UnsupportedOutput, `Unsupported document output: "${target}"`);
    }
    if(options.signal?.aborted) {throw new ConvertError(ErrorCode.Cancelled, "Conversion was cancelled");}

    try{
        const {convert} = await pandoc();
        const opts = {
            from: from.read,
            to: to.write,
            ...(to.standalone&&{standalone:true}),
            ...options.pandoc,
        };

        const files = {};
        let stdin = null;
        if (from.binary){
            const name = `input.${options.from}`;
            files[name] = new Blob([bytes]);
            opts["input-files"] = [name];
        } else {
            stdin = new TextDecoder().decode(bytes);
        }

        const outName = `output.${target}`;
        if (to.binary) {
            opts["output-file"] = outName;
        }

        const result = await convert(opts,stdin,files);
        const problem = String(result.stderr??"").trim();
        
        let out;
        if(to.binary){
            const file = result.files?.[outName];
            if(file){
                out = file instanceof Uint8Array ? file :
                    typeof file ==="string"?new TextEncoder().encode(file) :
                    new Uint8Array(await file.arrayBuffer());
            }
        } else if (typeof result.stdout ==="string"){
            out = new TextEncoder().encode(result.stdout);
        }

        if (!out||out.length===0){
            throw new ConvertError(ErrorCode.NativeFailure,
                problem?`pandoc:${problem.split("\n")[0]}` : "pandoc made empty file."
            );
        }

        return out;
    } catch (error){
        throw to_convert_error(error,ErrorCode.NativeFailure);
    }
}

