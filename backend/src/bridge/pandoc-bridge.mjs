import {ConvertError,ErrorCode,to_convert_error} from "./errors.mjs";
import { DOC_FORMATS } from "./converter.mjs";

let pandocPromise;
const pandoc = () =>(pandocPromise ??= import("pandoc-wasm").catch((error)=>{
        pandocPromise = undefined;
        throw error;
    })
);

const latin1 = (bytes,start,end) => new TextDecoder("latin1").decode(bytes.subarray(start,end));

export function detect_document_format(bytes){
    if (!bytes||bytes.length<8){return 'unknown';}

    if(bytes[0]===0x50&&bytes[1]===0x4b&&(bytes[2] === 3 || bytes[2] === 5)){
        const head = latin1(bytes,0,Math.min(bytes.length,1024));
        if (head.includes("application/epub+zip")){return "epub";}
        if (head.includes("application/vnd.oasis.opendocument.text")){return "odt";}
        const tail = latin1(bytes,Math.max(0,bytes.length-65536),bytes.length);
        if (tail.includes("word/document.xml")) return "docx";
        if (tail.includes("ppt/presentation.xml")) return "pptx";//detected so the error names it
        if (tail.includes("xl/workbook.xml")) return "xlsx";
        return "unknown";
    }

    const start = bytes[0]===0xef&&bytes[1]===0xbb&&bytes[2]===0xbf?3:0;
    const text = latin1(bytes,start,Math.min(bytes.length,start+512)).trimStart();

    if (text.startsWith("%PDF")){return "pdf";}
    if (text.includes("<FictionBook")){return"fb2";}
    if (/<opml[\s>]/i.test(text)){return"opml";}
    if (text.startsWith("{")&&text.includes('"nbformat"')){return"ipynb";}
    if (text.startsWith("{\\rtf")){return "rtf";}
    if (/^<!doctype html|^<html/i.test(text)){return "html";}
    if (/^\\documentclass|^\\begin\{document\}/.test(text)) return "tex";
    return "unknown";
}

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

