import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join} from 'path';

const FORMATS = ['png',
                 'jpg',
                 'bmp',
                 'hdr',
                 'tga',
                 'webp',
                 'svg',
];

const INDEX = {png:0,
               jpg:1,
               bmp:2,
               hdr:3,
               tga:4,
               webp:5,
               svg:6
};

const conversions_transition_table = [
//FROM    png jpg   bmp hdr   tga webp  svg   TO
        [null,null,null,null,null,null,null],//png
        [null,null,null,null,null,null,null],//jpg
        [null,null,null,null,null,null,null],//bmp
        [null,null,null,null,null,null,null],//hdr
        [null,null,null,null,null,null,null],//tga
        [null,null,null,null,null,null,null],//webp
        [null,null,null,null,null,null,null],//svg
];


export async function convert_file(format,bytes,quality){
    //have code here to identify the input format


    switch(format){
        case "png":

            break;
        default:

            break;
    }
}