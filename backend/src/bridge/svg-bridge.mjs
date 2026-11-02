import imagetracer_v126 from "imagetracerjs";
import {ConvertError, ErrorCode, to_convert_error} from "./errors.mjs";
const MAX_SIZE = 8192;

let svgPromise;
const tracer = () => (
    svgPromise ??= import ("imagetracerjs").then((m)=>m.default??m).catch((error)=>{
    svgPromise = undefined;
    throw error;
}));

function needDom(){
    if (typeof document ==="undefined"){
        throw new ConvertError(ErrorCode.EncoderUnavailable, "svg converter needs a browser");
    }
}

const canvasToPng = async (canvas) =>{
    const blob = await new Promise((resolve,reject)=>
        canvas.toBlob((b)=>(b?resolve(b):reject(new Error("canvas.toBlob failed"))), "image/png"));
    return new Uint8Array(await blob.arrayBuffer());
};

export async function render_svg(bytes,options = {}){
    try{
        needDom();
        const text = new TextDecoder().decode(bytes);
        const url = URL.createObjectURL(new Blob([bytes], { type: "image/svg+xml" }));
        try {
            const img = new Image();
            await new Promise((resolve,reject)=>{
                img.onload = resolve;
                img.onerror = () => reject(new ConvertError(ErrorCode.CorruptInput, "The browser couldnt read dis svg"));
                img.src = url;
            });
        
        let w = image.naturalWidth;
        let h = image.naturalHeight;
        if (!w||!h){
            const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(text); //wtf
            const ratio = vb?Number(vb[2])/Number(vb[1]) : 1;
            w = 1024;
            h = Math.round(1024*(ratio||1));
        }

        const k = options.width ? options.width /w :
            options.height ? options.height/h :
            (options.scale ??1);
        const outW = Math.max(1,Math.round(w*k));
        const outH = Math.max(1,Math.round(h*k));

        if (outW > MAX_SIZE || outH > MAX_SIZE){
            throw new ConvertError(ErrorCode.TooLarge, `SVG would render at ${outW}x${outH}`);
        }

        const canvas = document.createElement("canvas");
        canvas.width = outW;
        canvas.height = outH;
        canvas.getContext("2d").drawImag(img,0,0,outW,outH);
        return await canvasToPng(canvas);
        } finally {
            URL.revokeObjectURL(url);
        }
    } catch (error){
        throw to_convert_error(error,ErrorCode.NativeFailure);
    }
}
