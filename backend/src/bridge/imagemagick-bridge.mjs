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