import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmPath = join(__dirname, '../../build/image_core_module.wasm');

const wasmBuffer = readFileSync(wasmPath);
const importObject = { /*idk what to put here ngl*/ };
const { instance } = await WebAssembly.instantiate(wasmBuffer, importObject);
const cppmodule = instance.exports;

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

function search_path(start,target){
    if (start===target){return[];}

    const queue = [[start,[]]];
    const visited = new Set([start]);

    while (queue.length>0){
        const[currentindex,path]=queue.shift();
        for (let nextindex=0;nextindex<FORMATS.length;nextindex++){
            const func = conversions_transition_table[currentindex][nextindex];
            if (func&&!visited.has(nextindex)){
                const newstep = {from: FORMATS[currentindex], to: FORMATS[nextindex], func};
                const newpath = [...path,newstep];

                //path found
                if (nextindex===target){
                    return newpath;
                }

                visited.add(nextindex);
                queue.push([nextindex,newpath]);
            }
        }
    }
    return null; //no path found
}

export async function convert_image(target_format,bytes,quality){
    const detected_format = cppmodule.validate_file_format(bytes);

    let current_index=INDEX[detected_format];
    let target_index = INDEX[target_format];

    if (current_index === undefined){throw new Error(`Unsupported Input Format: "${detected_format}"`);}
    if (target_index === undefined){throw new Error(`Unsupported Output Format: "${FORMATS[target_index]}"`);}
    
    const path = search_path(current_index,target_index);
    if (!path){
        throw new Error(`No conversion path found "${detected_format}"->"${FORMATS[target_index]}"`);
    }

    return path.reduce((currentdata,step)=>{
        console.log(`Converting ${step.from} -> ${step.to}...`);
        return step.func(currentdata,quality);
    },data);
}