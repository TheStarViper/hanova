import fs from 'node:fs';
import {createRequire} from 'node:module';
import * as magickModule from '@imagemagick/magick-wasm'

const require = createRequire(import.meta.url);
let isinit = false;

export async function init_imagemagick(){
    if (isinit) {return;}

    try{
        const wasmpath = require.resolve('@imagemagick/magick-wasm/dist/magick.wasm');
        const wasmbytes = fs.readFileSync(wasmpath);

        await magickModule.initializeImageMagick(wasmbytes);
        isinit=true;
    } catch (error){
        throw new Error(`Failed to init imagemagick wasm module: ${error.message}`);
    }
}

export async function process_image(inputpath,outputpath,processorfunc){
    await init_imagemagick();

    const inputbytes = fs.readFileSync(inputpath);

    magickModule.ImageMagick.read(new Uint8array(inputbytes),async(image)=>{
        await processorfunc(image,magickModule);

        image.write((outputbytes)=>{
            fs.writeFileSync(outputpath,Buffer.from(outputbytes));
        },magickModule.MagickFormat.Auto);
    });
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
