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
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
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
       /**
       * so basically:
       *
       * - if being built for production, the svgo plugins are undefined so
       * that they don't override the default ones and it optimizes as normal
       * - if not being built for production (i.e. the live server), the svgo
       * plugins are empty and it doesn't do any processing.
       *
       * This is because the svgo optimization takes like 6 seconds so it was
       * really really slowing down the dev server whichw as irritating me
       */
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