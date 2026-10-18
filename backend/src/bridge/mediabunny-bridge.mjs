import * as mediabunny from 'mediabunny';
import { ConvertError,ErrorCode, to_convert_error } from './errors.mjs';

mediabunny.Logging.level = mediabunny.LogLevel.Warnings;

const OUTPUT_FORMATS = {
    mp4: ()=>new mediabunny.Mp4OutputFormat,
    mkv: ()=>new mediabunny.MkvOutputFormat,
    webm:()=>new mediabunny.WebMOutputFormat,
    //add more later after testing
};

const PRESETS = {
    potato: {video: {height:360, bitrate: mediabunny.QUALITY_VERY_LOW},audio:{bitrate: mediabunny.QUALITY_VERY_LOW}},
    small: {video: {height:480, bitrate: mediabunny.QUALITY_LOW},audio:{bitrate: mediabunny.QUALITY_LOW}},
    balanced: {video: {height:720, bitrate: mediabunny.QUALITY_MEDIUM},audio:{bitrate: mediabunny.QUALITY_MEDIUM}},
    high: {video: {height:480, bitrate: mediabunny.QUALITY_HIGH},audio:{bitrate: mediabunny.QUALITY_HIGH}},
};

export const MEDIA_PRESETS = Object.keys(PRESETS);
export const MEDIA_FORMATS = Object.keys(OUTPUT_FORMATS);

export async function convert_media(inputdata,target,options={}){

    const make = OUTPUT_FORMATS[target];
    if(!make){
        throw new ConvertError(`Unsupported media output: "${target}" (supported: ${MEDIA_FORMATS.join(', ')})`);
    }

    if(options.preset && !PRESETS[options.preset]){
        throw new ConvertError(ErrorCode.UnsupportedParameter,`Unknown preset: "${options.preset}"`);
    }
    
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
                                                        ...(options.video && { video: options.video }),
                                                        ...(options.audio && { audio: options.audio }),
                                                        });
    await conversion.execute();

    return new Uint8Array(output.target.buffer);
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