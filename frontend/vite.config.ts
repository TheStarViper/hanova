import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const frontendRoot = fileURLToPath(new URL(".", import.meta.url));
const backendRoot = fileURLToPath(new URL("../backend", import.meta.url));

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) => filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
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
  ],
  server: {
    fs: {
      allow: [frontendRoot, backendRoot],
    },
  },
});
