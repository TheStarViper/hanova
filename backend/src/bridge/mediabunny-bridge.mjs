import * as mediabunny from 'mediabunny';
import {registerMediabunnyServer } from '@mediabunny/server';

registerMediabunnyServer ();
mediabunny.Logging.level = mediabunny.LogLevel.Warnings;

const OUTPUT_FORMATS = {
    mp4: ()=>new mediabunny.Mp4OutputFormat,
    mkv: ()=>new mediabunny.MkvOutputFormat,
    webm:()=>new mediabunny.WebMOutputFormat,
    //add more later after testing
};

export const MEDIA_FORMATS = Object.keys(OUTPUT_FORMATS);

export async function convert_media(inputdata,target){

    const make = OUTPUT_FORMATS[target];
    if(!make){
        throw new Error(`Unsupported media output: "${target}" (supported: ${MEDIA_FORMATS.join(', ')})`);
    }

    const input = new mediabunny.Input({
        source: new mediabunny.BufferSource(inputdata),
        formats: mediabunny.ALL_FORMATS,
    });

    const output = new mediabunny.Output({
        format: make(),
        target: new mediabunny.BufferTarget,
    });

    const conversion = await mediabunny.Conversion.init({input,output});
    await conversion.execute();

    return new Uint8Array(output.target.buffer);
}

