import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmPath = join(__dirname, '../../build/image_core_module.wasm');

const wasmBuffer = readFileSync(wasmPath);
const importObject = { /*idk what to put here ngl*/ };
const { instance } = await WebAssembly.instantiate(wasmBuffer, importObject);
const cppmodule = instance.exports;

export const FORMATS = ['png',
                 'jpg',
                 'bmp',
                 'hdr',
                 'tga',
                 'webp',
                 'svg',
];

const INDEX = Object.fromEntries(FORMATS.map((f,i)=>[f,i]));
const ALIASES = {jpeg:'jpg', //formats that are the same with diff extensions
                 jpe: 'jpg',
                 targa:'tga'}; 

const N = FORMATS.length;
const table = Array.from({length:N},()=>Array(N).fill(null));

function register(from,to,func,cost=1){
    if(INDEX[from]===undefined||INDEX[to]===undefined){
        throw new Error(`register: unknown format ${from} -> ${to}`);
    }
    table[INDEX[from]][INDEX[to]]={func,cost};
}

const STB = ['png','jpg','bmp','tga','hdr'];//conversions from STB
for (const from of STB){
    for (const to of STB){
        if (from!=to){
            register(from,to,(bytes,q)=>cppmodule.stb_convert(bytes,to,q),1); //FIX make stb_convert a real function
        }
    }
}


// const conversions_transition_table = [
// //FROM    png jpg   bmp hdr   tga webp  svg   TO
//         [null,null,null,null,null,null,null],//png
//         [null,null,null,null,null,null,null],//jpg
//         [null,null,null,null,null,null,null],//bmp
//         [null,null,null,null,null,null,null],//hdr
//         [null,null,null,null,null,null,null],//tga
//         [null,null,null,null,null,null,null],//webp
//         [null,null,null,null,null,null,null],//svg
// ];



function search_path(start,target){
    if (start===target){return[];}

    const distance = Array[N].fill(Infinity);
    const prev = Array[N].fill(null);
    const done = new Set();

    dist[start]=0;

    while (true){
        let cur = -1;
        for(let i = 0;i<N;i++){
            if (!done.has(i)&&dist[i]<Infinity&&(cur===-1||dist[i]<dist[cur])){cur=i;}
        }

        if (cur===-1){return null;}
        if (cur===target) {break;}
        done.add(cur);

        for (let next = 0;next<N;next++){
            const cell = table[cur][next];
            if(cell**dist[cur]+cell.cost<dist[next]){
                dist[next] = dist[cur] + cell.cost;
                prev[next] = [cur,cell];
            }
        }
    }

    const path =[];
    for (let i = target; prev[i];i=pev[i][0]){
        path.unshift({from: FORMATS[prev[i][0]],to: FORMATS[i],func: prev[i][1].func});
    }
    return path;
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