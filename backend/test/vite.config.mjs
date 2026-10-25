import {defineConfig} from 'vite';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,resolve} from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root:resolve(here,'backend/test'),
    server:{fs:{allow:[here]}},
    optimizeDeps: {exclude: ['@imagemagick/magick-wasm']},
});