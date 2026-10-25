import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root:resolve(here,'backend/test'),
    server:{fs:{allow:[here]}},
    optimizeDeps: {exclude: [
        '@imagemagick/magick-wasm',
        '@mediabunny/mp3-encoder',
        '@mediabunny/flac-encoder',
        '@mediabunny/aac-encoder'],
    },
});