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

