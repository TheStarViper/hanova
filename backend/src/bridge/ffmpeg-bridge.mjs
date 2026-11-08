import { ConvertError, ErrorCode, to_convert_error } from "./errors.mjs";
import {FFMPEG_AUDIO} from "./formats.mjs";

let ffmpegPromise;
function load(){ //loader
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

    const encoder = FFMPEG_AUDIO[target]?.args;
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
        let dead = false;
        let cancelled = false;

        const onCancel = () => {cancelled = true; kill();};
        const onLog = ({message}) => {log.push(message); if(log.length > 12){log.shift();}};
        const onProgress = ({progress})=>options.onProgress?.(Math.max(0,Math.min(1,progress)));
        
        try{
            ffmpeg = await load();
            ffmpeg.on("log",onLog);
            ffmpeg.on("progress",onProgress);
            options.signal?.addEventListener("abort",onCancel,{once:true});

            await ffmpeg.writeFile("input",bytes.slice());
            const a = options.audio ?? {};
            const args = ["-i","input","-vn"];
            if (options.trim?.start!=null){args.push("-ss",String(options.trim.start));}
            if (options.trim?.end != null) args.push("-to", String(options.trim.end));
            if (typeof a.bitrate === "number") args.push("-b:a", String(a.bitrate));
            if (typeof a.sampleRate === "number") args.push("-ar", String(a.sampleRate));
            if (typeof a.numberOfChannels === "number") args.push("-ac", String(a.numberOfChannels));
            args.push(...encoder, "-y", outName);

            const code = await ffmpeg.exec(args);
            if (code !==0){
                kill();
                const detail = log.filter((l) =>l.trim()).slice(-4).join(" | ") || "no details";
                throw new ConvertError(ErrorCode.NativeFailure, `ffmpeg (${args.join(" ")}): ${detail}`);
            }

            const data = await ffmpeg.readFile(outName);
            if (!data ||data.length===0){
                throw new ConvertError(ErrorCode.NativeFailure, "ffmpeg made empty file");
            }
            return data.slice();
        } catch (error){
            const msg = String(error?.message??error);
            if (!dead && (error?.name==="RuntimeError"||/abort|out of bounds|unreachable|memory/i.test(msg))) {kill();}

            if (cancelled || options.signal?.aborted){
                throw new ConvertError(ErrorCode.Cancelled, "Conversion was Cancelled", {cause: error});
            }
            throw to_convert_error(error, ErrorCode.NativeFailure);
        } finally {
            options.signal?.removeEventListener("abort",onCancel);
            if(ffmpeg&&!dead){
                ffmpeg.off("log",onLog);
                ffmpeg.off("progress",onProgress);
                await ffmpeg.deleteFile("input").catch(()=>{});
                await ffmpeg.deleteFile(outName).catch(()=>{});
            }
        }
    });
}

export function convert_audio_to_video(bytes,target,options={}){
    const width = options.video?.width || 1280;
    const height = options.video?.height || 720;
    const bgColor = options.backgroundColor || 'black';
    const waveColor = options.waveColor || 'cyan';
    const mode = options.mode || 'line';

    return exclusive(async()=>{
        const outName = `output-waveform.${target}`;
        const log = [];
        let ffmpeg;
        let dead = false;
        let cancelled = false;

        const onCancel = () => {cancelled = true; kill();};
        const onLog = ({message}) => {log.push(message); if(log.length > 12){log.shift();}};
        const onProgress = ({progress})=>options.onProgress?.(Math.max(0,Math.min(1,progress)));
        try{
            ffmpeg = await load();
            ffmpeg.on("log",onLog);
            ffmpeg.on("progress",onProgress);
            options.signal?.addEventListener("abort",onCancel,{once:true});

            await ffmpeg.writeFile("input",bytes.slice());

            const args = [
                '-i', 'input',
                '-f', 'lavfi',
                '-i', `color=c=${bgColor}:s=${width}x${height}`,
                '-filter_complex',
                `[0:a]showwaves=size=${width}x${height}:colors=${waveColor}:mode=${mode}[wave];[1:v][wave]overlay=format=auto:shortest=1[v]`,
                '-map', '[v]',
                '-map', '0:a',
                '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p',
                '-c:a', 'aac',
                '-y',
                outName
            ];

            
        }
    })
}