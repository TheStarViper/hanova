import * as magickModule from '@imagemagick/magick-wasm';
import { ConvertError,ErrorCode, to_convert_error } from './errors.mjs';

let initPromise=null;

export async function init_imagemagick() {
    initPromise ??= (async()=>{
        const inNode = typeof process !=='undefined'&&!!process.versions?.node;
        let wasm;
        if(inNode){
            const fs = await import('node:fs');
            const {createRequire}=await import('node:module');
            const path = createRequire(import.meta.url).resolve('@imagemagick/magick-wasm/magick.wasm');
            wasm = fs.readFileSync(path);
        } else {
            const url = (await import('@imagemagick/magick-wasm/magick.wasm?url')).default;
            wasm = new URL(url,import.meta.url);
        }
        await magickModule.initializeImageMagick(wasm);
    })().catch((error)=>{initPromise=null;throw error;});
    return initPromise;
}

export const MAGICK_BY_NAME = {
    png:  magickModule.MagickFormat.Png,
    gif:  magickModule.MagickFormat.Gif,
    avif: magickModule.MagickFormat.Avif,
    tiff: magickModule.MagickFormat.Tiff,
    ico:  magickModule.MagickFormat.Ico,
    jxl:  magickModule.MagickFormat.Jxl,
    qoi:  magickModule.MagickFormat.Qoi,
    psd:  magickModule.MagickFormat.Psd,
    exr:  magickModule.MagickFormat.Exr,
    bmp:  magickModule.MagickFormat.Bmp,
    webp: magickModule.MagickFormat.WebP,
    pdf:  magickModule.MagickFormat.Pdf,
    eps:  magickModule.MagickFormat.Eps,
    ai:   magickModule.MagickFormat.Ai,
};

//can be writen but not read
export const MAGICK_OUTPUT_ONLY = ['ico', 'pdf', 'eps', 'ai'];
export const MAGICK_PROCESSORS = {
    ico: (image) => {
        if (image.width > 256 || image.height > 256) {
            image.resize(new magickModule.MagickGeometry(256, 256));
        }
    },
};

export async function convert_bytes(bytes, format, quality, processor) {
    await init_imagemagick();
    let output;
    try {
        magickModule.ImageMagick.read(bytes, (image) => {
            if (quality != null) image.quality = quality;
            if (processor) processor(image);
            image.write(format, (data) => {
                output = Uint8Array.from(data);
            });
        });
    } catch (error) {
        throw to_convert_error(error,ErrorCode.NativeFailure);
    }
    return output;
}

export async function detect_format(bytes) {
    await init_imagemagick();
    try {
        let name = 'unknown';
        magickModule.ImageMagick.read(bytes, (image) => { name = String(image.format).toLowerCase(); });
        return name;
    } catch {
        return 'unknown';
    }
}

export const {
    ImageMagick,
    Magick,
    MagickFormat,
    MagickColor,
    MagickGeometry,
    Channels,
    EvaluateOperator,
} = magickModule;