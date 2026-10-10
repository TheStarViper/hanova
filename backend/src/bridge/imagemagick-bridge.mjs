import fs from 'node:fs';
import { extname } from 'node:path';
import { createRequire } from 'node:module';
import * as magickModule from '@imagemagick/magick-wasm';

const require = createRequire(import.meta.url);
let isinit = false;

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
    '.bmp': magickModule.MagickFormat.Bmp,
    '.webp': magickModule.MagickFormat.WebP,
    '.gif': magickModule.MagickFormat.Gif,
};

export async function process_image(inputpath, outputpath, processorfunc) {
    await init_imagemagick();

    const inputbytes = fs.readFileSync(inputpath);
    const format = FORMATS[extname(outputpath).toLowerCase()];
    if (!format) throw new Error(`Unsupported output extension: ${outputpath}`);

    let output;
    await magickModule.ImageMagick.read(new Uint8Array(inputbytes), async (image) => {
        await processorfunc(image, magickModule);
        image.write(format, (data) => {
            output = Buffer.from(data);
        });
    });

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