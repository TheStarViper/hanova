# Hanova

> [!TIP]
> **Demo here: <https://thestarviper.github.io/hanova/>**

Hanova is a local web-based suite of file transformation tools that keeps all your files from touching an external server so that they stay secure. This file converter was made for Hackclub's YSWS event [Third Space](https://thirdspace.hackclub.com/). The frontend utilizes a pirate-esque theme that makes it stand out from other file converters online. When converting a file a pirate ship is summomed and travels to the island representing the file type you want to convert to and arrives at the island to dig up your treasure (your file) once the file conversion is done.

## Feature Roadmap
- [ ] image support
- [ ] audio support
- [ ] document support
- [ ] video support (would then make backend server to host on docker)

## Compiling yourself

Prerequisites:

- [pnpm](https://pnpm.io/installation)
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html)

```sh
# clone the repo
git clone https://github.com/TheStarViper/hanova.git
cd hanova

# regenerate the wasm (optional but recommended)
make -C backend

# start the site
cd frontend
pnpm install
pnpm dev
```

## **Contributers**

- Ethan ([@ethmarks](https://github.com/ethmarks)): Frontend in Svelte
- Andrew ([@TheStarViper](https://github.com/TheStarViper)): Backend in C++