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
export const MAGICK_BY_NAME = {
    png:  magickModule.MagickFormat.Png,
    gif:  magickModule.MagickFormat.Gif,
    avif: magickModule.MagickFormat.Avif,
    tiff: magickModule.MagickFormat.Tiff,
    ico:  magickModule.MagickFormat.Ico,
    heic: magickModule.MagickFormat.Heic,
    jxl:  magickModule.MagickFormat.Jxl,
    qoi:  magickModule.MagickFormat.Qoi,
    psd:  magickModule.MagickFormat.Psd,
    bmp:  magickModule.MagickFormat.Bmp,
    webp: magickModule.MagickFormat.WebP,
    heif: magickModule.MagickFormat.Heif,
    pdf: magickModule.MagickFormat.Pdf, // FIX add document conversion
    eps: magickModule.MagickFormat.Eps,
    ai: magickModule.MagickFormat.Ai,
    ora: magickModule.MagickFormat.Ora,
    xcf: magickModule.MagickFormat.Xcf,
    exr: magickModule.MagickFormat.Exr,
    
    //camera formats
    raw: magickModule.MagickFormat.Raw,
    dng: magickModule.MagickFormat.Dng,
    cr2: magickModule.MagickFormat.Cr2,
    cr3: magickModule.MagickFormat.Cr3,
    nef: magickModule.MagickFormat.Nef,
    arw: magickModule.MagickFormat.Arw,
    orf: magickModule.MagickFormat.Orf,
    rw2: magickModule.MagickFormat.Rw2,
    raf: magickModule.MagickFormat.Raf,
    pef: magickModule.MagickFormat.Pef,
    srw: magickModule.MagickFormat.Srw,
    x3f: magickModule.MagickFormat.X3f,
    fff: magickModule.MagickFormat.Fff,
    iiq: magickModule.MagickFormat.Iiq,
    mos: magickModule.MagickFormat.Mos,
    mrw: magickModule.MagickFormat.Mrw,
};

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
        throw summarize_errors(error);
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