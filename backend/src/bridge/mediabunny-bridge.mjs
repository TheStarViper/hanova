import * as mediabunny from 'mediabunny';
import { ConvertError,ErrorCode, to_convert_error } from './errors.mjs';
import {registerMp3Encoder} from '@mediabunny/mp3-encoder';
import {registerFlacEncoder} from '@mediabunny/flac-encoder';
import {registerAacEncoder} from '@mediabunny/aac-encoder';

let mp3ready = null;
mediabunny.Logging.level = mediabunny.LogLevel.Warnings;
const ENCODERS = {
    mp3: registerMp3Encoder,
    flac: registerFlacEncoder,
    aac: registerAacEncoder,
};
const registered = new Map();

function ensureEncoder(codec){
    const register = ENCODERS[codec];
    if (!register) {return Promise.resolve();}
    if (!registered.has(codec)){
        registered.set(codec,(async ()=>{
            if (!(await mediabunny.canEncodeAudio(codec))) {register();}
        })());
    }
    return registered.get(codec);
}


const OUTPUT_FORMATS = {
    //video
    mp4: ()=>new mediabunny.Mp4OutputFormat,
    mkv: ()=>new mediabunny.MkvOutputFormat,
    webm:()=>new mediabunny.WebMOutputFormat,
    ts:  ()=>new mediabunny.MpegTsOutputFormat,
    mov: ()=>new mediabunny.MovOutputFormat,
    m3u8:()=>new mediabunny.HlsOutputFormat,
    
    //audio
    mp3: ()=>new mediabunny.Mp3OutputFormat,
    wav: ()=>new mediabunny.WavOutputFormat,
    ogg: ()=>new mediabunny.OggOutputFormat,
    flac:()=>new mediabunny.FlacOutputFormat,
    aac: ()=>new mediabunny.AdtsOutputFormat,
    m4a: ()=>new mediabunny.Mp4OutputFormat, //uses mp4 container
};

export const MEDIA_INFO={
    //video
    mp4: {ext:'mp4' ,mime:'video/mp4'       ,video: true, encoders:['aac']},
    mkv: {ext:'mkv' ,mime:'video/x-matroska',video: true},
    webm:{ext:'webm',mime:'video/webm'      ,video: true},
    ts:  {ext:'ts'  ,mime:'video/mp2t'      ,video: true, encoders:['aac']},
    mov: {ext:'mov' ,mime:'video/quicktime' ,video: true, encoders:['aac']},
    m3u8:{ext:'m3u8',mime:'video/idkbruhwth',video: true}, // FIX
    
    //audio
    mp3: {ext:'mp3' ,mime:'audio/mpeg',video: false, encoders: ['mp3'],  audioCodec: 'mp3' },
    wav: {ext:'wav' ,mime:'audio/wav' ,video: false},
    ogg: {ext:'ogg' ,mime:'audio/ogg' ,video: false},
    flac:{ext:'flac',mime:'audio/flac',video: false, encoders: ['flac'], audioCodec: 'flac'},
    aac: {ext:'aac' ,mime:'audio/aac' ,video: false, encoders: ['aac'],  audioCodec: 'aac'},
    m4a: {ext:'m4a' ,mime:'audio/mp4' ,video: false, encoders: ['aac'],  audioCodec: 'aac'},
};


const PRESETS = {
    potato: {video: {height:360, bitrate: mediabunny.QUALITY_VERY_LOW},audio:{bitrate: mediabunny.QUALITY_VERY_LOW}},
    small: {video: {height:480, bitrate: mediabunny.QUALITY_LOW},audio:{bitrate: mediabunny.QUALITY_LOW}},
    balanced: {video: {height:720, bitrate: mediabunny.QUALITY_MEDIUM},audio:{bitrate: mediabunny.QUALITY_MEDIUM}},
    high: {video: {height:1080, bitrate: mediabunny.QUALITY_HIGH},audio:{bitrate: mediabunny.QUALITY_HIGH}},
    hdmax: {video: {height:1080, bitrate:mediabunny.QUALITY_VERY_HIGH},audio:{bitrate: mediabunny.QUALITY_VERY_HIGH}},
    fourkmax: {video: {height:3840, bitrate:mediabunny.QUALITY_VERY_HIGH},audio:{bitrate: mediabunny.QUALITY_VERY_HIGH}},
};

export const MEDIA_PRESETS = Object.keys(PRESETS);
export const MEDIA_FORMATS = Object.keys(OUTPUT_FORMATS);



export async function convert_media(inputdata,target,options={}){

    const make = OUTPUT_FORMATS[target];
    if(!make){
        throw new ConvertError(ErrorCode.UnsupportedOutput,`Unsupported media output: "${target}" (supported: ${MEDIA_FORMATS.join(', ')})`);
    }

    if(options.preset && !PRESETS[options.preset]){
        throw new ConvertError(ErrorCode.UnsupportedParameter,`Unknown preset: "${options.preset}"`);
    }

    if(options.signal?.aborted){
        throw new ConvertError(ErrorCode.Cancelled, 'Conversion was cancelled');
    }

    const preset = PRESETS[options.preset]??{};
    const info = MEDIA_INFO[target];

    try{
        for (const codec of info.encoders??[]){await ensureEncoder(codec);}

        const video = info.video? {...preset.video, ...options.video} : {discard: true};
        const audio = {
            ...(info.audioCodec && { codec: info.audioCodec }),
            ...preset.audio,
            ...options.audio,
        };

        const input = new mediabunny.Input({
            source: new mediabunny.BufferSource(inputdata),
            formats: mediabunny.ALL_FORMATS,
        });

        const output = new mediabunny.Output({
            format: make(),
            target: new mediabunny.BufferTarget,
        });

        const conversion = await mediabunny.Conversion.init({
            input,
            output,
            video,
            ...(Object.keys(audio).length && { audio }),
            ...(options.trim && { trim: options.trim }),
        });

        if (!conversion.isValid){
            const reasons = conversion.discardedTracks.map((t) => t.reason).join(', ');
            throw new ConvertError(ErrorCode.NothingToConvert,`Nothing to convert (${reasons || 'no usable tracks'})`);
        }

        if (options.onProgrses) {
            conversion.onProgress = options.onProgress;
        }
        options.signal?.addEventListener('Abort',()=>conversion.cancel(),{once: true});
        await conversion.execute();

        if (options.signal?.aborted) throw new ConvertError(ErrorCode.Cancelled, 'Conversion was cancelled');
        return new Uint8Array(output.target.buffer);

    } catch (error){
        if (options.signal?.aborted){throw new ConvertError(ErrorCode.Cancelled,'Conversion was cancelled', {cause: error })}
        throw to_convert_error(error,ErrorCode.NativeFailure);
    }
}

export async function probe_media(inputdata){
    try{
        const input = new mediabunny.input({
            source: new mediabunny.BufferSource(inputdata),
            formats: mediabunny.ALL_FORMATS,
        });
        const[duration,video,audio,tags,format]=await Promise.all([
            input.computeDuration(),
            input.getPrimaryVideoTrack(),
            input.getPrimaryAudioTrack(),
            input.getMetadataTags(),
            input.getFormat(),
        ]);
        return{
            format: format?.name,duration,
            video: video&&{codec: video.codec,width: video.displayWidth,height: video.displayHeight},
            audio: audio&&{codec: audio.codec,sampleRate: audio.sampleRate, channels: audio.numberOfChannels},
            tags,
        };
    } catch (error){
        throw to_convert_error(error,ErrorCode.CorruptInput);
    }
}