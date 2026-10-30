import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import svg from "vite-plugin-svgo";

const frontendRoot = fileURLToPath(new URL(".", import.meta.url));
const backendRoot = fileURLToPath(new URL("../backend", import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [
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
      multipass: true,

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
  server: {
    fs: {
      allow: [frontendRoot, backendRoot],
    },
  },
}));
