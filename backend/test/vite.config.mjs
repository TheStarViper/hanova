import {defineConfig} from 'vite';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,resolve} from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

function hanovaAPI(){
    let enginePromise;
    const engine = () => (enginePromise ??= import(pathToFileURL(resolve(here,'backend/src/bridge/orchestrator.mjs')).href));

    const readBody = (req)=> new Promise((done,fail)=>{
        const chunks = [];
        req.on('data',(c)=>chunks.push(c));
        req.on('end',()=>done(new Uint8Array(Buffer.concat(chunks))));
        req.on('error',fail);
    });

    const BAD_REQUEST = ['UnsupportedInput', 'UnsupportedOutput', 'NoPath', 'CorruptInput', 'TooLarge', 'NothingToConvert'];

    const sendError = (res,error) =>{
        const body = error?.toJSON?.()??{code:'Unknown',message: String(error?.message??error)};
        res.statusCode = BAD_REQUEST.includes(body.code)?400:500;
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify(body));
    };

    return {
        name: 'hanova-api',
        configureServer(server){
            server.middlewares.use('/api/capabilities',async (_req,res)=>{
                try{
                    const {capabilities}= await engine();
                    res.setHeader('Content-Type','application/json');
                    res.end(JSON.stringify(capabilities()));
                } catch (error) {sendError(res,error);}
            });

            server.middlewares.use('/api/convert',async (req,res)=>{
                if (req.method !=='post'){res.statusCode=405;res.end();return;}

                try{
                    const url = new URL(req.url,'http://localhost');
                    const target = url.searchParams.get('target');
                    const quality = Number(url.searchParams.get('quality')??80);
                    const bytes = await readBody(req);

                    const {convert} = await engine();
                    const out = await convert(bytes,target,{quality});

                    res.setHeader('Content-Type','application/octet-stream');
                    res.end(Buffer.from(out));
                } catch (error) {sendError(res,error);}
            });
        },
    };
}

export default defineConfig({
    root:resolve(here,'backend/test'),
    server:{fs:{allow:[here]}},
    plugins: [hanovaAPI()],
});