import createcore from '../../build/image_core_module.js';
import createwebp from '../../build/webp_module.js';
import createsvg from '../../build/svg_module.js';
import * as bridge from './imagemagick-bridge.mjs';
import * as mediabridge from './mediabunny-bridge.mjs';
import {
    createconverter, 
    createConvert,
    IMAGE_FORMATS, 
    VIDEO_FORMATS, 
    AUDIO_FORMATS,
} from './converter.mjs';
import { AudioFifo } from 'node-av';

const magick = {
    convert_bytes: bridge.convert_bytes,
    detect_format: bridge.detect_format,
    formats: bridge.MAGICK_BY_NAME,
    outputonly: bridge.MAGICK_OUTPUT_ONLY,
    processors: bridge.MAGICK_PROCESSORS,
};

const media = {
    convert_media: mediabridge.convert_media,
    detect_format: mediabridge.detect_media_format,
};

let enginesPromise;
const engines = () => (
    enginesPromise??=Promise.all([createcore(),createwebp(),createsvg()]).catch((error)=>{
        enginesPromise = undefined;
        throw error;
    })
);

/**
 * @returns {Promise<(target_format: string, bytes: Buffer<ArrayBuffer>, quality: number) => Promise<Buffer<ArrayBuffer>>> }
 */

export async function converterFactory(){
    const [core,webp,svg]= await engines();
    return createconverter({core,webp,svg,magick,media}).convert_image;
}

export async function universalFactory(){
    const [core,webp,svg]=await engines();
    const c = createconverter({core,webp,svg,magick,media});
    const convert = createConvert({
        image:c.convert_image,
        imageFormats:IMAGE_FORMATS,
        media: (bytes,target,options)=>(
            AUDIO_FORMATS.includes(target)?c.convert_audio:c.convert_video)(target,bytes,options),
        mediaFormats: [...VIDEO_FORMATS,...AUDIO_FORMATS],
    });
    return {convert,...c};
}

export {
    createconverter,
    FORMATS,
    ALIASES,
    ConvertError,
    simplifyerror,
    IMAGE_FORMATS,
    VIDEO_FORMATS,
    AUDIO_FORMATS,
} from "./converter.mjs";
export {ErrorCode,to_convert_error} from "./errors.mjs";
export {MEDIA_INFO,MEDIA_FORMATS,MEDIA_PRESETS,probe_media,thumbnail_at} from "./mediabunny-bridge.mjs";