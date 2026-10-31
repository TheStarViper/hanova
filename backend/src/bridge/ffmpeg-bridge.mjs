import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";

const FFMPEG_AUDIO = {
    mp3: ["-c:a","libmp3lame", "-f","mp3"],
    wav: ["-c:a","pcm_s16le", "-f","wav"],
    ogg: ["-c:a","libopus", "-f","ogg"],
    flac: ["-c:a","flac", "-f","flac"],
    aac: ["-c:a","aac", "-f","adts"],
    m4a: ["-c:a","aac", "-f","ipod"],
    aiff: ["-c:a","pcm_s16be", "-f","aiff"],
    au: ["-c:a","pcm_s16be", "-f","au"],
    caf: ["-c:a","pcm_s16le", "-f","caf"],
    ac3: ["-c:a","ac3", "-f","ac3"],
    mp2: ["-c:a","mp2", "-f","mp2"],
    wma: ["-c:a","wmav2", "-f","asf"],
};

let ffmpegPromise;
function load(){
    ffmpegPromise ??=(async ()=>{
        const [{FFmpeg},core,wasm]= await Promise.all([
            import("@ffmpeg/ffmpeg"),
            import("@ffmpeg/core?url"),
            import("@ffmpeg/core/wasm?url"),
        ]);
        const ffmpeg = new FFmpeg();
        await ffmpeg.load({coreURL:core.default,wasmURL: wasm.default});
        return ffmpeg;
    })().catch((error)=>{
        ffmpegPromise = undefined;
        throw error;
    });
    return ffmpegPromise;
}

let chain = Promise.resolve();
function exclusive(fn){
    const run = chain.then(fn);
    chain = run.catch(()=>{});
    return run;
}

export function convert_audio(bytes,target,options={}){

    const encoder = FFMPEG_AUDIO[target];
    if (!encoder){
        throw new ConvertError(ErrorCode.UnsupportedOutput, `ffmpeg can't write "${target}"`);
    }

    if (options.signal?.aborted){
        throw new ConvertError(ErrorCode.Cancelled, "Conversion was cancelled");
    }

    return exclusive(async ()=>{
        const outName = `output.${target}`;
        const log =[];
        let ffmpeg;
        let aborted = false;

        const onLog = ({message}) => {log.push(message); if(log.length > 12){log.shift();}};
        const onProgress = ({progress})=>options.onProgress?.(Math.max(0,Math.min(1,progress)));
        const onAbort = () => {
            aborted = true;
            ffmpegPromise = undefined; //kill worker
            ffmpeg?.terminate(); //unload
        };

        try{
            ffmpeg = await load();
            ffmpeg.on("log",onLog);
            ffmpeg.on("progress",onProgress);
            
        }
    })
}