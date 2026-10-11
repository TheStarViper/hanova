import fs from 'node:fs';
import { extname } from 'node:path';
import { createRequire } from 'node:module';
import * as magickModule from '@imagemagick/magick-wasm';

const require = createRequire(import.meta.url);
let isinit = false;

export class ImageError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'ImageError';
        this.code = code;
    }
}

export async function init_imagemagick() {
    if (isinit) return;

    const wasmPath = require.resolve('@imagemagick/magick-wasm/magick.wasm');
    const wasmBytes = fs.readFileSync(wasmPath);

    await magickModule.initializeImageMagick(wasmBytes);
    isinit = true;
}

const FORMATS = {
    '.png': magickModule.MagickFormat.Png,
    '.jpg': magickModule.MagickFormat.Jpeg,
    '.jpeg': magickModule.MagickFormat.Jpeg,
    '.jpe': magickModule.MagickFormat.Jpeg,
    '.bmp': magickModule.MagickFormat.Bmp,
    '.webp': magickModule.MagickFormat.WebP,
    '.gif': magickModule.MagickFormat.Gif,
    '.avif': magickModule.MagickFormat.Avif,
    '.tiff': magickModule.MagickFormat.Tiff,
    '.tif': magickModule.MagickFormat.Tif,
    '.heic': magickModule.MagickFormat.Heic,
    '.heif': magickModule.MagickFormat.Heif,
    '.jxl': magickModule.MagickFormat.Jxl,
    '.ico': magickModule.MagickFormat.Ico,
    '.psd': magickModule.MagickFormat.Psd,
    '.pdf': magickModule.MagickFormat.Pdf, // FIX add document conversion
    '.eps': magickModule.MagickFormat.Eps,
    '.ai': magickModule.MagickFormat.Ai,
    '.ora': magickModule.MagickFormat.Ora,
    '.xcf': magickModule.MagickFormat.Xcf,
    '.qoi': magickModule.MagickFormat.Qoi,
    '.exr': magickModule.MagickFormat.Exr,
    
    //camera formats
    '.raw': magickModule.MagickFormat.Raw,
    '.dng': magickModule.MagickFormat.Dng,
    '.cr2': magickModule.MagickFormat.Cr2,
    '.cr3': magickModule.MagickFormat.Cr3,
    '.nef': magickModule.MagickFormat.Nef,
    '.arw': magickModule.MagickFormat.Arw,
    '.orf': magickModule.MagickFormat.Orf,
    '.rw2': magickModule.MagickFormat.Rw2,
    '.raf': magickModule.MagickFormat.Raf,
    '.pef': magickModule.MagickFormat.Pef,
    '.srw': magickModule.MagickFormat.Srw,
    '.x3f': magickModule.MagickFormat.X3f,
    '.3fr': magickModule.MagickFormat.ThreeFr,
    '.fff': magickModule.MagickFormat.Fff,
    '.iiq': magickModule.MagickFormat.Iiq,
    '.mos': magickModule.MagickFormat.Mos,
    '.mrw': magickModule.MagickFormat.Mrw,
};

function summarize_errors(error){
    const m = /^(\w+)\s*(?:`([^']*)')?/.exec(error?.message ?? '');
    const code = m?.[1] ?? 'Unknown';
    const detail = m?.[2] || '';

    switch (code){
        case 'NoEncodeDelegateForThisImageFormat': 
            return new ImageError(code, `Can't write ${detail}: format is read-only or not in this build`);
        case 'NoDecodeDelegateForThisImageFormat':
            return new ImageError(code,`Can't read ${detail}: format is not supported`);
        case 'WidthOrHeightExceedsLimit':
            return new ImageError(code,`Image is too large for this format (ICO max is 256x256)`);
        default:
            return new ImageError(code,error?.message ?? String(error));
    }
}

export async function process_image(inputpath, outputpath, processorfunc) {
    await init_imagemagick();

    const inputbytes = fs.readFileSync(inputpath);
    const format = FORMATS[extname(outputpath).toLowerCase()];
    if (!format) throw new Error(`Unsupported output extension: ${outputpath}`);

    let output;
    try{
        await magickModule.ImageMagick.read(new Uint8Array(inputbytes), async (image) => {
            await processorfunc(image, magickModule);
            image.write(format, (data) => {
                output = Buffer.from(data);
            });
        });
    } catch(error) {
        throw summarize_errors(error);
    }
    fs.writeFileSync(outputpath, output);
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