import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const here = dirname(fileURLToPath(import.meta.url));

function wasmasurl(){
  return {
    name: 'pandoc-wasm-as-url',
    enforce: 'pre',
    load(id){
      const file = id.split('?')[0].replace(/\\/g,'/');
      if (!file.endsWith('/pandoc.wasm')){return null;}
      return `export default ${JSON.stringify('/@fs/' + file.replace(/^\//, ''))};`;
    },
  };
}

export default defineConfig({
  root: resolve(here, "backend/test"),
  plugins: [wasmasurl()],
  server: { fs: { allow: [here] } },
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: [
      "@imagemagick/magick-wasm",
      "@mediabunny/mp3-encoder",
      "@mediabunny/flac-encoder",
      "@mediabunny/aac-encoder",
      'pandoc-wasm',
    ],
  },
});
