import { readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join} from 'path';
import createcore from '../../build/image_core_module.js';
import createwebp from '../../build/webp_module.js';
import createsvg from '../../build/svg_module.js';
import { ConvertError,to_convert_error,ErrorCode } from './errors.mjs';
import * as bridge from './imagemagick-bridge.mjs';
const magick = {
    convert_bytes: bridge.convert_bytes,
    detect_format: bridge.detect_format,
    formats: await bridge.writable_formats(),
    processors: bridge.MAGICK_PROCESSORS
};

export function simplifyerror(error){
    if (error instanceof ConvertError) return error.message;

    if (typeof error ==='number'){
        return `C++ exception thrown (pointer ${error}); build with -fexceptions or catch it in C++`;
    }

    if (typeof error ==='string'){
        return error;
    }

    const message = String(error?.message??error);
    
    const magick = /^(\w+)\s*(?:`([^']*)')?\s*@/.exec(message); //icl i have 0 idea wtf this line does
    if (magick) return `${magick[1]}${magick[2] ? ` (${magick[2]})` : ''}`;

    if (error?.name==='BindingError'||error?.name==='UnboundTypeError'){
        return `embind: ${message.split('\n')[0]}`;
    }

    if (error?.code &&error?.syscall){
        return `${error.code}: ${error.syscall} ${error.path ?? ''}`.trim();
    }

    return `${error?.name??'Error'}: ${message.split('\n')[0]}`;
}

export const FORMATS = ['png',
                 'jpg',
                 'bmp',
                 'hdr',
                 'tga',
                 'webp',
                 'svg',
                 'gif',
                 'avif',
                 'tiff',
                 'ico',
                 'heic',
                 'jxl',
                 'qoi',
                 'psd'
];

const INDEX = Object.fromEntries(FORMATS.map((f,i)=>[f,i]));
const ALIASES = {jpeg:'jpg', //formats that are the same with diff extensions
                 jpe: 'jpg',
                 targa:'tga',
                 tif: 'tiff',
                 heif: 'heic'}; 

const N = FORMATS.length;



export function createconverter({core,webp,svg,magick}){
    const unwrap = (r)=>{
        if (Array.isArray(r)||r instanceof Uint8Array){return r};
        if (r&&r.ok===false){
            throw new ConvertError(ErrorCode.NativeFailure,`native conversion failed: ${r.error ?? r.errorType ?? 'unknown error'}`);
        }

        if (r?.data instanceof Uint8Array){
            const out= r.data.slice();
            r.delete?.();
            return out;
        }
        throw new ConvertError(ErrorCode.NativeFailure,`unexpected native result: ${Object.keys(r ?? {})}`);
    }


    console.log('core keys:', Object.keys(core ?? {}));
    const table = Array.from({length:N},()=>Array(N).fill(null));
    
    function register(from,to,func,cost=1){
        if(INDEX[from]===undefined||INDEX[to]===undefined){
            throw new Error(`register: unknown format ${from} -> ${to}`);
        }
        table[INDEX[from]][INDEX[to]]={func,cost};
    }

    const STB_ENCODER = {
        png: 'convert_to_png',
        jpg: 'convert_to_jpeg',
        bmp: 'convert_to_bmp',
        tga: 'convert_to_tga',
        hdr: 'convert_to_hdr'
    };

    for (const from of Object.keys(STB_ENCODER)) {
        for (const to of Object.keys(STB_ENCODER)) {
            if (from !== to) {
                register(from, to, (bytes, q) => unwrap(core[STB_ENCODER[to]](bytes, q)), 1);
            }
        }
    }


    //libwebp
    register('png','webp', (bytes, q)=> unwrap(webp.convert_to_webp(bytes, q)), 1);
    register('webp','png', (bytes) =>unwrap(webp.convert_webp_to_png(bytes)), 1);


    //nanosvg
    register('svg','png', (bytes)=> unwrap(svg.convert_svg_to_png(bytes)), 1);

    //magick

    if(magick){
        const MAGICK_COST = 5;
        const READABLE = ['png','jpg','bmp','tga','hdr'];
        const has = (from,to)=>table[INDEX[from]][INDEX[to]]!==null;

        const WRITABLE = Object.keys(magick.formats).filter(
            (f)=>f!=='png'&&INDEX[f]!==undefined&&magick.formats[f]!==undefined);
        
        const via = (to,proc)=>(bytes,q)=>magick.convert_bytes(bytes,magick.formats[to],q,proc); 
        

        for (const to of WRITABLE){
            for (const from of READABLE){
                if (!has(from,to)){register(from,to,via(to,magick.processors?.[to]),MAGICK_COST);}
            }
        }

        if(magick.formats.png !==undefined){
            for (const from of WRITABLE){
                if (!has(from,'png')){register(from,'png',via('png'),MAGICK_COST);}
            }
        }
    }

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
        let detected_format = core.validate_file_format(bytes);

        if (detected_format==='unknown'&&magick){
            detected_format = await magick.detect_format(bytes);
        }
        
        detected_format = ALIASES[detected_format]??detected_format;
        target_format = ALIASES[target_format]??target_format;

        let current_index=INDEX[detected_format];
        let target_index = INDEX[target_format];

        if (current_index === undefined){throw new ConvertError(ErrorCode.UnsupportedInput,`Unsupported Input Format: "${detected_format}"`);}
        if (target_index === undefined){throw new ConvertError(ErrorCode.UnsupportedOutput,`Unsupported Output Format: "${target_format}"`);}
        
        const path = search_path(current_index,target_index);
        if (!path){
            throw new ConvertError(ErrorCode.NoPath,`No conversion path found "${detected_format}"->"${FORMATS[target_index]}"`);
        }

        let data = bytes;
        for (const step of path){
            try {
                console.log(`Converting ${step.from} -> ${step.to}...`);
                data = await step.func(data,quality);
            } catch(error) {
                const cause = to_convert_error(error,ErrorCode.NativeFailure);
                throw new ConvertError(
                    ErrorCode.StepFailed,
                    `${step.from} -> ${step.to} failed: ${cause.message}`,
                    { step: `${step.from} -> ${step.to}`, cause }
                )
            }
        }
        return data;
    }
    return {convert_image,search_path};
}

const [core, webp, svg] = await Promise.all([createcore(), createwebp(), createsvg()]);
export const { convert_image } = createconverter({ core, webp, svg ,magick});