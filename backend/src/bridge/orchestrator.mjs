import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join} from 'path';
import createcore from '../../build/image_core_module.js';
import createwebp from '../../build/webp_module.js';
import createsvg from '../../build/svg_module.js';

export class ConvertError extends Error {
    constructor(code, message,{step,cause}={}) {
        super(message);
        this.name = 'ConvertError';
        this.code = code;
        this.step = step;
        this.cause = cause;
    }
}

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



export function createconverter(cppmodule){
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


    //libwebp
    register('png','webp',(bytes,q)=>cppmodule.convert_to_webp(bytes,q),1); //FIX using cppmodule isntead of webpmodule
    register('webp','png',(bytes)=>cppmodule.convert_webp_to_png(bytes)); //FIX using cppmodule isntead of webpmodule


    //nanosvg
    register('svg','png',(bytes)=>cppmodule.convert_svg_to_png(bytes)); //FIX using cppmodule isntead of svgmodule

    function search_path(start,target){
        if (start===target){return[];}

        const distance = Array(N).fill(Infinity);
        const prev = Array(N).fill(null);
        const done = new Set();

        distance[start]=0;

        while (true){
            let cur = -1;
            for(let i = 0;i<N;i++){
                if (!done.has(i)&&distance[i]<Infinity&&(cur===-1||distance[i]<distance[cur])){cur=i;}
            }

            if (cur===-1){return null;}
            if (cur===target) {break;}
            done.add(cur);

            for (let next = 0;next<N;next++){
                const cell = table[cur][next];
                if(cell&&distance[cur]+cell.cost<distance[next]){
                    distance[next] = distance[cur] + cell.cost;
                    prev[next] = [cur,cell];
                }
            }
        }

        const path =[];
        for (let i = target; prev[i];i=prev[i][0]){
            path.unshift({from: FORMATS[prev[i][0]],to: FORMATS[i],func: prev[i][1].func});
        }
        return path;
    }

    async function convert_image(target_format,bytes,quality){
        let detected_format = cppmodule.validate_file_format(bytes);

        detected_format = ALIASES[detected_format]??detected_format;
        target_format = ALIASES[target_format]??target_format;

        let current_index=INDEX[detected_format];
        let target_index = INDEX[target_format];

        if (current_index === undefined){throw new Error(`Unsupported Input Format: "${detected_format}"`);}
        if (target_index === undefined){throw new Error(`Unsupported Output Format: "${target_format}"`);}
        
        const path = search_path(current_index,target_index);
        if (!path){
            throw new Error(`No conversion path found "${detected_format}"->"${FORMATS[target_index]}"`);
        }

        let data = bytes;
        for (const step of path){
            console.log(`Converting ${step.from} -> ${step.to}...`);
            data = await step.func(data,quality);
        }
        return data;
    }
    return {convert_image,search_path};
}

const [core, webp, svg] = await Promise.all([createcore(), createwebp(), createsvg()]);
export const { convert_image } = createconverter({ core, webp, svg });
