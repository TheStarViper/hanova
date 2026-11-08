import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import svg from "vite-plugin-svgo";

const frontendRoot = fileURLToPath(new URL(".", import.meta.url));
const backendRoot = fileURLToPath(new URL("../backend", import.meta.url));
const repoRoot = fileURLToPath(new URL("..", import.meta.url));

function pandocWasmAsUrl(): Plugin {
  return {
    name: "pandoc-wasm-as-url",
    enforce: "pre",
    load(id) {
      const file = id.split("?")[0].replace(/\\/g, "/");
      if (!file.endsWith("/pandoc.wasm")) return null;
      return `export default new URL("./pandoc.wasm", import.meta.url).href;`;
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    pandocWasmAsUrl(),
    sveltekit({
      compilerOptions: {
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },
      adapter: adapter(),
      paths: {
        base: process.argv.includes("dev")
          ? ""
          : (process.env.BASE_PATH as `/${string}`),
      },
      prerender: {
        handleHttpError: ({
          path: _path,
          referrer: _referrer,
          message: _message,
        }) => {
          return;
        },
      },
      preprocess: [vitePreprocess()],
    }),
    svg({
      plugins: mode === "production" ? undefined : [],
    }),
  ],
  build: {
    rollupOptions: {
      external: [
        "wasi_snapshot_preview1",
      ],
    },
  },
  ssr: {
    external: [
      "wasi_snapshot_preview1",
    ],
  },
  optimizeDeps: {
    exclude: [
      "@imagemagick/magick-wasm",
      "@mediabunny/mp3-encoder",
      "@mediabunny/flac-encoder",
      "@mediabunny/aac-encoder",
      "@ffmpeg/ffmpeg",
      "@ffmpeg/core",
      "pandoc-wasm",
    ],
    include: ["assimpjs"],
  },
  server: {
    fs: {
      allow: [frontendRoot, backendRoot, repoRoot],
    },
  },
  worker: {
    format: "es",
    rollupOptions: {
      external: [
        "wasi_snapshot_preview1",
      ],
    },
  },
}));