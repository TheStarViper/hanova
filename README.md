# Hanova

Hanova is a file conversion website with a nautical twist!

[![Screenshot of Hanova](./frontend/src/lib/assets/screenshot5.png)](https://thestarviper.github.io/hanova/)

Welcome to Hanova, a (fictional) archipelago off the coast of Madagascar!
"Hanova" is the Malagasy word for "transform", and that's exactly what these
islands do. Drag-and-drop your file into the water, and sail it to the island
corresponding to your desired file format. Dig at the red X, and you'll unearth
buried **treasure**: your converted file!

> [!NOTE]
> Hanova is still under heavy development. It is in a functional state now, but
> it isn't feature-complete, and there may be bugs. A lot of bugs.

## Demo

> [!TIP]
> **<https://thestarviper.github.io/hanova/>**

## Backend (C++ & Mjs)

For the backend I(Andrew) have decided to use C++ as it is the language I'm the
most familar with. I compiled the backend through emscripten to a wasm package
paired with js and ts helper files so that Ethan can do the frontend more
seamlessly. There are a ton of file conversion libraries that exist already and
it would take an unreasonable amount of time to develop my own with the codecs
and such so i opted for a prepackaged library. I have listed the libraries ive
used down below, but before that, even though i used libraries for conversion
there are still a ton of other things to do other than calling functions in the
library that a file converter like file validation,safety functions,error handling,
and glue code so that they can work seamlessly together.

### Libraries Used:

- [STB_image](https://github.com/nothings/stb) (png,jpeg,bmp,tga,hdr)
- [Libwebp](https://github.com/webmproject/libwebp) (webp)
- [Imagetracerjs](https://github.com/jankovicsandras/imagetracerjs) (svg vectorizer & rasterizer)
- [Imagemagick](https://github.com/ImageMagick/ImageMagick) (all other image formats)
- [Mediabunny](https://github.com/Vanilagy/mediabunny) (audio and video)
- [FFmpeg](https://github.com/ffmpeg/ffmpeg) (audio)
- [Pandoc](https://github.com/jgm/pandoc) (documents)
- [Assimpjs](https://github.com/kovacsv/assimpjs) (3d models imports)
- [Threejs](https://github.com/mrdoob/three.js/) (3d models exports)

### Mjs Bridge System

Alot of the libraries that are commonly used for file conversions dont come as C++ packages and instead are pre-compiled wasm files. So we opted to use a Mjs bridge system to link together and use a bunch of different wasm libs at the same time with a dynamic loading function. stb_image,nanosvg,& stb_image are all libs that we can compile through emscripten. Imagemagick,ffmpeg, & pandoc come as pre-packaged wasm files that we converse with using MJS. Mediabunny however isnt wasm as wasm does not have support for hardware acceleration which is fine for smaller files like documents & images but is sluggish without hardware accel for video files.

Since this file conversion program uses alot of different libraries combined, a notable portion of the backend codebase is glue-code used to make it so that they can work together. We grabbed the WASM versions of programs like imagemagick and pandoc to use and bridged them using MJS, while mediabunny is a TypeScript library so that it can take advantage of hardware acceleration. However, since we had to balance a wide variety of ecosystems, they all had different error formats and spit out different types of errors, so to make things easier we made a unified error system that decoded all of the errors from the various libraries and made human-readable and simplified errors.

### Supported File Formats

<details>
<summary><h3>Images</h3></summary>

- [x] png
- [x] jpeg / jpg / jpe
- [x] bmp
- [x] tga / targa / icb / vda / vst
- [x] hdr
- [x] ico
- [x] gif
- [x] exr
- [x] webp
- [x] avif
- [x] eps / epsf / epsi
- [x] ai (adobe illustrator not artificial intellegence)
- [x] qoi
- [x] tiff / tif
- [x] jxl
- [x] psd
- [x] svg (We have a vectorizer that turns bitmaps to vectorized svgs and a rasterizer for vectors to bitmaps) </br>
<img src="before.jpg" width="300">
<img src="after.svg" width="300"></br>
### left before, right after
</details>


<details>
<summary><h3>Audio</h3></summary>

- [x] mp3
- [x] wav / wave
- [x] flac
- [x] ogg / oga
- [x] aac
- [x] m4a
- [x] wma
- [x] aiff
- [x] ac3
- [x] mp2
- [x] au
- [x] caf
- [x] opus
- [x] weba
- [x] mka
- [x] m4r
- [x] alac
- [x] tta
- [ ] alac
- [ ] amr

</details>

<details>
<summary><h3>Docs</h3></summary>

- [x] pdf
- [x] txt / text
- [x] md / markdown / mkd / mdown / markdn
- [x] rtf
- [x] docx
- [x] html / htm
- [x] epub / epub2 / epub3
- [x] pptx
- [x] fb2
- [x] gfm
- [x] tex / latex
- [x] ms
- [x] ctx
- [x] dbk / docbook
- [x] opml
- [x] odt
- [x] xls
- [x] adoc / asciidoc / asc

</details>

<details>
<summary><h3>Video</h3></summary>

- [x] mp4 / m4v
- [x] mkv / matroksa
- [x] webm
- [x] mov
- [x] m4s
- [x] ts (MPEG Transport stem)
- [x] m3u8 (HLS)

</details>

<details>
<summary><h3>3D Files</h3></summary>

- [ ] obj
- [ ] fbx
- [ ] stl
- [ ] step
- [ ] glb
- [ ] blend

</details>


## Frontend (Svelte)

There are a [lot](https://vert.sh/) [of](https://www.freeconvert.com/)
[file](https://convertio.co/) [converters](https://cloudconvert.com/)
[online](https://www.convertfiles.com/), and most of them have the same
aesthetic: a sleek modern webpage with a small box to drop files into and a
dropdown to select the target format. Well that's boring! It would be much more
fun if the whole website was styled as an antique nautical map.

The current design of the frontend is ~~stolen from~~ inspired by
[Perilous Shores](https://watabou.itch.io/perilous-shores) by Watabou, and I
made most of Hanova's assets by extracting them from Perilous Shores exports. We
might change the art direction or use custom assets in the future.

### Pathfinding

![Debugging mode, where the pathfinding grid and island collision boundaries are drawn in red and overlayed on the rest of the map](./frontend/src/lib/assets/debug_screenshot3.png)

The boat uses the A* algorithm to pathfind from its current position to the
target island without clipping through any other islands. The generated path is
then converted to centripetal Catmull-Rom splines, converted to cubic Beziers,
and then used to animate the boat's travel and draw the dashed line.

### Frontend Roadmap

Week 1:

- [x] Page layout inspired by Perilous Shores
- [x] Boat that can move between islands
- [x] 3 islands that trigger a file conversion when clicked
- [x] File uploading and downloading

Week 2:

- [x] About page
- [x] Decorative compass rose (that links to the about page)
- [x] A* pathfinding between islands
- [x] Boat travels along route
- [x] Dashed line that displays route

Week 3:

- [x] Viewport panning
- [x] Boat sinks if the conversion fails
- [x] Sound effects
- [x] Boat spawns at the island corresponding to its original file format
- [x] 19 islands

Week 4:

- [x] Viewport zooming
- [x] More island asset variety
- [x] Improved title screen
- [x] Pathfinding algorithm improvements
- [x] Tooltips

Week 5:

- [x] Improved island collision (ellipses rather than circles)
- [x] Islands and tooltips for the audio and video formats
- [x] Improved sprite colors
- [x] Mobile support 

Week 6:

- [x] New About page
- [x] Quality and filename template settings
- [x] Developer/debugging overlays
- [x] [Pathfinding test page](https://thestarviper.github.io/hanova/test/pathfind) and [Island completeness page](https://thestarviper.github.io/hanova/test/islandCompleteness)
- [x] Optimization with [SVGO](https://github.com/r3dDoX/vite-plugin-svgo)
- [x] Big frontend refactors

Week 7:

- [x] Quality setting uses presets instead of raw numbers
- [ ] Island editor dev tool
- [ ] More island sprites
- [ ] Pirates if you try to convert incompatible formats

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

## Acknowledgements

- Thanks to [Watabou](https://github.com/watabou) for making
  [Perilous Shores](watabou.itch.io/perilous-shores), which is the main design
  inspiration, and from which most of the assets are derived (e.g. islands,
  color palette, banner). _Obligatory legal disclaimer: Perilous Shores allows
  its output to be used
  ["as you like: copy, modify, include in your commercial rpg adventures etc."](https://watabou.itch.io/perilous-shores#:~:text=You%20can%20use,rpg%20adventures%20etc.)_
- Thanks to [Sean Barrett](https://github.com/nothings) for making
  [stb](https://github.com/nothings/stb), which is used for the image conversion
  backend.

## Contributors

- Ethan ([@ethmarks](https://github.com/ethmarks)): Frontend in Svelte
- Andrew ([@TheStarViper](https://github.com/TheStarViper)): Backend in C++
