import {ConvertError,ErrorCode,to_convert_error} from "./errors.mjs";

const READ = {docx: "docs",odt: "odt",epub:"epub",html:"html",md:"markdown",rst:"rst",tex:"latex"};
const WRITE = {docx: "docs",odt: "odt",epub:"epub3",html:"html",md:"markdown",rst:"rst",tex:"latex",txt:"plain"};

export const DOC_INPUTS = Object.keys(READ);
export const DOC_OUTPUTS = Object.keys(WRITE);

const BINARY_IN = new Set(["docx","odt","epub"]);
const BINARY_OUT = new Set(["docx","odt","epub"]);
const STANDALONE = new Set(["html","tex"]);

let pandocPromise;
const pandoc = () =>(pandocPromise ??= import("pandoc-wasm").catch((error)=>{
        pandocPromise = undefined;
        throw error;
    })
);

const latin1 = (bytes,start,end) => new TextDecoder("latin1").decode(bytes.subarray(start,end));

export function detect_document_format(bytes){
    if (!bytes||bytes.length<8){return 'unknown';}

    if(bytes[0]===0x50&&bytes[1]===0x4b&&(b[2] === 3 || b[2] === 5)){
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
    if (text.startsWith("{\\rtf")){return "rtf";}
    if (/^<!doctype html|^<html/i.test(text)){return "html";}
    if (/^\\documentclass|^\\begin\{document\}/.test(text)) return "tex";
    return "unknown";
}

export async function convert_document(bytes,target,options = {}){
    const from = options.from;
    if (!READ[from]){
        throw new ConvertError(ErrorCode.UnsupportedInput, `Unsupported document input: "${from}"`);
    }
    if (!WRITE[target]) {
        throw new ConvertError(ErrorCode.UnsupportedOutput, `Unsupported document output: "${target}"`);
    }
    if(options.signal?.aborted) {throw new ConvertError(ErrorCode.Cancelled, "Conversion was cancelled");}

    try{
        const {convert}
    }
}

